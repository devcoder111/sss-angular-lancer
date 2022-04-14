import { SSSLocalService } from './sss-local.service';
import { Ancestry } from '../models/ancestry';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../ngrx/reducers';
import { getListeners, getNodeById, getTabById } from '../ngrx/selectors/graph.selector';
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter, switchMap, withLatestFrom, map } from 'rxjs/operators';
import { PushActions } from '../ngrx/actions/beacon.actions';
import { RemoveNode } from '../ngrx/actions/node.actions';
import { SSSTabService } from './sss-tab.service';
import { Tab, Node, Pointer } from '../models';
import * as _ from 'lodash';
import { SSSAccountService } from './sss-account.service';

@Injectable({
  providedIn: 'root'
})
export class SSSSelectorService {

	public nodeHash: { [key: string]: number } = {};

	constructor(private store: Store<AppState>,
				private sssAccountService: SSSAccountService,
				private sssLocalService: SSSLocalService,
				private sssTabService: SSSTabService) { }

	public generateNodeSubscriptionObj(id: string): { id: string } {

		return { id };
	}

	public generateTabSubscriptionObj(id: string): {id: string } {

		return { id };
	}

	private getComandeeredFromHash(nodeid: string): string {

		const username = this.sssAccountService.getUser()._id;

		const comandeered = this.sssTabService.comandeerId( username, nodeid )

		return this.nodeHash[ comandeered ] && comandeered;
	}

	public registerNode(subscription: { id: string }, ancestry: Ancestry, _destroy$: Subject<boolean>): Observable<Node> {

		const alreadyComandeered 	= this.getComandeeredFromHash( ancestry.pointer.name );
		const pointer 				= {...ancestry.pointer, name: alreadyComandeered || ancestry.pointer.name };
		subscription.id  			= alreadyComandeered || ancestry.pointer.name;
		// urlPath use case may have comandeered a nodeid before
		// other sibling components in the tree first instantiate

		this.addToList(subscription.id);

		return this.generateNodeSelector(subscription, pointer, _destroy$);
	}

	public registerTab(subscription: { id: string }, _destroy$: Subject<boolean>): Observable<Tab> {

		return this.generateTabSelector(subscription, _destroy$);
	}

	public comandeerNode(subscription: { id: string }, oldId: string, newId: string): void {

		this.addToList(newId);

		subscription.id = newId;

		this.removeFromList(oldId);
	}

	public comandeerTab(subscription: { id: string }, newTabid: string): void {

		subscription.id = newTabid
	}

	public unregisterNode(_destroy$: Subject<boolean>, id: string) {

        _destroy$.next();
		_destroy$.complete();

		this.removeFromList(id);
	}

	private addToList( _id: string ) {

		this.nodeHash[ _id ] = this.nodeHash[ _id ] ? ++this.nodeHash[ _id ] : 1;
	}

	private removeFromList(id: string): void {

		if( this.nodeHash[ id ] > 1 ) {

			--this.nodeHash[ id ];

		} else {

			delete this.nodeHash[ id ];

			this.store.dispatch(PushActions( { payload: RemoveNode( { payload: id } ) } ) );

			this.sssLocalService.removeObjByKey( id );
		}
	}

	private generateNodeSelector(subscription: { id: string }, pointer: Pointer, _destroy$: Subject<boolean>): Observable<Node> {

		return this.store.pipe(
			takeUntil(_destroy$),
			select(getNodeById, subscription),
			withLatestFrom(this.store.select(getListeners)),
			filter(([node, listeners]) => {

				const alreadyListening = pointer.pagination.reduce((accum, el, idx) => {

					const tabid = this.sssTabService.deriveTabidFromPointer(pointer, idx);

					const { nodeid, namespace, instance } = this.sssTabService.interpretTabid( tabid );

					return Object.keys( ( _.get( listeners, `${nodeid}.${namespace}.${instance}.${tabid}`) || {} ) ).length > 0;

				}, false);

				const noIdChange = node && pointer.name == node._id;

				return !(noIdChange && alreadyListening);
			}),
			map(([node, listeners]) => {

				return node;
		    })
		);
	}

	private generateTabSelector(subscription: { id: string }, _destroy$: Subject<boolean>): Observable<Tab> {

		return this.store.pipe(
			takeUntil(_destroy$),
			select(getTabById, subscription)
		);
	}
}
