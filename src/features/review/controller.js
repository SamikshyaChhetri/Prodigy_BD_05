import { prisma } from "../auth/register/controller.js";

export const reviewController = async (req, res) => {
  try {
    const rating = req.body.rating;
    const comment = req.body.comment;
    const reviewerId = req.body.reviewerId;
    const listingId = req.body.listingId;

    // Ensure rating and comment are provided
    if (!rating || !comment) {
      return res.status(400).send({
        success: false,
        data: [],
        message: "Rating and comment are required",
        error: ["Missing required fields"],
      });
    }
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
      },
    });
    if (!listing) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "Listing not found",
        error: [],
      });
    }

    const loggedInUser = res.locals.userId;

    if (loggedInUser === listing.ownerId) {
      return res.status(400).send({
        success: false,
        data: [],
        message: "Owner can't add a review",
        error: [],
      });
    }

    // Create the review in the database
    const createReview = await prisma.review.create({
      data: {
        rating,
        comment,
        reviewerId,
        listingId,
      },
    });
    const reviews = await prisma.review.findMany({
      where: { listingId: req.body.listingId },
    });
    let sum = 0;
    reviews.forEach((i) => {
      sum += i.rating;
    });
    const avg = sum / reviews.length;
    await prisma.listing.update({
      where: { id: listingId },
      data: { rating: avg },
    });
    // Respond with success
    return res.status(201).send({
      success: true,
      data: createReview,
      message: "Review added successfully",
      error: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal server error",
      error: [error.message],
    });
  }
};

export const getReviewController = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    return res.status(200).send({
      success: true,
      data: reviews,
      message: "Reviews fetched successfully",
      error: [],
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: [],
      message: "Failed to fetch reviews",
      error: [error.message],
    });
  }
};

export const getSingleReview = async (req, res) => {
  try {
    const review = await prisma.review.findFirst({
      where: { id: req.params.id },
    });
    if (!review) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "Review not found",
        error: ["Review not found"],
      });
    }
    return res.status(200).send({
      success: true,
      data: review,
      message: "Review fetched successfully",
      error: [],
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: [],
      message: "Failed to fetch review",
      error: [error],
    });
  }
};

export const getReviewsOfListing = async (req, res) => {
  const reviewsOfListing = await prisma.review.findMany({
    where: { listingId: req.params.listingId },
    include: { reviewer: true },
  });

  return res.status(200).send({
    success: true,
    data: reviewsOfListing,
    message: "Reviews fetched successfully",
    error: [],
  });
};
