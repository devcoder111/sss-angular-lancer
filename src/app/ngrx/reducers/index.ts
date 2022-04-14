import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromGraph from './graph.reducer';
import * as fromBeacon from './beacon.reducer';
import * as fromChange from './change.reducer';

export interface AppState {

	[fromGraph.featureKey]: fromGraph.GraphState;
	[fromBeacon.featureKey]: fromBeacon.BeaconState;
	[fromChange.featureKey]: fromChange.ChangeState;
}

export const reducers: ActionReducerMap<AppState> = {

	[fromGraph.featureKey]: fromGraph.reducer,
	[fromBeacon.featureKey]: fromBeacon.reducer,
	[fromChange.featureKey]: fromChange.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
