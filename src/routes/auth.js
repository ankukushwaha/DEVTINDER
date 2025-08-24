const express = require("express");
const authRouter = express.Router();
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { userModel } = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHashed = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: passwordHashed,
    });
    const user = await newUser.save();

    const jwtToken = await user.getJWT();
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false, // true only if using HTTPS (i.e. in prod)
      sameSite: "Lax", // or "None" if needed across sites
      maxAge: 3600000, // 1 hour
    });
    return res
      .status(201)
      .json({ message: "User created successfully", data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user || user.length === 0) {
      throw new Error("Invalid Credentials!");
    }

    await user.comparePassword(password);
    const jwtToken = await user.getJWT();
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false, // true only if using HTTPS (i.e. in prod)
      sameSite: "Lax", // or "None" if needed across sites
      maxAge: 3600000, // 1 hour
    });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = authRouter;
