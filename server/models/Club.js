import mongoose from "mongoose"

const clubSchema = new mongoose.Schema(  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

const Club = mongoose.models.Club || mongoose.model("Club", clubSchema)
                                                   

export default Club;
