import Membership from "../models/Membership.js"
import Review from "../models/Review.js"

export async function buildClubStats(clubIds = []) {
  const matchClub = clubIds.length ? { clubId: { $in: clubIds } } : {}

  const [memberAgg, reviewAgg] = await Promise.all([
    Membership.aggregate([
      { $match: { ...matchClub, status: "active" } },
      { $group: { _id: "$clubId", count: { $sum: 1 } } },
    ]),
    Review.aggregate([
      { $match: matchClub },
      {
        $group: {
          _id: "$clubId",
          rating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]),
  ])

  const stats = {}

  memberAgg.forEach((item) => {
    stats[item._id] = stats[item._id] || {}
    stats[item._id].memberCount = item.count
  })

  reviewAgg.forEach((item) => {
    stats[item._id] = stats[item._id] || {}
    stats[item._id].rating = Number(item.rating?.toFixed(1)) || 0
    stats[item._id].reviewCount = item.reviewCount || 0
  })

  return stats
}

