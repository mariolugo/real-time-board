import { create } from 'zustand';

export interface Client {
  name: string;
  color: string;
}

export interface UsersState {
  currentUser: Client | null;
  connectedUsers: Client[];
  setUsers: (users: Client[]) => void;
  setCurrentUser: (user: Client) => void;
}

export const useUsersStore = create<UsersState>()((set) => ({
  currentUser: null,
  connectedUsers: [],
  setUsers: (users) =>
    set(() => ({ connectedUsers: users })),
  setCurrentUser: (user) => set({ currentUser: user }),
}));
