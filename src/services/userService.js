import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import userRepository from "../repositories/userRepository.js"
import { createJWT } from "../utils/common/authUtils.js";
import ClientError from "../utils/errors/clientError.js";
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

export const signInService = async (data) => {
    try {
        const user = await userRepository.getByEmail(data.email);
        if(!user) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'No registered user found with this email',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        //match the incoming password with the password
        const isMatch = bcrypt.compareSync(data.password, user.password);

        if(!isMatch) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Invalid password, please try again!!',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        return {
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
            token: createJWT({ id: user._id, email: user.email })
        }

    } catch (error) {
        console.log('User service error', error); 
        throw error;
    }
}