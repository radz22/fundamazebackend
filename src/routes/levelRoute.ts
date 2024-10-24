import express from "express";
import {
  CreateLevel,
  GetUserLevel,
  GetLevel,
} from "../controller/levelController";
const levelRoutes = express.Router();

levelRoutes.get("/get/:userid", GetUserLevel);
levelRoutes.post("/create", CreateLevel);
levelRoutes.post("/get", GetLevel);

export default levelRoutes;
