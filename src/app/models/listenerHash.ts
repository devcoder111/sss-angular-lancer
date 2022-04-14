export class ListenerHash { [nodeid: string]: {
	[namespace: string]: {
		[instance: string]: {
			[tabid: string]: { datapoint: string, trickle_path ?: string }
} } }; };
