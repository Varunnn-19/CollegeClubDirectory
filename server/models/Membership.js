import { Schema, model, models } from "mongoose"

const membershipSchema = new Schema(
  {
    userId: { type: String, required: true },
    clubId: { type: String, required: true },
    userName: String,
    userEmail: String,
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },
    role: { type: String, default: "member" },
    joinedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        return ret
      },
    },
  }
)

membershipSchema.index({ userId: 1, clubId: 1 }, { unique: true })

const Membership = models.Membership || model("Membership", membershipSchema)

export default Membership

