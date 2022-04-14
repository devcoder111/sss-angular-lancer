import { ChangeWrapper } from '../../models/change-wrapper';
import { RemoveTab, SubstitutePointer } from './../../ngrx/actions/tab.actions';
import { Ancestry } from '../../models/ancestry';
import { getChangeByTabId } from './../../ngrx/selectors/change.selector';
import { getTabById, getTabIdList } from './../../ngrx/selectors/graph.selector';
import { AppState } from './../../ngrx/reducers/index';
import { Tab } from 'src/app/models/tab';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subject, of, forkJoin } from 'rxjs';
import { Store, select, Action } from '@ngrx/store';
import { Pointer } from 'src/app/models/pointer';
import { Template } from '../../models/template';
import { SSSStateComponent } from './sss-state.component';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntil, switchMap, filter, map, delay } from 'rxjs/operators';
import { SSSWebsocketService } from 'src/app/services/sss-websocket.service';
import { SSSTabService } from 'src/app/services/sss-tab.service';
import { SSSLocalService } from 'src/app/services/sss-local.service';
import { SSSChangeService } from 'src/app/services/sss-change.service';
import { PushActions, UnshiftActions } from 'src/app/ngrx/actions/beacon.actions';
import { SSSAccountService } from 'src/app/services/sss-account.service';
import { SubstituteNode } from 'src/app/ngrx/actions/node.actions';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SSSMutateService } from 'src/app/services/sss-mutate.service';
import { SSSSelectorService } from 'src/app/services/sss-selector.service';
import * as _ from 'lodash';
import { SSSAncestryService } from 'src/app/services/sss-ancestry.service';

@Component({
  	selector: 'sss-list',
	template: `
		<ng-container *ngIf="tabObj$ | async as tab">
			<div
				cdkDropList
				[cdkDropListData]="memberList"
				[cdkDropListConnectedTo]="bumble"
				[cdkDropListDisabled]="isDisabled"
				(cdkDropListDropped)="drop($event)"
				[id]="tabid"
				[style]="template.style">
				<div class="indication" (click)="handleInfoClick(tab)">{{ALTtabid}} -- {{tabid}}</div>
				<!--trackByIndex;-->
				<sss-node
					*ngFor="let pointerobj of memberList; let i = index; trackBy: identify"
					cdkDrag
					[cdkDragData]="pointerobj"
					class="cdk-drag-animating"
					[ngClass]="pointerobj.name"
					[loading]="pointerobj.loading"
					[ancestry]="getAncestry(pointerobj, i)"
					[bubbleUp]="handleBubble.bind(this)">
				</sss-node>
			</div>
		</ng-container>
	`,
	styles: [`
		:host {
			display: contents;
		}
		sss-node {
			background: white;
			cursor: drag;
		}
		.cdk-drag-preview {
			box-sizing: border-box;
			box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
						0 8px 10px 1px rgba(0, 0, 0, 0.14),
						0 3px 14px 2px rgba(0, 0, 0, 0.12);
		}
		.cdk-drag-placeholder {
			opacity: 0.4;
			border-style: dotted;
		}
		.cdk-drag-animating {
			transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
		}
		.cdk-drop-list-dragging .cdk-drag {
		  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
		  cursor: grabbing !important;
		}
		.cdk-drag-disabled {
		  background: #ccc;
		  cursor: default;
		}
		.indication {
			color:blue;
			cursor: pointer;
		}
	`]
})
export class SSSListComponent extends SSSStateComponent implements OnInit, OnDestroy {

	_destroy$ 			: Subject<boolean> = new Subject();
	tabObj$ 			: Observable<Tab>;
	globalTabidList$ 	: Observable<string[]>;
	tabid 				: string;
	ALTtabid 			: string;
	storeSubscription	: { id: string };
	dropSubscription$ 	: Observable<string[]>;
	bumble: string[] =  ["language-arts_ALLRESOURCES_primero_master", "sister-history_1536260400000_primero_master"];
	memberList 			: Pointer[];
	ApiResponse 		: boolean = true;
	isDisabled 			: boolean = false;
	revision 			: number;

