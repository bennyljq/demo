export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'auxiliary';

export interface Bar {
  value: number;
  state: BarState;
}

export interface AlgorithmMeta {
  key: string;
  name: string;
  category: 'comparison' | 'non-comparison' | 'joke';
  timeComplexity: string;
  spaceComplexity: string;
  spaceRatio: number; // 0.0–1.0 for the space complexity bar
  description: string;
}

export interface AlgorithmGroup {
  label: string;
  icon: string;
  algorithms: AlgorithmMeta[];
}

export interface SortStep {
  bars: Bar[];
  comparisons: number;
  swaps: number;
  auxiliarySize: number;
  done: boolean;
  message?: string;
}

