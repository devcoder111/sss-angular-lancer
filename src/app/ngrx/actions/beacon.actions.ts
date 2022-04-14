import { Action, createAction, props } from '@ngrx/store';

export const dqNextAction       = createAction( '[Beacon] DQ Next Action' );
export const UnshiftActions     = createAction( '[Beacon] Unshift Action', 		props<{ payload: Action | Action[] }>() );
export const PushActions        = createAction( '[Beacon] Push Action', 		props<{ payload: Action | Action[] }>() );
