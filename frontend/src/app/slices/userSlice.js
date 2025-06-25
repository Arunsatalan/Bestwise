import { createSlice } from "@reduxjs/toolkit";

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
            // NOTE: You should also clear cart and wishlist state on logout in your component or with a thunk
            return {
                isAuthenticated: false,
                user: null,
                role: null
            }
        },
    }
});


export const { userLogin, userLogout, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
