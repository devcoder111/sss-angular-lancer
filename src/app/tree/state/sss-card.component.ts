import { SSSStateComponent } from './sss-state.component';
import { Component, Input } from '@angular/core';
import { Pointer } from 'src/app/models/pointer';
import { Template } from '../../models/template';
import { Ancestry } from 'src/app/models/ancestry';

@Component({
	selector: 'sss-card',
	template: `
		<div>Card</div>
		<sss-list
			[pointer]="pointer"
			[template]="template"
			[ancestry]="ancestry"
			[bubbleUp]="handleBubble.bind(this)">
		</sss-list>
	`,
	styles: [`
		:host {
			cursor: grab;
		}
	`]
})
export class SSSCardComponent extends SSSStateComponent {

	@Input()
	pointer: Pointer;

	@Input()
	template: Template;

	@Input()
	ancestry: Ancestry;

	@Input()
	bubbleUp: Function;

	constructor() { super(); }

	handleBubble(child: Ancestry) { return this.bubbleUp(child); }
}
