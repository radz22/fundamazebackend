import express from "express";
import { CreatePoint, GetUserPoint } from "../controller/leaderBoardController";
const leaderBoardRoutes = express.Router();
leaderBoardRoutes.post("/create", CreatePoint);
leaderBoardRoutes.get("/get", GetUserPoint);

export default leaderBoardRoutes;
