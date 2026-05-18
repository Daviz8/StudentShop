import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const NegotiationSchema = new mongoose.Schema(
  {
    trialNumber: {
      type: Number,
      required: true,
    },

    adminOfferPrice: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    sellerResponse: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const AppointmentSchema = new mongoose.Schema(
  {
    date: Date,
    location: String,
    note: String,
  },
  { _id: false }
);

const UserSaleSchema = new mongoose.Schema(
  {
    sellerName: {
      type: String,
      required: true,
    },

    sellerPhone: {
      type: String,
      required: true,
    },

    sellerEmail: {
      type: String,
    },

    gadgetName: {
      type: String,
      required: true,
    },

    gadgetDescription: {
      type: String,
      required: true,
    },

    sellerAskingPrice: {
      type: Number,
      required: true,
    },

    images: {
      type: [ImageSchema],
      default: [],
    },

    condition: {
      type: String,
      enum: ["new", "used", "faulty"],
      default: "used",
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "negotiating",
        "offer_accepted",
        "appointment_scheduled",
        "inspection_passed",
        "bought",
        "rejected",
      ],
      default: "submitted",
    },

    negotiationCount: {
      type: Number,
      default: 0,
      max: 3,
    },

    negotiations: {
      type: [NegotiationSchema],
      default: [],
    },

    acceptedPrice: {
      type: Number,
    },

    appointment: AppointmentSchema,
  },
  { timestamps: true }
);

export default mongoose.models.UserSale ||
  mongoose.model("UserSale", UserSaleSchema);