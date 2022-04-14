import { Component, Input, HostBinding } from '@angular/core';
import { Pointer } from '../../models/pointer';
import { Template } from '../../models/template';
import { Ancestry } from 'src/app/models/ancestry';

@Component({
  selector: 'sss-state',
  template: '',
  styleUrls: []
})
export class SSSStateComponent {

	// @HostBinding('style')
	// get s1 () { return this.template.style || ""; }

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
