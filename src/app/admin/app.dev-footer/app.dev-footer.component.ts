import { AfterContentInit, Component } from '@angular/core';
import { SSSApiService } from 'src/app/services/sss-api.service';
import { SSSCookieService } from 'src/app/services/sss-cookie.service';
import { SSSLocalService } from 'src/app/services/sss-local.service';
import { MovieParserService } from '../movie-parser.service';
import * as options from './options';

@Component({
	selector: 'app-dev-footer',
	template: `
		<div class="ui pointing navbar"
			style="	position: fixed;
					bottom: 0;
					left: 0;
					right: 0;
					border-top: 6px solid #888;
					box-shadow: 0 0 20px 16px #888;">
			<div>
				<img src='http://seasidesyndication.com/mysyllabi_logo.png'
					id="delete_localstorage_debug"
					style="height:20px; margin-top: 11px; margin-left: 14px;">
			</div>
			<div>
				<a (click)="flush()" id="delete_cookies_debug" class="item navbar-item">
					flush localstorage and cookies
				</a>
			</div>
			<div style="margin-top: 8px; margin-right: 14px; position: relative;">
				<input id="input_testtype_debug"
					type="text"
					placeholder="test data loading url path"
					name="testlabel"
					style="width: 400px; padding-right: 52px;"
					[(ngModel)]="testLabel">
				<button (click)="testLabel = ''; this.resetTestForm();"
						style="position: absolute;
								right: 30px;
								top: 5px;
								height: 16px;
								width: 22px;
								font-size: 9px;
								cursor: pointer">&#10006;</button>
				<button (click)="handleXClick()"
						style="position: absolute;
								right: 4px;
								top: 5px;
								height: 16px;
								width: 22px;
								font-size: 9px;
								cursor: pointer">&#10084;</button>
			</div>
			<div style="margin-top: 8px; margin-right: 14px;">
				<button id="load_testdata_debug" (click)="handlePromptTestData()" style="margin-right: 14px;">load test</button>
				<span *ngIf="testingLight == true" style="color:white; background:green; width:25px; display:inline-block; border-radius: 5px; font-size:9px; text-align: center; line-height: 25px; position: relative; top: -1px;">ON</span>
				<span *ngIf="!testingLight" style="color:white; background:red; width:25px; display:inline-block; border-radius: 5px; font-size:9px; text-align: center; line-height: 25px; position: relative; top: -1px;">OFF</span>
			</div>
			<div style="margin-top: 8px; margin-right: 14px;">
				<button id="close_testing_debug" (click)="toggleOffTesting()">close testing</button>
			</div>
			<div style="margin-top: 8px; margin-right: 14px;">
				<span id="login_test_debug"
					(click)="handleTestLogin()"
					style="cursor:pointer;">test login</span>
			</div>
			<div style="margin-top: 8px; margin-right: 14px; display:inline-block;">
				<button (click)="displayMovieiParserTool = !displayMovieiParserTool">
					Movie Parser
				</button>
			</div>
		</div>
		<div  *ngIf="displayMovieiParserTool"
				style="position: fixed;
						bottom: 50px;
						right: 158px;
						width: 830px;
						border: 6px solid #888;
						border-radius: 10px;
						background: white;
						height: 650px;
						z-index: 1000;">
			<div style="margin-right: 6px; margin-top: 6px;">
				<span style="font-weight: 800;
							text-align: left;
							width: 673px;
							margin-left: 10px;
							display: inline-block;">
					Movie Script Parser
				</span>
				<span (click)="triggerMovieParse()" style="margin-right:20px; cursor: pointer;">parse movie</span>
				<span (click)="displayMovieiParserTool = false; movieScriptText = '';"
					style="cursor: pointer; text-align: right;">
					&#10006;
				</span>
			</div>
			<div style="padding: 2px 10px 0">
				<textarea [(ngModel)]="movieScriptText"
							name="movieParser"
							style="height: 596px; width: 798px; resize: none;">
				</textarea>
			</div>
		</div>
		<div  *ngIf="displayTestUrlTool"
				style="position: fixed;
						bottom: 50px;
						left: 320px;
						width: 400px;
						border: 6px solid #888;
						border-radius: 10px;
						background: white;
						height: 170px;
						z-index: 1000;">
			<div style="margin-right: 6px; margin-top: 6px;">
				<span style="font-weight: 800;
							text-align: left;
							width: 348px;
							margin-left: 10px;
							display: inline-block;">
					Generate Test Data URL String
				</span>
				<span (click)="displayTestUrlTool = false;" style="cursor: pointer; text-align: right;">
					&#10006;
				</span>
			</div>
			<div style="padding: 2px 10px 0">
				<select [(ngModel)]="status"
						(ngModelChange)="onChange($event, selection)"
						style="margin-bottom: 6px; border-radius: 4px; height: 20px; width: 100%;">

					<option value="default" disabled selected style="text-align: center;">-- status --</option>
					<option *ngFor="let x of options.statusOptions" [value]="x" [selected]="status == x">{{x}}</option>
				</select>
				<select [(ngModel)]="approach"
						(ngModelChange)="onChange($event, selection)"
						style="margin-bottom: 6px; border-radius: 4px; height: 20px; width: 100%;">

					<option value="default" disabled selected style="text-align: center;">-- approach --</option>
					<option *ngFor="let x of options.aproachOptions" [value]="x" [selected]="approach == x">{{x}}</option>
				</select>
				<select [(ngModel)]="ingrediants"
						(ngModelChange)="onChange($event, selection)"
						style="margin-bottom: 6px; border-radius: 4px; height: 20px; width: 100%;">

				<option value="default" disabled selected style="text-align: center;">-- ingrediants --</option>
					<option *ngFor="let x of options.ingrediantsOptions" [value]="x" [selected]="ingrediants == x">{{x}}</option>
				</select>
				<select [(ngModel)]="test"
						(ngModelChange)="onChange($event, selection)"
						style="margin-bottom: 6px; border-radius: 4px; height: 20px; width: 100%;">

					<option value="default" disabled selected style="text-align: center;">-- test --</option>
					<option
						*ngFor="let x of testOptions"
						[value]="x"
						[selected]="test == x">{{x}}</option>
				</select>
			</div>
		</div>
	`,
	styles: [``]
})
export class AppDevFooterComponent implements AfterContentInit {

