import { Request, Response, NextFunction } from "express";
import { levelModel } from "../db/levelSchema";
import { VerifyToken } from "../services/json-web-token";
export const GetUserLevel = async (req: Request, res: Response) => {
  try {
    const { userid } = req.params;
    if (!userid) {
      res.status(400).json({ msg: "userid  required" });
      return;
    }
    const verifiytoken = VerifyToken(userid);

    const findUserLevel = await levelModel.find({ userid: verifiytoken.id });
    res.status(200).send(findUserLevel);
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", error: error });
  }
};

export const CreateLevel = async (req: Request, res: Response) => {
  try {
    const { userid, level } = req.body;

    if (!userid || !level) {
      res.status(400).json({ msg: "userid and level are required" });
      return;
    }
    const verifiytoken = VerifyToken(userid);
    const findUserLevel = await levelModel.findOne({
      userid: verifiytoken.id,
      level: level,
    });

    if (findUserLevel) {
      res.status(200).json({ level: level });
      return;
    }

    const createUserLevel = await levelModel.create({
      userid: verifiytoken.id,
      level: level,
      star: 0,
    });

    if (!createUserLevel) {
      res.status(400).json({ msg: "not created" });
      return;
    }

    res.status(200).json({ level: level });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", error: error });
  }
};

export const GetLevel = async (req: Request, res: Response) => {
  try {
    const { userid, level } = req.body;
    const verifiytoken = VerifyToken(userid);

    const findUserLevel = await levelModel.findOne({
      userid: verifiytoken.id,
      level: level,
    });

    if (!findUserLevel) {
      res.status(200).send({ level: level, star: 0 });
      return;
    }
    res.status(200).send({ level: level, star: findUserLevel.star });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", error: error });
  }
};