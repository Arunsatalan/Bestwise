import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    total: 0,
    userId: null, // Track which user owns this cart
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity || 1
        });
      }
      
      state.total = state.cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== itemId);
      state.total = state.cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
    },
    
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
        state.total = state.cartItems.reduce((total, item) => 
          total + (item.price * item.quantity), 0
        );
      }
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      state.total = 0;
      state.userId = null;
    },
    
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.total = state.cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
    },

    setCartUser: (state, action) => {
      state.userId = action.payload;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart, 
  setCartItems,
  setCartUser
} = cartSlice.actions;

export default cartSlice.reducer; 