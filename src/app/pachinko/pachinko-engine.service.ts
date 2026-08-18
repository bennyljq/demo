import { Injectable, NgZone, signal } from '@angular/core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

@Injectable({ providedIn: 'root' })
export class PachinkoEngineService {
  public score = signal(0);
  public ballsDropped = signal(0);

  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private world!: CANNON.World;
  
  private ballMeshes: THREE.Mesh[] = [];
  private ballBodies: CANNON.Body[] = [];
  private scoredBalls = new Set<number>(); 
  private activeEffects: any[] = []; 
  
  private animationFrameId: number = 0;
  private dropPlane!: THREE.Mesh;

  private colors = [0xff0055, 0x00ffaa, 0x00aaff, 0xffaa00, 0xaa00ff];
  
  private pegMaterial!: CANNON.Material;
  private ballMaterial!: CANNON.Material;
  private wallMaterial!: CANNON.Material;
  private floorMaterial!: CANNON.Material;

  // --- 1. Updated Boundaries ---
  private readonly boardWidth = 24;
  private readonly boardHeight = 46; 
  private readonly leftBound = -10.8;
  private readonly rightBound = 10.8;
  
  private readonly floorY = -22; 
  private readonly worldBottom = -23; 
  private readonly maxBalls = 150; 

  // --- Audio Variables & Pools ---
  public plinkSoundUrl = 'assets/pachinko/plink.mp3';     // Replace with actual path
  public scoreSoundUrl = 'assets/pachinko/score.mp3';     // Replace with actual path
  public jackpotSoundUrl = 'assets/pachinko/jackpot.mp3'; // Replace with actual path

  private plinkPool: HTMLAudioElement[] = [];
  private scorePool: HTMLAudioElement[] = [];
  private jackpotPool: HTMLAudioElement[] = [];
  
  private readonly poolSize = 10;
  private plinkIndex = 0;
  private scoreIndex = 0;
  private jackpotIndex = 0;

  constructor(private ngZone: NgZone) {}

