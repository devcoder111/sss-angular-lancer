import { Tab } from '../models/tab';
import { Node } from '../models/node';
import { Injectable } from '@angular/core';
import { Pointer } from 'src/app/models/pointer';
import { SSSLocalService } from './sss-local.service';
import * as _ from 'lodash';
import * as merge from 'deepmerge';
import { Store } from '@ngrx/store';
import { AppState } from '../ngrx/reducers';
import { PushActions } from '../ngrx/actions/beacon.actions';
import { LoadTab } from '../ngrx/actions/tab.actions';
import { LoadNode } from '../ngrx/actions/node.actions';
import { SwapChanges } from '../ngrx/actions/change.actions';
import { User } from '../models';
import { SSSNodeService } from './sss-node.service';

@Injectable({
  	providedIn: 'root'
})
export class SSSTabService {

	constructor(private sssLocalService: SSSLocalService,
				private store: Store<AppState>,
				private sssNodeService: SSSNodeService) { }

	getTabid( pointer: Pointer ): string {

		const { name, pagination, instance, currenttab, currentdate } = pointer;

		const namespace = currenttab == "day" ? currentdate : 'ALLRESOURCES';

		return `${name}_${namespace}_${pagination[0].serial}_${instance}`;
	}

	deriveNamespaceTail( tabid: string ) : string { return tabid.split("_").slice(-3)[0]; }

    deriveInstanceFromTabid( tabid: string ) : string { return tabid.split("_").pop(); }

	derivePagination( tabid: string ) : string { return tabid.split("_").slice(-2)[0]; }

	deriveUsername( tabid: string ) : string { return tabid.split("_")[0]; }

	derivePagIdx( pointer: Pointer, tabid: string ) {

        return pointer.pagination[ 0 ].serial == this.derivePagination( tabid ) ? 0 : 1;
	}

    deriveTabidFromPointer( pointer: Pointer, idx: number ) : string {

        if( !pointer.pagination[ idx ] ) { return null; }

        return pointer.name + "_" +
               this.decipherTailNameSpaceByPointer( pointer ) + "_" +
               pointer.pagination[ idx ].serial + "_" +
               pointer.instance;
	}

    decipherTailNameSpaceByPointer ( pointerobj : Pointer ) : string {

        switch( pointerobj.currenttab ) {

            case "day"          : return String(pointerobj.currentdate);
            case "timeline"     : return "TIMELINE";
            default             : return "ALLRESOURCES";
        }
	}

    interchangeNodeFromTab( tabid : string, newNodeid : string ): string {

        const returnArray = tabid.split("_").slice(-3);

        returnArray.unshift( newNodeid );

		return returnArray.join("_");
    }

    interchangeInstanceFromTab( tabid : string, instance : string ): string {

        const returnArray = tabid.split("_").slice(0, -1);

        returnArray.push( instance );

		return returnArray.join("_");
    }

    isLeaf( ...argarray ) {

        let leaftabtypearray = [ "vacant",
                                 "stub",
                                 "edit",
                                 "tags",
                                 "menu",
                                 "coin",
                                 "headline",
                                 "marquee",
                                 "button",
                                 "destinations",
                                 "modal",
                                 "calendar",
                                 "basic" ];

        const arg = typeof argarray[0] == "string" ? argarray[0] : argarray[0].currenttab;

        return leaftabtypearray.indexOf( arg ) == -1;
	}   // A LEAF IS TRUE IF IT IS NOT ON THIS LIST


    isToday( ...argarray ) {

        if( typeof argarray[0] != "string") { // pointer

            if( !argarray[0].currentdate || argarray[0].currenttab != "day" ) { return false; }

            return this.isToday( this.deriveTabidFromPointer( argarray[0], 0 ) );
        }

        const todayDate     = new Date().setHours(12,0,0,0);
        const namespaceTail = parseInt( this.deriveNamespaceTail( argarray[0] ) ); // tabid

        return todayDate == namespaceTail;
	}

    interpretTabid( tabid: string ) {

        const itp           = tabid.split("_");

        return {
            nodeid          : itp.slice(0,-3).join("_"),
            namespace       : itp.slice(-3)[0],
            pagination      : itp.slice(-2)[0],
            instance        : itp.slice(-1)[0]
        }
	}

