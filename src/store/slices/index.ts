import { combineReducers } from '@reduxjs/toolkit';

import app from '@/store/slices/app';

const reducers = combineReducers({
  app,
});

export default reducers;
