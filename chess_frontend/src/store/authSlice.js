import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	id: null,
	status: false,
	name:null,
};
const Auth = createSlice({
	name: "authslice",
	initialState,
	reducers: {
		login: (state, action) => {
			state.id = action.payload;
			state.status = true;
			// state.name=action.payload;
		},
		logout: (state) => {
			state.id = null;
			state.status = false;
		},
		setName:(state,action)=>{
			state.name=action.payload;
		},
	},
});
export const { login, logout,setName } = Auth.actions;
export default Auth.reducer;
