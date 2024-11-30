import mongoose from "mongoose"

let cachedConnection = null

const dbConnect = async (req, res) => {
  if (cachedConnection) {
    return cachedConnection
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 5000, // Close sockets after 5 seconds of inactivity
    maxPoolSize: 10, // Limit concurrent connections
    connectTimeoutMS: 5000, // Give up initial connection after 5 seconds
  }

  try {
    const connection = await mongoose.connect(process.env.DB_URL)
    cachedConnection = connection
    console.log(`[database]: connected to db`)
  } catch (err) {
    console.warn(`[database error]: ${err}`)
    return res.status(500).json({ error: `[database error:] ${err}` })
  }
}

export { dbConnect, mongoose }
