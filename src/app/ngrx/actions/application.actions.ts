import { createAction, props } from '@ngrx/store';

export const SetApplicationNodeID 		= createAction( '[ACTION Node] Set App Node ID',	props<{ payload: string }>() );
export const LoadNewRootInstantiation 	= createAction( '[ACTION Application] Load New Root', props<{ payload: { root_nodeid : string } }>() );
export const Reset 						= createAction( '[ACTION Application] Reset', props<{ payload: {} }>() );
export const SubstituteAppNode 			= createAction( '[ACTION Application] Comandeer App Node ID' );
