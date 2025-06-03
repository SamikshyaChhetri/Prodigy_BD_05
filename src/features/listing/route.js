import { Router } from "express";
import { isUser } from "../../middlewares/isUser.js";
import {
  createListingController,
  deleteListingController,
  getlistingsController,
  getSingleListing,
  getUserListings,
  updateListingDetails,
  updatePhoto,
} from "./controller.js";

const listRouter = Router();
listRouter.post("/", isUser, createListingController);
listRouter.get("/", isUser, getlistingsController);
listRouter.get("/:id", isUser, getSingleListing);
listRouter.get("/user/:ownerId", isUser, getUserListings);
listRouter.patch("/:id", isUser, updateListingDetails);
listRouter.patch("/:id/photo", isUser, updatePhoto);
listRouter.delete("/:id", isUser, deleteListingController);
export default listRouter;
