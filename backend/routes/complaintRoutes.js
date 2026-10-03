import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// CREATE COMPLAINT
router.post("/", async (req, res) => {
  try {
    const {
      category,
      description,
      city,
      yourName,
      yourPhone,
      suspectName,
      suspectPhone,
      suspectUpi,
      suspectProfile,
    } = req.body;

    if (!category || !description || !city || !yourName) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (!suspectPhone && !suspectUpi && !suspectProfile) {
      return res.status(400).json({
        message:
          "Please enter suspect phone, UPI ID or social media profile",
      });
    }

    const complaint = new Complaint({
      category,
      description,
      city,
      yourName,
      yourPhone,
      suspectName,
      suspectPhone,
      suspectUpi,
      suspectProfile,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not submit complaint",
    });
  }
});

// GET ALL COMPLAINTS
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    res.status(200).json(complaints);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not fetch complaints",
    });
  }
});

// GET SINGLE COMPLAINT
router.get("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: "Could not find complaint",
    });
  }
});

// UPDATE COMPLAINT STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      message: "Status updated",
      complaint,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not update status",
    });
  }
});

export default router;