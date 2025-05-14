import { DatabaseService } from "@/lib/db-service"
import User, { type IUser } from "@/models/user"

class UserService extends DatabaseService<IUser> {
  constructor() {
    super(User)
  }

  /**
   * Find a user by email
   * @param email The user's email
   * @returns The user or null if not found
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email })
  }

  /**
   * Update a user's XP
   * @param userId The user ID
   * @param xpAmount The amount of XP to add
   * @returns The updated user or null if not found
   */
  async updateXP(userId: string, xpAmount: number): Promise<IUser | null> {
    const user = await this.findById(userId)

    if (!user) return null

    // Calculate new XP
    let currentXP = user.xp.current + xpAmount
    let newLevel = user.level
    let maxXP = user.xp.max

    // Check if user leveled up
    while (currentXP >= maxXP) {
      newLevel++
      currentXP -= maxXP
      // Increase max XP for next level (by 10%)
      maxXP = Math.round(maxXP * 1.1)
    }

    // Update user stats
    const updatedStats = {
      ...user.stats,
      missions: user.stats.missions + (xpAmount > 0 ? 1 : 0),
    }

    return this.updateById(userId, {
      level: newLevel,
      xp: {
        current: currentXP,
        max: maxXP,
      },
      stats: updatedStats,
    } as Partial<IUser>)
  }
}

export const userService = new UserService()
