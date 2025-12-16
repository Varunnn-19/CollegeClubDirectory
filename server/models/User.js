import mongoose from "mongoose"

const userSchema = new mongoose.Schema(  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usn: String,
    yearOfStudy: String,
    phoneNumber: String,
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    assignedClubId: { type: String, default: "" },
    otpCode: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
  },
  {
    versionKey: false,
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.passwordHash
      delete ret.otpCode
      delete ret.otpExpiresAt
      return ret
    }
  }
)

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