	// @HostBinding('class')
	// get c1 () { return this.tabid; }

	@Input()
	pointer: Pointer;

	@Input()
	ancestry: Ancestry;

	@Input()
	template: Template;

	@Input()
	bubbleUp: Function;

	constructor(private sssTabService: SSSTabService,
				private sssLocalService: SSSLocalService,
				private sssChangeService: SSSChangeService,
				private sssAccountService: SSSAccountService,
				private sssMutateService: SSSMutateService,
				private store: Store<AppState>,
				private sssWsService: SSSWebsocketService,
				private sssSelectorService: SSSSelectorService,
				private sssAncestryService: SSSAncestryService,
				@Inject(PLATFORM_ID) protected platformId: Object) { super(); }

	ngOnInit() {

		this.dropSubscription$ = this.store.select(getTabIdList);

		this.storeSubscription = this.sssSelectorService.generateTabSubscriptionObj(this.sssTabService.deriveTabidFromPointer(this.ancestry.pointer, 0));

		this.tabObj$ = this.sssSelectorService.registerTab(this.storeSubscription, this._destroy$);

		// this.globalTabidList$ = this.store.pipe( takeUntil(this._destroy$), select(getTabIdList) );

		// this.globalTabidList$.subscribe(arg => {
		// 	this.bumble = arg;
		// 	console.log(arg)
		// });

		const pointerId = this.sssTabService.deriveTabidFromPointer(this.ancestry.pointer, 0);

		this.tabObj$.subscribe(tab => {

			switch( true ) {

				case !tab 									: throw `Empty Tab Error: ${this.tabid}`;
				case !this.tabid && tab._id != pointerId 	: this.rearrange(tab);
			   	case !this.tabid 							: this.initialize( tab ); 		// component first instantiates
				case  this.tabid == tab._id 				: this.register( tab ); break;	// load or reload registrations
				case  this.tabid != tab._id 				: this.comandeer( tab );
		   	}

			// !tab 									&& this.thrower();
			// !this.tabid && tab._id != pointerId 	&& this.rearrange(this.ancestry, tab)
			// !this.tabid 							&& this.initialize( tab ); 		// component first instantiates
			//  this.tabid == tab._id 					&& this.register( tab ); 		// load or reload registrations
			//  this.tabid != tab._id 					&& this.comandeer( tab );
		});

		this.store.pipe(

			takeUntil(this._destroy$),
			select(getChangeByTabId, this.storeSubscription),
			filter((changes: ChangeWrapper) => {
				return !!changes
			}),
			switchMap((changes: ChangeWrapper) => {

				return this.sssChangeService.processChanges( this.ancestry, changes )
			})

		).subscribe(actionList => {

			const payload = this.ancestry.pointer.currenttab != "timeline"
								? [ ...actionList, ...this.bubbleUp(this.ancestry) ]
								: actionList;

			this.store.dispatch(PushActions( { payload } ) );
		});
	}

	thrower() {
		throw `Empty Tab Error: ${this.tabid}`;
	}

	initialize( tab: Tab ): void {

		this.tabid = tab._id;

		this.revision = tab.revision;

		this.ALTtabid = tab.id; // this.sssTabService.deriveTabidFromPointer(this.ancestry.pointer, 0);
	}

	rearrange(tab: Tab) { // anon urlPaths use case

		this.sssSelectorService.comandeerTab(this.storeSubscription, tab._id);

		this.unregister(this.sssTabService.deriveTabidFromPointer(this.ancestry.pointer, 0));

		this.ancestry = this.sssAncestryService.comandeerAncestry(this.ancestry);
	}

	register( tab: Tab ): void {

		if( !isPlatformBrowser(this.platformId) ) { return; }

		this.memberList = JSON.parse(JSON.stringify(tab.inventory)) as Pointer[];

		this.sssWsService.subscribeToSocket( tab.id );

		this.sssLocalService.updateObjByKey( tab._id, tab );
	}

