import { Data } from './data';

export class Command {
    action: string;
    payload;

    constructor(action: string, payload ) {
        this.action = action;
        this.payload = payload;
    }
}
