import { Injectable } from '@angular/core';
import { Command } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class SSSOTService {

	constructor() { }

	public protectInput( input: Command ) : Command[] {

		return [];
	}
}
