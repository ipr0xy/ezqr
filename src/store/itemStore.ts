import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item, CreateItemData } from '../types';
import { generateUPIQRData, generatePaymentNote } from '../utils/qrGenerator';
import { STORAGE_KEYS } from '../utils/constants';

interface ItemState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  createItem: (itemData: CreateItemData) => Promise<Item>;
  updateItem: (itemId: string, itemData: Partial<Omit<Item, 'id' | 'createdAt'>>) => Promise<void>;
  deleteItem: (itemId: string) => void;
  getItemById: (itemId: string) => Item | undefined;
  toggleItemStatus: (itemId: string) => void;
  clearError: () => void;
}

export const useItemStore = create<ItemState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      createItem: async (itemData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay for better UX
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Generate payment note if not provided
          const paymentNote = itemData.paymentNote || generatePaymentNote(itemData.name);
          
          // Generate QR code data using the provided UPI ID
          const qrCodeData = generateUPIQRData(
            itemData.upiId,
            itemData.name,
            itemData.price,
            paymentNote
          );
          
          const item: Item = {
            ...itemData,
            id: crypto.randomUUID(),
            qrCodeData,
            paymentNote,
            createdAt: new Date(),
            isActive: true
          };
          
          set(state => ({
            items: [...state.items, item],
            isLoading: false
          }));
          
          return item;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create QR code';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      updateItem: async (itemId, itemData) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            items: state.items.map(item => {
              if (item.id === itemId) {
                const updatedItem = { ...item, ...itemData };
                
                // Regenerate QR code if relevant data changed
                if (itemData.upiId || itemData.name || itemData.price || itemData.paymentNote) {
                  const paymentNote = updatedItem.paymentNote || generatePaymentNote(updatedItem.name);
                  updatedItem.qrCodeData = generateUPIQRData(
                    updatedItem.upiId,
                    updatedItem.name,
                    updatedItem.price,
                    paymentNote
                  );
                  updatedItem.paymentNote = paymentNote;
                }
                
                return updatedItem;
              }
              return item;
            }),
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update QR code';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      deleteItem: (itemId) => {
        try {
          set(state => ({
            items: state.items.filter(item => item.id !== itemId),
            error: null
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete QR code';
          set({ error: errorMessage });
        }
      },
      
      getItemById: (itemId) => {
        try {
          return get().items.find(item => item.id === itemId);
        } catch (error) {
          console.error('Error getting item by ID:', error);
          return undefined;
        }
      },
      
      toggleItemStatus: (itemId) => {
        try {
          set(state => ({
            items: state.items.map(item =>
              item.id === itemId ? { ...item, isActive: !item.isActive } : item
            ),
            error: null
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to toggle item status';
          set({ error: errorMessage });
        }
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: STORAGE_KEYS.ITEMS,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state?.items) {
          // Ensure dates are properly restored
          state.items = state.items.map(item => ({
            ...item,
            createdAt: typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt
          }));
        }
      }
    }
  )
);