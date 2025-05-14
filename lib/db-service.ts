import { Document, Model, UpdateWriteOpResult } from "mongoose"
import { connectToMongoDB } from "./mongodb"

/**
 * Generic database service for CRUD operations
 * @template T The document type
 */
export class DatabaseService<T extends Document> {
  private model: Model<T>

  /**
   * Create a new database service
   * @param model The mongoose model to use
   */
  constructor(model: Model<T>) {
    this.model = model
  }

  /**
   * Create a new document
   * @param data The data to create
   * @returns The created document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      console.log("Attempting to create document with data:", JSON.stringify(data))
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }
      console.log("MongoDB connected, creating document...")
      const result = await this.model.create(data)
      console.log("Document created successfully:", JSON.stringify(result))
      return result
    } catch (error) {
      console.error("Error creating document:", error)
      throw error
    }
  }

  /**
   * Find a document by ID
   * @param id The document ID
   * @returns The document or null if not found
   */
  async findById(id: string): Promise<T | null> {
    try {
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }
      return this.model.findById(id)
    } catch (error) {
      console.error(`Error finding document by ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Find documents by query
   * @param query The query to find documents
   * @returns The documents matching the query
   */
  async find(query: any = {}): Promise<T[]> {
    try {
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }

      console.log(`Finding documents with query:`, JSON.stringify(query))
      const results = await this.model.find(query)
      console.log(`Found ${results.length} documents`)
      return results
    } catch (error) {
      console.error(`Error finding documents with query ${JSON.stringify(query)}:`, error)
      throw error
    }
  }

  /**
   * Find one document by query
   * @param query The query to find a document
   * @returns The document or null if not found
   */
  async findOne(query: any = {}): Promise<T | null> {
    try {
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }
      return this.model.findOne(query)
    } catch (error) {
      console.error(`Error finding document with query ${JSON.stringify(query)}:`, error)
      throw error
    }
  }

  /**
   * Update a document by ID
   * @param id The document ID
   * @param data The data to update
   * @returns The updated document or null if not found
   */
  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }
      return this.model.findByIdAndUpdate(id, data, { new: true })
    } catch (error) {
      console.error(`Error updating document by ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Update documents by query
   * @param query The query to find documents
   * @param data The data to update
   * @returns The update result
   */
  async updateMany(query: any, data: Partial<T>): Promise<UpdateWriteOpResult | null> {
    try {
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }
      return this.model.updateMany(query, data)
    } catch (error) {
      console.error(`Error updating documents with query ${JSON.stringify(query)}:`, error)
      throw error
    }
  }

  /**
   * Delete a document by ID
   * @param id The document ID
   * @returns The deleted document or null if not found
   */
  async deleteById(id: string): Promise<T | null> {
    try {
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }
      return this.model.findByIdAndDelete(id)
    } catch (error) {
      console.error(`Error deleting document by ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete documents by query
   * @param query The query to find documents
   * @returns The delete result
   */
  async deleteMany(query: any): Promise<{ deletedCount: number } | null> {
    try {
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }
      return this.model.deleteMany(query)
    } catch (error) {
      console.error(`Error deleting documents with query ${JSON.stringify(query)}:`, error)
      throw error
    }
  }

  /**
   * Count documents by query
   * @param query The query to count documents
   * @returns The count
   */
  async count(query: any = {}): Promise<number> {
    try {
      const connection = await connectToMongoDB()
      if (!connection) {
        throw new Error("Failed to connect to MongoDB")
      }
      return this.model.countDocuments(query)
    } catch (error) {
      console.error(`Error counting documents with query ${JSON.stringify(query)}:`, error)
      throw error
    }
  }
}
