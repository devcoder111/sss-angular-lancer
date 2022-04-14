import { Injectable } from '@angular/core';
import { enterOptions, exitOptions, multiLayoutTypes, singleLayoutTypes } from './constants';

@Injectable({
  providedIn: 'root'
})
export class MovieParserService {

	parseMovie(input: string) {

		const list = input.split(/(?:\.?\s{2,}|\.\n(?!$)|\.(?!$)\s?)/gm);

		console.log('list', list);

		const output = list.reduce((accum, sentence, idx) => {

			accum.en.push(new TextBlock(sentence.split(','), idx));
			accum.animation.push(new Scene(sentence.split(','), idx));

			return accum;

		}, { en: [], animation: []});


		console.log('output', output);
	}
}

class Scene {

	entranceAnimationType	: string;
	exitAnimationType 		: string;
	entranceTime 			: string;
	exitTime 				: string;
	layout 					: Layout;

	constructor(input: string[], idx: number) {

		this.entranceAnimationType	= enterOptions[ Math.floor( Math.random() * enterOptions.length ) ];
		this.exitAnimationType		= exitOptions[ 	Math.floor( Math.random() * exitOptions.length 	) ];
		this.entranceTime			= String( idx * 4 );
		this.exitTime				= String( idx * 4 + 4 );
		this.layout 				= new Layout(input, idx);
	}
}

class Layout {

	type: string;
	data: Data;

	constructor(input: string[], idx: number) {

		this.data = new Data(input, idx);

		this.type = input.length > 1 	? singleLayoutTypes[ 	Math.floor( Math.random() * singleLayoutTypes.length ) ]
										: multiLayoutTypes[ 	Math.floor( Math.random() * multiLayoutTypes.length ) ]
	}
}

class Data {

	name: string;

	constructor(input: string[], idx: number) {

		this.name = `S${idx}`;

		let cursor = '@';

		input.forEach((sentence, iterator) => {
			cursor = String.fromCharCode(cursor.charCodeAt(0) + 1);
			this[`text${iterator}`] = `S${idx}.${cursor}`;
			this[`img${iterator}`] = "";
			this[`color${iterator}`] = "";
		});
	}
}

class TextBlock{

	constructor(input: string[], idx: number) {

		let cursor = '@';

		this[`S${idx}`] = {};

		input.forEach(sentence => {
			cursor = String.fromCharCode(cursor.charCodeAt(0) + 1);
			this[`S${idx}`][cursor] = sentence;
		});
	}
}
