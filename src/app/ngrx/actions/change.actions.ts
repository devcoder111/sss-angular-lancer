import { createAction, props } from '@ngrx/store';
import { ChangeHash } from 'src/app/models/change-hash';

export const CutFromChanges 		= createAction( '[ACTION Changes] CutFromChanges', 			props<{ payload: { tabid: string; } }>() );
export const LoadChanges 			= createAction( '[ACTION Changes] LoadChanges', 			props<{ payload: ChangeHash }>() );
export const PromptProcessChanges 	= createAction( '[ACTION Changes] PromptProcessChanges');
export const FulfillProcessChanges 	= createAction( '[ACTION Changes] FulfillProcessChanges', 	props<{ payload: ChangeHash }>() );
export const TraverseTrickleTree 	= createAction( '[ACTION Changes] TraverseTrickleTree', 	props<{ payload: any }>() );
export const SwapChanges 			= createAction( '[ACTION Changes] SwapChanges', 			props<{ payload: { cutid: string, newList: ChangeHash } }>() );
