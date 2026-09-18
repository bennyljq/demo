import { Injectable } from '@angular/core';
import { AlgorithmGroup, AlgorithmMeta, BarState, SortStep } from './sort.types';

type Counters = { c: number; s: number };

// ─────────────────────────────────────────────────────────────────────────────
// Algorithm metadata
// ─────────────────────────────────────────────────────────────────────────────

export const ALGORITHMS: AlgorithmMeta[] = [
  // ── Comparison ────────────────────────────────────────────────────────────
  { key: 'bubble',    name: 'Bubble Sort',         category: 'comparison',
    timeComplexity: 'O(n²)',         spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: 'Repeatedly swaps adjacent elements that are out of order until the array is sorted.' },
  { key: 'selection', name: 'Selection Sort',       category: 'comparison',
    timeComplexity: 'O(n²)',         spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: 'Finds the minimum element and moves it to the front repeatedly.' },
  { key: 'insertion', name: 'Insertion Sort',       category: 'comparison',
    timeComplexity: 'O(n²)',         spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: 'Builds the sorted array one element at a time by inserting into the correct position.' },
  { key: 'merge',     name: 'Merge Sort',           category: 'comparison',
    timeComplexity: 'O(n log n)',    spaceComplexity: 'O(n)',    spaceRatio: 0.62,
    description: 'Divide-and-conquer: splits the array in half, sorts each half, then merges.' },
  { key: 'quick',     name: 'Quick Sort',           category: 'comparison',
    timeComplexity: 'O(n log n) avg', spaceComplexity: 'O(log n)', spaceRatio: 0.22,
    description: 'Picks a pivot, partitions around it, then recursively sorts each sub-array.' },
  { key: 'heap',      name: 'Heap Sort',            category: 'comparison',
    timeComplexity: 'O(n log n)',    spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: 'Builds a max-heap, then repeatedly extracts the maximum to sorted position.' },
  { key: 'shell',     name: 'Shell Sort',           category: 'comparison',
    timeComplexity: 'O(n log² n)',   spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: 'Insertion sort generalised with diminishing gap sequences.' },
  { key: 'tim',       name: 'Tim Sort',             category: 'comparison',
    timeComplexity: 'O(n log n)',    spaceComplexity: 'O(n)',    spaceRatio: 0.62,
    description: 'Hybrid of insertion sort + merge sort. Powers Python\'s sorted() and Java Arrays.sort.' },
  { key: 'cocktail',  name: 'Cocktail Shaker',      category: 'comparison',
    timeComplexity: 'O(n²)',         spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: 'Bubble sort that alternates direction each pass, like shaking a cocktail.' },
  { key: 'comb',      name: 'Comb Sort',            category: 'comparison',
    timeComplexity: 'O(n log n)',    spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: 'Improves bubble sort by comparing elements separated by a shrinking gap.' },
  // ── Non-Comparison ────────────────────────────────────────────────────────
  { key: 'radix',     name: 'Radix Sort (LSD)',     category: 'non-comparison',
    timeComplexity: 'O(nk)',         spaceComplexity: 'O(n+k)',  spaceRatio: 0.82,
    description: 'Sorts integers digit by digit, from least significant to most significant.' },
  { key: 'counting',  name: 'Counting Sort',        category: 'non-comparison',
    timeComplexity: 'O(n+k)',        spaceComplexity: 'O(k)',    spaceRatio: 0.48,
    description: 'Counts occurrences of each value, then reconstructs the sorted array.' },
  { key: 'bucket',    name: 'Bucket Sort',          category: 'non-comparison',
    timeComplexity: 'O(n+k)',        spaceComplexity: 'O(n+k)',  spaceRatio: 0.82,
    description: 'Scatters elements into buckets, sorts the buckets, and then concatenates them.' },
  // ── Joke ─────────────────────────────────────────────────────────────────
  { key: 'bogo',      name: 'Bogo Sort',            category: 'joke',
    timeComplexity: 'O((n+1)!)',     spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: '🎲 Randomly shuffles the array until it is sorted by sheer luck. Capped at 500 attempts.' },
  { key: 'sleep',     name: 'Sleep Sort',           category: 'joke',
    timeComplexity: 'O(n · max)',    spaceComplexity: 'O(n)',    spaceRatio: 0.62,
    description: '😴 Spawns a thread per element that sleeps for its value, then outputs itself.' },
  { key: 'stalin',    name: 'Stalin Sort',          category: 'joke',
    timeComplexity: 'O(n)',          spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: '🚨 Eliminates any element that is out of order. Blazing fast, but destructive.' },
  { key: 'miracle',   name: 'Miracle Sort',         category: 'joke',
    timeComplexity: 'O(∞)',          spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: '✨ Checks if sorted. Waits patiently for cosmic rays to flip bits into order.' },
  { key: 'gnome',     name: 'Gnome Sort',           category: 'joke',
    timeComplexity: 'O(n²)',         spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: '🧙 Inspired by a garden gnome sorting flower pots — steps forward and back.' },
  { key: 'pancake',   name: 'Pancake Sort',         category: 'joke',
    timeComplexity: 'O(n²)',         spaceComplexity: 'O(1)',    spaceRatio: 0.04,
    description: '🥞 Only allowed operation: flip a prefix of the array. Like sorting a stack of pancakes.' },
  { key: 'stooge',    name: 'Stooge Sort',          category: 'joke',
    timeComplexity: 'O(n^2.7)',      spaceComplexity: 'O(n)',    spaceRatio: 0.62,
    description: '🤡 Notoriously terrible: sort first ⅔, last ⅔, first ⅔ again — recursively.' },
  { key: 'strand',    name: 'Strand Sort',          category: 'joke',
    timeComplexity: 'O(n²)',         spaceComplexity: 'O(n)',    spaceRatio: 0.62,
    description: '🧵 Repeatedly pulls sorted strands from the input and merges them into the result.' },
];

