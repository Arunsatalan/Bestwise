import { createSlice } from "@reduxjs/toolkit";
import { clearCart, setCartUser } from "./cartSlice";
import { clearWishlist, setWishlistUser } from "./wishlistSlice";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user:null,
        role:null,
        isAuthenticated: false,
    },
    reducers: {
        userLogin(state, action) {
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                role: action.payload.role,
            }
        },
        userLogout(state, action) {
            return {
                isAuthenticated: false,
                user: null,
                role: null
            }
        },
    }
});

// Create thunk for login that sets user ID in cart and wishlist
export const loginUser = (userData) => (dispatch) => {
    dispatch(userLogin(userData));
    dispatch(setCartUser(userData.user._id));
    dispatch(setWishlistUser(userData.user._id));
};

// Create thunk for logout that clears cart and wishlist
export const logoutUser = () => (dispatch) => {
    dispatch(userLogout());
    dispatch(clearCart());
    dispatch(clearWishlist());
};

export const { userLogin, userLogout } = userSlice.actions;
export default userSlice.reducer;