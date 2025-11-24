import { Schema, model, models } from "mongoose"

const announcementSchema = new Schema(
  {
    clubId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    createdBy: { type: String, default: "" },
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

const Announcement = models.Announcement || model("Announcement", announcementSchema)

export default Announcement

