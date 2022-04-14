import { Action } from '@ngrx/store';
import { actionHash } from '../actions';
import * as _ from 'lodash';
import { Tab, Node, User, ListenerHash, Pointer } from 'src/app/models';
import { SSSTabService } from "../../services/sss-tab.service";
import { SSSListenerService } from "../../services/sss-listener.service";
import { SSSNodeService } from 'src/app/services/sss-node.service';
import { AppInjector } from 'src/app/helpers/injector';

export const isEmptyArray = (input): boolean => {

	if( typeof input ==  "string" ) { return false; }

	return Array.isArray(input) && input.length == 0;
}

export const realizeAction = (action): Action => {

    if( action.slice ) { // indication that action comes from server or from websocket

		const { classString, slice, payload } = action;

        action = actionHash[ slice ][ classString ]( { payload } ); // even no arg is {} payload
    }

    return action;
};

export const deQueue = ( queue: (any /* Action */ | Action[])[] ) => {

    switch( true ) {

		case 	 queue.length == 0			: return  [];
        case     !Array.isArray( queue[0] ) : return  [...queue].slice(1);		// not a nested array
        case     !queue[0][1]				: return  [...queue].slice(1);		// last element in nested array
		case    !!queue[0][1]				: return [[...queue][0].slice(1),
														...queue.slice(1)];   	// existing elements still in nester array
        default								: throw "dq Error";
    }
}

export const comandeerNodeId = ( username: string, old_id: string ) : string => {

    return AppInjector.get(SSSNodeService).comandeerId(username, old_id );
}

export const comandeerNode = (user: User, nodes: { [key: string]: Node }, oldNodeId: string ) : { [key: string]: Node } => {

	return AppInjector.get(SSSNodeService).comandeerNode(user, nodes, oldNodeId );
}

export const replaceNode = ( nodes: { [key: string]: Node }, { oldNodeId, newNodeObj } ) : { [key: string]: Node } => {

	return AppInjector.get(SSSNodeService).replaceNode(nodes, { oldNodeId, newNodeObj } );
}

export const replacePointer = (user: User, tabs: { [key: string]: Tab }, { id, pointerindex, pointer, comandeer } ): { [key: string]: Tab } => {

	return AppInjector.get(SSSTabService).replacePointer(user, tabs, { id, pointerindex, pointer, comandeer } );
}

export const comandeerTab = (user: User, tabs: { [key: string]: Tab }, oldTabId: string ) : { [key: string]: Tab } => {

	return AppInjector.get(SSSTabService).comandeerTab(user, tabs, oldTabId );
}

export const replaceTab = ( tabs: { [key: string]: Tab }, { oldTabId, newTabObj } ) : { [key: string]: Tab } => {

	return AppInjector.get(SSSTabService).replaceTab(tabs, { oldTabId, newTabObj } );
}

export const AddToListenerHash = (stateListener: ListenerHash, pointer: Pointer): ListenerHash => {

	return AppInjector.get(SSSListenerService).pushListenerHash(stateListener, pointer);
}

export const removeFromListener = ( listeners: ListenerHash, pointer: Pointer ): ListenerHash => {

	return AppInjector.get(SSSListenerService).popListener(listeners, pointer);
}
