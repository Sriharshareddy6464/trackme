import { create } from 'zustand';

/**
 * Small UI state store for global overlay states.
 */
const useUIStore = create((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));

export default useUIStore;
