import { AppState } from '../reducers';
import { createSelector } from '@ngrx/store';

export const selectGraphState = (state: AppState) => state.graph;
export const getNodes = createSelector(
    selectGraphState,
    store => store.nodes
);
export const getTabs = createSelector(
    selectGraphState,
    store => store.tabs
);
export const getListeners = createSelector(
    selectGraphState,
    store => store.listeners
);
export const getUrl = createSelector(
    selectGraphState,
    store => store.url
);
export const getNodeById = createSelector(
	getNodes,
	(nodeList, props) => {
		return nodeList[props.id];
	}
);
export const getTabById = createSelector(
	getTabs,
	(tabList, props) => tabList[props.id]
);
export const getTabIdList = createSelector(
	getTabs,
	tabobjs => Object.keys(tabobjs)
);
export const getAppNodeId =  createSelector(
	selectGraphState,
    store => store.appNodeID
);
export const getUser = createSelector(
    selectGraphState,
    store => store.user
);
