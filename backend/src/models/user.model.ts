import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
})

export const User = mongoose.model<IUser>('User', UserSchema)