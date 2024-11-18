import { CursorPosition } from '@/features/cursor/cursor';
import { create } from 'zustand';

interface CursorStore {
  cursors: Map<string, CursorPosition>;
  setCursors: (cursors: Map<string, CursorPosition>) => void;
}

export const useCursorStore = create<CursorStore>()((set) => ({
  cursors: new Map(),
  setCursors: (cursors) => set({ cursors }),
}));
