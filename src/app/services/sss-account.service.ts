import { Injectable } from '@angular/core';
import { User } from '../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '../ngrx/reducers';
import { getUser } from '../ngrx/selectors/graph.selector';

@Injectable({
  providedIn: 'root'
})
export class SSSAccountService {

	private user: User;

  	constructor(private store: Store<AppState>) {

		this.store.pipe( select(getUser) ).subscribe(user => this.user = user);
	}

	getUser() { return this.user; }

	determineIfLoggedIn(): boolean { return false; }
}
