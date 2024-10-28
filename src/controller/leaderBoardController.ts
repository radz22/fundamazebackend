import { Request, Response, NextFunction } from "express";
import { levelModel } from "../db/levelSchema";
import { VerifyToken } from "../services/json-web-token";
import { leaderBoardModel } from "../db/leaaderBoardSchema";
export const CreatePoint = async (req: Request, res: Response) => {
  try {
    const { username, userid, points, level } = req.body;

    const verifiytoken = VerifyToken(userid);

    const findUserAddPoint = await leaderBoardModel.findOne({
      userid: verifiytoken.id,
    });

    if (!findUserAddPoint) {
      const createUserLevel = await levelModel.create({
        userid: verifiytoken.id,
        level: level,
        star: points,
      });
      const createUserInLeaderBoard = await leaderBoardModel.create({
        userid: verifiytoken.id,
        username: username,
        points: points,
      });
      res
        .status(200)
        .json({ msg: createUserInLeaderBoard, sucess: createUserLevel });
      return;
    }

    const findUserLevel = await levelModel.findOne({
      userid: verifiytoken.id,
      level: level,
    });

    if (!findUserLevel) {
      const incrementPointsFromUser = await leaderBoardModel.findOneAndUpdate(
        { userid: verifiytoken.id },
        { $inc: { points: points } },
        { new: true }
      );

      const createUserLevel = await levelModel.create({
        userid: verifiytoken.id,
        level: level,
        star: points,
      });
      res.status(200).send({
        create: createUserLevel,
        incrementpoint: incrementPointsFromUser,
      });
      return;
    }

    const checkStar = findUserLevel?.star;

    if (checkStar == 3) {
      res.status(200).send({
        msg: "no need to add",
      });
      return;
    }

    if (checkStar == points) {
      res.status(200).send({
        msg: "no need to update",
      });
      return;
    }
    const updateCheckStar = await levelModel.findOneAndUpdate(
      { userid: verifiytoken.id, level: level },
      { star: points },
      { new: true }
    );
    const incrementPointsFromUser = await leaderBoardModel.findOneAndUpdate(
      { userid: verifiytoken.id },
      { $inc: { points: points } },
      { new: true }
    );

    res.status(200).send({
      msg: "Points successfully incremented, and star updated",
      data: incrementPointsFromUser,
      updatedLevel: updateCheckStar,
    });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", error: error });
  }
};

export const GetUserPoint = async (req: Request, res: Response) => {
  try {
    const findAll = await leaderBoardModel.find({});

    res.status(200).send(findAll);
  } catch (error) {
    res.status(500).send({ msg: "Internal server error", error: error });
  }
};
