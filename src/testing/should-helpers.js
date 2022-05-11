export function validateRes(res) {
	res.should.have.status(200);
	res.should.be.json;
	res.body.should.have.property('data');
	res.body.data.should.be.a('object');
}


export function validateResponseResource(resource, template) {
	template.forEach((field) => {
		resource.should.have.property(field);
	});
}

export function validateResponseResources(res, resourceTemplateMap) {
	Object.keys(resourceTemplateMap).forEach((resource) => {
		const template = resourceTemplateMap[resource];

		// use first one for template check
		validateResponseResource(res.body.data[resource][0], template);
	});
}


