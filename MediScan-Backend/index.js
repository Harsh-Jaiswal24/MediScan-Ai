const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const fetch = require("node-fetch"); 
const mongoose = require("mongoose");

const Report = require('./models/Report');
const User = require('./models/user'); 

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

// CORS Setup
app.use(cors({
  origin: "*", // Adjust this based on your frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// Connect to MongoDB
async function main() {
  await mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB", err));
}
main();

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .png, .jpg, etc.
    const baseName = path.basename(file.originalname, ext); // remove extension
    cb(null, `${Date.now()}-${baseName}${ext}`); // keep original extension
  }
});

const upload = multer({ storage });

// Initialize Google GenAI
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.get("/", (req, res) => {
  res.redirect(process.env.FRONTEND_URL); 
});

// POST Route for Symptom Check
app.post("/symptom-check", upload.single("image"), async (req, res) => {
  const file = req.file;
  const symptoms = req.body.symptoms;
  const { userId, email, fullName } = req.body;
  
  let user;
  
  try{
    user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId, email, fullName });
      await user.save();
      console.log("New user saved.");
    } else {
      console.log("User already exists.");
    }
  } catch (err) {
    console.error("Error saving user:", err);
  }

  // console.log("Uploaded file:", file);
  // console.log("Symptoms:", symptoms);

  if (!file || !symptoms) {
    return res.status(400).json({ error: "Missing file or symptoms field" });
  }

  try {
    // Convert image to base64
    const imageUrl = `http://localhost:3030/uploads/${file.filename}`;
    
    // Fetch the image and convert it to ArrayBuffer
    const response = await fetch(imageUrl);
    console.log("Fetched image response:", response.status); // This should log 200 if successful

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch image." });
    }

    const imageArrayBuffer = await response.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

    // Send image and symptoms to Google GenAI
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
                You are a professional medical diagnosis assistant. 
                Analyze the uploaded image of a skin condition and consider the described symptoms to predict possible diseases. 
                Your response should be in very easy english language by which any local indian can understand and include diease's indian name also if possible .Your response should include only this noting else:
                1. Name of the most likely disease(s).
                2. Key symptoms or signs.
                3. Recommended treatments or precautions.
                4. When to consult a doctor.
                5. If the image is not medically relevant (e.g., not of skin, wound, infection, etc.), respond with: 
                "Please send me a valid image to diagnose."
              `
            },
            {
              inlineData: {
                mimeType: file.mimetype, // detects jpeg/png automatically
                data: base64ImageData,
              },
            },
            {
              text: `The user reports the following symptoms: ${symptoms}`
            }
          ]
        }
      ],
    });

    // Extract the content from the AI response
    const aiContent = result.candidates[0].content;
    // console.log("AI Response Content:", aiContent.parts[0].text);

    const datatosave = aiContent.parts[0].text;

    const newReport = new Report({
      reports: [{
        report: datatosave,  // Saving the report as a string
        createdAt: new Date()  // The current date
      }],
      author: user._id
    
    });
    
    await newReport.save()
      .then(() => console.log("Report Saved Successfully"))
      .catch((err) => console.log("Error saving report in db", err));

    // Delete the uploaded image from the server after processing
    fs.unlink(path.join(uploadsDir, file.filename), (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("Uploaded file deleted successfully.");
      }
    });

    // Return the result from Google GenAI to the frontend
    res.status(200).json({
      message: "Analysis complete.",
      result: aiContent, // Processed response from GenAI
    });

  } catch (error) {
    console.error("Error with Google GenAI:", error);

    // Delete the uploaded image if there's an error
    if (file) {
      fs.unlink(path.join(uploadsDir, file.filename), (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("Uploaded file deleted due to error.");
        }
      });
    }

    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

app.get("/userreports",async (req,res)=>{
  console.log("get req")
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query" });
  }
  try {
    // Find the user using the userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all reports created by this user
    const reports = await Report.find({ author: user._id }) .populate('author', 'userId fullName email').sort({ 'reports.createdAt': -1 });
    console.log(reports)
    res.status(200).json({ reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Server error while fetching reports" });
  }
});



app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
