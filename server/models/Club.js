import mongoose from "mongoose"

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

// Auto-generate slug from name before saving
clubSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }
  next()
})

const Club = mongoose.models.Club || mongoose.model("Club", clubSchema)

export default Club
