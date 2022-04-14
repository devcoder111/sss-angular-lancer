import { AppState } from '../reducers';
import { createSelector } from '@ngrx/store';

export const selectChangeState = (state: AppState) => state.changes;

export const getChanges =  createSelector(
	selectChangeState,
    store => store.changes
);
export const getChangeByTabId = createSelector(
	getChanges,
	(changeHash, props) => {
		return changeHash[props.id];
	}
);
