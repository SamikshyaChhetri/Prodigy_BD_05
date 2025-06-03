import { Router } from "express";
import { isUser } from "../../middlewares/isUser.js";
import {
  getReviewController,
  getReviewsOfListing,
  getSingleReview,
  reviewController,
} from "./controller.js";

const reviewRouter = Router();
reviewRouter.post("/", isUser, reviewController);
reviewRouter.get("/", isUser, getReviewController);
reviewRouter.get("/:id", isUser, getSingleReview);
reviewRouter.get("/listing/:listingId", isUser, getReviewsOfListing);

export default reviewRouter;
