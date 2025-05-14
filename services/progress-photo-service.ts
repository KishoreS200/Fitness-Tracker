import { DatabaseService } from "@/lib/db-service"
import ProgressPhoto, { type IProgressPhoto } from "@/models/progress-photo"
import mongoose from "mongoose"

class ProgressPhotoService extends DatabaseService<IProgressPhoto> {
  constructor() {
    super(ProgressPhoto)
  }

  /**
   * Find photos by user ID
   * @param userId The user ID
   * @returns The user's photos
   */
  async findByUserId(userId: string): Promise<IProgressPhoto[]> {
    return this.find({ userId: new mongoose.Types.ObjectId(userId) })
  }

  /**
   * Find photos by user ID and type
   * @param userId The user ID
   * @param type The photo type
   * @returns The user's photos of the specified type
   */
  async findByUserIdAndType(userId: string, type: IProgressPhoto["type"]): Promise<IProgressPhoto[]> {
    return this.find({
      userId: new mongoose.Types.ObjectId(userId),
      type,
    })
  }

  /**
   * Find photos by user ID and date
   * @param userId The user ID
   * @param date The photo date
   * @returns The user's photos from the specified date
   */
  async findByUserIdAndDate(userId: string, date: Date): Promise<IProgressPhoto[]> {
    return this.find({
      userId: new mongoose.Types.ObjectId(userId),
      date,
    })
  }

  /**
   * Create a new progress photo
   * @param userId The user ID
   * @param data The photo data
   * @returns The created photo
   */
  async createPhoto(
    userId: string,
    data: { date: Date; type: IProgressPhoto["type"]; url: string },
  ): Promise<IProgressPhoto> {
    return this.create({
      userId: new mongoose.Types.ObjectId(userId),
      ...data,
    })
  }

  /**
   * Delete a photo by ID
   * @param photoId The photo ID
   * @returns The deleted photo or null if not found
   */
  async deletePhoto(photoId: string): Promise<IProgressPhoto | null> {
    return this.deleteById(photoId)
  }
}

export const progressPhotoService = new ProgressPhotoService() 