  public init(canvas: HTMLCanvasElement): void {
    this.initAudioPools();

    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -18, 0) });
    
    this.pegMaterial = new CANNON.Material('peg');
    this.ballMaterial = new CANNON.Material('ball');
    this.wallMaterial = new CANNON.Material('wall');
    this.floorMaterial = new CANNON.Material('floor');
    
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.pegMaterial, this.ballMaterial, { friction: 0.0, restitution: 0.5 }));
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.wallMaterial, this.ballMaterial, { friction: 0.1, restitution: 0.3 }));
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.floorMaterial, this.ballMaterial, { friction: 0.6, restitution: 0.1 }));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#030308'); 

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.setupLighting();
    this.buildBoard();

    this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 100);
    this.resize(window.innerWidth, window.innerHeight);

    this.startLoop();
  }

  private initAudioPools(): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.plinkPool.push(new Audio(this.plinkSoundUrl));
      this.scorePool.push(new Audio(this.scoreSoundUrl));
      this.jackpotPool.push(new Audio(this.jackpotSoundUrl));
    }
  }

  private playPlink(velocity: number): void {
    if (velocity < 1.0) return; 
    const audio = this.plinkPool[this.plinkIndex];
    audio.currentTime = 0;
    audio.volume = Math.min(1, velocity / 100);
    audio.play().catch(() => {}); 
    this.plinkIndex = (this.plinkIndex + 1) % this.poolSize;
  }

  private playScore(): void {
    const audio = this.scorePool[this.scoreIndex];
    audio.currentTime = 0;
    audio.volume = 0.3;
    audio.play().catch(() => {});
    this.scoreIndex = (this.scoreIndex + 1) % this.poolSize;
  }

  private playJackpot(): void {
    const audio = this.jackpotPool[this.jackpotIndex];
    audio.currentTime = 0;
    audio.volume = 0.3;
    audio.play().catch(() => {});
    this.jackpotIndex = (this.jackpotIndex + 1) % this.poolSize;
  }

  private getFrustumSize(aspect: number): number {
    if (this.boardHeight * aspect < this.boardWidth) {
      return this.boardWidth / aspect;
    }
    return this.boardHeight;
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(0, 10, 20);
    this.scene.add(dirLight);
  }

  private buildBoard(): void {
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    this.dropPlane = new THREE.Mesh(planeGeo, planeMat);
    this.scene.add(this.dropPlane);

    const wallColor = 0x0044ff;
    const pegColor = 0x00cc77;

    const modernWallMat = new THREE.MeshStandardMaterial({ color: wallColor, emissive: wallColor, emissiveIntensity: 0.3, roughness: 0.4 });
    const pegVisualMat = new THREE.MeshStandardMaterial({ color: pegColor, emissive: pegColor, emissiveIntensity: 0.4, roughness: 0.2 });

    const wallGeo = new THREE.BoxGeometry(1, 48, 2);
    const wallShape = new CANNON.Box(new CANNON.Vec3(0.5, 24, 1));
    
    const leftWall = new CANNON.Body({ mass: 0, shape: wallShape, material: this.wallMaterial });
    leftWall.position.set(this.leftBound - 0.5, 2, 0);
    this.world.addBody(leftWall);
    const leftWallMesh = new THREE.Mesh(wallGeo, modernWallMat);
    leftWallMesh.position.set(this.leftBound - 0.5, 2, 0);
    this.scene.add(leftWallMesh);

    const rightWall = new CANNON.Body({ mass: 0, shape: wallShape, material: this.wallMaterial });
    rightWall.position.set(this.rightBound + 0.5, 2, 0);
    this.world.addBody(rightWall);
    const rightWallMesh = new THREE.Mesh(wallGeo, modernWallMat);
    rightWallMesh.position.set(this.rightBound + 0.5, 2, 0);
    this.scene.add(rightWallMesh);

    const rows = 13;
    const cols = 8;
    const spacingX = 3;
    const spacingY = 2.0;
    const pegRadius = 0.3; 
    const pegGeo = new THREE.CylinderGeometry(pegRadius, pegRadius, 1.2, 16);
    pegGeo.rotateX(Math.PI / 2);

    for (let r = 0; r < rows; r++) {
      const isOffset = r % 2 !== 0;
      const currentCols = isOffset ? cols - 1 : cols;
      for (let c = 0; c < currentCols; c++) {
        const x = (c - currentCols / 2 + 0.5) * spacingX;
        const y = (rows / 2 - r) * spacingY + 1; 

        const shape = new CANNON.Sphere(pegRadius);
        const body = new CANNON.Body({ mass: 0, shape, material: this.pegMaterial });
        body.position.set(x, y, 0);
        this.world.addBody(body);

        const mesh = new THREE.Mesh(pegGeo, pegVisualMat);
        mesh.position.set(x, y, 0);
        this.scene.add(mesh);
      }
    }

    const floorWidth = (this.rightBound - this.leftBound) + 2; 
    const floorShape = new CANNON.Box(new CANNON.Vec3(floorWidth / 2, 0.5, 1));
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape, material: this.floorMaterial });
    floorBody.position.set(0, this.floorY, 0);
    this.world.addBody(floorBody);
    
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(floorWidth, 1, 2), modernWallMat);
    floorMesh.position.set(0, this.floorY, 0);
    this.scene.add(floorMesh);

    const dividerXs = [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5];
    const divHeight = 10; 
    const dividerGeo = new THREE.BoxGeometry(0.4, divHeight, 2);
    const dividerShape = new CANNON.Box(new CANNON.Vec3(0.2, divHeight / 2, 1));

    for (const x of dividerXs) {
      const yPos = this.floorY + 0.5 + (divHeight / 2);
      const body = new CANNON.Body({ mass: 0, shape: dividerShape, material: this.wallMaterial });
      body.position.set(x, yPos, 0);
      this.world.addBody(body);

      const mesh = new THREE.Mesh(dividerGeo, modernWallMat);
      mesh.position.set(x, yPos, 0);
      this.scene.add(mesh);
    }
  }

  public dropBall(x: number): void {
    this.playPlink(10);

    const clampedX = Math.max(this.leftBound + 1.0, Math.min(this.rightBound - 1.0, x));
    const radius = 0.45; 
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.5, roughness: 0.1, metalness: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({ mass: 1, shape, material: this.ballMaterial });
    
    body.position.set(clampedX, 22, 0);
    body.velocity.set((Math.random() - 0.5) * 0.4, -2, 0);
    
    body.addEventListener('collide', (e: any) => {
      const relativeVelocity = e.contact.getImpactVelocityAlongNormal();
      this.playPlink(Math.abs(relativeVelocity));
    });

    this.world.addBody(body);
    this.scene.add(mesh);
    this.ballBodies.push(body);
    this.ballMeshes.push(mesh);
    
    this.ballsDropped.update(v => v + 1);

    if (this.ballBodies.length > this.maxBalls) {
      this.removeBall(0);
    }
  }

  // --- Score Floating Text Generator ---
  private createScoreSprite(scoreValue: number, isJackpot: boolean): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;

    context.font = 'bold 70px "Courier New", Courier, monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Aesthetic text mapping
    const textColor = isJackpot ? '#ffaa00' : '#ffffff';
    context.fillStyle = textColor;
    context.shadowColor = textColor;
    context.shadowBlur = 15;
    
    context.fillText(`+${scoreValue}`, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    
    // Scale dynamically based on jackpot status
    const scaleFactor = isJackpot ? 4.5 : 2.5;
    sprite.scale.set(scaleFactor * 2, scaleFactor, 1);
    
    return sprite;
  }

  // --- Expanded Trigger Score Effect ---
  private triggerScoreEffect(x: number, y: number, isJackpot: boolean, scoreValue: number): void {
    // 1. Radar Pulse (Ring)
    const ringGeo = new THREE.RingGeometry(0.2, 0.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: isJackpot ? 0xffaa00 : 0x00cc77, 
      transparent: true, opacity: 1, side: THREE.DoubleSide 
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(x, y, 1);
    this.scene.add(ring);
    this.activeEffects.push({ type: 'ring', mesh: ring, life: 1.0, maxLife: 1.0, isJackpot });

    // 2. Score Floating Text
    const textSprite = this.createScoreSprite(scoreValue, isJackpot);
    textSprite.position.set(x, y + 1, 2); // Placed slightly above the ball
    this.scene.add(textSprite);
    this.activeEffects.push({ 
      type: 'text', 
      mesh: textSprite, 
      life: 1.5, 
      maxLife: 1.5, 
      vy: 2.0 // Velocity moving upwards
    });

    // 3. Jackpot Explosion (Particles)
    if (isJackpot) {
      for (let i = 0; i < 15; i++) {
        const pGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.set(x, y, 1);
        this.scene.add(pMesh);
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        this.activeEffects.push({
          type: 'particle',
          mesh: pMesh,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 5,
          life: 1.5,
          maxLife: 1.5
        });
      }
    }
  }

  public getDropPlane(): THREE.Mesh { return this.dropPlane; }
  public getCamera(): THREE.Camera { return this.camera; }

  private startLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      const clock = new THREE.Clock();

      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);
        const delta = Math.min(clock.getDelta(), 0.1);

        this.world.step(1 / 60, delta, 3);

        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
          const fx = this.activeEffects[i];
          fx.life -= delta;
          
          if (fx.life <= 0) {
            this.scene.remove(fx.mesh);
            
            // Safe cleanup of geometries and materials (Important for WebGL memory)
            if (fx.mesh.geometry) fx.mesh.geometry.dispose();
            if (fx.mesh.material) {
              if (fx.mesh.material.map) fx.mesh.material.map.dispose(); // Cleans CanvasTexture
              fx.mesh.material.dispose();
            }
            
            this.activeEffects.splice(i, 1);
            continue;
          }
          
          if (fx.type === 'ring') {
            const scale = 1 + (1 - fx.life / fx.maxLife) * (fx.isJackpot ? 6 : 3);
            fx.mesh.scale.set(scale, scale, scale);
            fx.mesh.material.opacity = fx.life / fx.maxLife;
          } else if (fx.type === 'text') {
            fx.mesh.position.y += fx.vy * delta;
            fx.mesh.material.opacity = fx.life / fx.maxLife; // Fade-up opacity reduction
          } else if (fx.type === 'particle') {
            fx.vy -= delta * 25; 
            fx.mesh.position.x += fx.vx * delta;
            fx.mesh.position.y += fx.vy * delta;
            fx.mesh.scale.setScalar(fx.life / fx.maxLife);
          }
        }

        for (let i = 0; i < this.ballBodies.length; i++) {
          const body = this.ballBodies[i];
          const mesh = this.ballMeshes[i];

          body.position.z = 0;
          body.velocity.z = 0;

          if (body.position.y > -12 && Math.abs(body.velocity.x) < 0.05 && Math.abs(body.velocity.y) < 0.05) {
             body.applyImpulse(new CANNON.Vec3((Math.random() - 0.5) * 0.5, 0, 0), body.position);
          }

          mesh.position.copy(body.position as any);
          mesh.quaternion.copy(body.quaternion as any);

          if (body.position.y < -12 && !this.scoredBalls.has(body.id)) {
            this.scoredBalls.add(body.id);
            
            const absX = Math.abs(body.position.x);
            let scoreValue = 10;
            let isJackpot = false;
            
            if (absX < 1.5) { scoreValue = 500; isJackpot = true; } 
            else if (absX < 4.5) scoreValue = 100;
            else if (absX < 7.5) scoreValue = 50;
            else scoreValue = 10;
            
            this.ngZone.run(() => this.score.update(v => v + scoreValue));
            
            // Pass the generated score into the visual juice function
            this.triggerScoreEffect(body.position.x, body.position.y, isJackpot, scoreValue);
            
            // Audio Triggers
            if (isJackpot) this.playJackpot();
            else this.playScore();
          }
        }
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }

  public resize(width: number, height: number): void {
    if (!this.camera || !this.renderer) return;
    
    const aspect = width / height;
    const fSize = this.getFrustumSize(aspect);
    
    const camY = this.worldBottom + (fSize / 2);
    
    this.camera.left = (fSize * aspect) / -2;
    this.camera.right = (fSize * aspect) / 2;
    this.camera.top = fSize / 2;
    this.camera.bottom = fSize / -2;
    
    this.camera.position.set(0, camY, 35);
    this.camera.lookAt(0, camY, 0);
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }

  private removeBall(index: number): void {
    const body = this.ballBodies[index];
    const mesh = this.ballMeshes[index];
    this.world.removeBody(body);
    this.scene.remove(mesh);
    mesh.geometry.dispose();
    (mesh.material as THREE.Material).dispose();
    this.scoredBalls.delete(body.id); 
    this.ballBodies.splice(index, 1);
    this.ballMeshes.splice(index, 1);
  }

  public reset(): void {
    this.score.set(0);
    this.ballsDropped.set(0);
    while (this.ballBodies.length > 0) {
      this.removeBall(0);
    }
  }

  public destroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}