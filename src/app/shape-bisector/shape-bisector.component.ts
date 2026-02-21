import { Component, signal, computed, ElementRef, viewChild, OnInit, Inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Point, generateRandomBlob, splitPolygon, isPointInPolygon, doesCutIntersectShape, getPolygonAreaAndCentroid, calculateDriftOffsets, createPRNG, getSingaporeDateString } from './geometry.util';
import { AudioService } from '../services/audio.service';
import { CelebrationService, CelebrationTier } from '../services/celebration.service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-shape-bisector',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ClipboardModule],
  templateUrl: './shape-bisector.component.html',
  styleUrls: ['./shape-bisector.component.scss']
})
export class ShapeBisectorComponent implements OnInit {
  
  mode = signal<'daily' | 'sandbox'>('sandbox');
  
  constructor(
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    private audioService: AudioService,
    private celebrationService: CelebrationService,
    private route: ActivatedRoute
  ) {
    this.loadStats(); 
    this.route.data.subscribe(data => {
      const currentMode = data['mode'] || 'sandbox';
      this.mode.set(currentMode);
      this.initGameMode();
    });
  }
  
  showCelebration = this.celebrationService.isActive;
  particles = this.celebrationService.particles;
  celebrationText = this.celebrationService.text;
  celebrationTier = this.celebrationService.tier;
  showInstructions = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);
  currentSeed = signal<string | null>(null);
  targetRatio = input<number>(50.0);
  dailyDate = signal<string>('');
  dailyStreak = signal<number>(0);
  dailyCutText = signal<string>('--/--');
  dailyScore = signal<number | null>(null);
  dailyTier = signal<string>(''); // Used for the share text
  dailyBestCutText = signal<string>('--/--');
  dailyAvgScore = signal<number | null>(null);
  shareText = signal<string>('SHARE RESULT');
  shareCopied = signal<boolean>(false);
  dailyShareString = computed(() => {
    const tierEmojis: Record<string, string> = {
      'perfect': '🏆',
      'almost': '👍',
      'great': '🥱',
      'standard': '🤡'
    };
    const emoji = tierEmojis[this.dailyTier()] || '🔪';
    
    return `POTONG Daily ${this.dailyDate()}\n${emoji} Cut: ${this.dailyCutText()}\n💯 Score: ${this.dailyScore()}\n\nCan you beat my slice?\nbennyl.im/potong`;
  });
  
  ngOnInit() {
    const favIcon = this.document.getElementById('app-favicon') as HTMLLinkElement;
    if (favIcon) favIcon.href = 'assets/potong/katana-icon.png'; 
    this.loadPersistedData();
    this.checkFirstVisit();
  }
  
  private loadPersistedData() {
    const savedBestText = localStorage.getItem('potong_best_text');
    const savedBestDiff = localStorage.getItem('potong_best_diff');
    if (savedBestText && savedBestDiff !== null) {
      this.bestCutText.set(savedBestText);
      this.bestCutDiff.set(parseFloat(savedBestDiff));
    }
  }
  
  readonly VIEWBOX_SIZE = 1000;
  readonly polygonPoints = signal<Point[]>([]);
  bestCutText = signal<string>('--/--');
  bestCutDiff = signal<number>(50.0);
  readonly shapeId = signal<number>(0);
  
  isAutoNext = signal<boolean>(false);
  isDrifting = signal<boolean>(false);
  autoNextProgressDuration = signal<number>(0);
  private autoNextTimer: any;
  
  private initGameMode() {
    if (this.mode() === 'daily') {
      this.titleService.setTitle('POTONG Daily');
      const todaySGT = getSingaporeDateString();
      const dailySeed = `POTONG-DAILY-${todaySGT}`;
      
      this.isAutoNext.set(false);
      this.dailyDate.set(todaySGT);
      
      // Load their overarching daily profile to populate the HUD
      const profile = JSON.parse(localStorage.getItem('potong_daily_profile') || '{"streak": 0, "roundsPlayed": 0, "totalScore": 0, "bestDiff": 50, "bestCutText": "--/--", "lastDate": ""}');
      
      this.dailyStreak.set(profile.streak);
      this.dailyBestCutText.set(profile.bestCutText);
      if (profile.roundsPlayed > 0) {
        this.dailyAvgScore.set(Math.round(profile.totalScore / profile.roundsPlayed));
      }
      
      this.generateRandomShape(dailySeed);
      
      // Check if they already played TODAY (Anti-Cheat)
      const savedDaily = localStorage.getItem(`potong_daily_${todaySGT}`);
      
      if (savedDaily) {
        const data = JSON.parse(savedDaily);
        this.dailyCutText.set(data.cutText);
        this.dailyScore.set(data.score);
        this.dailyTier.set(data.tier);
        
        const result = splitPolygon(this.polygonPoints(), data.start, data.end);
        if (result) {
          this.splitPieces.set(result);
          this.startPoint.set(data.start);
          this.currentPoint.set(data.end);
          this.cutCompleted.set(true);
          
          const statsA = getPolygonAreaAndCentroid(result.pieceA);
          const statsB = getPolygonAreaAndCentroid(result.pieceB);
          
          this.pieceStats.set({
            pieceA: { percent: data.percentA, centroid: statsA.centroid },
            pieceB: { percent: data.percentB, centroid: statsB.centroid }
          });
          
          this.driftOffsets.set(calculateDriftOffsets(data.start, data.end, -60));
          setTimeout(() => this.isDrifting.set(true), 50);
        }
      }
    } else {
      this.titleService.setTitle('POTONG Sandbox');
      const savedAutoNext = localStorage.getItem('potong_auto_next');
      this.isAutoNext.set(savedAutoNext === 'true');
      this.generateRandomShape(); 
    }
  }
  
  generateRandomShape(seed?: string) {
    this.celebrationService.clear();
    this.audioService.stopAll();
    
    if (this.autoNextTimer) clearTimeout(this.autoNextTimer);
    this.autoNextProgressDuration.set(0);
    
    // --- 🚨 PRNG ROUTING 🚨 ---
    let rng = Math.random; // Default to pure chaos (Sandbox mode)
    
    if (seed) {
      this.currentSeed.set(seed);
      rng = createPRNG(seed);
      console.log(`Generating shape from seed: ${seed}`);
    } else {
      this.currentSeed.set(null);
    }
    
    // Pass the RNG function into our blob generator
    this.polygonPoints.set(generateRandomBlob(150, { x: 500, y: 500 }, 200, rng));
    // ----------------------------
    
    this.shapeId.update(id => id + 1); 
    
    this.splitPieces.set(null);
    this.startPoint.set(null);
    this.currentPoint.set(null);
    this.cutCompleted.set(false);
  }
  
  private readonly STORAGE_KEY = 'potong_stats';
  
  private loadStats() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.roundsPlayed.set(parsed.roundsPlayed || 0);
        this.totalScore.set(parsed.totalScore || 0);
        if (this.roundsPlayed() > 0) {
          this.avgScore.set(Math.round(this.totalScore() / this.roundsPlayed()));
        }
      }
    } catch (e) { console.error('Could not load stats', e); }
  }
  
  private saveStats() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      roundsPlayed: this.roundsPlayed(),
      totalScore: this.totalScore()
    }));
  }
  
  resetStats() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.roundsPlayed.set(0);
    this.totalScore.set(0);
    this.avgScore.set(null);
    this.lastCutText.set('--/--');
    this.lastScore.set(null);
  }
  
  pointsString = computed(() => this.polygonPoints().map(p => `${p.x},${p.y}`).join(' '));
  svgElement = viewChild.required<ElementRef<SVGSVGElement>>('gameCanvas');
  
  isDrawing = signal(false);
  startPoint = signal<Point | null>(null);
  currentPoint = signal<Point | null>(null);
  cutCompleted = signal(false);
  
  pieceStats = signal<{ pieceA: { percent: string, centroid: Point }, pieceB: { percent: string, centroid: Point } } | null>(null);
  
  roundsPlayed = signal<number>(0);
  lastCutText = signal<string>('--/--');
  lastScore = signal<number | null>(null);
  totalScore = signal<number>(0);
  avgScore = signal<number | null>(null);
  
  onPointerDown(event: PointerEvent) {
    this.audioService.unlock();
    
    if (this.splitPieces()) return;
    (event.target as Element).setPointerCapture(event.pointerId);
    
    const svgPoint = this.getSvgPoint(event.clientX, event.clientY);
    this.startPoint.set(svgPoint);
    this.currentPoint.set(svgPoint);
    this.isDrawing.set(true);
    this.cutCompleted.set(false);
  }
  
  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing()) return;
    this.currentPoint.set(this.getSvgPoint(event.clientX, event.clientY));
  }
  
  splitPieces = signal<{ pieceA: Point[], pieceB: Point[] } | null>(null);
  driftOffsets = signal<{ offsetA: Point, offsetB: Point }>({ offsetA: {x: 0, y: 0}, offsetB: {x: 0, y: 0} });
  
  async onPointerUp(event: PointerEvent) {
    if (!this.isDrawing()) return;
    this.isDrawing.set(false);
    this.cutCompleted.set(true);
    (event.target as Element).releasePointerCapture(event.pointerId);
    
    const start = this.startPoint();
    const end = this.currentPoint();
    
    if (!start || !end) return;
    const currentShape = this.polygonPoints();
    
    if (isPointInPolygon(start, currentShape) || isPointInPolygon(end, currentShape) || !doesCutIntersectShape(start, end, currentShape)) {
      this.startPoint.set(null);
      this.currentPoint.set(null);
      this.cutCompleted.set(false);
      return; 
    }
    
    const result = splitPolygon(this.polygonPoints(), start, end);
    
    if (result) {
      this.audioService.playSlice();
      
      const statsA = getPolygonAreaAndCentroid(result.pieceA);
      const statsB = getPolygonAreaAndCentroid(result.pieceB);
      const totalArea = statsA.area + statsB.area;
      
      const rawA = (statsA.area / totalArea) * 100;
      const rawB = 100 - rawA;
      
      const target = this.targetRatio();
      const diffA = Math.abs(target - rawA);
      const diffB = Math.abs(target - rawB);
      const diff = Math.min(diffA, diffB); 
      
      const currentCutText = `${Math.min(rawA, rawB).toFixed(1)}/${Math.max(rawA, rawB).toFixed(1)}`;
      
      if (diff < this.bestCutDiff()) {
        this.bestCutDiff.set(diff);
        this.bestCutText.set(currentCutText);
        
        if (this.mode() === 'sandbox') {
          localStorage.setItem('potong_best_diff', diff.toString());
          localStorage.setItem('potong_best_text', currentCutText);
        }
      }
      
      const score = this.calculateScore(diff);
      
      // Determine the Tier (Shared between both modes)
      let currentTier: CelebrationTier = 'standard';
      if (diff < 0.05) currentTier = 'perfect';
      else if (diff < 0.95) currentTier = 'almost';
      else if (diff < 4.95) currentTier = 'great';
      
      // --- 🚨 BRANCH THE GAME STATE 🚨 ---
      if (this.mode() === 'sandbox') {
        // 1. Sandbox-Only Persistence
        this.roundsPlayed.update(r => r + 1);
        this.lastCutText.set(currentCutText); 
        this.lastScore.set(score);
        this.totalScore.update(t => t + score);
        this.avgScore.set(Math.round(this.totalScore() / this.roundsPlayed()));
        this.saveStats(); 
        
        // 2. Sandbox-Only High Score
        if (diff < this.bestCutDiff()) {
          this.bestCutDiff.set(diff);
          this.bestCutText.set(currentCutText);
          localStorage.setItem('potong_best_diff', diff.toString());
          localStorage.setItem('potong_best_text', currentCutText);
        }
        
      } else if (this.mode() === 'daily') {
        const todaySGT = getSingaporeDateString();
        let profile = JSON.parse(localStorage.getItem('potong_daily_profile') || '{"streak": 0, "roundsPlayed": 0, "totalScore": 0, "bestDiff": 50, "bestCutText": "--/--", "lastDate": ""}');
        
        // 🚨 FAST-FAIL: If they already played today, do not overwrite their stats!
        // This prevents a bug where playing the daily again via an unhandled state overwrite increments stats
        const savedDaily = localStorage.getItem(`potong_daily_${todaySGT}`);
        if (!savedDaily) {
          
          if (profile.lastDate) {
            const lastDate = new Date(profile.lastDate);
            const today = new Date(todaySGT);
            const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) profile.streak += 1; 
            else if (diffDays > 1) profile.streak = 1;  
          } else {
            profile.streak = 1; 
          }
          
          profile.lastDate = todaySGT;
          profile.roundsPlayed += 1;
          profile.totalScore += score;
          
          if (diff < profile.bestDiff) {
            profile.bestDiff = diff;
            profile.bestCutText = currentCutText;
          }
          
          localStorage.setItem('potong_daily_profile', JSON.stringify(profile));
          
          this.dailyStreak.set(profile.streak);
          this.dailyBestCutText.set(profile.bestCutText);
          this.dailyAvgScore.set(Math.round(profile.totalScore / profile.roundsPlayed));
          this.dailyCutText.set(currentCutText);
          this.dailyScore.set(score);
          this.dailyTier.set(currentTier);
          
          const dailySaveData = {
            cutText: currentCutText, score: score, tier: currentTier,
            start: start, end: end, percentA: rawA.toFixed(1), percentB: rawB.toFixed(1)
          };
          localStorage.setItem(`potong_daily_${todaySGT}`, JSON.stringify(dailySaveData));
        }
      }
      
      if (currentTier === 'perfect' && this.isAutoNext()) {
        this.isAutoNext.set(false);
        localStorage.setItem('potong_auto_next', 'false'); 
      }
      
      this.celebrationService.trigger(currentTier);
      
      if (currentTier !== 'standard') this.triggerHaptics(currentTier);
      else this.triggerHaptics();
      
      if (currentTier === 'perfect') this.audioService.playPerfect();
      
      this.isDrifting.set(false);
      
      this.pieceStats.set({
        pieceA: { percent: rawA.toFixed(1), centroid: statsA.centroid },
        pieceB: { percent: rawB.toFixed(1), centroid: statsB.centroid }
      });
      
      this.driftOffsets.set({ offsetA: { x: 0, y: 0 }, offsetB: { x: 0, y: 0 } });
      this.splitPieces.set({ pieceA: result.pieceA, pieceB: result.pieceB });
      
      await this.waitForNextFrame(); 
      this.isDrifting.set(true);
      this.driftOffsets.set(calculateDriftOffsets(start, end, -60));
      
      const delayMs = this.celebrationService.getDelay(currentTier);
      
      if (this.isAutoNext()) {
        this.autoNextProgressDuration.set(delayMs);
        this.autoNextTimer = setTimeout(() => {
          this.autoNextProgressDuration.set(0);
          this.generateRandomShape(); 
        }, delayMs);
      }
      
    } else {
      this.startPoint.set(null);
      this.currentPoint.set(null);
      this.cutCompleted.set(false);
    }
  }
  
  private getSvgPoint(clientX: number, clientY: number): Point {
    const svg = this.svgElement().nativeElement;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }
  
  getPointsString(points: Point[] | undefined): string {
    if (!points) return '';
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }
  
  calculateScore(diff: number): number {
    if (diff < 0.05) return 100;
    const linear = 80 - (2.0 * diff);
    const exponential = 20 * Math.exp(-0.425 * diff);
    
    return Math.max(0, Math.round(linear + exponential));
  }
  
  private triggerHaptics(tier?: CelebrationTier) {
    if (!navigator.vibrate) return;
    if (tier === 'perfect') navigator.vibrate([50, 50, 100, 50, 150]); 
    else if (tier === 'almost') navigator.vibrate([40, 50, 80]); 
    else if (tier === 'great') navigator.vibrate([40, 30, 40]); 
    else navigator.vibrate(40);
  }
  
  private waitForNextFrame(): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }
  
  toggleAutoNext() {
    this.isAutoNext.update(state => {
      const newState = !state;
      localStorage.setItem('potong_auto_next', String(newState));
      return newState;
    });
    
    if (this.isAutoNext() && this.cutCompleted()) {
      this.autoNextProgressDuration.set(1000);
      this.autoNextTimer = setTimeout(() => {
        this.autoNextProgressDuration.set(0);
        this.generateRandomShape(); 
      }, 1000);
    } else if (!this.isAutoNext()) {
      if (this.autoNextTimer) {
        clearTimeout(this.autoNextTimer);
        this.autoNextTimer = undefined;
      }
      this.autoNextProgressDuration.set(0);
    }
  }
  
  private checkFirstVisit() {
    const hasVisited = localStorage.getItem('potong_has_visited');
    if (!hasVisited) {
      this.showInstructions.set(true);
      // We don't set the local storage flag until they explicitly click "PLAY"
    }
  }
  
  closeInstructions() {
    this.showInstructions.set(false);
    localStorage.setItem('potong_has_visited', 'true');
  }
  
  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
  
  openInstructions() {
    this.isMenuOpen.set(false); // Close the menu first
    this.showInstructions.set(true); // Open the modal
  }
  
  onShareCopied(isSuccessful: boolean) {
    if (isSuccessful) {
      this.shareText.set('COPIED!');
      this.shareCopied.set(true);
      
      setTimeout(() => {
        this.shareText.set('SHARE RESULT');
        this.shareCopied.set(false);
      }, 2500);
    } else {
      this.shareText.set('COPY FAILED');
      setTimeout(() => this.shareText.set('SHARE RESULT'), 2500);
    }
  }
}