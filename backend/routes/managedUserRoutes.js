import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/managedUserController.js";
import userAuth from "../middlewares/userAuth.js"; 

const router = express.Router();

router.get("/", userAuth, getUsers);
router.post("/", userAuth, createUser);
router.patch("/:id", userAuth, updateUser);
router.delete("/:id", userAuth, deleteUser);

export default router;
