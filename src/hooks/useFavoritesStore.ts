import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteMeetups: string[];
  favoriteEvents: string[];
  favoritePlaces: string[];
  addMeetupToFavorites: (meetupId: string) => void;
  removeMeetupFromFavorites: (meetupId: string) => void;
  addEventToFavorites: (eventId: string) => void;
  removeEventFromFavorites: (eventId: string) => void;
  addPlaceToFavorites: (placeId: string) => void;
  removePlaceFromFavorites: (placeId: string) => void;
  isMeetupFavorite: (meetupId: string) => boolean;
  isEventFavorite: (eventId: string) => boolean;
  isPlaceFavorite: (placeId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Pre-populate with mock favorites for demo
      favoriteMeetups: ["meetup1", "meetup2", "meetup4", "meetup5"],
      favoriteEvents: ["event1", "event2", "event3", "event5"],
      favoritePlaces: [],

      addMeetupToFavorites: (meetupId: string) => {
        set((state) => ({
          favoriteMeetups: [...state.favoriteMeetups, meetupId],
        }));
      },

      removeMeetupFromFavorites: (meetupId: string) => {
        set((state) => ({
          favoriteMeetups: state.favoriteMeetups.filter(
            (id) => id !== meetupId
          ),
        }));
      },

      addEventToFavorites: (eventId: string) => {
        set((state) => ({
          favoriteEvents: [...state.favoriteEvents, eventId],
        }));
      },

      removeEventFromFavorites: (eventId: string) => {
        set((state) => ({
          favoriteEvents: state.favoriteEvents.filter((id) => id !== eventId),
        }));
      },

      addPlaceToFavorites: (placeId: string) => {
        set((state) => ({
          favoritePlaces: [...state.favoritePlaces, placeId],
        }));
      },

      removePlaceFromFavorites: (placeId: string) => {
        set((state) => ({
          favoritePlaces: state.favoritePlaces.filter((id) => id !== placeId),
        }));
      },

      isMeetupFavorite: (meetupId: string) => {
        return get().favoriteMeetups.includes(meetupId);
      },

      isEventFavorite: (eventId: string) => {
        return get().favoriteEvents.includes(eventId);
      },

      isPlaceFavorite: (placeId: string) => {
        return get().favoritePlaces.includes(placeId);
      },
    }),
    {
      name: "favorites-storage",
    }
  )
);
