"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, setCartUser } from '../slices/cartSlice';
import { clearWishlist, setWishlistUser } from '../slices/wishlistSlice';

function UserStateManager() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.userState);
  const { userId: cartUserId } = useSelector((state) => state.cartState);
  const { userId: wishlistUserId } = useSelector((state) => state.wishlistState);

  useEffect(() => {
    // If user is authenticated and cart/wishlist don't belong to current user, clear them
    if (isAuthenticated && user) {
      if (cartUserId && cartUserId !== user._id) {
        dispatch(clearCart());
        dispatch(setCartUser(user._id));
      } else if (!cartUserId) {
        dispatch(setCartUser(user._id));
      }

      if (wishlistUserId && wishlistUserId !== user._id) {
        dispatch(clearWishlist());
        dispatch(setWishlistUser(user._id));
      } else if (!wishlistUserId) {
        dispatch(setWishlistUser(user._id));
      }
    } else if (!isAuthenticated) {
      // If user is not authenticated, clear cart and wishlist
      if (cartUserId) {
        dispatch(clearCart());
      }
      if (wishlistUserId) {
        dispatch(clearWishlist());
      }
    }
  }, [isAuthenticated, user, cartUserId, wishlistUserId, dispatch]);

  return null; // This component doesn't render anything
}

export default UserStateManager; 