export const ALGORITHM_GROUPS: AlgorithmGroup[] = [
  { label: 'Comparison',     icon: '📊', algorithms: ALGORITHMS.filter(a => a.category === 'comparison') },
  { label: 'Non-Comparison', icon: '🔢', algorithms: ALGORITHMS.filter(a => a.category === 'non-comparison') },
  { label: 'Joke Sorts',     icon: '🃏', algorithms: ALGORITHMS.filter(a => a.category === 'joke') },
];

// ─────────────────────────────────────────────────────────────────────────────
// Engine service
// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SortEngineService {

  /** Returns a generator that yields SortStep snapshots for the chosen algorithm. */
  createGenerator(key: string, arr: number[]): Generator<SortStep> {
    const a = [...arr];
    switch (key) {
      case 'bubble':    return this.bubble(a);
      case 'selection': return this.selection(a);
      case 'insertion': return this.insertion(a);
      case 'merge':     return this.merge(a);
      case 'quick':     return this.quick(a);
      case 'heap':      return this.heap(a);
      case 'shell':     return this.shell(a);
      case 'tim':       return this.tim(a);
      case 'cocktail':  return this.cocktail(a);
      case 'comb':      return this.comb(a);
      case 'radix':     return this.radix(a);
      case 'counting':  return this.counting(a);
      case 'bucket':    return this.bucket(a);
      case 'bogo':      return this.bogo(a);
      case 'sleep':     return this.sleepSort(a);
      case 'stalin':    return this.stalin(a);
      case 'miracle':   return this.miracle(a);
      case 'gnome':     return this.gnome(a);
      case 'pancake':   return this.pancake(a);
      case 'stooge':    return this.stooge(a);
      case 'strand':    return this.strand(a);
      default:          return this.bubble(a);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private snap(
    arr: number[],
    hl: { [i: number]: BarState },
    sorted: Set<number>,
    cnts: Counters,
    aux = 0,
    msg?: string,
    done = false
  ): SortStep {
    return {
      bars: arr.map((v, i) => ({
        value: v,
        state: done         ? 'sorted'
             : hl[i] != null ? hl[i]
             : sorted.has(i) ? 'sorted'
             : 'default'
      })),
      comparisons: cnts.c,
      swaps: cnts.s,
      auxiliarySize: aux,
      done,
      message: msg
    };
  }

  private doneStep(arr: number[], cnts: Counters, aux = 0, msg?: string): SortStep {
    return {
      bars: arr.map(v => ({ value: v, state: 'sorted' })),
      comparisons: cnts.c,
      swaps: cnts.s,
      auxiliarySize: aux,
      done: true,
      message: msg
    };
  }

  private isSorted(a: number[]): boolean {
    for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) return false;
    return true;
  }

  private shuffle(a: number[]): void {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }

  // ── COMPARISON SORTS ──────────────────────────────────────────────────────

  private *bubble(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        cnts.c++;
        yield this.snap(a, { [j]: 'comparing', [j + 1]: 'comparing' }, sorted, cnts);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          cnts.s++;
          swapped = true;
          yield this.snap(a, { [j]: 'swapping', [j + 1]: 'swapping' }, sorted, cnts);
        }
      }
      sorted.add(n - 1 - i);
      if (!swapped) break;
    }
    yield this.doneStep(a, cnts);
  }

  private *selection(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        cnts.c++;
        yield this.snap(a, { [j]: 'comparing', [minIdx]: 'pivot' }, sorted, cnts);
        if (a[j] < a[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        cnts.s++;
        yield this.snap(a, { [i]: 'swapping', [minIdx]: 'swapping' }, sorted, cnts);
      }
      sorted.add(i);
    }
    sorted.add(n - 1);
    yield this.doneStep(a, cnts);
  }

  private *insertion(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    sorted.add(0);
    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      yield this.snap(a, { [i]: 'comparing' }, sorted, cnts);
      while (j >= 0 && a[j] > key) {
        cnts.c++;
        a[j + 1] = a[j];
        cnts.s++;
        yield this.snap(a, { [j]: 'swapping', [j + 1]: 'swapping' }, sorted, cnts);
        j--;
      }
      if (j >= 0) cnts.c++;
      a[j + 1] = key;
      sorted.add(i);
      yield this.snap(a, { [j + 1]: 'comparing' }, sorted, cnts);
    }
    yield this.doneStep(a, cnts);
  }

  // ── Merge Sort ────────────────────────────────────────────────────────────

  private *merge(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    yield* this.mergeSortRec(a, 0, a.length - 1, sorted, cnts);
    yield this.doneStep(a, cnts, a.length);
  }

  private *mergeSortRec(a: number[], l: number, r: number, sorted: Set<number>, cnts: Counters): Generator<SortStep> {
    if (l >= r) { sorted.add(l); return; }
    const m = Math.floor((l + r) / 2);
    yield* this.mergeSortRec(a, l, m, sorted, cnts);
    yield* this.mergeSortRec(a, m + 1, r, sorted, cnts);
    yield* this.mergeParts(a, l, m, r, sorted, cnts);
  }

  private *mergeParts(a: number[], l: number, m: number, r: number, sorted: Set<number>, cnts: Counters): Generator<SortStep> {
    const left  = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    const aux   = left.length + right.length;
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      cnts.c++;
      yield this.snap(a, { [l + i]: 'auxiliary', [m + 1 + j]: 'auxiliary', [k]: 'comparing' }, sorted, cnts, aux);
      if (left[i] <= right[j]) { a[k] = left[i++]; }
      else                     { a[k] = right[j++]; cnts.s++; }
      yield this.snap(a, { [k]: 'swapping' }, sorted, cnts, aux);
      k++;
    }
    while (i < left.length)  { a[k++] = left[i++]; }
    while (j < right.length) { a[k++] = right[j++]; }
    for (let idx = l; idx <= r; idx++) sorted.add(idx);
    yield this.snap(a, {}, sorted, cnts, 0);
  }

  // ── Quick Sort ────────────────────────────────────────────────────────────

  private *quick(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    yield* this.quickRec(a, 0, a.length - 1, sorted, cnts);
    yield this.doneStep(a, cnts, Math.ceil(Math.log2(a.length + 1)));
  }

  private *quickRec(a: number[], low: number, high: number, sorted: Set<number>, cnts: Counters): Generator<SortStep> {
    if (low >= high) { if (low === high) sorted.add(low); return; }
    const pivot: number = yield* this.partition(a, low, high, sorted, cnts);
    sorted.add(pivot);
    yield* this.quickRec(a, low, pivot - 1, sorted, cnts);
    yield* this.quickRec(a, pivot + 1, high, sorted, cnts);
  }

  private *partition(a: number[], low: number, high: number, sorted: Set<number>, cnts: Counters): Generator<SortStep, number, unknown> {
    let i = low - 1;
    for (let j = low; j < high; j++) {
      cnts.c++;
      yield this.snap(a, { [j]: 'comparing', [high]: 'pivot' }, sorted, cnts);
      if (a[j] <= a[high]) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          cnts.s++;
          yield this.snap(a, { [i]: 'swapping', [j]: 'swapping', [high]: 'pivot' }, sorted, cnts);
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    cnts.s++;
    yield this.snap(a, { [i + 1]: 'pivot' }, sorted, cnts);
    return i + 1;
  }

  // ── Heap Sort ─────────────────────────────────────────────────────────────

  private *heap(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
      yield* this.heapify(a, n, i, sorted, cnts);
    for (let i = n - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      cnts.s++;
      sorted.add(i);
      yield this.snap(a, { [0]: 'swapping', [i]: 'swapping' }, sorted, cnts);
      yield* this.heapify(a, i, 0, sorted, cnts);
    }
    sorted.add(0);
    yield this.doneStep(a, cnts);
  }

  private *heapify(a: number[], n: number, i: number, sorted: Set<number>, cnts: Counters): Generator<SortStep> {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n) {
      cnts.c++;
      yield this.snap(a, { [l]: 'comparing', [largest]: 'comparing' }, sorted, cnts);
      if (a[l] > a[largest]) largest = l;
    }
    if (r < n) {
      cnts.c++;
      yield this.snap(a, { [r]: 'comparing', [largest]: 'comparing' }, sorted, cnts);
      if (a[r] > a[largest]) largest = r;
    }
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      cnts.s++;
      yield this.snap(a, { [i]: 'swapping', [largest]: 'swapping' }, sorted, cnts);
      yield* this.heapify(a, n, largest, sorted, cnts);
    }
  }

  // ── Shell Sort ────────────────────────────────────────────────────────────

  private *shell(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    let gap = Math.floor(n / 2);
    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        const temp = a[i];
        let j = i;
        while (j >= gap) {
          cnts.c++;
          yield this.snap(a, { [j]: 'comparing', [j - gap]: 'comparing' }, sorted, cnts);
          if (a[j - gap] > temp) {
            a[j] = a[j - gap];
            cnts.s++;
            yield this.snap(a, { [j]: 'swapping', [j - gap]: 'swapping' }, sorted, cnts);
            j -= gap;
          } else break;
        }
        a[j] = temp;
      }
      gap = Math.floor(gap / 2);
    }
    yield this.doneStep(a, cnts);
  }

  // ── Tim Sort ──────────────────────────────────────────────────────────────

  private *tim(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    const MIN_RUN = Math.min(32, n);
    for (let i = 0; i < n; i += MIN_RUN)
      yield* this.timInsert(a, i, Math.min(i + MIN_RUN - 1, n - 1), sorted, cnts);
    for (let size = MIN_RUN; size < n; size *= 2) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid   = Math.min(left + size - 1, n - 1);
        const right = Math.min(left + 2 * size - 1, n - 1);
        if (mid < right) yield* this.mergeParts(a, left, mid, right, sorted, cnts);
      }
    }
    yield this.doneStep(a, cnts, MIN_RUN);
  }

  private *timInsert(a: number[], left: number, right: number, sorted: Set<number>, cnts: Counters): Generator<SortStep> {
    for (let i = left + 1; i <= right; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= left && a[j] > key) {
        cnts.c++;
        a[j + 1] = a[j];
        cnts.s++;
        yield this.snap(a, { [j]: 'swapping', [j + 1]: 'swapping' }, sorted, cnts);
        j--;
      }
      if (j >= left) cnts.c++;
      a[j + 1] = key;
    }
    for (let i = left; i <= right; i++) sorted.add(i);
  }

  // ── Cocktail Shaker Sort ──────────────────────────────────────────────────

  private *cocktail(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    let lo = 0, hi = n - 1;
    while (lo < hi) {
      let swapped = false;
      for (let i = lo; i < hi; i++) {
        cnts.c++;
        yield this.snap(a, { [i]: 'comparing', [i + 1]: 'comparing' }, sorted, cnts);
        if (a[i] > a[i + 1]) {
          [a[i], a[i + 1]] = [a[i + 1], a[i]];
          cnts.s++; swapped = true;
          yield this.snap(a, { [i]: 'swapping', [i + 1]: 'swapping' }, sorted, cnts);
        }
      }
      sorted.add(hi--);
      if (!swapped) break;
      swapped = false;
      for (let i = hi; i > lo; i--) {
        cnts.c++;
        yield this.snap(a, { [i]: 'comparing', [i - 1]: 'comparing' }, sorted, cnts);
        if (a[i] < a[i - 1]) {
          [a[i], a[i - 1]] = [a[i - 1], a[i]];
          cnts.s++; swapped = true;
          yield this.snap(a, { [i]: 'swapping', [i - 1]: 'swapping' }, sorted, cnts);
        }
      }
      sorted.add(lo++);
      if (!swapped) break;
    }
    yield this.doneStep(a, cnts);
  }

  // ── Comb Sort ─────────────────────────────────────────────────────────────

  private *comb(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    let gap = n;
    let inOrder = false;
    while (!inOrder) {
      gap = Math.floor(gap / 1.3);
      if (gap <= 1) { gap = 1; inOrder = true; }
      for (let i = 0; i + gap < n; i++) {
        cnts.c++;
        yield this.snap(a, { [i]: 'comparing', [i + gap]: 'comparing' }, sorted, cnts);
        if (a[i] > a[i + gap]) {
          [a[i], a[i + gap]] = [a[i + gap], a[i]];
          cnts.s++; inOrder = false;
          yield this.snap(a, { [i]: 'swapping', [i + gap]: 'swapping' }, sorted, cnts);
        }
      }
    }
    yield this.doneStep(a, cnts);
  }

  // ── NON-COMPARISON SORTS ──────────────────────────────────────────────────

  private *radix(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n   = a.length;
    const max = Math.max(...a);
    const aux = n + 10;
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const output = new Array(n).fill(0);
      const count  = new Array(10).fill(0);
      for (let i = 0; i < n; i++) {
        const digit = Math.floor(a[i] / exp) % 10;
        count[digit]++;
        cnts.c++;
        yield this.snap(a, { [i]: 'comparing' }, sorted, cnts, aux, `Counting digit ${digit} (×${exp})`);
      }
      for (let i = 1; i < 10; i++) count[i] += count[i - 1];
      for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(a[i] / exp) % 10;
        output[--count[digit]] = a[i];
        cnts.s++;
        yield this.snap(a, { [i]: 'swapping' }, sorted, cnts, aux, `Placing digit ${digit}`);
      }
      for (let i = 0; i < n; i++) {
        a[i] = output[i];
        yield this.snap(a, { [i]: 'auxiliary' }, sorted, cnts, aux);
      }
    }
    yield this.doneStep(a, cnts, 0);
  }

  private *counting(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n   = a.length;
    const max = Math.max(...a);
    const cnt = new Array(max + 1).fill(0);
    for (let i = 0; i < n; i++) {
      cnt[a[i]]++;
      cnts.c++;
      yield this.snap(a, { [i]: 'comparing' }, sorted, cnts, cnt.length, `Counting ${a[i]}`);
    }
    let idx = 0;
    for (let v = 0; v <= max; v++) {
      while (cnt[v]-- > 0) {
        a[idx] = v;
        cnts.s++;
        yield this.snap(a, { [idx]: 'swapping' }, sorted, cnts, cnt.length, `Writing ${v}`);
        idx++;
      }
    }
    yield this.doneStep(a, cnts, 0);
  }

  private *bucket(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    if (n === 0) { yield this.doneStep(a, cnts, 0); return; }

    const max = Math.max(...a);
    const min = Math.min(...a);
    const bucketCount = Math.floor(Math.sqrt(n)) || 1;
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    for (let i = 0; i < n; i++) {
      cnts.c++;
      let bIdx = Math.floor(((a[i] - min) / (max - min + 1)) * bucketCount);
      if (bIdx >= bucketCount) bIdx = bucketCount - 1;
      buckets[bIdx].push(a[i]);
      yield this.snap(a, { [i]: 'comparing' }, sorted, cnts, n + bucketCount, `Scattering ${a[i]} to bucket ${bIdx}`);
    }

    let idx = 0;
    for (let b = 0; b < bucketCount; b++) {
      const bucket = buckets[b];
      bucket.sort((x, y) => { cnts.c++; return x - y; });
      for (let i = 0; i < bucket.length; i++) {
        a[idx] = bucket[i];
        cnts.s++;
        yield this.snap(a, { [idx]: 'swapping' }, sorted, cnts, n + bucketCount, `Writing ${a[idx]} from bucket ${b}`);
        idx++;
      }
    }
    yield this.doneStep(a, cnts, 0);
  }

  // ── JOKE SORTS ────────────────────────────────────────────────────────────

  private *bogo(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const MAX = 500;
    let attempt = 0;
    while (!this.isSorted(a) && attempt < MAX) {
      attempt++;
      for (let i = 0; i < a.length - 1; i++) {
        cnts.c++;
        yield this.snap(a, { [i]: 'comparing', [i + 1]: 'comparing' }, sorted, cnts, 0,
          `🎲 Check #${attempt}…`);
      }
      if (!this.isSorted(a)) {
        this.shuffle(a);
        cnts.s += a.length;
        yield this.snap(a, {}, sorted, cnts, 0, `🎲 Nope. Shuffling again… (attempt ${attempt})`);
      }
    }
    if (attempt >= MAX)
      yield this.snap(a, {}, sorted, cnts, 0, `🎲 Gave up after ${MAX} shuffles. The universe has spoken.`, true);
    else
      yield this.doneStep(a, cnts, 0, `🎲 Got lucky after ${attempt} shuffle${attempt === 1 ? '' : 's'}!`);
  }

  private *sleepSort(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    const order = a.map((v, i) => ({ v, i })).sort((x, y) => x.v - y.v);
    let writeIdx = 0;
    for (const { v, i } of order) {
      cnts.c++;
      yield this.snap(a, { [i]: 'comparing' }, sorted, cnts, n, `😴 Thread ${v} sleeping (${v} ticks)…`);
      a[writeIdx] = v;
      cnts.s++;
      sorted.add(writeIdx);
      yield this.snap(a, { [writeIdx]: 'swapping' }, sorted, cnts, n, `⏰ Thread ${v} woke up!`);
      writeIdx++;
    }
    yield this.doneStep(a, cnts, 0, '😴 All threads have woken up!');
  }

  private *stalin(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const eliminated = new Set<number>();
    let maxSeen = a[0];
    sorted.add(0);
    yield this.snap(a, { [0]: 'pivot' }, sorted, cnts, 0, '🚨 Element 0 is the first. It is safe — for now.');
    for (let i = 1; i < a.length; i++) {
      cnts.c++;
      yield this.snap(a, { [i]: 'comparing' }, sorted, cnts, 0, `🚨 Inspecting ${a[i]}…`);
      if (a[i] >= maxSeen) {
        maxSeen = a[i];
        sorted.add(i);
        yield this.snap(a, { [i]: 'pivot' }, sorted, cnts, 0, `✅ ${a[i]} conforms. Comrade is safe.`);
      } else {
        yield this.snap(a, { [i]: 'swapping' }, sorted, cnts, 0, `🚨 ${a[i]} is out of line. ELIMINATED.`);
        a[i] = 0;
        cnts.s++;
        eliminated.add(i);
      }
    }
    yield {
      bars: a.map((v, i) => ({ value: v, state: (eliminated.has(i) ? 'auxiliary' : 'sorted') })),
      comparisons: cnts.c,
      swaps: cnts.s,
      auxiliarySize: 0,
      done: true,
      message: `🚨 Done. ${eliminated.size} dissidents purged.`
    };
  }

  private *miracle(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const MAX = 1000;
    const msgs = [
      '✨ Checking… not sorted yet.',
      '🌌 Waiting for cosmic rays…',
      '☄️ Any quantum fluctuation now…',
      '🎰 Still waiting for that miracle…',
      '🌠 A shooting star! Nothing changed.',
      '⚡ So close…',
      '🙏 Praying harder…',
      '🌀 Quantum collapse imminent…',
      '💫 A bit flipped! Now it\'s more wrong.',
      '🫣 Have you tried turning it off and on again?',
    ];
    for (let check = 1; check <= MAX; check++) {
      const msg = msgs[check % msgs.length];
      for (let i = 0; i < a.length - 1; i++) {
        cnts.c++;
        yield this.snap(a, { [i]: 'comparing', [i + 1]: 'comparing' }, sorted, cnts, 0,
          `${msg} (check #${check})`);
      }
      if (this.isSorted(a)) {
        yield this.doneStep(a, cnts, 0, '✨ A miracle occurred!');
        return;
      }
    }
    yield this.snap(a, {}, sorted, cnts, 0, `✨ No miracle after ${MAX} checks. Try again next Big Bang.`, true);
  }

  private *gnome(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    let i = 0;
    while (i < n) {
      if (i === 0) { i++; continue; }
      cnts.c++;
      yield this.snap(a, { [i]: 'comparing', [i - 1]: 'comparing' }, sorted, cnts);
      if (a[i] >= a[i - 1]) { i++; }
      else {
        [a[i], a[i - 1]] = [a[i - 1], a[i]];
        cnts.s++;
        yield this.snap(a, { [i]: 'swapping', [i - 1]: 'swapping' }, sorted, cnts, 0, '🧙 Gnome steps back!');
        i--;
      }
    }
    yield this.doneStep(a, cnts);
  }

  private *pancake(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const n = a.length;
    for (let size = n; size > 1; size--) {
      let maxIdx = 0;
      for (let i = 1; i < size; i++) {
        cnts.c++;
        yield this.snap(a, { [i]: 'comparing', [maxIdx]: 'pivot' }, sorted, cnts);
        if (a[i] > a[maxIdx]) maxIdx = i;
      }
      if (maxIdx !== size - 1) {
        if (maxIdx !== 0) yield* this.flip(a, 0, maxIdx, sorted, cnts, `🥞 Flip [0…${maxIdx}]`);
        yield* this.flip(a, 0, size - 1, sorted, cnts, `🥞 Flip [0…${size - 1}]`);
      }
      sorted.add(size - 1);
    }
    sorted.add(0);
    yield this.doneStep(a, cnts);
  }

  private *flip(a: number[], s: number, e: number, sorted: Set<number>, cnts: Counters, msg: string): Generator<SortStep> {
    while (s < e) {
      [a[s], a[e]] = [a[e], a[s]];
      cnts.s++;
      yield this.snap(a, { [s]: 'swapping', [e]: 'swapping' }, sorted, cnts, 0, msg);
      s++; e--;
    }
  }

  private *stooge(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    yield* this.stoogeRec(a, 0, a.length - 1, sorted, cnts);
    yield this.doneStep(a, cnts, a.length);
  }

  private *stoogeRec(a: number[], l: number, r: number, sorted: Set<number>, cnts: Counters): Generator<SortStep> {
    if (l >= r) return;
    cnts.c++;
    yield this.snap(a, { [l]: 'comparing', [r]: 'comparing' }, sorted, cnts, 0, `🤡 Stooge [${l}…${r}]`);
    if (a[l] > a[r]) {
      [a[l], a[r]] = [a[r], a[l]];
      cnts.s++;
      yield this.snap(a, { [l]: 'swapping', [r]: 'swapping' }, sorted, cnts, 0, '🤡 Swap ends');
    }
    if (r - l + 1 > 2) {
      const t = Math.floor((r - l + 1) / 3);
      yield* this.stoogeRec(a, l,     r - t, sorted, cnts);
      yield* this.stoogeRec(a, l + t, r,     sorted, cnts);
      yield* this.stoogeRec(a, l,     r - t, sorted, cnts);
    }
    if (r - l <= 2) for (let i = l; i <= r; i++) sorted.add(i);
  }

  private *strand(a: number[]): Generator<SortStep> {
    const cnts: Counters = { c: 0, s: 0 };
    const sorted = new Set<number>();
    const input  = [...a];
    const result: number[] = [];

    while (input.length > 0) {
      const strand: number[] = [input.shift()!];
      let i = 0;
      while (i < input.length) {
        cnts.c++;
        if (input[i] >= strand[strand.length - 1]) {
          strand.push(input.splice(i, 1)[0]);
          cnts.s++;
        } else { i++; }
        // Rebuild visual: result | strand | remaining input
        let k = 0;
        for (const v of result) a[k++] = v;
        for (const v of strand) a[k++] = v;
        for (const v of input)  a[k++] = v;
        yield this.snap(a, { [result.length + strand.length - 1]: 'comparing' }, sorted, cnts,
          strand.length, `🧵 Building strand (len ${strand.length})…`);
      }
      // Merge strand into result
      const merged: number[] = [];
      let si = 0, ri = 0;
      while (si < strand.length && ri < result.length) {
        cnts.c++;
        merged.push(strand[si] <= result[ri] ? strand[si++] : result[ri++]);
        cnts.s++;
      }
      while (si < strand.length) merged.push(strand[si++]);
      while (ri < result.length) merged.push(result[ri++]);
      result.splice(0, result.length, ...merged);
      for (let j = 0; j < merged.length; j++) { a[j] = merged[j]; sorted.add(j); }
      yield this.snap(a, {}, sorted, cnts, result.length, `🧵 Merged strand into result (${result.length} elements)`);
    }
    yield this.doneStep(a, cnts, 0, '🧵 All strands woven!');
  }
}

