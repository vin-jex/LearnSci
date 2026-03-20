import { createSlice } from "@reduxjs/toolkit";

interface IgboState {
  isVisible: boolean;
}

const initialState: IgboState = {
  isVisible: false,
};

const igboSlice = createSlice({
  name: "igbo",
  initialState,
  reducers: {
    toggleIgbo(state) {
      state.isVisible = !state.isVisible;
    },
    showIgbo(state) {
      state.isVisible = true;
    },
    hideIgbo(state) {
      state.isVisible = false;
    },
  },
});

export const { toggleIgbo, showIgbo, hideIgbo } = igboSlice.actions;
export default igboSlice.reducer;
