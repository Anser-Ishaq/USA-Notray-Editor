import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface AppState {
  loader?: {
    isLoading: boolean;
    message?: string;
    showDots?: boolean;
  };
}

const initialState: AppState = {
  loader: {
    isLoading: false,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoader: (
      state,
      action: PayloadAction<{
        isLoading: boolean;
        message?: string;
        showDots?: boolean;
      }>,
    ) => {
      state.loader = action.payload;
    },

    hideLoader: (state) => {
      state.loader = {
        isLoading: false,
        message: undefined,
        showDots: undefined,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoader, hideLoader } = appSlice.actions;

export default appSlice.reducer;
