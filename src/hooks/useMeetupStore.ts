import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Meetup } from "../types";
import { SupabaseDataService } from "../services/SupabaseDataService";

interface MeetupState {
  meetups: Meetup[];
  isLoading: boolean;
  fetchMeetups: () => Promise<void>;
  createMeetup: (
    meetup: Omit<Meetup, "id" | "createdAt" | "updatedAt">
  ) => Promise<Meetup>;
  updateMeetup: (id: string, updates: Partial<Meetup>) => Promise<void>;
  deleteMeetup: (id: string) => Promise<void>;
  getMeetup: (id: string) => Meetup | undefined;
  getUserMeetups: (userId: string) => Meetup[];
  clearAllMeetups: () => void;
  setMeetups: (meetups: Meetup[]) => void;
}

export const useMeetupStore = create<MeetupState>()(
  persist(
    (set, get) => ({
      meetups: [],
      isLoading: false,

      fetchMeetups: async () => {
        set({ isLoading: true });
        try {
          const meetups = await SupabaseDataService.getMeetups();
          set({ meetups, isLoading: false });
        } catch (error) {
          console.error("Error fetching meetups:", error);
          set({ isLoading: false });
        }
      },

      createMeetup: async (meetupData) => {
        set({ isLoading: true });
        try {
          const newMeetup = await SupabaseDataService.createMeetup(
            meetupData as Partial<Meetup>
          );
          set((state) => ({
            meetups: [newMeetup, ...state.meetups],
            isLoading: false,
          }));
          return newMeetup;
        } catch (error) {
          console.error("Error creating meetup:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateMeetup: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updatedMeetup = await SupabaseDataService.updateMeetup(
            id,
            updates
          );
          set((state) => ({
            meetups: state.meetups.map((meetup) =>
              meetup.id === id ? updatedMeetup : meetup
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error updating meetup:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      deleteMeetup: async (id) => {
        set({ isLoading: true });
        try {
          await SupabaseDataService.deleteMeetup(id);
          set((state) => ({
            meetups: state.meetups.filter((meetup) => meetup.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error deleting meetup:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      getMeetup: (id) => {
        return get().meetups.find((meetup) => meetup.id === id);
      },

      getUserMeetups: (userId) => {
        return get().meetups.filter((meetup) => meetup.creatorId === userId);
      },

      clearAllMeetups: () => {
        set({ meetups: [] });
      },

      setMeetups: (meetups) => {
        set({ meetups });
      },
    }),
    {
      name: "meetup-storage",
      // Only persist the meetups array
      partialize: (state) => ({ meetups: state.meetups }),
    }
  )
);
