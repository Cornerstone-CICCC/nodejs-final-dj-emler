import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser, User } from "../models/user.model";
import userService from "../services/user.service";

/**
 * Sign up (add user)
 *
 * @route POST /users
 * @param {Request<{}, {}, Omit<IUser, 'id'>>} req
 * @param {Response} res
 */
const signup = async (
  req: Request<{}, {}, Omit<IUser, "id">>,
  res: Response
) => {
  const { username, email, password } = req.body;

  // Validate fields
  if (!username.trim() || !email.trim() || !password.trim()) {
    res.status(400).json({ message: "Missing username, email, or password!" });
    return;
  }

  // Check username exists
  const existingUsername = await userService.getByUsername(username);
  if (existingUsername.length > 0) {
    res.status(409).json({ message: "Username already taken!" });
    return;
  }

  // Check email exists
  const existingEmail = await userService.getByEmail(email);
  if (existingEmail) {
    res.status(409).json({ message: "Email already exists!" });
    return;
  }

  // Create user
  const newUser = await userService.add({ username, email, password });
  if (!newUser) {
    res.status(500).json({ message: "Failed to create user!" });
    return;
  }

  res.status(201).json({ message: "User successfully added!" });
};

/**
 * Log in (check user)
 *
 * @route POST /users/login
 * @param {Request<{}, {}, { email: string; password: string }>} req
 * @param {Response} res
 */
const login = async (
  req: Request<{}, {}, Omit<IUser, "id" | "username">>,
  res: Response
) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    res.status(400).json({ message: "Email or password cannot be empty!" });
    return;
  }

  const user = await userService.getByEmail(email);
  if (!user) {
    res.status(400).json({ message: "Incorrect email or password!" });
    return;
  }

  // Check password
  const passwordCheck = await bcrypt.compare(password, user.password);
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
};

/**
 * Check Auth & Get User Info
 *
 * @route GET /users/check-auth
 * @param {Request} req
 * @param {Response} res
 */
const getUserByUsername = async (req: Request, res: Response) => {
  if (!req.session || !req.session.username) {
    res.status(401).json({
      message: "Only logged-in user can access this page!",
    });
    return;
  }

  const { username } = req.session;
  const user = await userService.getByUsername(username);

  if (!user || user.length === 0) {
    res.status(404).json({ message: "User does not exist!" });
    return;
  }

  const foundUser = user[0];

  res.status(200).json({
    username: foundUser.username,
    email: foundUser.email,
  });
};

/**
 * Update email or username or password
 *
 * @route PUT /users/profile
 * @param {Request} req
 * @param {Response} res
 */
const updateAccount = async (req: Request, res: Response) => {
  if (req.session) {
    if (!req.session.userId) {
      res.status(401).json({ message: "Not logged in!" });
      return;
    }

    const userId = req.session.userId;

    const { username, email, currPassword, newPassword } = req.body;

    //Email duplication check
    const findemail = await userService.getByEmail(email);
    if (findemail) {
      res.status(409).json({ message: "This email is already registered." });
      return;
    }

    if (!username && !email && !currPassword && !newPassword) {
      res.status(400).json({ message: "Nothing to update!" });
      return;
    }

    const user = await User.findById(userId).select("+password");
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

      const match = await bcrypt.compare(currPassword, user.password);

      if (!match) {
        res.status(400).json({ message: "Incorrect current password." });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }
    await user.save();
  }

  res.status(200).json({ message: "Profile updated successfully!" });
};

/**
 * Log out
 *
 * @route GET /users/logout
 * @param {Request} req
 * @param {Response} res
 */
const logout = (req: Request, res: Response) => {
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
const deleteAccount = async (req: Request, res: Response) => {
  if (req.session) {
    if (!req.session.userId) {
      res.status(401).json({ message: "Not logged in!" });
      return;
    }

    const { userId } = req.session;

    const deleted = await userService.remove(userId);

    if (!deleted) {
      res.status(400).json({ message: "Failed to delete user!" });
      return;
    }

    req.session = null;
  }

  res.status(200).json({ message: "Account deleted successfully!" });
};

export default {
  signup,
  login,
  getUserByUsername,
  updateAccount,
  logout,
  deleteAccount,
};
