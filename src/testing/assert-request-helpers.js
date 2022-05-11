import chai from 'chai';

import testConfig from "./test-config";
import { validateRes, validateResponseResources } from "./should-helpers";

/*
	This helpers are used to:
	- help with default configuration when testing endpoints
	- run default resource validation
*/

export async function testGet(options) {
	const { route, jwt, validateResResources } = options;

	const res = await chai.request(testConfig.apiUrl)
		.get(route)
		.set("Authorization", "Bearer " + jwt);

	validateRes(res);

	if (validateResResources) {
		validateResponseResources(res, validateResResources);
	}

	return res;
}

export async function testPost(options) {
	const { route, body, validateResResources, jwt } = options;

	const res = await chai.request(testConfig.apiUrl)
		.post(route)
		.set("Authorization", "Bearer " + jwt)
		.send(body);

	if (!options.status) {
		validateRes(res);
	}

	if (validateResResources) {
		validateResponseResources(res, validateResResources);
	}

	return res;
}

export async function testPut(options) {
	const { route, body, validateResResources, jwt } = options;

	const res = await chai.request(testConfig.apiUrl)
		.put(route)
		.set("Authorization", "Bearer " + jwt)
		.send(body);


	validateRes(res);

	if (validateResResources) {
		validateResponseResources(res, validateResResources);
	}

	return res;
}

export async function testDelete(options) {
	const { route, body, validateResResources, jwt } = options;
	const res = await chai.request(testConfig.apiUrl)
		.delete(route)
		.set("Authorization", "Bearer " + jwt)
		.send(body);

	return res;
}

