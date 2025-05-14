// Define the cache interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

import mongoose from "mongoose";

// Cache the MongoDB connection to prevent multiple connections during development
const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

/**
 * Connect to MongoDB using the provided URI
 * This function caches the connection to prevent multiple connections
 * @returns {Promise<mongoose.Connection>} The MongoDB connection
 */
async function connectToMongoDB(): Promise<typeof mongoose | null> {
  try {
    // If we already have a connection, return it
    if (cached.conn) {
      console.log("Using existing MongoDB connection")
      return cached.conn
    }

    // If we don't have a connection but have a promise, wait for it to resolve
    if (!cached.promise) {
      const MONGODB_URI = process.env.MONGODB_URI

      if (!MONGODB_URI) {
        console.error("MONGODB_URI environment variable is not defined")
        throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
      }

      console.log("MongoDB URI:", MONGODB_URI)

      // Connection options
      const options: mongoose.ConnectOptions = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
        retryWrites: true,
        retryReads: true,
      }

      console.log("Connecting to MongoDB...")
      cached.promise = mongoose
        .connect(MONGODB_URI, options)
        .then((mongoose) => {
          console.log("Connected to MongoDB successfully")
          console.log("Connection state:", mongoose.connection.readyState)
          
          // Verify connection by listing databases
          if (!mongoose.connection.db) {
            console.error("MongoDB connection database is undefined")
            throw new Error("MongoDB connection database is undefined")
          }
          
          return mongoose.connection.db.admin().listDatabases()
            .then(result => {
              console.log("Available databases:", result.databases.map(db => db.name))
              return mongoose
            })
            .catch(err => {
              console.error("Error listing databases:", err)
              throw err
            })
        })
        .catch((err) => {
          console.error("MongoDB connection error:", err)
          cached.promise = null
          throw err
        })
    }

    const result = await cached.promise
    cached.conn = result
    if (!result) {
      throw new Error("Failed to establish MongoDB connection")
    }
    return result
  } catch (e) {
    cached.promise = null
    cached.conn = null
    console.error("Failed to connect to MongoDB:", e)
    throw e
  }
}

/**
 * Disconnect from MongoDB
 * This is useful for testing and development
 */
async function disconnectFromMongoDB(): Promise<void> {
  try {
    if (cached.conn) {
      await cached.conn.disconnect()
      cached.conn = null
      cached.promise = null
      console.log("Disconnected from MongoDB")
    }
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error)
    throw error
  }
}

/**
 * Check if MongoDB is connected
 * @returns {boolean} True if connected, false otherwise
 */
function isConnected(): boolean {
  return cached.conn?.connection.readyState === 1
}

export { connectToMongoDB, disconnectFromMongoDB, isConnected };
