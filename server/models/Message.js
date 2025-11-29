import { Schema, model, models } from "mongoose"

const messageSchema = new Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    senderName: { type: String, required: true },
    receiverName: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
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

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 })

const Message = models.Message || model("Message", messageSchema)

export default Message

