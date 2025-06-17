import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
    userId: null, // Track which user owns this wishlist
  },
  reducers: {
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.wishlistItems.find(item => item._id === newItem._id);
      
      if (!existingItem) {
        state.wishlistItems.push(newItem);
      }
    },
    
    removeFromWishlist: (state, action) => {
      const itemId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(item => item._id !== itemId);
    },
    
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.userId = null;
    },
    
    setWishlistItems: (state, action) => {
      state.wishlistItems = action.payload;
    },

    setWishlistUser: (state, action) => {
      state.userId = action.payload;
    }
  }
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  setWishlistItems,
  setWishlistUser
} = wishlistSlice.actions;

export default wishlistSlice.reducer; 