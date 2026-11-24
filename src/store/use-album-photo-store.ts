import { create } from "zustand";
import { Photo, Page } from "@/types/photo-album";
import { createJSONStorage, persist } from "zustand/middleware";
import { del, get, set } from "idb-keyval";

interface AlbumPhotoState {
  pages: Page[];
  currentPageIndex: number;
  selectedPhotos: Photo[];

  addPage: () => void;
  addPhotosToCurrentPage: (photos: Photo[]) => void;
  deleteSelectedPhotos: () => void;
  setCurrentPageIndex: (index: number) => void;
  toggleSelectedPhoto: (photo: Photo) => void;
}

const indexedDBStorage = {
  getItem: async (name: string) => (await get(name)) || null,
  setItem: async (name: string, value: string) => await set(name, value),
  removeItem: async (name: string) => await del(name),
};

export const useAlbumPhotoStore = create<AlbumPhotoState>()(
  persist(
    (set) => ({
      pages: [{ id: 0, photos: [] }],
      currentPageIndex: 0,
      selectedPhotos: [],

      setCurrentPageIndex: (index: number) => set(() => ({ currentPageIndex: index })),

      addPage: () =>
        set((state) => ({
          pages: [...state.pages, { id: state.pages.length, photos: [] }],
          currentPageIndex: state.pages.length,
        })),

      addPhotosToCurrentPage: (photos: Photo[]) =>
        set((state) => ({
          pages: state.pages.map((page, index) =>
            index === state.currentPageIndex
              ? { ...page, photos: [...page.photos, ...photos] }
              : page,
          ),
        })),

      toggleSelectedPhoto: (photo: Photo) =>
        set((state) => ({
          selectedPhotos: state.selectedPhotos.some((sPhoto) => sPhoto.id === photo.id)
            ? state.selectedPhotos.filter((sPhoto) => sPhoto.id !== photo.id)
            : [...state.selectedPhotos, photo],
        })),

      deleteSelectedPhotos: () =>
        set((state) => ({
          pages: state.pages.map((page, index) =>
            index === state.currentPageIndex
              ? {
                  ...page,
                  photos: page.photos.filter(
                    (photo) => !state.selectedPhotos.some((sPhoto) => sPhoto.id === photo.id),
                  ),
                }
              : page,
          ),
          selectedPhotos: [],
        })),
    }),
    {
      name: "album-photo-storage",
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);
