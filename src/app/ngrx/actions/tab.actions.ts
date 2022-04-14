import { createAction, props } from '@ngrx/store';
import { Tab } from '../../models/tab';
import { Pointer } from 'src/app/models';

export const LoadTabObject  	= createAction( '[ACTION Tabs] Load Object',			props<{ payload: { tabid : string, tabobj : Tab } }>() );
export const LoadFetched    	= createAction( '[ACTION Tabs] Load Fetched',			props<{ payload: { [id: string] : Tab } }>() );
export const LoadTab        	= createAction( '[ACTION Tabs] Load Tab', 				props<{ payload: { id: string, tab: Tab } }>() );
export const RemoveTab			= createAction( '[ACTION Tabs] Remove Tab', 			props<{ payload: string }>() );
export const SubstitutePointer	= createAction( '[ACTION Tabs] Substitute Pointer',		props<{ payload: { id: string, pointerindex: number, pointer: Pointer; comandeer: boolean  } }>() );
export const SubstituteTab 		= createAction( '[ACTION Tabs] Substitute Tab',			props<{ payload: { oldTabId: string; newTabObj: Tab;} }>() );
export const ComandeerTab 		= createAction( '[ACTION Tabs] Comandeer Tab',			props<{ payload: string }>() );
