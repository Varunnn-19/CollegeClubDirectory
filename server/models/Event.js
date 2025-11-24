import { Schema, model, models } from "mongoose"

const eventSchema = new Schema(
  {
    clubId: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: String,
    location: String,
    description: String,
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

const Event = models.Event || model("Event", eventSchema)

export default Event

