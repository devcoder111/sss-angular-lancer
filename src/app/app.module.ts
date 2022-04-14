import { ChangeEffects } from './ngrx/effects/change.effects';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeModule } from './tree/tree.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './ngrx/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { BeaconEffects } from './ngrx/effects/beacon.effects';
import { GraphEffects } from './ngrx/effects/graph.effects';
import { ListenerEffects } from './ngrx/effects/listener.effects';
import { appInit, SSSConfigService } from './services/sss-config.service';
import { SSSRouterService } from './services/sss-router.service';
import { AppDevFooterComponent } from './admin/app.dev-footer/app.dev-footer.component';
import { setAppInjector } from './helpers/injector';


@NgModule({
	declarations: [
		AppComponent,
		AppDevFooterComponent,
	],
	imports: [
		FormsModule,
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
		BrowserTransferStateModule,
		HttpClientModule,
		BrowserAnimationsModule,
		TreeModule,
		StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([BeaconEffects, GraphEffects, ListenerEffects, ChangeEffects]),
		StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
	],
	providers: [
		SSSConfigService,
		{
			provide: APP_INITIALIZER,
			useFactory: appInit,
			multi: true,
			deps: [SSSConfigService, SSSRouterService]
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private injector: Injector) {
		setAppInjector(injector);
	}
}
