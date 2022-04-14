import { Component } from '@angular/core';
import { SSSStateComponent } from './sss-state.component';

@Component({
  	selector: 'sss-stub',
	template: `
		stub works!
	`,
	styles: []
})
export class SSSStubComponent extends SSSStateComponent  {

	constructor() { super(); }
}
