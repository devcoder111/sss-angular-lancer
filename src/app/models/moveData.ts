export class MoveData {
    from: number;
	to: number;
	clone: boolean;

    constructor(from: number, to: number) {

        this.from 	= from;
		this.to   	= to;
		this.clone	= false;
    }
}
