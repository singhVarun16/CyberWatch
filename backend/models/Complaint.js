import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    yourName: {
      type: String,
      required: true,
    },

    yourPhone: {
      type: String,
      default: "",
    },

    suspectName: {
      type: String,
      default: "",
    },

    suspectPhone: {
      type: String,
      default: "",
    },

    suspectUpi: {
      type: String,
      default: "",
    },

    suspectProfile: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Under Investigation", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;