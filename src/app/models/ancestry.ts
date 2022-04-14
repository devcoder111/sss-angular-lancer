import { Pointer } from "./pointer";

export class Ancestry {

	pointer: Pointer;
	pointerindex: number;
	parentTabid: string;
	pagIdx: number;

	constructor(pointer: Pointer, pointerindex: number, parentTabid: string, pagIdx: number) {

		this.pointer 		= pointer;
		this.pointerindex 	= pointerindex;
		this.parentTabid	= parentTabid;
		this.pagIdx 		= pagIdx;
	}
}
