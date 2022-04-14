import { AppState } from '../reducers';
import { createSelector } from '@ngrx/store';

export const selectBeaconState = (state: AppState) => state.beacon;

export const getQueue = createSelector(
    selectBeaconState,
    store => store.queue
);