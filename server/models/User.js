import { Schema, model, models } from "mongoose"

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usn: String,
    yearOfStudy: String,
    phoneNumber: String,
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    assignedClubId: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.passwordHash
        return ret
      },
    },
  }
)

const User = models.User || model("User", userSchema)

export default User