	constructor(private sssCookieService: SSSCookieService,
				private sssLocalService: SSSLocalService,
				private sssApiService: SSSApiService,
				private sssMovieService: MovieParserService ) { }

	public testLabel 				: string;
	public movieScriptText 			: string;
    public testingLight				: boolean;
	public displayTestUrlTool		: boolean;
	public displayMovieiParserTool 	: boolean;
	public status 					: string = "default";
	public approach 				: string = "default";
	public ingrediants 				: string = "default";
	public test 					: string = "default";
	public options;

	get testOptions(): string[] { 	return 	!options.testOptions[this.status] ||
											!options.testOptions[this.status][this.approach] ||
											!options.testOptions[this.status][this.approach][this.ingrediants]

											? []

											: options.testOptions[this.status][this.approach][this.ingrediants]; }

	ngAfterContentInit() 		{ 	this.options = options;
									this.testLabel = this.sssCookieService.getCookie("testing") || "";
									this.testingLight = this.sssCookieService.getCookie("testing") &&
														this.sssCookieService.getCookie("testing").length > 0; }

	flush() 					{ 	this.sssCookieService.flush();
									this.sssLocalService.flush(); }

	handleXClick() 				{	this.displayTestUrlTool		= !this.displayTestUrlTool;
									this.resetTestForm(); }

	resetTestForm() 			{  	this.status 				= "default";
									this.approach 				= "default";
									this.ingrediants 			= "default";
									this.test 					= "default"; }

	onChange() 					{	if( this.status == "default" ) { this.testLabel = ""; }
									if( this.status != "default" ) { this.testLabel = `${this.status}/pagination/contribute/` }
									if( this.status != "default" && this.approach != "default" ) {
										this.testLabel = `${this.status}/pagination/contribute/${this.approach}/`; }
									if( this.status != "default" && this.approach != "default" && this.ingrediants != "default" ) {
										this.testLabel = `${this.status}/pagination/contribute/${this.approach}/${this.ingrediants}`; }
									if( this.status != "default" && this.approach != "default" && this.ingrediants != "default" && this.test != "default" ) {
										this.testLabel = `${this.status}/pagination/contribute/${this.approach}/${this.ingrediants}/${this.test}`; } }

    handlePromptTestData()    	{ 	window[ "testing" ] = null;
									this.sssApiService.feedTestData( this.testLabel || "alpha" ).subscribe(res => {

										this.sssCookieService.setCookie("client_date", String(new Date().setHours(12,0,0,0)), 6);
										this.sssCookieService.setCookie("testing", this.testLabel || "alpha", 6);

										window[ "testing" ] 	= true;
										this.testingLight 		= window[ "testing" ];
										this.testLabel 			= this.sssCookieService.getCookie("testing");
										this.displayTestUrlTool = !this.displayTestUrlTool;

										this.resetTestForm();
									}); }

	triggerMovieParse() 		{ 	console.log("movie", this.sssMovieService.parseMovie(this.movieScriptText)); }

    toggleOffTesting()          { 	window[ "testing" ] = false;
									this.testingLight = window[ "testing" ];
									this.testLabel = "";
									this.sssCookieService.removeCookie("testing"); }


    handleTestLogin()           { 	/* const payload = { username : "TESTER", password : "Broadway$19" };
                                    const transaction = [ new auth.Login( payload ) ] */ } ;
}
