import { environment } from './../../environments/environment';

export const apiRoot = environment.httpEndpoint;

export const tokenUrl 						= `${apiRoot}/ws-init`;
export const websocketSubscribeUrl 			= `${apiRoot}/channel`;
export const mutationUrl 					= `${apiRoot}/channels`;
export const mockInstanceUrl 				= `${apiRoot}/init`;
export const pushAnonBranchUrl 				= `${apiRoot}/push-anon-branch`;
export const pushAuthBranchUrl 				= `${apiRoot}/push-persisted-branch`;
export const traverseUrl 					= `${apiRoot}/traverse-info`;
export const fetchInstanceUrl				= `${apiRoot}/fetch-instance`;
export const fetchExistingInstanceUrl 		= `${apiRoot}/fetch-existing-anon-instance`;
export const feeedDataStoreUrl 				= `${apiRoot}/feed-datastore`;
