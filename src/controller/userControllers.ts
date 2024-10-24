import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt"; // Import bcrypt
import { SendEmail } from "../services/node-mailer";
import { GenerateToken } from "../services/json-web-token";
import "dotenv/config";
import { userModels } from "../db/userSchema";
const saltRounds = 10;

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const findUser = await userModels.findOne({
      $or: [{ username }, { email }],
    });
    if (findUser) {
      res.status(400).send({ msg: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const createUser = await userModels.create({
      username,
      email,
      password: passwordHash,
    });

    if (!createUser) {
      res.status(400).send({ msg: "User not create" });
      return;
    }
    res
      .status(201)
      .send({ msg: "User created successfully", user: createUser });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", error: error });
  }
};

export const SignIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send({ msg: "All fields are required" });
      return;
    }

    const foundUser = await userModels.findOne({ username: username });

    if (!foundUser) {
      res.status(400).send({ msg: "User does not exist" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      res.status(401).send({ msg: "Invalid password" });
      return;
    }
    const token = GenerateToken({ id: foundUser._id });

    res.status(200).send({
      username: foundUser.username,
      token: token,
    });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", error: error });
  }
};

export const RecoveryAccount = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const findEmail = await userModels.findOne({ email });
    if (!findEmail) {
      res.status(400).send({ msg: "Email does not exist" });
      return;
    }

    const randomNumberOTP = Math.floor(1000 + Math.random() * 9000);

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP FOR RECOVERY ACCOUNT",
      text: `Your OTP: ${randomNumberOTP}`,
    };

    try {
      await SendEmail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      res.status(500).send({ msg: "Error sending OTP email" });
      return;
    }

    const userId = findEmail?._id;

    res.status(200).send({ otp: randomNumberOTP, userid: userId });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", error: error });
  }
};

export const ResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const findUserid = await userModels.findById(id);
    if (!findUserid) {
      res.status(400).send({ msg: "User does not exist" });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const updatePassword = await userModels.findByIdAndUpdate(
      id,
      { password: passwordHash },
      { new: true }
    );

    if (!updatePassword) {
      res.status(400).send({ msg: "Password update failed" });
      return;
    }

    res.status(200).send({ msg: "Password updated successfully" });
  } catch (error: any) {
    res
      .status(500)
      .send({ msg: "Internal server error", error: error.message });
  }
};
