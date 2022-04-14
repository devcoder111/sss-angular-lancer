import { createAction, props } from '@ngrx/store';
import { Pointer } from 'src/app/models/pointer';

export const RegisterListener		= createAction( '[ACTION Listener] Register Listener', 		props<{ payload: Pointer }>() );
export const UnRegisterListener		= createAction( '[ACTION Listener] UnRegister Listener', 	props<{ payload: Pointer }>() );
export const UnRegisterParent 		= createAction( '[ACTION Listener] UnRegister Parent', 		props<{ payload: Pointer }>() );
export const UpdateCurrentUrl 		= createAction( '[ACTION Router]   Update CurrentUrl', 		props<{ payload: string }>() );
