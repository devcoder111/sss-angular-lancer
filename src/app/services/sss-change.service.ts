import { Tab } from '../models/tab';
import { LoadTab, SubstitutePointer } from './../ngrx/actions/tab.actions';
import { Ancestry } from 'src/app/models/ancestry';
import { ChangeWrapper } from '../models/change-wrapper';
import { Injectable } from '@angular/core';
import { SSSTabService } from './sss-tab.service';
import { Observable, of, forkJoin } from 'rxjs';
import { CutFromChanges } from '../ngrx/actions/change.actions';
import { Action, Store, select } from '@ngrx/store';
import { map, switchMap, first } from 'rxjs/operators';
import { AppState } from '../ngrx/reducers';
import { getTabById, getUser } from '../ngrx/selectors/graph.selector';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SSSChangeService {

	constructor(private sssTabService: SSSTabService,
				private store: Store<AppState>) { }

	processChanges( ancestry: Ancestry, changes: ChangeWrapper ): Observable<Action[]> {

		const funcList = [
							// this.decoratePointerWithMutations( ancestry, changes ),
							this.decorateTabObjWithAdditions( ancestry, changes ),
							this.executeCutChange( ancestry )
						];

		return forkJoin( funcList ).pipe(map(( [s1, s2, s3] ) => [...s1, ...s2 /*, ...s3 */ ] ) );
	}

	decoratePointerWithMutations( { pointer, pointerindex, pagIdx, parentTabid }: Ancestry, { mutations }: ChangeWrapper ): Observable<Action[]> {

		if( !mutations ) { return of([]); }

        const candidate = mutations.reduce( ( accum, element ) => ({ ...accum, ...element }), pointer );

		const new_tabid = this.sssTabService.deriveTabidFromPointer( candidate, pagIdx );

		return of( [ SubstitutePointer({ payload: { pointerindex, pointer: candidate, id: parentTabid, comandeer: false  } }) ] );
	}

	decorateTabObjWithAdditions( { pointer, pagIdx }: Ancestry, { additions }: ChangeWrapper ): Observable<any> {

		if( !additions ) { return of([]); }

		const tabid = this.sssTabService.deriveTabidFromPointer( pointer, pagIdx );

		return forkJoin( [ 	this.store.select(getTabById, { id: tabid }).pipe(first()),
							this.store.select(getUser).pipe(first()) ] ).pipe(

			switchMap(( [ oldTabObj, user ] ) => {

				const newTabObj = this.sssTabService.processContribution(user._id, _.cloneDeep(oldTabObj), additions);

				const transaction = !newTabObj ? [] : [ // !newTabObj is a timeline already with today
					LoadTab( { payload: { id: newTabObj._id, tab: newTabObj } } ),
					LoadTab( { payload: { id: oldTabObj._id, tab: newTabObj } } )
				]; // second LoadTab is just to trigger the list component selector subscribe block

				return of(transaction);
			})
		);
	}

	executeCutChange( { pointer, pagIdx }: Ancestry ): Observable<Action[]> {

		const tabid = this.sssTabService.deriveTabidFromPointer( pointer, pagIdx );

        return of([ CutFromChanges( { payload: { tabid } } ) ]);
	}

	// processMutationChanges( hasBeenCalledlist, mutationList, tabid: string ) {

	// }

	// processAdditionChanges( hasBeenCalledlist, additionList, tabid: string ) {

	// }
}
