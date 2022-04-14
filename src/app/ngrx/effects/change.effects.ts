import { getChanges } from './../selectors/change.selector';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { withLatestFrom, map, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { FulfillProcessChanges, PromptProcessChanges } from '../actions/change.actions';

@Injectable()
export class ChangeEffects {

	constructor(private actions$: Actions,
				private store: Store<AppState>) {}

	PromptProcessChanges$ = createEffect(() =>
		this.actions$.pipe(
			ofType(PromptProcessChanges),
			withLatestFrom(this.store.select(getChanges)),
			map(([action, changes]) => FulfillProcessChanges( { payload: changes } ) )
		)
	);

	// processChanges$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(FulfillProcessChanges),
	// 		map(action => {

	// 		} )
	// 	)
	// );
}
