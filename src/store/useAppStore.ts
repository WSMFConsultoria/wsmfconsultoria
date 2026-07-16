import { create } from 'zustand';
import { ContactMessage, BudgetRequest } from '../types';

interface AppState {
  messages: ContactMessage[];
  budgets: BudgetRequest[];
  addMessage: (message: ContactMessage) => void;
  addBudget: (budget: BudgetRequest) => void;
  clearMessages: () => void;
  clearBudgets: () => void;
}

// Helper to initialize from localStorage safely
const loadInitialMessages = (): ContactMessage[] => {
  try {
    const stored = localStorage.getItem('wsmf_messages');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const loadInitialBudgets = (): BudgetRequest[] => {
  try {
    const stored = localStorage.getItem('wsmf_budgets');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useAppStore = create<AppState>((set) => ({
  messages: loadInitialMessages(),
  budgets: loadInitialBudgets(),
  
  addMessage: (newMsg) => set((state) => {
    const updated = [newMsg, ...state.messages];
    localStorage.setItem('wsmf_messages', JSON.stringify(updated));
    return { messages: updated };
  }),
  
  addBudget: (newBudget) => set((state) => {
    const updated = [newBudget, ...state.budgets];
    localStorage.setItem('wsmf_budgets', JSON.stringify(updated));
    return { budgets: updated };
  }),
  
  clearMessages: () => set(() => {
    localStorage.removeItem('wsmf_messages');
    return { messages: [] };
  }),
  
  clearBudgets: () => set(() => {
    localStorage.removeItem('wsmf_budgets');
    return { budgets: [] };
  })
}));
