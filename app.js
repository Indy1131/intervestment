const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware to allow requests from any origin
app.use(cors()); // This will allow all origins by default

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema for JSON documents with the flexibility to handle any structure
const JsonData = mongoose.model(
  "JsonData",
  new mongoose.Schema({}, { strict: false }),
  "mycollection"
);

// Route to fetch the document based on the "name" query parameter
app.get("/", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Query param "name" is required' });
  }

  try {
    // Query the document by name and exclude the _id and name fields
    const data = await JsonData.findOne({ name }).select("-_id -name");

    if (!data) {
      return res.status(404).json({ error: `No document found for name: ${name}` });
    }

    res.json(data); // Return the document content excluding _id and name
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
