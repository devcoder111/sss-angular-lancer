import * as beacon          from './beacon.actions';
import * as tabs            from './tab.actions';
import * as nodes           from './node.actions';
import * as application     from './application.actions';
import * as listeners     	from './listener.actions';
import * as changes     	from './change.actions';

export const actionHash = {
    beacon,
    tabs,
    nodes,
	application,
	listeners,
	changes
}
