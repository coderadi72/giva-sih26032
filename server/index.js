require("dotenv").config();\nconst { OpenAI } = require("openai");\nconst express = require("express");
const path = require("path");
const cors = require("cors");
const { farmers, centres, notifications } = require("./data");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function getFarmer(id) {
  return farmers.find(f => f.id.toUpperCase() === String(id || "").toUpperCase());
}

function getCentre(id) {
  return centres.find(c => c.id === id);
}

function estimateWait(centre) {
  return Math.max(5, Math.round(centre.queue * centre.avgMinutes / 6));
}

app.get("/api/fertilizers", (req,res) => {
  res.json([
    {name:"Urea", pack:"45 kg", price:266.50, stock:"Available"},
    {name:"DAP", pack:"50 kg", price:1350, stock:"Available"},
    {name:"NPK 10:26:26", pack:"50 kg", price:1470, stock:"Limited"},
    {name:"MOP", pack:"50 kg", price:1700, stock:"Available"}
  ]);
});

app.post("/api/feedback", (req,res) => {
  const { farmerId, centreId, rating, comment } = req.body;
  if (!farmerId || !centreId || !rating) return res.status(400).json({message:"farmerId, centreId and rating are required"});
  res.status(201).json({ok:true, message:"Feedback saved in prototype", feedback:{farmerId, centreId, rating, comment:comment||""}});
});

app.get("/api/health", (req,res) => {
  res.json({ ok:true, service:"KisanSetu API", mode:"prototype" });
});

app.get("/api/farmers/:id", (req,res) => {
  const farmer = getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ message:"Farmer not found" });

  const centre = getCentre(farmer.centreId);
  res.json({
    ...farmer,
    centre: centre ? {
      ...centre,
      estimatedWaitMinutes: estimateWait(centre)
    } : null
  });
});

app.get("/api/centres", (req,res) => {
  res.json(centres.map(c => ({
    ...c,
    estimatedWaitMinutes: estimateWait(c)
  })));
});

app.get("/api/centres/:id", (req,res) => {
  const centre = getCentre(req.params.id);
  if (!centre) return res.status(404).json({ message:"Centre not found" });

  res.json({
    ...centre,
    estimatedWaitMinutes: estimateWait(centre)
  });
});

app.get("/api/notifications/:farmerId", (req,res) => {
  const farmer = getFarmer(req.params.farmerId);
  if (!farmer) return res.status(404).json({ message:"Farmer not found" });
  res.json(notifications);
});

app.get("/api/payments/:farmerId", (req,res) => {
  const farmer = getFarmer(req.params.farmerId);
  if (!farmer) return res.status(404).json({ message:"Farmer not found" });

  res.json({
    farmerId: farmer.id,
    crop: farmer.crop,
    expectedValue: farmer.expectedValue,
    status: farmer.paymentStatus,
    procurementStatus: farmer.procurementStatus,
    message: farmer.paymentStatus === "Pending"
      ? "Payment will be processed after procurement."
      : "Payment processed."
  });
});

// Prototype: simulate live queue movement.
// POST /api/demo/queue {"centreId":"C001","delta":-5}
app.post("/api/demo/queue", (req,res) => {
  const centre = getCentre(req.body.centreId);
  if (!centre) return res.status(404).json({ message:"Centre not found" });

  const delta = Number(req.body.delta || 0);
  centre.queue = Math.max(0, centre.queue + delta);
  centre.load = Math.min(100, Math.max(5, Math.round((centre.queue / centre.capacity) * 100)));
  centre.status = centre.load >= 90 ? "High" : centre.load >= 75 ? "Medium" : "Low";

  res.json({
    ...centre,
    estimatedWaitMinutes: estimateWait(centre)
  });
});

app.get("/api/farmer/:id/summary", (req,res) => {
  const farmer = getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ message:"Farmer not found" });
  const centre = getCentre(farmer.centreId);
  res.json({
    farmer,
    centre: centre ? { ...centre, estimatedWaitMinutes: estimateWait(centre) } : null,
    smartRecommendation: centre
      ? {
          arrival: "10:15 AM",
          reason: "15 minutes before scheduled slot",
          estimatedWaitMinutes: estimateWait(centre)
        }
      : null
  });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, "../dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


