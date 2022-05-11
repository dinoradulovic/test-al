export default class Response {
    static defaultResponse(resources) {
        return {
            data: resources,
            hasErrors: false,
            error: null
        }
    }

    static defaultError(error) {
        return {
            data: {},
            hasErrors: true,
            error: {
                name: error.name,
                errorMessage: error.message,
                stackTrace: error.stack
            }
        }
    }
}
