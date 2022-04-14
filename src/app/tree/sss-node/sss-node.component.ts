import { Ancestry } from './../../models/ancestry';
import { Component, Input, OnInit, HostBinding, OnDestroy, HostListener } from '@angular/core';
import { Node } from '../../models/node';
import { Observable, Subject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngrx/reducers/index';
import { SSSStateComponent } from '../state/sss-state.component';
import { Template } from 'src/app/models/template';
import { SSSConfigService } from 'src/app/services/sss-config.service';
import { SSSListenerService } from 'src/app/services/sss-listener.service';
import { SSSSelectorService } from 'src/app/services/sss-selector.service';
import { PushActions } from 'src/app/ngrx/actions/beacon.actions';
import { Location } from '@angular/common';
import { UpdateCurrentUrl } from 'src/app/ngrx/actions/listener.actions';
import { SSSLocalService } from 'src/app/services/sss-local.service';
import { SSSAncestryService } from 'src/app/services/sss-ancestry.service';

// <ng-container *ngIf="nodeObj$ | async as node">
// 	<h1 (click)="onClick()">id: {{node?._id}}</h1>
// 	<h2>color: {{node?.color}}</h2>
// 	<div *ngIf="loading" class="spinner"></div>
// 	<ng-template
// 		[ngComponentOutlet]="component"
// 		[ndcDynamicInputs]="input">
// 	</ng-template>
// </ng-container>

@Component({
	selector: 'sss-node',
	template: `
		<h1 (click)="onClick()">id: {{nodeOject?._id}}</h1>
		<h2>color: {{nodeOject?.color}}</h2>
		<div *ngIf="loading" class="spinner"></div>
		<ng-template
			[ngComponentOutlet]="component"
			[ndcDynamicInputs]="input">
		</ng-template>
	`,
	styles: [`
		:host {
			overflow-y: scroll;
			border: 10px solid;
			padding: 5px;
			margin: 1em;
			display: block;
			position: relative;
		}
		.spinner {
			background-image: url('https://icon-library.com/images/spinner-icon-gif/spinner-icon-gif-24.jpg');
			height: 30px;
			width: 30px;
			display: block;
			background-size: cover;
			position: absolute;
			right: 4px;
			top: 4px;
		}
		h1 {
			color: blue;
			cursor: pointer;
		}
	`]
})
export class SSSNodeComponent implements OnInit, OnDestroy  {

	_destroy$: Subject<boolean> = new Subject();

	nodeObj$ 			: Observable<Node>;
	nodeid 				: string;
	component 			: SSSStateComponent;
	input 				: { template: Template, ancestry: Ancestry, bubbleUp: Function };
	nodeColor 			: string;
	template 			: Template;
	tabset 				: Template[];
	storeSubscription	: { id: string };
	nodeOject: Node;

	@HostBinding('style.borderColor')
	get s1 () { return this.nodeColor; }

	@HostBinding('style.gridArea')
	get g1 () { return `child-${this.ancestry.pointerindex}`; }

	@Input()
	ancestry: Ancestry;

	@Input()
	bubbleUp: Function;

	@Input()
	loading: boolean;

	@HostListener('click')
	onHostClick() {
		console.log("node result", this.nodeid, this.ancestry, this);
	}

	onClick() {
		this.location.go('/' + this.ancestry.pointer.name);
		const transaction = [ UpdateCurrentUrl( { payload: this.ancestry.pointer.name } ) ];
		this.store.dispatch(PushActions( { payload: transaction } ) );
	}

	constructor(private sssConfigService: SSSConfigService,
				private sssListenerService: SSSListenerService,
				private store: Store<AppState>,
				private location: Location,
				private sssLocalService: SSSLocalService,
				private sssAncestryService: SSSAncestryService,
				private sssSelectorService: SSSSelectorService) {}

	ngOnInit() {

		this.storeSubscription = this.sssSelectorService.generateNodeSubscriptionObj( this.ancestry.pointer.name );

		this.nodeObj$ = this.sssSelectorService.registerNode(this.storeSubscription, this.ancestry, this._destroy$);

		this.nodeObj$.subscribe(node => {

			// !node 										&& this.thrower();
			// !this.nodeid && this.ancestry.pointer.name != node._id		&& this.rearrange(this.ancestry, node);
			// !this.nodeid 								&& this.initialize( node );
			//  this.nodeid == node._id 					&& this.register( node );
			//  this.nodeid != node._id 					&& this.comandeer( node );

			switch( true ) {

			 	case !node 														: throw `Empty Node Error: ${this.ancestry.pointer.name}`;
				case !this.nodeid && this.ancestry.pointer.name != node._id		: this.rearrange(node);
				case !this.nodeid 												: this.initialize( node );		// component first instantiates
				case  this.nodeid == node._id 									: this.register( node ); break;	// load or reload registrations
				case  this.nodeid != node._id 									: this.comandeer( node );
			}
		});
	}

	thrower() {
		throw `Empty Node Error: ${this.ancestry.pointer.name}`;
	}

	rearrange(node) { // anon urlPaths use case

		this.initialize( node );

		this.sssListenerService.unregister( this.ancestry );

		this.sssAncestryService.traverse( this.ancestry, this.bubbleUp );
	}

	initialize( node: Node ): void {

		this.nodeid 	= node._id;

		this.nodeOject 	= node;

		this.tabset 	= this.sssConfigService.rollTabArray(node);

		this.template 	= this.sssConfigService.solveTemplateFromTabSet( this.tabset, this.ancestry.pointer.currenttab );

		this.component 	= this.sssConfigService.fetchComponentClass( this.tabset, this.ancestry.pointer.currenttab );

		this.input 		= { template: this.template, ancestry: this.ancestry, bubbleUp: this.handleBubble.bind(this) };

		this.nodeColor 	= node.color;
	}

	register( node: Node ): void {

		this.sssLocalService.updateObjByKey( node._id, node );

		node._id == this.ancestry.pointer.name
			? this.sssListenerService.register(  this.ancestry )	// this is for late followers to register
			: this.sssListenerService.comandeer( this.ancestry );	// this happens after an earlier this.comandeer
	}

	unregister(): void {

		this.sssSelectorService.unregisterNode(this._destroy$, this.nodeid);

		this.sssListenerService.unregister(this.ancestry);
	}

	comandeer(node: Node) {

		const oldNodeid = this.nodeid;

		this.nodeOject = node;

		this.nodeid = node._id;

		this.sssSelectorService.comandeerNode( this.storeSubscription, oldNodeid, this.nodeid );

		this.sssListenerService.comandeer( this.ancestry );

		this.sssLocalService.replacementByKey( oldNodeid, node._id, node );

		this.sssAncestryService.traverse( this.ancestry, this.bubbleUp );

		this.ancestry = this.sssAncestryService.comandeerAncestry( this.ancestry );
	}

	handleBubble(ancestry: Ancestry) { return this.bubbleUp(ancestry); }

	ngOnDestroy() {

		this.unregister();
	}
}
