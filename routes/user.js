import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserModel from "../models/User.js";

const router = express.Router();
const JWT_SECRET = "your_jwt_secret_key"; // 👉 Change this to a secure env variable in production

// Register Route
router.post(
  "/register",
  // [
  //   body("name").notEmpty().withMessage("Name is required"),
  //   body("email").isEmail().withMessage("Invalid email format"),
  //   body("password")
  //     .isLength({ min: 6 })
  //     .withMessage("Password must be at least 6 characters long"),
  // ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    console.log(req.body)

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: "Registration successful", newUser });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Login Route with JWT
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    console.log(req.body)

    try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "10h" });

      res.status(200).json({
        message: "Login successful",
        token,
        user
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
