"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Get all users
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find();
});
// Get user by id
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findById(id);
});
// Get user by username
const getByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find({
        username: {
            $regex: username,
            $options: 'i'
        }
    });
});
// Get user by email 
const getByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({ email });
});
// Add new user 
const add = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (newUser.password) {
        newUser.password = yield bcrypt_1.default.hash(newUser.password, 12);
    }
    return yield user_model_1.User.create(newUser);
});
// Update user
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, 12);
    }
    return yield user_model_1.User.findByIdAndUpdate(id, data, {
        new: true
    });
});
// Delete user
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndDelete(id);
});
exports.default = {
    getAll,
    getById,
    getByUsername,
    getByEmail,
    add,
    update,
    remove
};
