import mongoose from "mongoose"

const dbConnect = async (req, res) => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log(`[database]: connected to db`)
  } catch (err) {
    console.warn(`[database error]: ${err}`)
    return res.status(500).json({ error: `[database error:] ${err}` })
  }
}

export { dbConnect, mongoose }