app.post("/api/assistant", async (req, res) => {
  const { message, farmerId, language } = req.body;
  if (!message) return res.status(400).json({ reply: "Please ask a question." });

  const f = getFarmer(farmerId) || {};
  const c = f.centreId ? getCentre(f.centreId) : (centres[0] || {});
  const waitTime = c.name ? estimateWait(c) : 0;

  // Simulated AI logic (Fallback if no external AI API key is set)
  const getDemoReply = (q) => {
    let rep = language === "hi" ? "मैं किसान सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?" : "I am the Kisan Assistant. How can I help you today?";
    if (q.includes("kitne farmer") || q.includes("queue") || q.includes("aage") || q.includes("kisan") || q.includes("kitne")) {
      rep = language === "hi" 
        ? `${c.name} में ${c.queue} किसान प्रतीक्षा कर रहे हैं। आपका अनुमानित समय ${waitTime} मिनट है। (AI Demo Mode)` 
        : `There are ${c.queue} farmers waiting at ${c.name}. Your estimated waiting time is ${waitTime} minutes. (AI Demo Mode)`;
    } else if (q.includes("slot") || q.includes("kab hai") || q.includes("kab")) {
      rep = language === "hi" 
        ? `आपका स्लॉट ${f.slotDate || "आज"} ${c.name} पर निर्धारित है। (AI Demo Mode)` 
        : `Your slot is scheduled for ${f.slotDate || "today"} at ${c.name}. (AI Demo Mode)`;
    } else if (q.includes("msp") || q.includes("price") || q.includes("bhav") || q.includes("kya hai")) {
      rep = language === "hi" 
        ? `गेहूं का वर्तमान MSP ₹2275 प्रति क्विंटल है। सीहोर में मॉडल बाजार भाव ₹3100 है। (AI Demo Mode)` 
        : `The current MSP for Wheat is ₹2275 per quintal. The modal market price in Sehore is ₹3100 per quintal. (AI Demo Mode)`;
    } else if (q.includes("payment")) {
      rep = language === "hi" 
        ? `आपका ₹${(f.expectedValue || 115200).toLocaleString("en-IN")} का भुगतान अभी ${f.paymentStatus === 'COMPLETED' ? "सफल" : "प्रक्रिया में"} है। (AI Demo Mode)` 
        : `Your expected payment of ₹${(f.expectedValue || 115200).toLocaleString("en-IN")} is currently ${f.paymentStatus || "PENDING"} processing. (AI Demo Mode)`;
    } else if (q.includes("open") || q.includes("time") || q.includes("khulega") || q.includes("samay")) {
      rep = language === "hi" 
        ? `${c.name} आज सुबह 08:00 बजे से शाम 06:00 बजे तक खुला है। (AI Demo Mode)` 
        : `${c.name} is open today from 08:00 AM to 06:00 PM. (AI Demo Mode)`;
    } else if (q.includes("nearest") || q.includes("pass") || q.includes("centre")) {
      rep = language === "hi" 
        ? `सबसे नज़दीकी केंद्र ${c.name} है (${c.distance} दूर)। (AI Demo Mode)` 
        : `The nearest procurement centre is ${c.name} (${c.distance} away). (AI Demo Mode)`;
    }
    return rep;
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY is not set. Using Demo Mode.");
    return res.json({ reply: getDemoReply(message.toLowerCase()) });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const systemPrompt = `
You are a helpful and professional Kisan Assistant for the KisanSetu portal in India. 
Your primary job is to answer questions using ONLY the provided Application Data.
- DO NOT invent queue lengths, wait times, slot dates, or payment numbers.
- If the required data is not in the Application Data, politely state: "Is samay KisanSetu ke paas is information ka data available nahi hai."
- Reply in ${language === 'hi' ? 'Hindi or Hinglish' : 'English'}. Keep responses concise, clear, and focused on helping the farmer.

Application Data Context:
- Farmer Name: ${f.name || 'Unknown'}
- Farmer ID: ${f.id || 'Unknown'}
- Crop: ${f.crop || 'Unknown'}
- Expected Value (Payment): ₹${f.expectedValue || 'Unknown'}
- Payment Status: ${f.paymentStatus || 'Unknown'}
- Slot Date: ${f.slotDate || 'Unknown'}
- Allotted Centre: ${c.name || 'Unknown'}
- Centre Distance: ${c.distance || 'Unknown'}
- Centre Total Queue: ${c.queue || 0} farmers
- Estimated Wait Time: ${waitTime} minutes
- Centre Capacity Load: ${c.load || 0}%
- Centre Timings: 08:00 AM to 06:00 PM
- Current MSP (Wheat): ₹2275 per quintal
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-efficient widely available model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.2
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI API Error:", err.message);
    res.json({ reply: "AI Assistant is temporarily unavailable. You can still use Queue, Slot, Procurement and Payment services." });
  }
});

app.listen(PORT, () => {
  console.log(`KisanSetu API running on http://localhost:${PORT}`);
});
