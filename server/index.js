require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { OpenAI } = require("openai");

const { farmers, centres, notifications } = require("./data");

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());
app.use(express.json());

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getFarmer(id) {
  const farmerId = String(id || "").trim().toUpperCase();

  return farmers.find(
    (farmer) => String(farmer.id).toUpperCase() === farmerId
  );
}

function getCentre(id) {
  const centreId = String(id || "").trim();

  return centres.find((centre) => centre.id === centreId);
}

function estimateWait(centre) {
  if (!centre) {
    return 0;
  }

  return Math.max(
    5,
    Math.round((centre.queue * centre.avgMinutes) / 6)
  );
}

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "KisanSetu API",
    mode: "prototype"
  });
});

/* =========================================================
   FERTILIZERS
========================================================= */

app.get("/api/fertilizers", (req, res) => {
  const fertilizers = [
    {
      name: "Urea",
      pack: "45 kg",
      price: 266.5,
      stock: "Available"
    },
    {
      name: "DAP",
      pack: "50 kg",
      price: 1350,
      stock: "Available"
    },
    {
      name: "NPK 10:26:26",
      pack: "50 kg",
      price: 1470,
      stock: "Limited"
    },
    {
      name: "MOP",
      pack: "50 kg",
      price: 1700,
      stock: "Available"
    }
  ];

  res.json(fertilizers);
});

/* =========================================================
   FARMER
========================================================= */

app.get("/api/farmers/:id", (req, res) => {
  const farmer = getFarmer(req.params.id);

  if (!farmer) {
    return res.status(404).json({
      message: "Farmer not found"
    });
  }

  const centre = getCentre(farmer.centreId);

  res.json({
    ...farmer,

    centre: centre
      ? {
          ...centre,
          estimatedWaitMinutes: estimateWait(centre)
        }
      : null
  });
});

/* =========================================================
   FARMER SUMMARY
========================================================= */

app.get("/api/farmer/:id/summary", (req, res) => {
  const farmer = getFarmer(req.params.id);

  if (!farmer) {
    return res.status(404).json({
      message: "Farmer not found"
    });
  }

  const centre = getCentre(farmer.centreId);

  res.json({
    farmer,

    centre: centre
      ? {
          ...centre,
          estimatedWaitMinutes: estimateWait(centre)
        }
      : null,

    smartRecommendation: centre
      ? {
          arrival: "10:15 AM",
          reason: "15 minutes before scheduled slot",
          estimatedWaitMinutes: estimateWait(centre)
        }
      : null
  });
});

/* =========================================================
   CENTRES
========================================================= */

app.get("/api/centres", (req, res) => {
  const centreData = centres.map((centre) => ({
    ...centre,
    estimatedWaitMinutes: estimateWait(centre)
  }));

  res.json(centreData);
});

app.get("/api/centres/:id", (req, res) => {
  const centre = getCentre(req.params.id);

  if (!centre) {
    return res.status(404).json({
      message: "Centre not found"
    });
  }

  res.json({
    ...centre,
    estimatedWaitMinutes: estimateWait(centre)
  });
});

/* =========================================================
   NOTIFICATIONS
========================================================= */

app.get("/api/notifications/:farmerId", (req, res) => {
  const farmer = getFarmer(req.params.farmerId);

  if (!farmer) {
    return res.status(404).json({
      message: "Farmer not found"
    });
  }

  res.json(notifications);
});

/* =========================================================
   PAYMENTS
========================================================= */

app.get("/api/payments/:farmerId", (req, res) => {
  const farmer = getFarmer(req.params.farmerId);

  if (!farmer) {
    return res.status(404).json({
      message: "Farmer not found"
    });
  }

  const isPending = farmer.paymentStatus === "Pending";

  res.json({
    farmerId: farmer.id,
    crop: farmer.crop,
    expectedValue: farmer.expectedValue,
    status: farmer.paymentStatus,
    procurementStatus: farmer.procurementStatus,

    message: isPending
      ? "Payment will be processed after procurement."
      : "Payment processed."
  });
});

