import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	id: null,
	status: false,
};
const Auth = createSlice({
	name: "authslice",
	initialState,
	reducers: {
		login: (state, action) => {
			state.id = action.payload;
			state.status = true;
		},
		logout: (state) => {
			state.id = null;
			state.status = false;
		},
	},
});
export const { login, logout } = Auth.actions;
export default Auth.reducer;
