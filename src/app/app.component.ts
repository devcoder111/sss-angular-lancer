import { Component, OnInit } from '@angular/core';
import { SSSConfigService } from './services/sss-config.service';
import { Observable } from 'rxjs';
import { Pointer } from './models';
import { select, Store } from '@ngrx/store';
import { AppState } from './ngrx/reducers';
import { map } from 'rxjs/operators';
import { SubstituteAppNode } from './ngrx/actions/application.actions';
import { getAppNodeId } from './ngrx/selectors/graph.selector';
import { Ancestry } from './models/ancestry';

@Component({
  selector: 'app-root',
  template: `
		<div class="ui">
			<div class="ui segment">
				<sss-node
					*ngIf="pointer$ | async as pointer"
					[ngClass]="pointer.name"
					[ancestry]="getAncestry(pointer, 0)"
					[bubbleUp]="handleBubble.bind(this)">
				</sss-node>
			</div>

			<hr style="margin-top: 0px;">

			<app-dev-footer></app-dev-footer>
		</div>
  `,
  styles: [``]
})

export class AppComponent implements OnInit {

	pointer$ : Observable<Pointer>;

	constructor(public sssConfig: SSSConfigService,
				private store: Store<AppState>) {}

	ngOnInit() {

		this.pointer$ = this.store.pipe(
			select(getAppNodeId),
			map(appId => ({

					name						: appId,
					instance					: "master",
					isFavorite					: false,
					currentdate					: null,
					currenttab					: "all",
					urlnodelistener				: null,
					defaultchildrenstate		: "BINKER",
					pagination					: [ { serial : "primero" } ]
			})) );
	}

	getAncestry(pointer: Pointer, idx: number): Ancestry {

		return new Ancestry(pointer, idx, null, 0);
	}

	handleBubble(child: Ancestry) { return [ SubstituteAppNode() ]; }
}
