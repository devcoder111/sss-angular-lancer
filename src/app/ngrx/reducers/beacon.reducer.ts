import { Action, createReducer, on } from '@ngrx/store';
import { dqNextAction, UnshiftActions, PushActions } from '../actions/beacon.actions';
import { deQueue, isEmptyArray } from './helper';

export const featureKey = 'beacon';

export interface BeaconState {
    queue       : (any /* Action */ | Action[])[];
}
export const initialState: BeaconState = {
    queue       : []
};
const beaconReducer = createReducer(
	initialState,

    on(dqNextAction, 	(state) 				=> ({ ...state, queue: deQueue(state.queue) })),
    on(UnshiftActions, 	(state, { payload }) 	=> ({ ...state, queue: isEmptyArray(payload) ? state.queue : [...state.queue.slice(0,1), payload, ...state.queue.slice(1)] })),
    on(PushActions, 	(state, { payload }) 	=> ({ ...state, queue: isEmptyArray(payload) ? state.queue : [ ...state.queue, payload ] }))
 );
export function reducer(state: BeaconState | undefined, action: Action) {
  	return beaconReducer(state, action);
}