	processContribution(userid: string, tab: Tab, additions): Tab | void {

		switch( true ) {

			case this.isTimeline( tab._id )	: return  this.processTimelineAdditions( userid, tab, additions );
			case this.isDay( tab._id ) 		: return  this.processDayAdditions(      userid, tab, additions );
			default							: return  this.processNormalAdditions(   userid, tab, additions );
		}
	}

	refreshTabPagination( tabobj, tabid, username ): Tab {

        if( username == "GUEST" ) {

            if( tabobj.antes ) {  tabobj.antes.ghoul = _.get( tabobj, 'antes.ghost' ) ||
                                                       _.get( tabobj, 'antes.ghoul' ) ||
                                                       this.deriveNodeFromTabid( tabid );

                                    tabobj.antes = _.omit(tabobj.antes, 'ghost'); }

            if( tabobj.despues ) {  tabobj.despues.ghoul = _.get( tabobj, 'despues.ghost' ) ||
                                                           _.get( tabobj, 'despues.ghoul' ) ||
                                                           this.deriveNodeFromTabid( tabid );

                                    tabobj.despues = _.omit(tabobj.despues, 'ghost'); }
        }                           // omit bc of elvis issues of tabobjs w/o antes or despues key

        return tabobj;
    }

	processNormalAdditions( username: string, tab: Tab, additions: Pointer[] ): Tab {

        // this.sssLocalService.removeObjByKey( tab._id );

		tab = merge.all( [ tab, { _id : this.comandeerId( username, tab._id ) } ] ) as Tab;

		tab = this.refreshTabPagination( tab, tab._id, username );

		return additions.reduce( (accum: Tab, pointer: Pointer) => ( { ...accum, inventory: [ pointer, ...accum.inventory ] } ), tab);
	}

	comandeerId = ( username: string, old_id: string ) : string => {

		const splitarray = old_id.split("_");

		if( splitarray[0] == username ) { return old_id; }

		splitarray.length < 5 	? splitarray.unshift( username )
								: splitarray.splice( 0, 2, username, `${splitarray[0]}@${splitarray[1]}` );

		return splitarray.join("_");
	}

    processDayAdditions( username: string, tab: Tab, additions: Pointer[] ) {

        const okToMutate       = this.isToday( tab._id ) && this.derivePagination( tab._id ) == "primero";
        const intendedAddition = okToMutate ? additions : [];

        return this.processNormalAdditions( username, tab, intendedAddition );
    }

    processTimelineAdditions( username: string, tab: Tab, additions: Pointer[] ): Tab | void {

        const todayDate				= new Date().setHours(12,0,0,0);
        const mostRecentPointer   	= tab.inventory[0];

		return !mostRecentPointer || todayDate != mostRecentPointer.currentdate
			? this.processNewDay( todayDate, username, tab, additions )
			: this.processExistingDay(mostRecentPointer, tab, additions);
	}

	processNewDay( todayDate: number, username: string, tab: Tab, additions: Pointer[] ): Tab {

		const instance   		= this.deriveInstanceFromTabid( tab._id );
		const nodeid			= this.deriveNodeFromTabid( tab._id );
		const newPointer 		= this.createNewPointer( "calendar", nodeid, "card", todayDate, instance, "basic" );
		const day        		= this.generateDayElements( newPointer, username );
		const transaction 		= [
			LoadTab( 			{ payload: { id: day._id, tab: day } } ),
			SwapChanges( 		{ payload: { cutid: tab._id, newList: { [ day._id ] : { additions } } } } )
		]

		this.store.dispatch( PushActions( { payload: transaction } ) );

		tab.inventory.unshift( newPointer );

		return tab;
	}

	processExistingDay(mostRecentPointer: Pointer, tab: Tab, additions: Pointer[]): void {

		const tabid  = this.deriveTabidFromPointer(  mostRecentPointer, 0  );
		const action = SwapChanges( { payload: { cutid: tab._id, newList: { [ tabid ] : { additions } } } } );

		this.store.dispatch( PushActions( { payload: action } ) );
	}

    generateDayElements( newPointer: Pointer, username: string ): Tab {

        const 	new_tabid 			= this.deriveTabidFromPointer( newPointer, 0 );

        const { vacantnodeobj,
				stubnodeobj,
				calendartabobj } 	= this.assembleNewCalendarTabObject( new_tabid, username );

		const 	transaction			= [

				LoadNode( { payload: { id: vacantnodeobj._id, 	node: vacantnodeobj } } ),
				LoadNode( { payload: { id: stubnodeobj._id, 	node: stubnodeobj } } )
		];

		this.store.dispatch( PushActions( { payload: transaction } ) );

        return calendartabobj;
    }

