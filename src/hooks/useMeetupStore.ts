import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Meetup } from "../types";

interface MeetupState {
  meetups: Meetup[];
  createMeetup: (
    meetup: Omit<Meetup, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateMeetup: (id: string, updates: Partial<Meetup>) => void;
  deleteMeetup: (id: string) => void;
  getMeetup: (id: string) => Meetup | undefined;
  getUserMeetups: (userId: string) => Meetup[];
  clearAllMeetups: () => void;
}

// Generate a simple ID for local storage
const generateId = () =>
  `meetup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useMeetupStore = create<MeetupState>()(
  persist(
    (set, get) => ({
      meetups: [],

      createMeetup: (meetupData) => {
        const newMeetup: Meetup = {
          ...meetupData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          meetups: [newMeetup, ...state.meetups],
        }));
      },

      updateMeetup: (id, updates) => {
        set((state) => ({
          meetups: state.meetups.map((meetup) =>
            meetup.id === id
              ? { ...meetup, ...updates, updatedAt: new Date() }
              : meetup
          ),
        }));
      },

      deleteMeetup: (id) => {
        set((state) => ({
          meetups: state.meetups.filter((meetup) => meetup.id !== id),
        }));
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
    }),
    {
      name: "meetup-storage",
      // Only persist the meetups array
      partialize: (state) => ({ meetups: state.meetups }),
    }
  )
);
