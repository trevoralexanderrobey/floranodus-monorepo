import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface CollaborationState {
  users: User[];
  currentUser: User | null;
  cursors: Record<string, { x: number; y: number }>;
  isConnected: boolean;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateCursor: (userId: string, position: { x: number; y: number }) => void;
  setCurrentUser: (user: User) => void;
  setConnected: (connected: boolean) => void;
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  users: [],
  currentUser: null,
  cursors: {},
  isConnected: false,
  
  addUser: (user) => set((state) => ({
    users: [...state.users.filter(u => u.id !== user.id), user]
  })),
  
  removeUser: (userId) => set((state) => ({
    users: state.users.filter(u => u.id !== userId),
    cursors: Object.fromEntries(
      Object.entries(state.cursors).filter(([id]) => id !== userId)
    )
  })),
  
  updateCursor: (userId, position) => set((state) => ({
    cursors: { ...state.cursors, [userId]: position }
  })),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setConnected: (connected) => set({ isConnected: connected })
})); 