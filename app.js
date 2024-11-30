import "dotenv/config"
import express from "express"
import cors from "cors"
const app = express()
import Topping from "./models/Topping.js"
import PizzaOrder from "./models/PizzaOrder.js"
import { dbConnect } from "./db.js"

app.use(cors())
app.use(express.json())

app.get("/", async (req, res) => {
  res.send("Deployment successful; app is live")
})

app.get("/toppings", async (req, res) => {
  try {
    const filter = {}
    if (req.query.vegetarian === "true") filter.vegetarian = true
    if (req.query.inStock === "true") filter.inStock = true

    const toppings = await Topping.find(filter)

    res.json(toppings)
  } catch (error) {
    console.error("Error fetching toppings:", error)
    res.status(500).json({ message: "Server error fetching toppings" })
  }
})

app.post("/order", async (req, res) => {
  try {
    const { toppings, size } = req.body
    if (!size) res.status(400).json({ message: "Pizza size is required" })

    const newOrder = new PizzaOrder({ toppings, size })
    const savedOrder = await newOrder.save()

    const totalPrice = savedOrder.totalPrice

    const message = `Your order for a ${size} pizza with ${toppings
      .map((t) => t.displayName)
      .join(", ")} has been placed. The price is $${totalPrice.toFixed(2)}`
    res.status(201).send({ message })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
})

export default async function handler(req, res) {
  try {
    await dbConnect()
  } catch (error) {
    console.error("Database connection failed:", error)
    return res.status(500).json({ error: "Internal server error" })
  }

  app(req, res)
}
