import { DynamicIoModule } from 'ng-dynamic-component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SSSNodeComponent } from './sss-node/sss-node.component';
import { SSSStubComponent } from './state/sss-stub.component';
import { SSSStateComponent } from './state/sss-state.component';
import { SSSListComponent } from './state/sss-list.component';
import { SSSCardComponent } from './state/sss-card.component';
import { SSSTimelineComponent } from './state/sss-timeline.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
	declarations: [
		SSSNodeComponent,
		SSSStubComponent,
		SSSStateComponent,
		SSSTimelineComponent,
		SSSListComponent,
		SSSCardComponent
	],
	imports: [
		CommonModule,
		DragDropModule,
		DynamicIoModule
	],
	exports: [
		SSSNodeComponent,
		SSSStubComponent,
		SSSStateComponent,
		SSSTimelineComponent,
		SSSListComponent,
		SSSCardComponent
	]
})
export class TreeModule { }
