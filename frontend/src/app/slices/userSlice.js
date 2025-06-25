import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    role: null,
    isAuthenticated: false,
  },
  reducers: {
    userLogin(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
<<<<<<< HEAD
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
=======
    updateUserProfile(state, action) {
      if (action.payload.user) state.user = action.payload.user;
      if (action.payload.role) state.role = action.payload.role;
    },
    userLogout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
    },
  },
>>>>>>> b72d6a6e57ab8402290872919715d1d3ec70ee5a
});

export const { userLogin, userLogout, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
