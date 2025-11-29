import { Schema, model, models } from "mongoose"

const socialSchema = new Schema(
  {
    website: String,
    twitter: String,
    instagram: String,
  },
  { _id: false }
)

const clubSchema = new Schema(
  {
    _id: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    logoUrl: String,
    shortDescription: String,
    fullDescription: String,
    category: String,
    membershipType: { type: String, default: "Open" },
    email: String,
    meetingTimes: String,
    social: socialSchema,
    images: { type: [String], default: [] },
    status: { type: String, default: "approved" },
    createdBy: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id
        delete ret._id
        return ret
      },
    },
  }
)

const Club = models.Club || model("Club", clubSchema)

export default Club

