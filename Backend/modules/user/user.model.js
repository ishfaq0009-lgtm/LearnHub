import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["Admin"],
      default: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { role: 1 },
  {
    unique: true,
    partialFilterExpression: { role: "Admin" },
  }
);

const User =
  mongoose.models.userData ||
  mongoose.model("userData", userSchema);

export default User;