/* =========================================================
   FEEDBACK
========================================================= */

app.post("/api/feedback", (req, res) => {
  const {
    farmerId,
    centreId,
    rating,
    comment
  } = req.body;

  if (!farmerId || !centreId || !rating) {
    return res.status(400).json({
      message: "farmerId, centreId and rating are required"
    });
  }

  res.status(201).json({
    ok: true,
    message: "Feedback saved in prototype",

    feedback: {
      farmerId,
      centreId,
      rating,
      comment: comment || ""
    }
  });
});

/* =========================================================
   DEMO QUEUE
========================================================= */

/*
  Example request:

  POST /api/demo/queue

  {
    "centreId": "C001",
    "delta": -5
  }
*/

app.post("/api/demo/queue", (req, res) => {
  const { centreId } = req.body;
  const delta = Number(req.body.delta || 0);

  const centre = getCentre(centreId);

  if (!centre) {
    return res.status(404).json({
      message: "Centre not found"
    });
  }

  centre.queue = Math.max(
    0,
    centre.queue + delta
  );

  centre.load = Math.min(
    100,
    Math.max(
      5,
      Math.round((centre.queue / centre.capacity) * 100)
    )
  );

  if (centre.load >= 90) {
    centre.status = "High";
  } else if (centre.load >= 75) {
    centre.status = "Medium";
  } else {
    centre.status = "Low";
  }

  res.json({
    ...centre,
    estimatedWaitMinutes: estimateWait(centre)
  });
});

/* =========================================================
   AI ASSISTANT
========================================================= */

