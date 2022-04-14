import { SubstituteAppNode } from './../actions/application.actions';
import { LoadFetched as LoadFetchedNodes, LoadNode, ReloadNode, SubstituteNode, RemoveNode } from './../actions/node.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { replacePointer, replaceTab, comandeerNode, comandeerTab, comandeerNodeId, removeFromListener, AddToListenerHash } from './helper';
import { ComandeerTab, LoadFetched as LoadFetchedTabs, LoadTab, RemoveTab, SubstitutePointer, SubstituteTab } from '../actions/tab.actions';
import { RegisterListener, UnRegisterListener, UpdateCurrentUrl } from '../actions/listener.actions';
import { SetApplicationNodeID } from '../actions/application.actions';
import * as _ from 'lodash';
import { ListenerHash, Node, Tab, User } from 'src/app/models';


export const featureKey = 'graph';

export interface GraphState {
    appNodeID 	: string;
    nodes 		: { [key: string]: Node };
	tabs 		: { [key: string]: Tab };
	user 		: User;
	listeners   : ListenerHash;
	url	 		: string;
}
export const initialState: GraphState = {
    appNodeID 	: null,
    nodes 		: {},
	tabs		: {},
	user 		: {
		_id     : "GUEST",
		email   : null,
		level   : "user"
	},
	listeners   : {},
	url 		: ''
};
const graphReducer = createReducer(
	initialState,

	on(SetApplicationNodeID, 	(state, { payload }) => ({ ...state, appNodeID: payload })),
	on(SubstituteAppNode, 		(state 			   ) => ({ ...state, appNodeID: comandeerNodeId( state.user._id, state.appNodeID ),
																	 nodes: comandeerNode( state.user, state.nodes, state.appNodeID) })),


    on(LoadNode,           		(state, { payload }) => ({ ...state, nodes: { ...state.nodes, [ payload.id ] : payload.node } })),
    on(ReloadNode,          	(state, { payload }) => ({ ...state, nodes: { ...state.nodes, [ payload ] : { ...state.nodes[ payload ] } } })),
    on(LoadFetchedNodes,    	(state, { payload }) => ({ ...state, nodes: { ...state.nodes, ...payload } })),
    on(SubstituteNode, 			(state, { payload }) => ({ ...state, nodes: comandeerNode(	state.user, state.nodes, payload) })),
	on(RemoveNode,     			(state, { payload }) => ({ ...state, nodes: _.omit(state.nodes, payload) })),

    on(LoadTab,           		(state, { payload }) => ({ ...state, tabs: { ...state.tabs, [ payload.id ] : payload.tab } })),
    on(ComandeerTab, 			(state, { payload }) => ({ ...state, tabs: comandeerTab(	state.user, state.tabs, payload) })),
	on(LoadFetchedTabs,     	(state, { payload }) => ({ ...state, tabs: { ...state.tabs, ...payload } })),
	on(RemoveTab,     			(state, { payload }) => ({ ...state, tabs: _.omit( state.tabs, payload )})),
	on(SubstitutePointer, 		(state, { payload }) => ({ ...state, tabs: 	replacePointer(	state.user, state.tabs, payload),
																	 nodes: comandeerNode(	state.user, state.nodes, payload.pointer.name)})),
    on(SubstituteTab, 			(state, { payload }) => ({ ...state, tabs: replaceTab(state.tabs, payload) })),

	on(RegisterListener, 		(state, { payload }) => ({ ...state, listeners: AddToListenerHash(state.listeners, payload) })),
	on(UnRegisterListener, 		(state, { payload }) => ({ ...state, listeners: removeFromListener(state.listeners, payload) })),
	on(UpdateCurrentUrl, 		(state, { payload }) => ({ ...state, url: payload })),
);
export function reducer(state: GraphState | undefined, action: Action) {
  	return graphReducer(state, action);
}
