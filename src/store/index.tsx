import { configureStore as reduxConfigureStore } from '@reduxjs/toolkit';
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query';

import DataHelper from '@/helper/DataHelper';

import reducers from './slices';

const store = (callBack?: (store: any) => void) => {
  const cs = reduxConfigureStore({
    reducer: reducers,
    devTools: true,
  });

  DataHelper.setStore(cs);
  if (callBack) {
    callBack(cs);
  }

  return cs;
};

export const globalStore = store();

export type RootState = ReturnType<typeof globalStore.getState>;

export type AppDispatch = typeof globalStore.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store().dispatch);
