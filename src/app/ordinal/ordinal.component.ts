import { Component, OnInit, signal, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { OrdinalItem, FeedbackState, GameLevel } from './ordinal.types';
import { QUESTION_BANK, QUESTION_BANK_EXTENDED, QUESTION_BANK_BATCH_3 } from './game-data';
import { GameStatsService } from './game-stats.service'; // Import service
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from './theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard'

const ALL_LEVELS = [...QUESTION_BANK, ...QUESTION_BANK_EXTENDED, ...QUESTION_BANK_BATCH_3];

@Component({
  selector: 'app-ordinal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    MatTooltipModule,
    ClipboardModule,
    MatSnackBarModule
  ],
  templateUrl: './ordinal.component.html',
  styleUrls: ['./ordinal.component.scss']
})
export class OrdinalComponent implements OnInit {

  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);
  currentLevelId = signal<string>('');
  private statsService = inject(GameStatsService); // Modern injection
  themeService = inject(ThemeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Expose the stats signal to the template
  stats = this.statsService.stats;

  // Signals
  currentMetric = signal<string>('');
  items: WritableSignal<OrdinalItem[]> = signal([]);
  isSubmitted = signal(false);
  attempts = signal(0);
  readonly MAX_ATTEMPTS = 3;

  seenLevelIds = new Set<string>();

  ngOnInit() {
    // Subscribe to query params to handle the URL link
    this.route.queryParams.subscribe(params => {
      const sharedId = params['question']; // matches ?question=...

      if (sharedId) {
        this.loadLevelById(sharedId);
      } else {
        this.loadRandomLevel();
      }
    });
  }

  loadLevelById(id: string) {
    // Find the specific level from the master list
    const targetLevel = ALL_LEVELS.find(l => l.id === id);

    if (targetLevel) {
      this.startLevel(targetLevel);

      // Optional: Clear the URL so hitting refresh doesn't stick to this level forever
      // this.router.navigate([], { queryParams: {} }); 
    } else {
      // If ID is invalid/typo, fallback to random
      this.loadRandomLevel();
    }
  }

  private startLevel(level: GameLevel) {
    this.currentLevelId.set(level.id);
    this.currentMetric.set(level.metric);

    const gameItems: OrdinalItem[] = level.data.map((d, i) => ({
      id: `${level.id}_${i}`,
      label: d.label,
      value: d.value,
      correctIndex: d.correctIndex,
      state: 'neutral' as FeedbackState
    }));

    this.items.set(this.shuffleArray(gameItems));
    this.attempts.set(0);
    this.isSubmitted.set(false);

    // Mark as seen so they don't get it again immediately
    this.seenLevelIds.add(level.id);

    this.router.navigate([], {
      queryParams: { question: level.id },
      queryParamsHandling: 'merge', // Keeps other params if you ever add them
      replaceUrl: true              // Prevents "Back" button spam (updates history in place)
    });
  }

  loadRandomLevel() {
    // Filter out levels we've already seen this session
    const availableLevels = ALL_LEVELS.filter(l => !this.seenLevelIds.has(l.id));

    // If we played everything, reset the history
    if (availableLevels.length === 0) {
      this.seenLevelIds.clear();
      this.loadRandomLevel(); // Recursively call to restart
      return;
    }

    // 1. Pick Random Level
    const randomIndex = Math.floor(Math.random() * availableLevels.length);
    const level = availableLevels[randomIndex];

    this.startLevel(level);
  }

  // Fisher-Yates Shuffle Algorithm
  private shuffleArray(array: OrdinalItem[]): OrdinalItem[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  drop(event: CdkDragDrop<OrdinalItem[]>) {
    if (this.isSubmitted()) return; // Lock dragging after specific conditions if needed

    // Create a new array reference to trigger signal update
    const newOrder = [...this.items()];
    moveItemInArray(newOrder, event.previousIndex, event.currentIndex);
    this.items.set(newOrder);

    // Reset states on move for cleaner UX
    this.resetStates();
  }

  submitOrder() {
    if (this.attempts() >= this.MAX_ATTEMPTS) return;

    this.attempts.update(v => v + 1);

    const currentItems = this.items();
    const updatedItems = currentItems.map((item, index) => {
      let newState: FeedbackState = 'wrong';
      const distance = Math.abs(index - item.correctIndex);

      if (distance === 0) {
        newState = 'correct'; // Exact Spot
      } else if (distance === 1) {
        newState = 'close';   // Off by 1 (The "Yellow" hint)
      }

      return { ...item, state: newState };
    });

    this.items.set(updatedItems);

    // Check Win Condition
    const allCorrect = updatedItems.every(i => i.state === 'correct');
    if (allCorrect) {
      this.isSubmitted.set(true);
      this.statsService.recordWin(); // <--- WIN!
      // Trigger "You Won!" Modal or Animation here
    } else if (this.attempts() >= this.MAX_ATTEMPTS) {
      this.isSubmitted.set(true);
      this.statsService.recordLoss(); // <--- LOSS!
      // Trigger "Game Over" UI here
    }
  }

  private resetStates() {
    this.items.update(items => items.map(i => ({ ...i, state: 'neutral' })));
  }

  shareResults() {
    const score = this.attempts();
    const max = this.MAX_ATTEMPTS;
    const didWin = this.items().every(i => i.state === 'correct');
    const items = this.items();

    // 1. Generate Emoji Grid (Vertical)
    // We map the final state of each item to an emoji
    const emojiGrid = items.map(item => {
      switch (item.state) {
        case 'correct': return '🟩';
        case 'close': return '🟨';
        default: return '⬜';
      }
    }).join('\n');

    // 2. Generate Link
    const link = `${window.location.origin}/?question=${this.currentLevelId()}`;

    // 3. Build the Text
    const shareText = `Ordinal #${this.currentLevelId()} ${didWin ? score : 'X'}/${max}\n\n${emojiGrid}\n\nPlay here: ${link}`;

    // 4. Copy & Notify
    const pending = this.clipboard.beginCopy(shareText);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        pending.destroy();
        this.snackBar.open('Results copied to clipboard!', 'Nice', { duration: 2000 });
      }
    };
    attempt();
  }
}