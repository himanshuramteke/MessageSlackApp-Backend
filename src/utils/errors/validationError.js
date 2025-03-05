import { StatusCodes } from "http-status-codes";

class ValidationError extends Error {
    constructor(errorDetails = {}, message = "Validation error") {
        super(message);
        this.name = "ValidationError";
        this.statusCode = StatusCodes.BAD_REQUEST;

        // Ensure `errorDetails.error` exists and is an object
        const errors = errorDetails.error || {};
        
        // Convert errors into an array of messages
        this.explanation = Object.keys(errors).length
            ? Object.values(errors).flat() // Flatten nested error messages
            : [message]; // Default message if no errors are provided

        this.message = message;
    }
}

export default ValidationError;