import { Component, Input } from '@angular/core';
import { Pointer } from 'src/app/models/pointer';
import { Template } from '../../models/template';
import { Ancestry } from 'src/app/models/ancestry';

@Component({
	selector: 'sss-timeline',
	template: `
		<div>Timeline</div>
		<sss-list
			[pointer]="pointer"
			[template]="template"
			[ancestry]="ancestry"
			[bubbleUp]="handleBubble.bind(this)">
		</sss-list>
	`,
	styles: [`
		:host {
		}
	`]
})
export class SSSTimelineComponent {

	@Input()
	pointer: Pointer;

	@Input()
	template: Template;

	@Input()
	ancestry: Ancestry;

	@Input()
	bubbleUp: Function;

	constructor() { }

	handleBubble(child: Ancestry) { return this.bubbleUp(child); }
}
