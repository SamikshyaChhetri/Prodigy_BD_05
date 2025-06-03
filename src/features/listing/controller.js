import { prisma } from "../auth/register/controller.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import moment from "moment";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MESSAGINGSENDERID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const createListingController = async (req, res) => {
  try {
    const {
      city,
      street,
      country,
      zipcode,
      type,
      description,
      rating,
      price,
      noOfVehicle,
      ownerId,
    } = req.body;
    const { photo } = req.files;
    // const photo=req.files.photo
    if (!photo) {
      return res.status(400).send({
        success: false,
        message: "Photo is required",
        data: [],
        error: [],
      });
    }

    //get the storage service from firebase
    const storage = getStorage();

    // Create a storage reference (filepath or filename in which file is to be uploaded)
    const storageRef = ref(storage, `${ownerId}-${photo.name}`); // making unique file name

    // prepare metadata
    const metadata = {
      contentType: photo.mimetype,
    };

    // Upload the file using the prepared data
    const uploadedFile = await uploadBytesResumable(
      storageRef,
      photo.data,
      metadata
    );
    // Get the uploaded file URL
    const URL = await getDownloadURL(uploadedFile.ref);
    const createList = await prisma.listing.create({
      data: {
        city,
        street,
        country,
        zipcode,
        type,
        description,
        rating,
        price,
        noOfVehicle,
        ownerId,
        photo: URL,
      },
    });
    return res.status(201).send({
      success: true,
      data: createList,
      message: "List added successfully",
      error: [],
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal server error",
      error: err,
    });
  }
};
export const getlistingsController = async (req, res) => {
  //getting all listings
  const all_list = await prisma.listing.findMany();
  return res.status(200).send({
    success: true,
    data: all_list,
    message: "All Listing retrived",
    error: [],
  });
};

export const getSingleListing = async (req, res) => {
  const listdata = await prisma.listing.findFirst({
    where: { id: req.params.id },
    include: {
      owner: true,
      review: { include: { reviewer: true } },
      reservation: { include: { reserver: true } },
    },
  });
  const reservationOfListing = await prisma.reservation.findMany({
    where: {
      listingId: req.params.id,
    },
  });

  const dates = reservationOfListing.map((item) => {
    return moment(item.date).format("YYYY-MM-DD");
  });

  if (listdata) {
    return res.status(200).send({
      success: true,
      data: { ...listdata, unavailableDates: dates },
      message: "Single listing retrieved",
      error: [],
    });
  }
  return res.status(404).send({
    success: false,
    data: [],
    message: "Listing not found",
    error: ["Listing not found"],
  });
};

export const getUserListings = async (req, res) => {
  try {
    const userListings = await prisma.listing.findMany({
      where: { ownerId: req.params.ownerId },
    });
    return res.status(200).send({
      success: true,
      data: userListings,
      message: "Successfully fetched user's listings",
      error: [],
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal Server Error",
      error,
    });
  }
};

export const updateListingDetails = async (req, res) => {
  try {
    const listingDetails = await prisma.listing.findFirst({
      where: { id: req.params.id },
    });
    if (!listingDetails) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "Listing not found",
        error: ["Listing not found"],
      });
    }
    const updateListing = await prisma.listing.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return res.status(200).send({
      success: true,
      data: updateListing,
      message: "Listing updated successfully",
      error: [],
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal Server Error",
      error,
    });
  }
};

export const updatePhoto = async (req, res) => {
  console.log(req.files);
  try {
    const photo = req.files.photo;

    if (!photo) {
      return res.status(400).send({
        success: false,
        message: "Photo is required",
        data: [],
        error: [],
      });
    }
    //get the storage service from firebase
    const storage = getStorage();

    // Create a storage reference (filepath or filename in which file is to be uploaded)
    const storageRef = ref(storage, `${photo.name}`); // making unique file name

    // prepare metadata
    const metadata = {
      contentType: photo.mimetype,
    };

    // Upload the file using the prepared data
    const uploadedFile = await uploadBytesResumable(
      storageRef,
      photo.data,
      metadata
    );
    // Get the uploaded file URL
    const URL = await getDownloadURL(uploadedFile.ref);
    const updatedlisting = await prisma.listing.update({
      where: {
        id: req.params.id,
      },
      data: {
        photo: URL,
      },
    });
    return res.status(200).send({
      success: true,
      data: updatedlisting,
      message: "Photo updated successfully",
      error: [],
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal Server Error",
      error,
    });
  }
};

export const deleteListingController = async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await prisma.listing.findFirst({
      where: {
        id,
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
    if (listing.ownerId !== res.locals.userId) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "Listing not found",
        error: [],
      });
    }
    await prisma.listing.delete({
      where: {
        id,
      },
    });
    return res.status(200).send({
      success: true,
      data: [],
      message: "Listing deleted successfully",
      error: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal Server Error",
      error,
    });
  }
};
