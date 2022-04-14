import { Injectable } from '@angular/core';
import { Ancestry } from '../models/ancestry';
import { SSSAccountService } from './sss-account.service';
import { SSSNodeService } from './sss-node.service';
import { SSSTabService } from './sss-tab.service';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { AppState } from '../ngrx/reducers';
import { PushActions } from '../ngrx/actions/beacon.actions';
import { ComandeerTab, SubstitutePointer } from '../ngrx/actions/tab.actions';

@Injectable({
  providedIn: 'root'
})
export class SSSAncestryService {

  	constructor(private sssAccountService: SSSAccountService,
				private sssNodeService: SSSNodeService,
				private store: Store<AppState>,
				private sssTabService: SSSTabService) { }

	comandeerAncestry(ancestry: Ancestry): Ancestry {

		ancestry = _.cloneDeep(ancestry);

		const username = this.sssAccountService.getUser()._id;

		ancestry.pointer.name = this.sssNodeService.comandeerId(username, ancestry.pointer.name);

		if( ancestry.parentTabid ) {
			ancestry.parentTabid = this.sssTabService.comandeerId(username, ancestry.parentTabid);
		}

		return ancestry;
	}

	traverse(ancestry: Ancestry, bubbleUp: Function): void {

		if( !this.sssTabService.isLeaf(ancestry.pointer) ) {

			this.store.dispatch(PushActions( { payload: bubbleUp( ancestry ) } ) );

		} else { // comandeer the immediate child tab

			const payload = ancestry.pointer.pagination.reduce((accum, pag, idx) => {
				return [...accum, ComandeerTab( { payload: this.sssTabService.deriveTabidFromPointer(ancestry.pointer, idx) }) ];
			}, ancestry.parentTabid ? [ SubstitutePointer( { payload: { ...ancestry, id: ancestry.parentTabid, comandeer: true } } ) ] : []);

			this.store.dispatch(PushActions( { payload } ) );
		}
	}
}
