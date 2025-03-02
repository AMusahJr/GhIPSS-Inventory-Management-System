const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/inventory", {
});

const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const RequestSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  approved: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const Inventory = mongoose.model("Inventory", ItemSchema);
const Request = mongoose.model("Request", RequestSchema);
const User = mongoose.model("User", UserSchema);

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).send("Access denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
};

app.get("/api/inventory", authenticateToken, async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

app.post("/api/inventory", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");
  const newItem = new Inventory(req.body);
  await newItem.save();
  res.json(newItem);
});

app.get("/api/requests", authenticateToken, async (req, res) => {
  const requests = await Request.find();
  res.json(requests);
});

app.post("/api/requests", authenticateToken, async (req, res) => {
  const newRequest = new Request(req.body);
  await newRequest.save();
  res.json(newRequest);
});

app.put("/api/requests/:id/approve", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).send("Request not found");

  const item = await Inventory.findOne({ name: request.name });
  if (!item || item.quantity < request.quantity) {
    return res.status(400).send("Insufficient stock");
  }

  item.quantity -= request.quantity;
  request.approved = true;
  await item.save();
  await request.save();

  res.json({ message: "Request approved and inventory updated" });
});

app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }
  const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT || 5001}`);
});
