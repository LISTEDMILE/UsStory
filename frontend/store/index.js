import { configureStore, createSlice } from "@reduxjs/toolkit";

const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    Login: (state, action) => {
      state.isLoggedIn = true;
      state._id = action.payload._id;
    },
    Logout: (state) => {
      state = { isLoggedIn: false };
    },
  },
});

const store = configureStore({
  reducer: {
    userInfo: userInfo.reducer,
  },
});

export const userActions = userInfo.actions;
export default store;