app.post("/api/assistant", async (req, res) => {
  const {
    message,
    farmerId,
    language
  } = req.body;

  if (!message || !String(message).trim()) {
    return res.status(400).json({
      reply: "Please ask a question."
    });
  }

  const farmer = getFarmer(farmerId) || {};

  const centre = farmer.centreId
    ? getCentre(farmer.centreId)
    : centres[0] || {};

  const waitTime = centre.name
    ? estimateWait(centre)
    : 0;

  /* -------------------------------------------------------
     DEMO AI RESPONSE
  ------------------------------------------------------- */

  function getDemoReply(question) {
    let reply =
      language === "hi"
        ? "मैं किसान सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?"
        : "I am the Kisan Assistant. How can I help you today?";

    if (
      question.includes("kitne farmer") ||
      question.includes("queue") ||
      question.includes("aage") ||
      question.includes("kisan") ||
      question.includes("kitne")
    ) {
      reply =
        language === "hi"
          ? `${centre.name} में ${centre.queue} किसान प्रतीक्षा कर रहे हैं। आपका अनुमानित समय ${waitTime} मिनट है। (AI Demo Mode)`
          : `There are ${centre.queue} farmers waiting at ${centre.name}. Your estimated waiting time is ${waitTime} minutes. (AI Demo Mode)`;
    }

    else if (
      question.includes("slot") ||
      question.includes("kab hai") ||
      question.includes("kab")
    ) {
      reply =
        language === "hi"
          ? `आपका स्लॉट ${farmer.slotDate || "आज"} ${centre.name} पर निर्धारित है। (AI Demo Mode)`
          : `Your slot is scheduled for ${farmer.slotDate || "today"} at ${centre.name}. (AI Demo Mode)`;
    }

    else if (
      question.includes("msp") ||
      question.includes("price") ||
      question.includes("bhav") ||
      question.includes("kya hai")
    ) {
      reply =
        language === "hi"
          ? "गेहूं का वर्तमान MSP ₹2275 प्रति क्विंटल है। सीहोर में मॉडल बाजार भाव ₹3100 है। (AI Demo Mode)"
          : "The current MSP for Wheat is ₹2275 per quintal. The modal market price in Sehore is ₹3100 per quintal. (AI Demo Mode)";
    }

    else if (question.includes("payment")) {
      const amount = (
        farmer.expectedValue || 115200
      ).toLocaleString("en-IN");

      const status =
        farmer.paymentStatus === "COMPLETED"
          ? "सफल"
          : "प्रक्रिया में";

      reply =
        language === "hi"
          ? `आपका ₹${amount} का भुगतान अभी ${status} है। (AI Demo Mode)`
          : `Your expected payment of ₹${amount} is currently ${farmer.paymentStatus || "PENDING"} processing. (AI Demo Mode)`;
    }

    else if (
      question.includes("open") ||
      question.includes("time") ||
      question.includes("khulega") ||
      question.includes("samay")
    ) {
      reply =
        language === "hi"
          ? `${centre.name} आज सुबह 08:00 बजे से शाम 06:00 बजे तक खुला है। (AI Demo Mode)`
          : `${centre.name} is open today from 08:00 AM to 06:00 PM. (AI Demo Mode)`;
    }

    else if (
      question.includes("nearest") ||
      question.includes("pass") ||
      question.includes("centre")
    ) {
      reply =
        language === "hi"
          ? `सबसे नज़दीकी केंद्र ${centre.name} है (${centre.distance} दूर)। (AI Demo Mode)`
          : `The nearest procurement centre is ${centre.name} (${centre.distance} away). (AI Demo Mode)`;
    }

    return reply;
  }

  /* -------------------------------------------------------
     OPENAI API
  ------------------------------------------------------- */

  const apiKey = process.env.OPENAI_API_KEY;

  /*
    If OpenAI API key is not configured,
    use the local demo assistant.
  */

  if (!apiKey) {
    console.warn(
      "OPENAI_API_KEY is not set. Using Demo Mode."
    );

    return res.json({
      reply: getDemoReply(
        String(message).toLowerCase()
      )
    });
  }

  try {
    const openai = new OpenAI({
      apiKey
    });

    const systemPrompt = `
You are a helpful and professional Kisan Assistant for the KisanSetu portal in India.

Your job is to answer questions using ONLY the provided Application Data.

Rules:
- Do not invent queue lengths.
- Do not invent wait times.
- Do not invent slot dates.
- Do not invent payment amounts.
- Do not invent farmer information.
- If the required information is unavailable, say:
  "Is samay KisanSetu ke paas is information ka data available nahi hai."
- Reply in ${
      language === "hi"
        ? "Hindi or Hinglish"
        : "English"
    }.
- Keep responses concise and useful.

Application Data:

Farmer Name:
${farmer.name || "Unknown"}

Farmer ID:
${farmer.id || "Unknown"}

Crop:
${farmer.crop || "Unknown"}

Expected Payment:
₹${farmer.expectedValue || "Unknown"}

Payment Status:
${farmer.paymentStatus || "Unknown"}

Slot Date:
${farmer.slotDate || "Unknown"}

Allotted Centre:
${centre.name || "Unknown"}

Centre Distance:
${centre.distance || "Unknown"}

Centre Queue:
${centre.queue || 0} farmers

Estimated Wait:
${waitTime} minutes

Centre Load:
${centre.load || 0}%

Centre Timings:
08:00 AM to 06:00 PM

Current Wheat MSP:
₹2275 per quintal
`.trim();

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: String(message)
          }
        ],

        max_tokens: 150,
        temperature: 0.2
      });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I could not generate a response.";

    return res.json({
      reply
    });

  } catch (error) {
    console.error(
      "OpenAI API Error:",
      error.message
    );

    return res.json({
      reply:
        "AI Assistant is temporarily unavailable. You can still use Queue, Slot, Procurement and Payment services."
    });
  }
});

/* =========================================================
   SERVE FRONTEND
========================================================= */

/*
  The frontend build is expected in:

  project/
    dist/
    server/
      index.js
*/

const frontendPath = path.join(
  __dirname,
  "../dist"
);

app.use(
  express.static(frontendPath)
);

/*
  SPA fallback.

  IMPORTANT:
  This must come AFTER all /api routes.
*/

app.get("*", (req, res) => {
  res.sendFile(
    path.join(frontendPath, "index.html")
  );
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    message: "Internal server error"
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `KisanSetu API running on port ${PORT}`
    );
  }
);