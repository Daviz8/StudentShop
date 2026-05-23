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
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

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
      default: "",
    },

    cityArea: {
      type: String,
      default: "",
    },

    idType: {
      type: String,
      default: "",
    },

    gadgetName: {
      type: String,
      required: true,
    },

    gadgetDescription: {
      type: String,
      required: true,
    },

    brandModel: {
      type: String,
      default: "",
    },

    colorVariant: {
      type: String,
      default: "",
    },

    serialOrImei: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "electronics_gadget",
    },

    otherCategory: {
      type: String,
      default: "",
    },

    condition: {
      type: String,
      enum: ["brand_new", "like_new", "good", "fair", "needs_repair"],
      default: "good",
    },

    sellerAskingPrice: {
      type: Number,
      required: true,
    },

    faultsAccessoriesReason: {
      type: String,
      default: "",
    },

    additionalNotes: {
      type: String,
      default: "",
    },

    returnPreference: {
      type: String,
      enum: ["cash_payout", "store_credit", "swap", "part_payment"],
      default: "cash_payout",
    },

    desiredItem: {
      type: String,
      default: "",
    },

    topUpAmount: {
      type: Number,
      default: 0,
    },

    heardFrom: {
      type: String,
      default: "",
    },

    referralCode: {
      type: String,
      default: "",
    },

    referredBy: {
      type: String,
      default: "",
    },

    agreedToTerms: {
      type: Boolean,
      default: false,
    },

    images: {
      type: [ImageSchema],
      default: [],
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