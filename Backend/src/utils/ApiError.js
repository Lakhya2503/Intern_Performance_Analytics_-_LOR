class ApiError extends Error {
    constructor( statusCode, message,errors =[], statck ){
        super(message)

        this.statusCode = statusCode
        this.message = message
        this.errors = errors

        if(statck) {
          this.statck = statck
        }
    }
}

export default ApiError
