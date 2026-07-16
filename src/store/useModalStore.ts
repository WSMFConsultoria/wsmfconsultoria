import { create } from 'zustand';

interface ModalState {
  isBudgetModalOpen: boolean;
  openBudgetModal: () => void;
  closeBudgetModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isBudgetModalOpen: false,
  openBudgetModal: () => set({ isBudgetModalOpen: true }),
  closeBudgetModal: () => set({ isBudgetModalOpen: false }),
}));
