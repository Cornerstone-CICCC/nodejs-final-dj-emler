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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const user_service_1 = __importDefault(require("../services/user.service"));
/**
 * Sign up (add user)
 *
 * @route POST /users
 * @param {Request<{}, {}, Omit<IUser, 'id'>>} req
 * @param {Response} res
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    // Validate fields
    if (!username.trim() || !email.trim() || !password.trim()) {
        res.status(400).json({ message: "Missing username, email, or password!" });
        return;
    }
    // Check username exists
    const existingUsername = yield user_service_1.default.getByUsername(username);
    if (existingUsername.length > 0) {
        res.status(409).json({ message: "Username already taken!" });
        return;
    }
    // Check email exists
    const existingEmail = yield user_service_1.default.getByEmail(email);
    if (existingEmail) {
        res.status(409).json({ message: "Email already exists!" });
        return;
    }
    // Create user
    const newUser = yield user_service_1.default.add({ username, email, password });
    if (!newUser) {
        res.status(500).json({ message: "Failed to create user!" });
        return;
    }
    res.status(201).json({ message: "User successfully added!" });
});
/**
 * Log in (check user)
 *
 * @route POST /users/login
 * @param {Request<{}, {}, { email: string; password: string }>} req
 * @param {Response} res
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim()) {
        res.status(400).json({ message: "Email or password cannot be empty!" });
        return;
    }
    const user = yield user_service_1.default.getByEmail(email);
    if (!user) {
        res.status(400).json({ message: "Incorrect email or password!" });
        return;
    }
    // Check password
    const passwordCheck = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordCheck) {
        res.status(400).json({ message: "Incorrect email or password!" });
        return;
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();
        req.session.username = user.username;
    }
    res.status(200).json({ message: "Login successful!" });
});
/**
 * Check Auth & Get User Info
 *
 * @route GET /users/check-auth
 * @param {Request} req
 * @param {Response} res
 */
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session || !req.session.username) {
        res.status(401).json({
            message: "Only logged-in user can access this page!",
        });
        return;
    }
    const { username } = req.session;
    const user = yield user_service_1.default.getByUsername(username);
    if (!user || user.length === 0) {
        res.status(404).json({ message: "User does not exist!" });
        return;
    }
    const foundUser = user[0];
    res.status(200).json({
        username: foundUser.username,
        email: foundUser.email,
    });
});
/**
 * Update email or username or password
 *
 * @route PUT /users/profile
 * @param {Request} req
 * @param {Response} res
 */
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session) {
        if (!req.session.userId) {
            res.status(401).json({ message: "Not logged in!" });
            return;
        }
        const userId = req.session.userId;
        const { username, email, currPassword, newPassword } = req.body;
        if (!username && !email && !currPassword && !newPassword) {
            res.status(400).json({ message: "Nothing to update!" });
            return;
        }
        const user = yield user_model_1.User.findById(userId).select("+password");
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Email update
        if (email) {
            user.email = email.trim();
        }
        // Username update
        if (username) {
            user.username = username.trim();
            req.session.username = user.username;
        }
        // Password update
        if (currPassword || newPassword) {
            if (!currPassword || !newPassword) {
                res.status(400).json({ message: "Current and new password required." });
                return;
            }
            const match = yield bcrypt_1.default.compare(currPassword, user.password);
            if (!match) {
                res.status(400).json({ message: "Incorrect current password." });
                return;
            }
            user.password = yield bcrypt_1.default.hash(newPassword, 12);
        }
        yield user.save();
    }
    res.status(200).json({ message: "Profile updated successfully!" });
});
/**
 * Log out
 *
 * @route GET /users/logout
 * @param {Request} req
 * @param {Response} res
 */
const logout = (req, res) => {
    if (req.session) {
        req.session = null;
    }
    res.status(200).json({ message: "Logout successful!" });
};
/**
 * Delete Account
 *
 * @route DELETE /users/delete
 * @param {Request} req
 * @param {Response} res
 */
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session) {
        if (!req.session.userId) {
            res.status(401).json({ message: "Not logged in!" });
            return;
        }
        const { userId } = req.session;
        const deleted = yield user_service_1.default.remove(userId);
        if (!deleted) {
            res.status(400).json({ message: "Failed to delete user!" });
            return;
        }
        req.session = null;
    }
    res.status(200).json({ message: "Account deleted successfully!" });
});
exports.default = {
    signup,
    login,
    getUserByUsername,
    updateAccount,
    logout,
    deleteAccount,
};
