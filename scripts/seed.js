import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    condition: String,
    price: Number,
    stock: Number,
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PropertySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    condition: String,
    price: Number,
    stock: Number,
    location: String,
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

const Property =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env.local");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany({});
    await Property.deleteMany({});

    // Products dynamically built from your inventory report
    await Product.insertMany([
      // --- PHONES CATEGORY ---
      {
        name: "iPhone 11 (Office)",
        description: "Office grade iPhone 11 with 128GB storage.",
        category: "Phone",
        condition: "verified",
        price: 280000,
        stock: 1,
        images: "/images/iphone_11.png",
        isActive: true,
      },
      {
        name: "iPhone 12 (Foreign)",
        description: "Clean foreign used iPhone 12 with 128GB storage.",
        category: "Phone",
        condition: "verified",
        price: 320000,
        stock: 1,
        images: ["https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=1200"],
        isActive: true,
      },
      {
        name: "iPhone 12 Pro Max (NG Office)",
        description: "Locally inspected iPhone 12 Pro Max, 128GB edition.",
        category: "Phone",
        condition: "verified",
        price: 350000,
        stock: 2,
        images: "/images/iphone-12-pro-max.jpg",
        isActive: true,
      },
      {
        name: "iPhone 13 Pro (Foreign)",
        description: "Premium foreign utilized iPhone 13 Pro, 128GB variants.",
        category: "Phone",
        condition: "verified",
        price: 520000,
        stock: 1,
        images: "/images/Phone-13-Pro.png",
        isActive: true,
      },
      {
        name: "iPhone 13 Pro Max (Foreign)",
        description: "High performance foreign used iPhone 13 Pro Max.",
        category: "Phone",
        condition: "verified",
        price: 600000,
        stock: 1,
        images: "/images/iphone-13-pro-max.jpeg",
        isActive: true,
      },
      {
        name: "Redmi 14C",
        description: "Massive 8GB RAM + 256GB storage layout.",
        category: "Phone",
        condition: "brand_new",
        price: 170000,
        stock: 1,
        images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200"],
        isActive: true,
      },
      {
        name: "Nokia 150",
        description: "Durable battery life alternative option.",
        category: "Phone",
        condition: "brand_new",
        price: 165000,
        stock: 1,
        images: "/images/nokia-150.jpg",
        isActive: true,
      },

      // --- LAPTOPS CATEGORY ---
      {
        name: "Dell Latitude 5480 UK",
        description: "Reliable UK used business and student workhorse laptop.",
        category: "Laptop",
        condition: "verified",
        price: 180000,
        stock: 2,
        images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200"],
        isActive: true,
      },
      {
        name: "Dell Latitude E5450",
        description: "Mid tier student laptop setup built for assignments.",
        category: "Laptop",
        condition: "verified",
        price: 150000,
        stock: 2,
        images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200"],
        isActive: true,
      },
      {
        name: "Dell Latitude E6410",
        description: "Budget entry laptop alternative built for fundamental requirements.",
        category: "Laptop",
        condition: "used",
        price: 120000,
        stock: 1,
        images: "/images/dell-latitutde-E6410.jpeg",
        isActive: true,
      },
      {
        name: "HP EliteBook 840 G3 UK",
        description: "Sleek metallic design UK standard premium model.",
        category: "Laptop",
        condition: "verified",
        price: 300000,
        stock: 5,
        images:"/images/hp-840-g3.jpg",
        isActive: true,
      },
      {
        name: "HP EliteBook 840 Office NG",
        description: "Clean Nigeria handled lightweight enterprise hardware choice.",
        category: "Laptop",
        condition: "verified",
        price: 165000,
        stock: 1,
        images: "/images/hp-office-ng-used.webp",
        isActive: true,
      },
      {
        name: "Lenovo IdeaPad",
        description: "Student centric flexible daily productivity driver.",
        category: "Laptop",
        condition: "verified",
        price: 245000,
        stock: 1,
        images: "/images/lenovo idea-pad.png",
        isActive: true,
      },

      // --- HIGH VALUE POPULAR ACCESSORIES ---
      {
        name: "Green Lion Echo Solar Speaker",
        description: "Solar charging outdoor speaker system.",
        category: "Accessories",
        condition: "brand_new",
        price: 45000,
        stock: 14,
        images: "/images/green-lion-headset.jpg",
        isActive: true,
      },
      {
        name: "Airpods Max Headset",
        description: "Premium over-ear acoustic listening accessory style.",
        category: "Accessories",
        condition: "brand_new",
        price: 175000,
        stock: 1,
        images: ["https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=1200"],
        isActive: true,
      },
      {
        name: "JBL Extreme 3 Speaker",
        description: "Massive bass portable high utility party audio system.",
        category: "Accessories",
        condition: "brand_new",
        price: 370000,
        stock: 1,
        images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200"],
        isActive: true,
      },
      {
        name: "Starlink Kit",
        description: "High speed internet connectivity satellite equipment set.",
        category: "Accessories",
        condition: "brand_new",
        price: 570000,
        stock: 1,
        images: "/images/Starlink-Router.webp",
        isActive: true,
      },
      {
        name: "Ldnio 50000mAh Power Bank",
        description: "Ultra capacity backup battery station built for long blackouts.",
        category: "Accessories",
        condition: "brand_new",
        price: 590000,
        stock: 2,
        images: "/images/power-bank-ldn.webp",
        isActive: true,
      },
        {
        name: "Test 50000mAh Power Bank",
        description: "Ultra capacity backup battery station built for long blackouts.",
        category: "Accessories",
        condition: "brand_new",
        price: 10,
        stock: 1,
        images: "/images/hero.webp",
        isActive: true,
      }
    ]);

    // Properties / Shared Student Infrastructure items mapping 
    await Property.insertMany([
      {
        name: "Redmi Pad",
        description: "Great layout for lecture notes, media, and studying.",
        category: "Tablet",
        condition: "used",
        price: 190000,
        stock: 2,
        location: "Campus Area",
        images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200"],
        isActive: true,
      },
      {
        name: "Cidea Student Tablet",
        description: "Highly budget friendly utility setup choice for reading documentation.",
        category: "Tablet",
        condition: "used",
        price: 150000,
        stock: 2,
        location: "Off-campus Lodge",
        images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200"],
        isActive: true,
      },
      {
        name: "Children BB8 Tablet",
        description: "Basic processing layout tool asset alternative.",
        category: "Tablet",
        condition: "used",
        price: 95000,
        stock: 1,
        location: "Student Hostel",
        images: "/images/children-bb8.png",
        isActive: true,
      },
      {
        name: "Sonix Standing Fan",
        description: "High durability hostel ventilation device config.",
        category: "Hostel Appliance",
        condition: "fairly_used",
        price: 30000,
        stock: 1,
        location: "Near Campus Gate",
        images:"/images/sonik-fan.jpg",
        isActive: true,
      },
      {
        name: "Sonix Pressing Iron",
        description: "Heavy duty pressing layout iron to stay clean for presentations.",
        category: "Hostel Appliance",
        condition: "used",
        price: 14000,
        stock: 10,
        location: "Campus Block A",
        images: "/images/sonik-iron.webp",
        isActive: true,
      }
    ]);

    console.log("Seed completed successfully based on updated inventory.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}
seed();