    createNewPointer( typearg: string, name, optionaltabarg: string, optionaldatearg, instance, defaultchildrenstate ): Pointer {

        let currenttab, currentdate;

        if ( typearg === "calendar" ) {

            currenttab     = optionaltabarg === "card" ? "day" : optionaltabarg || "day";
            currentdate    = optionaldatearg || this.createTodayUTC();

        } else {

            currenttab     = optionaltabarg === "card" ? "all" : optionaltabarg || "all";
            currentdate    = optionaldatearg || null;
        }

        return new Pointer( currenttab, currentdate, instance, name, defaultchildrenstate );
	}

	deriveNodeFromTabid( tabid : string ) {

        const splitarray = tabid.split("_")

        splitarray.splice(-3, 3);

		return splitarray.join("_");
    }

	isTimeline(input: string): boolean {
		return this.deriveNamespaceTail( input ) == "TIMELINE";
	}

    isDay( ...argarray ): boolean {

		const namespacetail = typeof argarray[0] != "string"
								? argarray[0].currentdate  					// pointer
								: this.deriveNamespaceTail( argarray[0] ); 	// tabid

        return !isNaN( parseInt( namespacetail ) );
	}

	assembleNewCalendarTabObject( tabid: string, username: string ): { vacantnodeobj: Node, stubnodeobj: Node, calendartabobj: Tab } {

        const vacantNodeId 		= (username === "mysyllabi" ? "HHHHHHHH-" : username + "_HHHHHHHH-") + Date.now();
		const stubNodeId 		= (username === "mysyllabi" ? "GGGGGGGG-" : username + "_GGGGGGGG-") + Date.now();
		const vacantnodeobj   	= new Node(vacantNodeId, "blue", "", "vacant");
		const stubName 			= ( new Date( parseInt( this.createTodayUTC() ) ) ).toDateString();
		const stubnodeobj     	= new Node(stubNodeId, "blue", stubName, "stub");
        const calendartabobj 	= new Tab( tabid );
		const vacantpointerobj	= new Pointer("vacant", null, ( Date.now() ).toString(), vacantNodeId);
		const stubpointerobj 	= new Pointer("stub", null, ( Date.now() ).toString(), stubNodeId);

        calendartabobj.inventory.push( vacantpointerobj );
        calendartabobj.inventory.push( stubpointerobj );

        return { vacantnodeobj, stubnodeobj, calendartabobj };
	}

    createTodayUTC() {

        let nowDate = new Date();

        return Date.UTC( nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1 ).toString();
	}

	comandeerTab(user: User, tabs: { [key: string]: Tab }, oldTabId: string ) : { [key: string]: Tab } {

		if(!tabs[ oldTabId ]) { return tabs; }

		const newTabObj = { ...tabs[ oldTabId ], _id: this.comandeerId( user._id, oldTabId ) };

		return tabs[ oldTabId ] ? this.replaceTab(tabs, { oldTabId, newTabObj }) : tabs;
	}

	replaceTab( tabs: { [key: string]: Tab }, { oldTabId, newTabObj } ) : { [key: string]: Tab } {

		return { ...tabs, [ newTabObj._id ] : newTabObj, [ oldTabId ] : newTabObj };
	}

	replacePointer(user: User, tabs: { [key: string]: Tab }, { id, pointerindex, pointer, comandeer } ): { [key: string]: Tab } {

		if(!tabs[ id ]) { id = this.comandeerId(user._id, id ) }

		const mutated = merge.all([ tabs[ id ] ]) as Tab;

		const idx = mutated.inventory.findIndex(el => {
			return 	`${el.currentdate || ''}_${el.instance}_${el.name}` ==
					`${pointer.currentdate || ''}_${pointer.instance}_${pointer.name}`;
		});
		/*** CANDIDATE FOR PERFORMANCE OPTMIZATION ***/

		mutated.inventory[ idx /* pointerindex */ ] = { ...pointer, name: this.sssNodeService.comandeerId( user._id, pointer.name ) };

		return comandeer 	? this.replaceTab(tabs, { oldTabId: id, newTabObj: { ...mutated, _id: this.comandeerId( user._id, id ) } })
							: { ...tabs, id: mutated };
	}
}
