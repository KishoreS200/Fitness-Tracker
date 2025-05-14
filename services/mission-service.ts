import { DatabaseService } from "@/lib/db-service"
import Mission, { type IMission } from "@/models/mission"
import mongoose from "mongoose"

class MissionService extends DatabaseService<IMission> {
  constructor() {
    super(Mission)
  }

  /**
   * Find active missions for a user
   * @param userId The user ID
   * @returns The active missions
   */
  async findActiveMissions(userId: string): Promise<IMission[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`Invalid user ID: ${userId}`)
      }
      return await this.find({ userId: new mongoose.Types.ObjectId(userId), isActive: true })
    } catch (error) {
      console.error(`Error finding active missions for user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Find available missions for a user
   * @param userId The user ID
   * @returns The available missions
   */
  async findAvailableMissions(userId: string): Promise<IMission[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`Invalid user ID: ${userId}`)
      }
      return await this.find({ userId: new mongoose.Types.ObjectId(userId), isActive: false })
    } catch (error) {
      console.error(`Error finding available missions for user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Update mission progress
   * @param missionId The mission ID
   * @param progress The new progress value
   * @returns The updated mission
   */
  async updateProgress(missionId: string, progress: number): Promise<IMission> {
    try {
      if (!mongoose.Types.ObjectId.isValid(missionId)) {
        throw new Error(`Invalid mission ID: ${missionId}`)
      }
      const updatedMission = await this.updateById(missionId, { progress } as Partial<IMission>)
      if (!updatedMission) {
        throw new Error(`Mission not found with ID: ${missionId}`)
      }
      return updatedMission
    } catch (error) {
      console.error(`Error updating progress for mission ${missionId}:`, error)
      throw error
    }
  }

  /**
   * Activate a mission
   * @param missionId The mission ID
   * @param userId The user ID
   * @returns The updated mission
   */
  async activateMission(missionId: string, userId: string): Promise<IMission> {
    try {
      if (!mongoose.Types.ObjectId.isValid(missionId)) {
        throw new Error(`Invalid mission ID: ${missionId}`)
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`Invalid user ID: ${userId}`)
      }
      const updatedMission = await this.updateById(missionId, {
        isActive: true,
        userId: new mongoose.Types.ObjectId(userId),
      } as Partial<IMission>)
      if (!updatedMission) {
        throw new Error(`Mission not found with ID: ${missionId}`)
      }
      return updatedMission
    } catch (error) {
      console.error(`Error activating mission ${missionId} for user ${userId}:`, error)
      throw error
    }
  }
}

export const missionService = new MissionService()
