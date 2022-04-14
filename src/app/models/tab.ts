import { Pointer } from './pointer';

export class Tab {
    antes 			: string;
    despues 		: string;
    inventory 		: Pointer[]
    _id 			: string;
	heightstate 	: string;
	id			   ?: string;
	revision 	   ?: number;

	constructor( tabid: string ) {
		this.antes 			= null;
		this.despues 		= null;
		this.inventory 		= [];
		this._id 			= tabid;
		this.heightstate	= null;
	}
}
