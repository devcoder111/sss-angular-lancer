import { createAction, props } from '@ngrx/store';
import { Node } from '../../models/node';

export const LoadFetched 		= createAction( '[ACTION Node] Load Fetched',		props<{ payload: { [key: string] : Node }  }>() );
export const LoadNode 			= createAction( '[ACTION Nodes] Load Node',			props<{ payload: { id: string, node: Node } }>() );
export const ReloadNode 		= createAction( '[ACTION Nodes] Reload Node',		props<{ payload: string }>() );
export const RemoveNode 		= createAction( '[ACTION Nodes] Remove Node', 		props<{ payload: string }>() );
export const ComandeerNode 		= createAction( '[ACTION Nodes] Comandeer Node',	props<{ payload: Node }>() );
export const SubstituteNode 	= createAction( '[ACTION Nodes] Substitute Node',	props<{ payload: string }>() );
