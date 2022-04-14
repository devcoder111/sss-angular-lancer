import { Pointer } from './pointer';

export class ChangeWrapper {
	additions  ?: Pointer[];
	mutations  ?: any[];
	old_nodeid ?: string;
}
