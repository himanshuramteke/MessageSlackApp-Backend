import userRepository from "../repositories/userRepository.js"
import ValidationError from "../utils/errors/validationError.js";

export const signUpService = async (data) => {
    try {

        // Check if user already exists before creating 
        const existingUser = await userRepository.findByEmailOrUsername(data.email, data.username);
        if (existingUser) {
            throw new ValidationError(
                {
                    error: ['A user with the same email or username already exists']
                },
                'A user with the same email or username already exists'
            );
        }

        const newUser = await userRepository.create(data);
        return newUser;

    } catch (error) {
        console.log('User service error', error);

        // Handle Mongoose duplicate key error (E11000)
        if (error.code === 11000 || error.name === 'MongoServerError') {
            throw new ValidationError(
                {
                    error: ['A user with the same email or username already exists']
                },
                'A user with the same email or username already exists'
            );
        }

        // Handle other validation errors
        if (error.name === 'ValidationError') {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }

        throw error; // Rethrow unexpected errors
    }
};