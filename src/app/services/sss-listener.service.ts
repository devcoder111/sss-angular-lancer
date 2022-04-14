import { Ancestry } from '../models/ancestry';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Pointer, ListenerHash } from 'src/app/models';
import { SSSTabService } from './sss-tab.service';
import { Store } from '@ngrx/store';
import { RegisterListener, UnRegisterListener } from 'src/app/ngrx/actions/listener.actions';
import * as _ from 'lodash';
import { AppState } from 'src/app/ngrx/reducers';
import { isPlatformBrowser } from '@angular/common';
import { PushActions } from '../ngrx/actions/beacon.actions';
import * as merge from 'deepmerge';
import { SSSAncestryService } from './sss-ancestry.service';


@Injectable({
  	providedIn: 'root'
})
export class SSSListenerService {

	constructor(private sssTabService: SSSTabService,
				private sssAncestryService: SSSAncestryService,
				private store: Store<AppState>,
				@Inject(PLATFORM_ID) protected platformId: Object) { }

	public register( { pointer }: Ancestry ): void {

		if( !isPlatformBrowser(this.platformId) ) 	{ return; }

		if( !this.sssTabService.isLeaf( pointer ) ) { return; }

		this.store.dispatch(PushActions( { payload: RegisterListener( { payload: pointer } ) } ) );
	}

	public unregister( { pointer }: Ancestry ): void {

		if( !isPlatformBrowser(this.platformId) ) 	{ return; }

		if( !this.sssTabService.isLeaf( pointer ) ) { return; }

		this.store.dispatch(PushActions( { payload: UnRegisterListener( { payload: pointer } ) } ) );
	}

	public comandeer( ancestry: Ancestry ): void {

		this.unregister(ancestry);

		ancestry = ancestry.parentTabid ? this.sssAncestryService.comandeerAncestry(merge.all( [ancestry]) as Ancestry) : ancestry;

		this.register(ancestry);
	}

	public decorate( listeners: Array<string> ): Array<string>  {

		return [];
	}

    private generateHash( tabid: string, pointer: Pointer, isListening: boolean ): ListenerHash {

        const nodeid            = pointer.name;
        const namespacetail     = this.sssTabService.deriveNamespaceTail( tabid );
        const instance          = this.sssTabService.deriveInstanceFromTabid( tabid );
        const idx               = this.sssTabService.derivePagIdx( pointer, tabid )
        const pag               = pointer.pagination[ idx ];
        const ghoulghost        = pag.ghoul || pag.ghost;
        const suffix            = ghoulghost ? `:${ghoulghost}` : "";
        const datapoint         = `${isListening}:${pointer.defaultchildrenstate}${suffix}`;
        // const trickle_path      = nodeCmpRef.instance.depth;

		return { [ nodeid ]: { [ namespacetail ]: { [ instance ]: { [ tabid ]: { datapoint, trickle_path: null } } } } }
    }

    private isActiveListener( 	pointer: Pointer ): boolean { return pointer.urlnodelistener == true; }

    private isPassiveListener( 	pointer: Pointer ): boolean { return pointer.urlnodelistener == false; }

    private shouldListen( pointer: Pointer, idx: number ): boolean {

        return this.isActiveListener( pointer ) ||

             ( this.isPassiveListener( pointer ) && pointer.pagination[ idx ].serial == "primero" );
    }

    private shouldNotListen( pointer: Pointer ): boolean {

        return this.isPassiveListener( pointer ) && pointer.pagination[0].serial != "primero";
	}

    public isAlreadyAListener( tabid: string, listeners: ListenerHash ) : boolean {

        const { nodeid, namespace } = this.sssTabService.interpretTabid( tabid ); // day namespace is not timeline namespace

        return Object.keys( ( _.get( listeners, `${nodeid}.${namespace}`) || {} ) ).length > 0;
	}

	generateListenerCandidate(stateListener: ListenerHash, pointer: Pointer): ListenerHash {

		return pointer.pagination.reduce((accum, pag, index) => {

			const tabid 		= this.sssTabService.deriveTabidFromPointer(pointer, index);

			const shouldListen 	= this.shouldListen(pointer, index);
			const isLeaf 		= this.sssTabService.isLeaf(pointer);
			const already 		= this.isAlreadyAListener(tabid, stateListener);

			const listener 		= isLeaf && shouldListen;
			const follower 		= !shouldListen && isLeaf && already;

			const foo =  listener || follower
				? merge.all( [ accum, this.generateHash(tabid, pointer, listener) ] ) as ListenerHash
				: accum;

			return foo;

		}, {});
	}

	compareListenerSlice(stateListener: ListenerHash, pointer: Pointer): boolean { // returns true if they are the same nested object

		const { name, currenttab, currentdate } = pointer;

		const namespace = currenttab == "day" ? currentdate : 'ALLRESOURCES'; // day namespace is not timeline namespace

		const candidate = this.generateListenerCandidate(stateListener, pointer);

		return 	!_.isEmpty(stateListener 	&& stateListener[name]  	&& stateListener[name][namespace]) 		&&
				!_.isEmpty(candidate 		&& candidate[name]			&& candidate[name][namespace]) 			&&
				 _.isEqual(stateListener[name][namespace], candidate[name][namespace]);
	}

	pushListenerHash(stateListener: ListenerHash, pointer: Pointer): ListenerHash {

		const contribution = this.generateListenerCandidate(stateListener, pointer);

		return merge.all( [ stateListener, contribution ] ) as ListenerHash
	}

	listenerExists(nameSpaceHash): boolean {

		for(let instancekey in nameSpaceHash) {

			for(let key in nameSpaceHash[ instancekey ]) {

				if( nameSpaceHash[ instancekey ][ key ].datapoint.split(':')[0] == 'true' ) {

					return true;
				}
			}
		}

		return false;
	}

	popListener( listeners: ListenerHash, pointer ): ListenerHash {

		return pointer.pagination.reduce((accum, pag, idx) => {

			const tabid 	= this.sssTabService.deriveTabidFromPointer(pointer, idx);
			const nodeid 	= pointer.name;
			const namespace = tabid.split("_").slice(-3)[0];
			const instance  = tabid.split("_").slice(-1)[0];

			if( _.get( accum, `${nodeid}.${namespace}.${instance}` ) ) {

				delete accum[ nodeid ][ namespace ][instance][ tabid ];
			}

			if( !this.listenerExists( _.get( accum, `${nodeid}.${namespace}` ) ) ) {

				accum = _.omit( listeners, nodeid );
			}

			return accum;

		}, merge.all([listeners]) as ListenerHash);
	}
}
