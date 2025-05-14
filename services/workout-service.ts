import { DatabaseService } from "@/lib/db-service"
import Workout, { type IWorkout } from "@/models/workout"

class WorkoutService extends DatabaseService<IWorkout> {
  constructor() {
    super(Workout)
  }

  /**
   * Find workouts by difficulty
   * @param difficulty The workout difficulty
   * @returns The workouts matching the difficulty
   */
  async findByDifficulty(difficulty: string): Promise<IWorkout[]> {
    try {
      return await this.find({ difficulty })
    } catch (error) {
      console.error(`Error finding workouts by difficulty ${difficulty}:`, error)
      throw error
    }
  }

  /**
   * Find workouts by category
   * @param category The workout category
   * @returns The workouts matching the category
   */
  async findByCategory(category: string): Promise<IWorkout[]> {
    try {
      return await this.find({ categories: category })
    } catch (error) {
      console.error(`Error finding workouts by category ${category}:`, error)
      throw error
    }
  }

  /**
   * Find workouts by difficulty and category
   * @param difficulty The workout difficulty
   * @param category The workout category
   * @returns The workouts matching the difficulty and category
   */
  async findByDifficultyAndCategory(difficulty: string, category: string): Promise<IWorkout[]> {
    try {
      return await this.find({ difficulty, categories: category })
    } catch (error) {
      console.error(`Error finding workouts by difficulty ${difficulty} and category ${category}:`, error)
      throw error
    }
  }

  /**
   * Record workout completion
   * @param workoutId The ID of the completed workout
   * @param userId The ID of the user who completed the workout
   * @param xpGained The XP gained from completing the workout
   * @param exercisesCompleted The exercises completed in the workout
   * @returns The updated workout
   */
  async recordCompletion(
    workoutId: string,
    userId: string,
    xpGained: number,
    exercisesCompleted: {
      name: string
      setsCompleted: number
      repsCompleted: number
    }[]
  ): Promise<IWorkout> {
    try {
      const workout = await this.findById(workoutId)
      if (!workout) {
        throw new Error(`Workout not found with ID: ${workoutId}`)
      }

      workout.completedBy = workout.completedBy || []
      workout.completedBy.push({
        userId,
        completedAt: new Date(),
        xpGained,
        exercisesCompleted
      })

      const savedWorkout = await workout.save()
      if (!savedWorkout) {
        throw new Error("Failed to save workout completion")
      }

      return savedWorkout
    } catch (error) {
      console.error("Error recording workout completion:", error)
      throw error
    }
  }

  /**
   * Get user's completed workouts
   * @param userId The ID of the user
   * @returns The workouts completed by the user
   */
  async getCompletedWorkouts(userId: string): Promise<IWorkout[]> {
    try {
      return await this.find({ "completedBy.userId": userId })
    } catch (error) {
      console.error(`Error finding completed workouts for user ${userId}:`, error)
      throw error
    }
  }
}

export const workoutService = new WorkoutService()
