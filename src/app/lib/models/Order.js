import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: String,

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    customerPhone: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    escrowFee: {
      type: Number,
      default: 0,
    },

    deliveryMethod: {
      type: String,
      enum: ["standard", "pickup", "none"],
      default: "standard",
    },

    deliveryAddress: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);