	unregister(id: string): void {

		this.store.dispatch(PushActions( { payload: RemoveTab( { payload: id } ) } ) );

		this.sssLocalService.removeObjByKey( id );

		this.sssWsService.unSubscribeToSocket( this.ALTtabid );
	}

	comandeer(tab: Tab) {

		const oldTabid = this.tabid;

		this.tabid = tab._id;

		this.ancestry = this.sssAncestryService.comandeerAncestry(this.ancestry);

		this.memberList = JSON.parse(JSON.stringify(tab.inventory)) as Pointer[];

		this.sssSelectorService.comandeerTab(this.storeSubscription, tab._id);

		this.sssLocalService.replacementByKey(oldTabid, tab._id, tab);

		this.unregister(oldTabid);
	}

	getAncestry(childPointer: Pointer, idx: number): Ancestry {

		return new Ancestry(childPointer, idx, this.tabid, 0);
	}

	identify(index, pointer: Pointer) {
		// if(pointer.name == "sister-history") { console.log(`${pointer.currentdate || ''}_${pointer.instance}_${pointer.name}`) }
		// return `${pointer.currentdate || ''}_${pointer.instance}`; // _${pointer.name}
		return pointer.id;
	} // tech debt here that will cause problem with auth comandeer pointer happens

	handleBubble( child: Ancestry ): Action[] {

		const prefix 	= this.sssTabService.deriveUsername(this.tabid);
		const username  = this.sssAccountService.getUser()._id;
		const payload 	= { ...child, id: this.tabid, comandeer: prefix != username };
		const action 	= [ SubstitutePointer( { payload } ) ];

		return prefix == username 	? [ SubstituteNode( { payload: child.pointer.name } ) ]
									: [ ...this.bubbleUp( this.ancestry ), ...action ];
	}

	handleInfoClick(tab: Tab) {
		console.log(tab._id, tab, this);
		console.log("= = = = = = = = = = = = ");
		console.log("= = = = = = = = = = = = ");
		console.log("= = = = = = = = = = = = ");
	}

	drop( event ): void {
		console.log("this.tabid", this.tabid);
		console.log("event", event);

		const { previousIndex, currentIndex, item, previousContainer, container: currenContainer } = event;

		const sameIdx 	= previousIndex 	=== currentIndex;
		const sameShell = previousContainer === currenContainer;

		item.data.loading = true;

		this.isDisabled = true;

		switch(true) {

			case  sameShell &&  sameIdx   	: item.data.loading = false; this.isDisabled = false; return;
			case !sameShell 				: return this.moveForeign(event);
			case  sameShell && !sameIdx 	: return this.moveDomestic(event);
		}
	}

	moveDomestic( { previousIndex, currentIndex, item, container } ): void {

		const trigger$ = this.sssMutateService.triggerMove(previousIndex, currentIndex, this.ALTtabid, this.revision);

		trigger$.subscribe(actions => {

			item.data.loading = false;

			this.isDisabled = false;

			actions ? this.store.dispatch(PushActions( { payload: actions } ) )
					: moveItemInArray(container.data, currentIndex, previousIndex); // goback
		});

		moveItemInArray(container.data, previousIndex, currentIndex); // goforward
	}

	moveForeign( { previousIndex, currentIndex, item, container, previousContainer } ): void {

		const trigger$ = forkJoin([	this.sssMutateService.triggerDeleteByIndex(previousIndex, this.ALTtabid, this.revision),
									this.sssMutateService.triggerInject(item.data, currentIndex, this.ALTtabid, this.revision) ]);

		trigger$.subscribe(actions => {

			item.data.loading = false;

			this.isDisabled = false;

			actions ? this.store.dispatch(PushActions( { payload: actions } ) )
					: transferArrayItem(container.data, previousContainer.data, currentIndex, previousIndex); // goback
		});

		transferArrayItem(previousContainer.data, container.data, previousIndex, currentIndex); // goforward
	}

	ngOnDestroy() {

		this.unregister(this.tabid);

         this._destroy$.next();
		this._destroy$.complete();
	}
}
