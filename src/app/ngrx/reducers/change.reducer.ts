import { Action, createReducer, on } from '@ngrx/store';
import { LoadChanges, CutFromChanges, SwapChanges } from '../actions/change.actions';
import { ChangeHash } from '../../models/change-hash';
import * as _ from "lodash";
import * as merge from 'deepmerge';

export const featureKey = 'changes';

export interface ChangeState {
    changes: ChangeHash;
}
export const initialState: ChangeState = {
    changes: {}
};
const changeReducer = createReducer(
	initialState,

	on(LoadChanges, 	(state, { payload }) 	=> ({ ...state, changes: merge.all( [ state.changes, payload ] ) })),
	on(CutFromChanges, 	(state, { payload }) 	=> ({ ...state, changes: _.omit( state.changes, payload.tabid )})),
	on(SwapChanges, 	(state, { payload }) 	=> ({ ...state, changes: merge.all( [ _.omit( state.changes, payload.cutid ), payload.newList ] ) }))
);
export function reducer(state: ChangeState | undefined, action: Action) {
  	return changeReducer(state, action);
}
