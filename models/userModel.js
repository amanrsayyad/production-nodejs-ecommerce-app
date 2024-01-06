import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userShema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name is required"],
    },
    email: {
      type: String,
      require: [true, "email is required"],
      unique: [true, "email is already taken"],
    },
    mobile: {
      type: String,
      require: [true, "mobile number is required"],
      unique: [true, "mobile number is already taken"],
    },
    state: {
      type: String,
      require: [true, "state is required"],
    },
    password: {
      type: String,
      require: [true, "password is required"],
      minLength: [6, "password length should be greater than 6 character"],
    },
  },
  { timestamps: true }
);

// Hash func
userShema.pre("save", async function () {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare function
userShema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// JWT
userShema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const userModel = mongoose.model("Users", userShema);
export default userModel;
