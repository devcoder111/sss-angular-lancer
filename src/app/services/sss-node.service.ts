import { Injectable } from '@angular/core';
import { User, Node } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SSSNodeService {

  	constructor() { }

	comandeerId = ( username: string, old_id: string ) : string => {

		const splitarray = old_id.split("_");

		if( splitarray[0] == username ) { return old_id; }

		splitarray.length < 2 	? splitarray.unshift( username )
								: splitarray.splice( 0, 2, username, `${splitarray[0]}@${splitarray[1]}` );

		return splitarray.join("_");
	}

	comandeerNode(user: User, nodes: { [key: string]: Node }, oldNodeId: string ) : { [key: string]: Node } {

		if(!nodes[ oldNodeId ]) { return nodes; }

		const newNodeObj = { ...nodes[ oldNodeId ], _id: this.comandeerId( user._id, oldNodeId ) };

		return this.replaceNode(nodes, { oldNodeId, newNodeObj })
	}


	replaceNode( nodes: { [key: string]: Node }, { oldNodeId, newNodeObj } ) : { [key: string]: Node } {

		return { ...nodes, [ newNodeObj._id ] : newNodeObj, [ oldNodeId ] : newNodeObj };
	}
}
