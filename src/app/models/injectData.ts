import { Pointer } from './pointer';

export class InjectData  {
    pointer: Pointer;
    idx: number;

    constructor(pointer: Pointer, idx: number) {

        this.pointer = pointer;
        this.idx = idx;
    }
}
