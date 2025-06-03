import moment from "moment";
import { prisma } from "../auth/register/controller.js";
import { schema } from "./validator.js";

export const createReservationController = async (req, res) => {
  try {
    const { date, listingId, reserverId } = schema.parse(req.body);
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        date: {
          gte: moment(date).startOf("day"),
          lte: moment(date).endOf("day"),
        },
      },
    });

    if (existingReservation) {
      return res.status(400).send({
        success: false,
        data: [],
        message: "Reservation for the date already",
        error: [],
      });
    }
    const createdReservation = await prisma.reservation.create({
      data: {
        date: moment(date).toDate(),
        listingId,
        reserverId,
      },
    });
    return res.status(201).send({
      success: true,
      data: createdReservation,
      message: "Reservation created",
      error: [],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: [],
      message: "Internal server error",
      error: error,
    });
  }
};

// Fetch all the reservation
export const getAllReservation = async (req, res) => {
  try {
    const allReservations = await prisma.reservation.findMany();

    return res.status(200).send({
      success: true,
      data: allReservations,
      message: "Reservations fetched successfully",
      error: [],
    });
  } catch (error) {
    return res.status(404).send({
      success: false,
      data: [],
      message: "Internal server error",
      error: error,
    });
  }
};

//Get a single reservation
export const getSingleReservation = async (req, res) => {
  try {
    const singleReservation = await prisma.reservation.findFirst({
      where: { id: req.params.id },
    });
    return res.status(200).send({
      success: true,
      data: singleReservation,
      message: "Reservation fetched successfully",
      error: [],
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal server error",
      error: error,
    });
  }
};

//Get Reservation of User
export const getUserReservations = async (req, res) => {
  try {
    const userReservations = await prisma.reservation.findMany({
      where: {
        reserverId: req.params.reserverId,
      },
      include: { listing: true },
    });
    return res.status(200).send({
      success: true,
      data: userReservations,
      message: "User's Reservations fetched successfully",
      error: [],
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal server error",
      error: error,
    });
  }
};
