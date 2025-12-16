import mongoose from "mongoose"

const rsvpSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: ["going", "not_going"], default: "going" },
    clubId: String,
    clubName: String,
    eventTitle: String,
    eventDate: String,
    eventTime: String,
    eventLocation: String,
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

rsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true })

const RSVP = mongoose.models.RSVP || mongoose.model("RSVP", rsvpSchema)
export default RSVP

