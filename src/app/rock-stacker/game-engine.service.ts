import { Injectable, NgZone, signal } from '@angular/core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  public score = signal(0);
  public rocksPlaced = signal(0);
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private world!: CANNON.World;
  
  private meshes: THREE.Mesh[] = [];
  private bodies: CANNON.Body[] = [];
  private animationFrameId: number = 0;
  
  private pointer = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private mouseConstraint: CANNON.Constraint | null = null;
  private kinematicMouseBody = new CANNON.Body({ type: CANNON.Body.KINEMATIC });
  
  // Event listener references for cleanup
  private onPointerDown!: (e: PointerEvent) => void;
  private onPointerMove!: (e: PointerEvent) => void;
  private onPointerUp!: () => void;
  
  constructor(private ngZone: NgZone) {}
  
  public init(canvas: HTMLCanvasElement): void {
    // 1. Setup Physics World
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });
    
    // FIX: Cast the base solver to GSSolver to access iterations
    (this.world.solver as CANNON.GSSolver).iterations = 20; 
    
    // 2. Setup Three.js
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#f0ece1');
    this.scene.fog = new THREE.Fog('#f0ece1', 10, 50);
    
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 2, 0);
    
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    this.setupLighting();
    this.createBasePlatform();
    this.startLoop();
  }
  
  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);
  }
  
  private createBasePlatform(): void {
    const groundShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.5, 2.5));
    const groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
    groundBody.position.set(0, -0.5, 0);
    this.world.addBody(groundBody);
    
    const groundGeo = new THREE.BoxGeometry(5, 1, 5);
    const groundMat = new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.8 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    groundMesh.position.copy(groundBody.position as any);
    this.scene.add(groundMesh);
  }
  
  public spawnProceduralRock(x: number, y: number, z: number): void {
    // 1. Create a Zen "River Stone" profile (flatter on the Y axis, wider on X/Z)
    const scaleX = 1 + Math.random() * 0.5;
    const scaleY = 0.4 + Math.random() * 0.3; // Flat bottom/top for stacking!
    const scaleZ = 1 + Math.random() * 0.5;
    const radius = 0.5;
    
    // --- VISUAL GEOMETRY (High detail, slightly bumpy) ---
    const visualGeo = new THREE.IcosahedronGeometry(radius, 3);
    visualGeo.scale(scaleX, scaleY, scaleZ); 
    
    const positions = visualGeo.attributes['position'];
    const v = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      v.fromBufferAttribute(positions, i);
      // Tiny spatial noise just to make it look organic, but keeping the general flat shape
      const noise = 1 + (Math.sin(v.x * 5) + Math.cos(v.y * 5) + Math.sin(v.z * 5)) * 0.02;
      v.multiplyScalar(noise);
      positions.setXYZ(i, v.x, v.y, v.z);
    }
    visualGeo.computeVertexNormals();
    
    const material = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color().setHSL(0, 0, 0.2 + Math.random() * 0.4),
      roughness: 0.8,
      metalness: 0.2
    });
    
    const mesh = new THREE.Mesh(visualGeo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // --- PHYSICS GEOMETRY (Low detail, perfectly convex, strictly mathematical) ---
    // detail=0 creates only 12 vertices. Highly performant and perfectly stable for stacking.
    const physicsGeo = new THREE.IcosahedronGeometry(radius, 0);
    physicsGeo.scale(scaleX, scaleY, scaleZ); 
    
    const physicsPositions = physicsGeo.attributes['position'];
    const vertices: CANNON.Vec3[] = [];
    const faces: number[][] = [];
    const vertexMap = new Map<string, number>();
    const indices: number[] = [];
    
    // Safely deduplicate vertices to prevent Cannon.js zero-vector crashes
    for (let i = 0; i < physicsPositions.count; i++) {
      const vx = physicsPositions.getX(i);
      const vy = physicsPositions.getY(i);
      const vz = physicsPositions.getZ(i);
      
      // Use string rounding as a hash key to find overlapping vertices
      const key = `${vx.toFixed(4)}_${vy.toFixed(4)}_${vz.toFixed(4)}`;
      
      if (!vertexMap.has(key)) {
        vertexMap.set(key, vertices.length);
        vertices.push(new CANNON.Vec3(vx, vy, vz));
      }
      indices.push(vertexMap.get(key)!);
    }
    
    // Build strict faces using the deduplicated index list
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i];
      const b = indices[i+1];
      const c = indices[i+2];
      
      // Only push valid triangles (prevents degenerate face crashes)
      if (a !== b && b !== c && a !== c) {
        faces.push([a, b, c]);
      }
    }
    
    const shape = new CANNON.ConvexPolyhedron({ vertices, faces });
    const mass = (scaleX * scaleY * scaleZ) * 10; 
    
    const body = new CANNON.Body({ mass, shape });
    body.position.set(x, y, z);
    
    // Give the rock a slight random initial rotation
    body.quaternion.setFromEuler(
      Math.random() * Math.PI, 
      0, 
      Math.random() * Math.PI
    );
    
    this.world.addBody(body);
    this.scene.add(mesh);
    this.bodies.push(body);
    this.meshes.push(mesh);
    
    this.rocksPlaced.update(val => val + 1);
  }
  
  public setupInteractions(canvas: HTMLCanvasElement): void {
    this.world.addBody(this.kinematicMouseBody);
    
    this.onPointerDown = (e: PointerEvent) => {
      this.updatePointer(e);
      this.raycaster.setFromCamera(this.pointer, this.camera);
      
      const intersects = this.raycaster.intersectObjects(this.meshes);
      if (intersects.length > 0) {
        const hitMesh = intersects[0];
        const index = this.meshes.indexOf(hitMesh.object as THREE.Mesh);
        const hitBody = this.bodies[index];
        
        this.dragPlane.setFromNormalAndCoplanarPoint(
          this.camera.getWorldDirection(new THREE.Vector3()), 
          hitMesh.point
        );
        
        this.kinematicMouseBody.position.copy(hitMesh.point as any);
        this.mouseConstraint = new CANNON.PointToPointConstraint(
          hitBody, new CANNON.Vec3().copy(hitBody.position).negate().vadd(hitMesh.point as any),
          this.kinematicMouseBody, new CANNON.Vec3(0,0,0)
        );
        this.world.addConstraint(this.mouseConstraint);
      }
    };
    
    this.onPointerMove = (e: PointerEvent) => {
      if (!this.mouseConstraint) return;
      this.updatePointer(e);
      this.raycaster.setFromCamera(this.pointer, this.camera);
      
      const intersectPoint = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(this.dragPlane, intersectPoint);
      
      if (intersectPoint) {
        this.kinematicMouseBody.position.copy(intersectPoint as any);
      }
    };
    
    this.onPointerUp = () => {
      if (this.mouseConstraint) {
        this.world.removeConstraint(this.mouseConstraint);
        this.mouseConstraint = null;
      }
    };
    
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
  }
  
  private updatePointer(e: PointerEvent): void {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  
  private startLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      const clock = new THREE.Clock();
      
      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);
        const delta = Math.min(clock.getDelta(), 0.1);
        
        this.world.step(1 / 60, delta, 3);
        
        let highestY = 0;
        for (let i = 0; i < this.meshes.length; i++) {
          this.meshes[i].position.copy(this.bodies[i].position as any);
          this.meshes[i].quaternion.copy(this.bodies[i].quaternion as any);
          
          if (this.bodies[i].position.y > highestY) {
            highestY = this.bodies[i].position.y;
          }
        }
        
        if (Math.abs(this.score() - highestY) > 0.1) {
          this.ngZone.run(() => this.score.set(highestY));
        }
        
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }
  
  public resize(width: number, height: number): void {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  public destroy(canvas: HTMLCanvasElement): void {
    cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) {
      this.renderer.dispose();
    }
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerup', this.onPointerUp);
  }
}