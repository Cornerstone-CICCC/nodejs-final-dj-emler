import { IUser, User } from "../models/user.model";
import bcrypt from 'bcrypt'

// Get all users
const getAll = async () => {
    return await User.find()
}

// Get user by id
const getById = async (id: string) => {
    return await User.findById(id)
}

// Get user by username
const getByUsername = async (username: string): Promise<IUser[]> => {
    return await User.find({
        username: {
            $regex: username,
            $options: 'i'
        }
    })
}

// Get user by email 
const getByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email })
}

// Add new user 
const add = async (newUser: Partial<IUser>): Promise<IUser> => {
    if (newUser.password) {
        newUser.password = await bcrypt.hash(newUser.password, 12)
    }

    return await User.create(newUser)
}

// Update user
const update = async (
    id: string,
    data: Partial<IUser>
): Promise<IUser | null> => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 12)
    }

    return await User.findByIdAndUpdate(id, data, {
        new: true
    })
}

// Delete user
const remove = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(id)
}

export default {
    getAll,
    getById,
    getByUsername,
    getByEmail,
    add,
    update,
    remove
}