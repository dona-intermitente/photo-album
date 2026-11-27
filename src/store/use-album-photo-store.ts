import { create } from "zustand";
import { Photo, Page } from "@/types/photo-album";
import { createJSONStorage, persist } from "zustand/middleware";
import { del, get, set } from "idb-keyval";

interface AlbumPhotoState {
  pages: Page[];
  currentPageIndex: number;
  selectedPhotos: Photo[];

  addPage: () => void;
  deletePage: (pageId: number) => void;
  reorderPages: (pages: Page[]) => void;
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

      reorderPages: (pages: Page[]) =>
        set((state) => {
          const currentPage = state.pages[state.currentPageIndex];
          const newCurrentIndex = currentPage ? pages.findIndex((p) => p.id === currentPage.id) : 0;
          return {
            pages,
            currentPageIndex: newCurrentIndex >= 0 ? newCurrentIndex : 0,
          };
        }),

      deletePage: (pageId: number) =>
        set((state) => {
          if (state.pages.length <= 1) {
            return state;
          }

          const targetIndex = state.pages.findIndex((page) => page.id === pageId);
          if (targetIndex === -1) {
            return state;
          }

          const nextPages = state.pages.filter((page) => page.id !== pageId);
          let nextIndex = state.currentPageIndex;

          if (state.currentPageIndex === targetIndex) {
            nextIndex = Math.min(targetIndex, nextPages.length - 1);
          } else if (state.currentPageIndex > targetIndex) {
            nextIndex = state.currentPageIndex - 1;
          }

          return {
            pages: nextPages,
            currentPageIndex: Math.max(0, nextIndex),
          };
        }),

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
