import express from "express";
import Blacklist from "../models/Blacklist.js";

const router = express.Router();

// ADD BLACKLIST ENTRY
router.post("/", async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !value) {
      return res.status(400).json({
        message: "Type and value are required",
      });
    }

    const existing = await Blacklist.findOne({
      value: value.toLowerCase(),
    });

    if (existing) {
      return res.status(400).json({
        message: "Already blacklisted",
      });
    }

    const entry = new Blacklist({
      type,
      value: value.toLowerCase(),
    });

    await entry.save();

    res.status(201).json({
      message: "Added to blacklist",
      entry,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not add blacklist entry",
    });
  }
});

// GET BLACKLIST
router.get("/", async (req, res) => {
  try {
    const blacklist = await Blacklist.find().sort({
      createdAt: -1,
    });

    res.status(200).json(blacklist);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch blacklist",
    });
  }
});

// CHECK BLACKLIST
router.get("/check", async (req, res) => {
  try {
    const value = req.query.value;

    if (!value) {
      return res.status(400).json({
        message: "Value is required",
      });
    }

    const result = await Blacklist.findOne({
      value: value.trim().toLowerCase(),
    });

    if (result) {
      return res.status(200).json({
        blacklisted: true,
        entry: result,
      });
    }

    res.status(200).json({
      blacklisted: false,
    });
  } catch (error) {
    res.status(500).json({
      message: "Blacklist check failed",
    });
  }
});

// DELETE BLACKLIST ENTRY
router.delete("/:id", async (req, res) => {
  try {
    const entry = await Blacklist.findByIdAndDelete(
      req.params.id
    );

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    res.status(200).json({
      message: "Blacklist entry deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete blacklist entry",
    });
  }
});

export default router;