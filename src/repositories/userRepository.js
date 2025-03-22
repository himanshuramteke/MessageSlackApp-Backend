import User from "../schema/users.schema.js";
import crudRepository from "./crudRepository.js";

const userRepository = {
    ...crudRepository(User),

    signUpUser: async function (data) {
        const newUser = new User(data);
        await newUser.save();
        return newUser;
    },

    getByEmail: async function (email) {
        const user = await User.findOne({ email });
        return user;
    },
    
    getByUsername: async function (username) {
        const user = await User.findOne({ username }).select('-password'); //exclude password field
        return user;
    },

    getByToken: async function (token) {
        const user = await User.findOne({ verificationToken: token });
        return user;
    },

    findByEmailOrUsername: async function (email, username) {
        const user = await User.findOne({
            $or: [{ email }, { username }]
        }).select('-password');
        return user;
    }
};

export default userRepository;