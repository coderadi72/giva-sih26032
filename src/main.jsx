import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  Wheat,
  MapPin,
  Bell,
  WalletCards,
  Clock3,
  Users,
  TrendingUp,
  MessageCircle,
  Star,
  Send,
  Search,
  RefreshCw,
  Navigation,
  CalendarClock,
  CheckCircle2,
  CircleHelp,
  ArrowRight,
  ShieldCheck,
  Newspaper,
  Landmark,
  LogIn,
  Sprout,
  ExternalLink,
  FileText,
  ClipboardCheck,
  Download,
  Phone,
  BadgeCheck,
  Building2,
  Bot,
} from "lucide-react";
import "./styles.css";
import "./responsive.css";
import ProcurementDashboard from "./ProcurementDashboard";

const API = "http://localhost:5000";
const farmerId = "FR-20481";
let activeHindi = false;
const languagePairs = {
  "Procurement Status": "उपार्जन स्थिति",
  "Track registration, allotment, token, weighment and payment in one place.":
    "पंजीयन, केंद्र, टोकन, तौल और भुगतान को एक ही जगह ट्रैक करें.",
  "CURRENT SEASON": "वर्तमान सीजन",
  "Registration verified": "पंजीयन सत्यापित",
  "Procurement journey": "उपार्जन प्रक्रिया",
  "Live status for your current crop": "आपकी वर्तमान फसल की लाइव स्थिति",
  "In progress": "प्रगति पर है",
  "Registration submitted": "पंजीयन जमा किया गया",
  "Centre allotted": "केंद्र आवंटित",
  "Token generated": "टोकन बनाया गया",
  "Procurement & weighment": "उपार्जन और तौल",
  "Payment credited": "भुगतान जमा",
  Completed: "पूरा हुआ",
  "Pending centre visit": "केंद्र पर जाने की प्रतीक्षा",
  "After quality approval": "गुणवत्ता स्वीकृति के बाद",
  "Allotted procurement centre": "आवंटित उपार्जन केंद्र",
  "Based on your registration and location": "आपके पंजीयन और स्थान के आधार पर",
  "Open today: 8:00 AM – 6:00 PM": "आज खुला: सुबह 8:00 – शाम 6:00",
  "Low crowd": "कम भीड़",
  "Download token slip": "टोकन स्लिप डाउनलोड करें",
  "Get route": "रास्ता देखें",
  "Quality & payment": "गुणवत्ता और भुगतान",
  "Transparent status after arrival": "केंद्र पहुंचने के बाद पारदर्शी स्थिति",
  "Expected quantity": "अनुमानित मात्रा",
  "Quality check": "गुणवत्ता जांच",
  "Awaiting weighment": "तौल की प्रतीक्षा",
  "Expected payment": "अनुमानित भुगतान",
  "Payment is initiated after quality approval and credited through DBT.":
    "गुणवत्ता स्वीकृति के बाद भुगतान शुरू होकर DBT से जमा होगा.",
  "Sell Crop": "फसल बेचें",
  "Track your procurement, slot, queue and seller count by crop.":
    "अपनी खरीद, स्लॉट, कतार और किसानों की संख्या ट्रैक करें.",
  "Expected quantity:": "अनुमानित मात्रा:",
  quintals: "क्विंटल",
  Scheduled: "निर्धारित",
  Slot: "स्लॉट",
  Centre: "केंद्र",
  Queue: "कतार",
  farmers: "किसान",
  "Estimated wait": "अनुमानित प्रतीक्षा",
  min: "मिनट",
  "Live queue tracking": "लाइव कतार ट्रैकिंग",
  "refreshing every 10 seconds": "हर 10 सेकंड में अपडेट",
  "Sellers currently waiting by crop": "फसल के अनुसार प्रतीक्षा कर रहे किसान",
  "sellers waiting": "किसान प्रतीक्षा में",
  "Turn on slot alerts": "स्लॉट अलर्ट चालू करें",
  "Check crop prices": "फसल के भाव देखें",
  "Rate centre": "केंद्र को रेट करें",
  "Current Market Prices": "वर्तमान बाजार भाव",
  Notifications: "सूचनाएं",
  "Payment Tracking": "भुगतान ट्रैकिंग",
  "Centre Feedback": "केंद्र फीडबैक",
  "Live mandi status": "लाइव मंडी स्थिति",
  "Current queue and centre load": "वर्तमान कतार और केंद्र का भार",
  "Recommended arrival": "अनुशंसित पहुंच समय",
  "Smart arrival recommendation": "स्मार्ट पहुंच सुझाव",
  "Enable alerts": "अलर्ट चालू करें",
  "Compare centres": "केंद्रों की तुलना करें",
  "Buy fertilizer": "उर्वरक खरीदें",
  "Submit feedback": "फीडबैक जमा करें",
  "How was your selling experience?": "आपका बिक्री अनुभव कैसा रहा?",
  "Write your feedback...": "अपना फीडबैक लिखें...",
  "Payment journey": "भुगतान प्रक्रिया",
  "Registration → Token → Procurement → Quality check → Payment processing → Bank credit.":
    "पंजीयन → टोकन → उपार्जन → गुणवत्ता जांच → भुगतान प्रक्रिया → बैंक खाते में जमा.",
  Fertilizer: "उर्वरक",
  "Search crop or mandi...": "फसल या मंडी खोजें...",
  "Ask Kisan Assistant": "किसान सहायक से पूछें",
};
function translateVisibleText(root, hi) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!node.nodeValue.trim()) continue;
    let value = node.nodeValue;
    Object.entries(languagePairs).forEach(([en, hiText]) => {
      value = hi ? value.split(en).join(hiText) : value.split(hiText).join(en);
    });
    if (value !== node.nodeValue) node.nodeValue = value;
  }
}

const initialPrices = [
  {
    crop: "Wheat",
    mandi: "Sehore",
    min: 2380,
    max: 2640,
    modal: 2510,
    change: "+2.4%",
  },
  {
    crop: "Soybean",
    mandi: "Ashta",
    min: 4250,
    max: 4720,
    modal: 4510,
    change: "+1.1%",
  },
  {
    crop: "Gram",
    mandi: "Bhopal",
    min: 5450,
    max: 5880,
    modal: 5660,
    change: "-0.8%",
  },
  {
    crop: "Paddy",
    mandi: "Vidisha",
    min: 2180,
    max: 2460,
    modal: 2320,
    change: "+0.6%",
  },
  {
    crop: "Maize",
    mandi: "Sehore",
    min: 2050,
    max: 2310,
    modal: 2190,
    change: "+0.9%",
  },
  {
    crop: "Mustard",
    mandi: "Bhopal",
    min: 5450,
    max: 5900,
    modal: 5710,
    change: "-0.4%",
  },
];

const fallbackCentres = [
  {
    id: "C001",
    name: "Sehore Procurement Centre",
    district: "Sehore",
    distance: "3.2 km",
    queue: 32,
    estimatedWaitMinutes: 38,
    load: 64,
    status: "Low",
  },
  {
    id: "C002",
    name: "Ashta Mandi Centre",
    district: "Sehore",
    distance: "7.4 km",
    queue: 74,
    estimatedWaitMinutes: 85,
    load: 81,
    status: "Medium",
  },
  {
    id: "C003",
    name: "Bhopal Rural Centre",
    district: "Bhopal",
    distance: "11.1 km",
    queue: 164,
    estimatedWaitMinutes: 165,
    load: 94,
    status: "High",
  },
];

function AccessibilityControls({ hi }) {
  const [active, setActive] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [reduceMotion, setReduceMotion] = useState(false);

  const [reading, setReading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  const chunksRef = React.useRef([]);
  const chunkIndexRef = React.useRef(0);
  const utteranceRef = React.useRef(null);

  useEffect(() => {
    if (highContrast) document.body.classList.add("high-contrast-mode");
    else document.body.classList.remove("high-contrast-mode");
  }, [highContrast]);

  useEffect(() => {
    if (reduceMotion) document.body.classList.add("reduce-motion");
    else document.body.classList.remove("reduce-motion");
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base-font-size",
      fontSize + "px",
    );
    document.body.style.fontSize = fontSize + "px";
  }, [fontSize]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const getVoice = (langCode) => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang.startsWith(langCode)) ||
      voices.find((v) => v.lang.startsWith(langCode.split("-")[0])) ||
      voices[0]
    );
  };

  const playNextChunk = () => {
    if (chunkIndexRef.current >= chunksRef.current.length) {
      setReading(false);
      setPaused(false);
      return;
    }
    const text = chunksRef.current[chunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(text);

    const targetLang = hi ? "hi-IN" : "en-IN";
    utterance.lang = targetLang;
    const voice = getVoice(targetLang);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      chunkIndexRef.current += 1;
      playNextChunk();
    };
    utterance.onerror = () => {
      setReading(false);
      setPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleReadAloud = () => {
    if (!("speechSynthesis" in window)) {
      setUnsupported(true);
      setTimeout(() => setUnsupported(false), 3000);
      return;
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }

    window.speechSynthesis.cancel();
    chunkIndexRef.current = 0;

    const mainContent = document.getElementById("readable-main-content");
    if (!mainContent) return;

    let rawText = mainContent.innerText || mainContent.textContent;
    rawText = rawText
      .replace(/[\r\n]+/g, ". ")
      .replace(/\s{2,}/g, " ")
      .trim();

    const sentences = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];
    let chunks = [];
    let currentChunk = "";
    for (let s of sentences) {
      if (currentChunk.length + s.length > 200) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = s;
      } else {
        currentChunk += " " + s;
      }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    chunksRef.current = chunks;

    if (chunks.length > 0) {
      setReading(true);
      setPaused(false);
      playNextChunk();
    }
  };

  const handlePauseResume = () => {
    if (!window.speechSynthesis) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const handleStop = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    chunksRef.current = [];
    chunkIndexRef.current = 0;
    setReading(false);
    setPaused(false);
  };

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          background: "#12344D",
          color: "white",
          padding: "12px",
          borderRadius: "50%",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 10000,
        }}
        aria-label={hi ? "एक्सेसिबिलिटी मेनू खोलें" : "Open Accessibility Menu"}
      >
        <span style={{ fontSize: "24px" }} aria-hidden="true">
          👁
        </span>
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        background: "white",
        border: "1px solid #D9E2DC",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        zIndex: 10000,
        minWidth: "250px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <b style={{ color: "#12344D" }}>
          {hi ? "एक्सेसिबिलिटी" : "Accessibility"}
        </b>
        <button
          type="button"
          onClick={() => setActive(false)}
          aria-label={hi ? "मेनू बंद करें" : "Close menu"}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ✖
        </button>
      </div>

      <div style={{ marginBottom: "16px" }}>
        {unsupported && (
          <div
            style={{ color: "#991B1B", fontSize: "12px", marginBottom: "8px" }}
            aria-live="assertive"
          >
            {hi
              ? "इस ब्राउज़र में Read Aloud समर्थित नहीं है।"
              : "Read Aloud is not supported in this browser."}
          </div>
        )}
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          {!reading ? (
            <button
              type="button"
              onClick={handleReadAloud}
              aria-label={hi ? "पृष्ठ पढ़कर सुनाएं" : "Read page aloud"}
              style={{
                flex: 1,
                padding: "8px",
                background: "#176B4C",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🔊 {hi ? "पढ़कर सुनाएं" : "Read Aloud"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handlePauseResume}
                aria-label={
                  paused
                    ? hi
                      ? "पढ़ना जारी रखें"
                      : "Resume reading"
                    : hi
                      ? "पढ़ना रोकें"
                      : "Pause reading"
                }
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "#C96B16",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {paused ? "▶ Resume" : "⏸ Pause"}
              </button>
              <button
                type="button"
                onClick={handleStop}
                aria-label={hi ? "पढ़ना बंद करें" : "Stop reading"}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "#991B1B",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ■ Stop
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <span
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#53645B",
          }}
        >
          {hi ? "टेक्स्ट साइज़" : "Text Size"}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            aria-label={hi ? "टेक्स्ट साइज़ कम करें" : "Decrease text size"}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #D9E2DC",
              background: "#F5F7F5",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            A-
          </button>
          <div
            style={{
              padding: "8px 16px",
              border: "1px solid #D9E2DC",
              borderRadius: "4px",
              background: "white",
            }}
            aria-live="polite"
          >
            {fontSize}px
          </div>
          <button
            type="button"
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            aria-label={hi ? "टेक्स्ट साइज़ बढ़ाएं" : "Increase text size"}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #D9E2DC",
              background: "#F5F7F5",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            A+
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#12344D",
          }}
        >
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            aria-label={hi ? "हाई कंट्रास्ट टॉगल करें" : "Toggle high contrast"}
          />
          {hi ? "हाई कंट्रास्ट (High Contrast)" : "High Contrast Mode"}
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#12344D",
          }}
        >
          <input
            type="checkbox"
            checked={reduceMotion}
            onChange={(e) => setReduceMotion(e.target.checked)}
            aria-label={
              hi ? "एनीमेशन कम करें टॉगल करें" : "Toggle reduce motion"
            }
          />
          {hi ? "एनीमेशन कम करें (Reduce Motion)" : "Reduce Motion"}
        </label>
      </div>
    </div>
  );
}

function AIAssistant({ setToast, hi, farmerId }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: hi
        ? "नमस्ते! मैं आपका किसान सहायक हूँ। आप मुझसे मंडी के भाव, अपनी फसल की जानकारी या सरकारी योजनाओं के बारे में पूछ सकते हैं।"
        : "Hello! I am your Kisan Assistant. Ask me about mandi prices, your crops, or government schemes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestResponse, setLatestResponse] = useState("");

  const sendMessage = async (e, quickMsg = null) => {
    if (e) e.preventDefault();
    const msgToSend = quickMsg || input;
    if (!msgToSend.trim()) return;

    const userMsg = { role: "user", content: msgToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgToSend,
          language: hi ? "hi" : "en",
          farmerId,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      setLatestResponse(data.reply);
    } catch {
      const errReply = hi
        ? "माफ़ करें, अभी सर्वर से संपर्क नहीं हो पा रहा है।"
        : "Sorry, I cannot reach the server right now.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errReply },
      ]);
      setLatestResponse(errReply);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = hi
    ? [
        "मेरी कतार (Queue)",
        "मेरा स्लॉट",
        "केंद्र का समय",
        "मेरा भुगतान",
        "गेहूं का MSP",
        "नज़दीकी केंद्र",
      ]
    : [
        "My Queue",
        "My Slot",
        "Centre Timing",
        "My Payment",
        "MSP",
        "Nearest Centre",
      ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <PageTitle
        title={hi ? "किसान सहायक" : "Kisan Assistant"}
        sub={
          hi
            ? "आर्टिफिशियल इंटेलिजेंस (AI) से जुड़े अपने सवाल पूछें"
            : "Ask your questions to our AI assistant"
        }
      />
      <div
        style={{
          background: "#E8F3EC",
          color: "#176B4C",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Bot size={20} /> <b>AI Powered Prototype</b>
      </div>
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #D9E2DC",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "600px",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          aria-live="polite"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#176B4C" : "#F5F7F5",
                color: m.role === "user" ? "white" : "#12344D",
                padding: "12px 16px",
                borderRadius: "12px",
                maxWidth: "80%",
              }}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "#F5F7F5",
                padding: "12px 16px",
                borderRadius: "12px",
              }}
              aria-label="Loading response"
            >
              ...
            </div>
          )}
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #D9E2DC",
            background: "#FAFAFA",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
          }}
        >
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(null, q)}
              style={{
                whiteSpace: "nowrap",
                padding: "8px 12px",
                background: "white",
                border: "1px solid #D9E2DC",
                borderRadius: "16px",
                color: "#176B4C",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={sendMessage}
          style={{
            padding: "16px",
            borderTop: "1px solid #D9E2DC",
            display: "flex",
            gap: "12px",
            background: "#F5F7F5",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hi ? "अपना सवाल यहाँ लिखें..." : "Type your question here..."
            }
            aria-label={hi ? "प्रश्न पूछें" : "Ask question"}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #D9E2DC",
            }}
          />
          <button
            type="submit"
            aria-label="Send"
            style={{
              background: "#176B4C",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <Send size={18} />
          </button>
          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  content: hi ? "नया सेशन। पूछें!" : "New session. Ask!",
                },
              ])
            }
            aria-label="Clear Chat"
            style={{
              background: "transparent",
              color: "#991B1B",
              border: "1px solid #991B1B",
              padding: "12px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </form>
      </div>
      <div
        className="sr-only"
        aria-live="assertive"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {latestResponse}
      </div>
    </div>
  );
}

function Fertilizer({ hi }) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <PageTitle
        title={hi ? "उर्वरक एवं बीज" : "Fertilizer & Seeds"}
        sub={
          hi
            ? "सरकारी रेट पर खाद की उपलब्धता जांचें"
            : "Check fertilizer availability at government rates"
        }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #D9E2DC",
          }}
        >
          <h3 style={{ color: "#12344D", marginBottom: "8px" }}>
            Urea (यूरिया)
          </h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#176B4C",
              margin: "0 0 16px 0",
            }}
          >
            ₹266.50{" "}
            <small
              style={{
                fontSize: "14px",
                color: "#53645B",
                fontWeight: "normal",
              }}
            >
              / 45kg bag
            </small>
          </p>
          <div
            style={{
              background: "#E8F3EC",
              padding: "8px 12px",
              borderRadius: "4px",
              color: "#176B4C",
              fontSize: "14px",
            }}
          >
            <b>145 bags</b> available at Sehore Society
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #D9E2DC",
          }}
        >
          <h3 style={{ color: "#12344D", marginBottom: "8px" }}>
            DAP (डी.ए.पी)
          </h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#176B4C",
              margin: "0 0 16px 0",
            }}
          >
            ₹1,350.00{" "}
            <small
              style={{
                fontSize: "14px",
                color: "#53645B",
                fontWeight: "normal",
              }}
            >
              / 50kg bag
            </small>
          </p>
          <div
            style={{
              background: "#FFF0E2",
              padding: "8px 12px",
              borderRadius: "4px",
              color: "#C96B16",
              fontSize: "14px",
            }}
          >
            <b>Low stock (12 bags)</b> at Sehore Society
          </div>
        </div>
      </div>
    </div>
  );
}

function FarmerPortalHome({ farmer, centres, setPage, hi }) {
  const c = centres[0];
  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #176B4C 0%, #12344D 100%)",
          color: "white",
          padding: "32px",
          borderRadius: "12px",
          marginBottom: "32px",
          boxShadow: "0 8px 24px rgba(23,107,76,0.2)",
        }}
      >
        <h2 style={{ margin: "0 0 8px", fontSize: "28px" }}>
          {hi ? "नमस्ते, रमेश पटेल" : "WELCOME, Ramesh Patel"}
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            marginTop: "16px",
          }}
        >
          <div>
            <small
              style={{
                color: "#E8F3EC",
                display: "block",
                marginBottom: "4px",
              }}
            >
              {hi ? "किसान आईडी" : "Farmer ID"}
            </small>
            <b>FR-20481</b>
          </div>
          <div>
            <small
              style={{
                color: "#E8F3EC",
                display: "block",
                marginBottom: "4px",
              }}
            >
              {hi ? "फसल" : "Crop"}
            </small>
            <b>{farmer?.crop || "Wheat"}</b>
          </div>
          <div>
            <small
              style={{
                color: "#E8F3EC",
                display: "block",
                marginBottom: "4px",
              }}
            >
              {hi ? "सीजन" : "Season"}
            </small>
            <b>Rabi 2026–27</b>
          </div>
          <div>
            <small
              style={{
                color: "#E8F3EC",
                display: "block",
                marginBottom: "4px",
              }}
            >
              {hi ? "ज़िला" : "District"}
            </small>
            <b>Bhopal</b>
          </div>
        </div>
      </div>

      <h3
        style={{
          color: "#12344D",
          marginBottom: "16px",
          fontSize: "20px",
          borderBottom: "2px solid #D9E2DC",
          paddingBottom: "8px",
        }}
      >
        {hi ? "किसान सेवाएं" : "Farmer Services"}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "24px",
        }}
      >
        <div
          onClick={() => setPage("status")}
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #D9E2DC",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              background: "#E8F3EC",
              color: "#176B4C",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <ClipboardCheck size={24} />
          </div>
          <div>
            <b
              style={{
                display: "block",
                color: "#12344D",
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {hi ? "उपार्जन स्थिति" : "Procurement Status"}
            </b>
            <small style={{ color: "#53645B" }}>Track your journey</small>
          </div>
        </div>

        <div
          onClick={() => setPage("sell")}
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #D9E2DC",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              background: "#FFF0E2",
              color: "#C96B16",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <CalendarClock size={24} />
          </div>
          <div>
            <b
              style={{
                display: "block",
                color: "#12344D",
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {hi ? "मेरा स्लॉट" : "My Slot"}
            </b>
            <small style={{ color: "#53645B" }}>View booking</small>
          </div>
        </div>

        <div
          onClick={() => setPage("prices")}
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #D9E2DC",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              background: "#E9F0FA",
              color: "#255EA8",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div>
            <b
              style={{
                display: "block",
                color: "#12344D",
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {hi ? "MSP मूल्य" : "MSP Price"}
            </b>
            <small style={{ color: "#53645B" }}>Check mandi rates</small>
          </div>
        </div>

        <div
          onClick={() => setPage("centres")}
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #D9E2DC",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              background: "#F5F7F5",
              color: "#53645B",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <b
              style={{
                display: "block",
                color: "#12344D",
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {hi ? "केंद्र भीड़ स्थिति" : "Centre Crowd View"}
            </b>
            <small style={{ color: "#53645B" }}>Live queue</small>
          </div>
        </div>

        <div
          onClick={() => setPage("payment")}
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #D9E2DC",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              background: "#E8F3EC",
              color: "#176B4C",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <WalletCards size={24} />
          </div>
          <div>
            <b
              style={{
                display: "block",
                color: "#12344D",
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {hi ? "भुगतान" : "Payment"}
            </b>
            <small style={{ color: "#53645B" }}>DBT status</small>
          </div>
        </div>

        <div
          onClick={() => setPage("notifications")}
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #D9E2DC",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              background: "#FFF0E2",
              color: "#C96B16",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <Bell size={24} />
          </div>
          <div>
            <b
              style={{
                display: "block",
                color: "#12344D",
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {hi ? "सूचनाएं" : "Notifications"}
            </b>
            <small style={{ color: "#53645B" }}>Alerts & updates</small>
          </div>
        </div>

        <div
          onClick={() => setPage("fertilizer")}
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #D9E2DC",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              background: "#E9F0FA",
              color: "#255EA8",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <Sprout size={24} />
          </div>
          <div>
            <b
              style={{
                display: "block",
                color: "#12344D",
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {hi ? "उर्वरक (Fertilizer)" : "Fertilizer"}
            </b>
            <small style={{ color: "#53645B" }}>Stock info</small>
          </div>
        </div>

        <div
          onClick={() => setPage("assistant")}
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #D9E2DC",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "transform 0.2s",
          }}
        >
          <div
            style={{
              background: "#F5F7F5",
              color: "#53645B",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <Bot size={24} />
          </div>
          <div>
            <b
              style={{
                display: "block",
                color: "#12344D",
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {hi ? "किसान सहायक" : "Kisan Assistant"}
            </b>
            <small style={{ color: "#53645B" }}>AI help</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntroV2({ onNext, hi, setLang }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #176B4C 0%, #12344D 100%)",
        color: "white",
        padding: "48px",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px" }}
      >
        JIVA Portal
      </div>
      <p style={{ fontSize: "20px", marginBottom: "48px", opacity: 0.9 }}>
        {hi
          ? "आप सेवा को कहाँ एक्सेस करना चाहते हैं?"
          : "Where do you want to access the service?"}
      </p>
      <div style={{ display: "flex", gap: "24px" }}>
        <button
          onClick={onNext}
          style={{
            background: "white",
            color: "#176B4C",
            padding: "16px 32px",
            borderRadius: "8px",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {hi ? "वेब पोर्टल (Web Portal)" : "Web Portal"}
        </button>
        <button
          onClick={() =>
            alert(hi ? "ऐप स्टोर जल्द आ रहा है!" : "App store coming soon!")
          }
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "white",
            padding: "16px 32px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.3)",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {hi ? "मोबाइल ऐप (Mobile App)" : "Mobile App"}
        </button>
      </div>
    </div>
  );
}

function LanguageSelection({ onSelect, lang, setLang, hi }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F5F7F5",
        color: "#12344D",
        padding: "48px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
        {hi ? "अपनी भाषा चुनें" : "Select your language"}
      </h1>
      <p style={{ fontSize: "18px", color: "#53645B", marginBottom: "48px" }}>
        Choose your preferred language to continue
      </p>
      <div style={{ display: "flex", gap: "24px" }}>
        <button
          onClick={() => {
            setLang("HI");
            onSelect();
          }}
          style={{
            padding: "24px 48px",
            fontSize: "24px",
            borderRadius: "12px",
            border: lang === "HI" ? "2px solid #176B4C" : "1px solid #D9E2DC",
            background: "white",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <b>हिंदी</b>
          <span>Hindi</span>
        </button>
        <button
          onClick={() => {
            setLang("EN");
            onSelect();
          }}
          style={{
            padding: "24px 48px",
            fontSize: "24px",
            borderRadius: "12px",
            border: lang === "EN" ? "2px solid #176B4C" : "1px solid #D9E2DC",
            background: "white",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <b>English</b>
          <span>English</span>
        </button>
      </div>
    </div>
  );
}

function RoleSelection({ onSelect, hi }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F5F7F5",
        color: "#12344D",
        padding: "48px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "48px" }}>
        {hi ? "आपकी भूमिका क्या है?" : "What is your role?"}
      </h1>
      <div
        style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => onSelect("farmer")}
          style={{
            padding: "32px",
            borderRadius: "12px",
            border: "1px solid #D9E2DC",
            background: "white",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            minWidth: "250px",
          }}
        >
          <div style={{ fontSize: "48px" }}>🌾</div>
          <b style={{ fontSize: "20px" }}>{hi ? "किसान (Farmer)" : "Farmer"}</b>
          <span style={{ color: "#53645B", fontSize: "14px" }}>
            {hi ? "पंजीयन और फसल बिक्री" : "Registration and crop selling"}
          </span>
        </button>
        <button
          onClick={() => onSelect("admin")}
          style={{
            padding: "32px",
            borderRadius: "12px",
            border: "1px solid #D9E2DC",
            background: "white",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            minWidth: "250px",
          }}
        >
          <div style={{ fontSize: "48px" }}>🏢</div>
          <b style={{ fontSize: "20px" }}>
            {hi ? "केंद्र अधिकारी (Centre Admin)" : "Centre Admin"}
          </b>
          <span style={{ color: "#53645B", fontSize: "14px" }}>
            {hi ? "उपार्जन प्रबंधन" : "Procurement management"}
          </span>
        </button>
      </div>
    </div>
  );
}

function HomePage({ lang, setLang, onLogin, onDirectLogin, onAdminLogin }) {
  const hi = lang === "HI";

  const Header = () => (
    <header
      className="public-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 32px",
        background: "white",
        borderBottom: "1px solid #D9E2DC",
        alignItems: "center",
      }}
    >
      <div
        className="logo"
        style={{ color: "#176B4C", fontWeight: "bold", fontSize: "20px" }}
      >
        JIVA Portal
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "#53645B",
          background: "#F5F7F5",
          padding: "4px 12px",
          borderRadius: "16px",
        }}
      >
        Team JIVA • Prototype
      </div>
    </header>
  );

  const Footer = () => (
    <footer
      className="nic-footer"
      style={{
        background: "#12344D",
        color: "white",
        padding: "24px 32px",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <b style={{ display: "block", marginBottom: "8px" }}>JIVA KISAN SEVA</b>
      <span style={{ fontSize: "12px", opacity: 0.8 }}>
        {hi
          ? "किसानों के लिए सुरक्षित और पारदर्शी डिजिटल सेवाएं"
          : "Secure and transparent digital services for farmers"}
      </span>
    </footer>
  );

  return (
    <div
      className="public-wizard"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F5F7F5",
      }}
    >
      <Header />
      <div
        className="wizard-content"
        style={{
          flex: 1,
          padding: "48px 32px",
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          className="demo-badge"
          style={{
            display: "inline-block",
            background: "#FFF0E2",
            color: "#C96B16",
            padding: "8px 16px",
            borderRadius: "24px",
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          A Prototype by Team JIVA
        </div>
        <h1
          className="main-title"
          style={{ color: "#12344D", fontSize: "36px", marginBottom: "16px" }}
        >
          {hi
            ? "स्मार्ट किसान उपार्जन एवं MSP सहायता पोर्टल"
            : "SMART FARMER PROCUREMENT & MSP ASSISTANCE PORTAL"}
        </h1>
        <p
          className="subtitle"
          style={{ color: "#176B4C", fontSize: "16px", marginBottom: "32px" }}
        >
          {hi
            ? "सरल पंजीयन • पारदर्शी उपार्जन • लाइव स्थिति • तेज जानकारी"
            : "Simple Registration • Transparent Procurement • Live Status • Faster Information"}
        </p>
        <button
          className="primary"
          style={{
            padding: "16px 32px",
            fontSize: "18px",
            marginBottom: "48px",
          }}
          onClick={onLogin}
        >
          {hi ? "शुरू करें" : "START"} <ArrowRight size={18} />
        </button>

        <div
          className="wizard-grid three"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "24px",
            marginBottom: "48px",
            textAlign: "left",
          }}
        >
          <div
            className="leader-card-v2"
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid #D9E2DC",
            }}
          >
            <h3 style={{ color: "#12344D", marginBottom: "8px" }}>
              Shri Narendra Modi
            </h3>
            <p style={{ fontSize: "12px", color: "#53645B" }}>
              {hi
                ? "माननीय प्रधानमंत्री, भारत"
                : "Hon'ble Prime Minister of India"}
            </p>
          </div>
          <div
            className="leader-card-v2"
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid #D9E2DC",
            }}
          >
            <h3 style={{ color: "#12344D", marginBottom: "8px" }}>
              Dr. Mohan Yadav
            </h3>
            <p style={{ fontSize: "12px", color: "#53645B" }}>
              {hi
                ? "माननीय मुख्यमंत्री, म.प्र."
                : "Hon'ble Chief Minister of M.P."}
            </p>
          </div>
          <div
            className="leader-card-v2"
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid #D9E2DC",
            }}
          >
            <h3 style={{ color: "#12344D", marginBottom: "8px" }}>
              Shri Govind Singh Rajput
            </h3>
            <p style={{ fontSize: "12px", color: "#53645B" }}>
              {hi
                ? "खाद्य एवं नागरिक आपूर्ति मंत्री"
                : "Minister of Food & Civil Supplies"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function LoginPage({
  onLogin,
  onHome,
  lang,
  setLang,
  initialMode = "login",
}) {
  const hi = lang === "HI";
  const [method, setMethod] = useState("aadhaar"); // aadhaar, kisan_card, otp
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!inputValue) {
      setError(hi ? "कृपया विवरण दर्ज करें।" : "Please enter details.");
      return;
    }
    onLogin();
  };

  return (
    <div style={{minHeight: '100vh', background: '#F5F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}}>
      <div style={{maxWidth: '480px', width: '100%', background: 'white', borderRadius: '8px', border: '1px solid #D9E2DC', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
         
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <button onClick={onHome} style={{background: 'transparent', border: 'none', color: '#53645B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'}}>
               ← {hi ? "होम" : "Home"}
            </button>
            <button
               type="button"
               onClick={() => setLang(hi ? "EN" : "HI")}
               style={{
                  background: "none",
                  border: "1px solid #D9E2DC",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  cursor: "pointer",
               }}
            >
               {hi ? "English" : "हिंदी"}
            </button>
         </div>

         <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <div style={{display: 'inline-block', width: '48px', height: '48px', background: '#E8F3EC', borderRadius: '50%', color: '#176B4C', lineHeight: '48px', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>
               ✦
            </div>
            <h2 style={{margin: '0 0 8px 0', color: '#12344D', fontSize: '24px'}}>
               {hi ? "किसान ई-उपार्जन पोर्टल" : "Kisan e-Uparjan Portal"}
            </h2>
            <p style={{margin: 0, color: '#53645B', fontSize: '14px'}}>
               {hi ? "भारत सरकार • कृषि विभाग" : "Government of India • Department of Agriculture"}
            </p>
         </div>

         <div style={{display: 'flex', gap: '8px', marginBottom: '24px', background: '#F5F7F5', padding: '4px', borderRadius: '8px'}}>
            <button 
              onClick={() => setMethod('aadhaar')}
              style={{flex: 1, padding: '8px', border: 'none', borderRadius: '4px', background: method === 'aadhaar' ? 'white' : 'transparent', color: method === 'aadhaar' ? '#12344D' : '#53645B', fontWeight: method === 'aadhaar' ? 'bold' : 'normal', boxShadow: method === 'aadhaar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}
            >
              {hi ? "आधार e-KYC" : "Aadhaar e-KYC"}
            </button>
            <button 
              onClick={() => setMethod('kisan_card')}
              style={{flex: 1, padding: '8px', border: 'none', borderRadius: '4px', background: method === 'kisan_card' ? 'white' : 'transparent', color: method === 'kisan_card' ? '#12344D' : '#53645B', fontWeight: method === 'kisan_card' ? 'bold' : 'normal', boxShadow: method === 'kisan_card' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}
            >
              {hi ? "किसान कार्ड" : "Kisan Card"}
            </button>
            <button 
              onClick={() => setMethod('otp')}
              style={{flex: 1, padding: '8px', border: 'none', borderRadius: '4px', background: method === 'otp' ? 'white' : 'transparent', color: method === 'otp' ? '#12344D' : '#53645B', fontWeight: method === 'otp' ? 'bold' : 'normal', boxShadow: method === 'otp' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}
            >
              {hi ? "मोबाइल OTP" : "Mobile OTP"}
            </button>
         </div>

         <form onSubmit={submit}>
            {error && <div style={{background: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px'}}>{error}</div>}
            
            <div style={{marginBottom: '24px'}}>
               <label style={{display: 'block', marginBottom: '8px', color: '#12344D', fontSize: '14px', fontWeight: 'bold'}}>
                  {method === 'aadhaar' && (hi ? "आधार नंबर दर्ज करें" : "Enter Aadhaar Number")}
                  {method === 'kisan_card' && (hi ? "किसान कार्ड नंबर (या NFC स्कैन करें)" : "Kisan Card Number (or Scan NFC)")}
                  {method === 'otp' && (hi ? "पंजीकृत मोबाइल नंबर" : "Registered Mobile Number")}
               </label>
               <input
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 style={{width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #D9E2DC', fontSize: '16px'}}
                 placeholder={method === 'aadhaar' ? "XXXX XXXX XXXX" : method === 'kisan_card' ? "KCC-XXXXXXX" : "10-digit mobile number"}
               />
            </div>

            <button type="submit" style={{width: '100%', padding: '14px', background: '#176B4C', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}}>
               <ShieldCheck size={18}/>
               {method === 'aadhaar' && (hi ? "e-KYC सत्यापित करें" : "Verify e-KYC")}
               {method === 'kisan_card' && (hi ? "लॉगिन करें" : "Login")}
               {method === 'otp' && (hi ? "OTP भेजें" : "Send OTP")}
            </button>
         </form>

         <div style={{textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#53645B'}}>
            <ShieldCheck size={12} style={{verticalAlign: 'middle', marginRight: '4px'}}/>
            {hi ? "सुरक्षित सरकारी नेटवर्क" : "Secure Government Network"}
         </div>
      </div>
    </div>
  );
}

function Navbar({ lang, setLang, setPage, hi }) {
  const nav = [
    ["dashboard", "Dashboard", Home],
    ["status", "Procurement Status", ClipboardCheck],
    ["sell", "Sell Crop", Wheat],
    ["centres", "Mandi & Centres", MapPin],
    ["prices", "Market Prices", TrendingUp],
    ["assistant", "AI Help Agent", Bot],
    ["notifications", "Notifications", Bell],
    ["payment", "Payment", WalletCards],
    ["feedback", "Feedback", Star],
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "70px",
        background: "white",
        borderBottom: "1px solid #D9E2DC",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div
          style={{
            color: "#176B4C",
            fontWeight: "bold",
            fontSize: "24px",
            cursor: "pointer",
          }}
          onClick={() => setPage("dashboard")}
        >
          JIVA
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            maxWidth: "60vw",
            scrollbarWidth: "none",
          }}
        >
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                background: "none",
                border: "none",
                color: "#53645B",
                cursor: "pointer",
                whiteSpace: "nowrap",
                borderRadius: "8px",
                transition: "background 0.2s",
              }}
            >
              <Icon size={18} />
              <span>{hi ? hiLabel(label) : label}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
          style={{
            padding: "6px 12px",
            borderRadius: "16px",
            border: "1px solid #D9E2DC",
            background: "white",
            cursor: "pointer",
          }}
        >
          {lang === "EN" ? "हिंदी" : "EN"}
        </button>
        <button
          onClick={() => setPage("home")}
          style={{
            padding: "6px 16px",
            background: "#FEE2E2",
            color: "#991B1B",
            border: "none",
            borderRadius: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [lang, setLang] = useState(
    () => localStorage.getItem("giva-language") || "EN",
  );
  const [page, setPage] = useState("intro");

  activeHindi = lang === "HI";
  useEffect(() => {
    localStorage.setItem("giva-language", lang);
  }, [lang]);
  useEffect(() => {
    let busy = false;
    const apply = () => {
      if (busy) return;
      busy = true;
      translateVisibleText(document.body, lang === "HI");
      busy = false;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [lang, page]);

  const [farmer, setFarmer] = useState(null);
  const [centres, setCentres] = useState(fallbackCentres);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState("");

  const loadData = async () => {
    try {
      const [f, c, n] = await Promise.all([
        fetch(`${API}/api/farmers/${farmerId}`)
          .then((r) => r.json())
          .catch(() => null),
        fetch(`${API}/api/centres`)
          .then((r) => r.json())
          .catch(() => null),
        fetch(`${API}/api/notifications/${farmerId}`)
          .then((r) => r.json())
          .catch(() => null),
      ]);
      if (f) setFarmer(f);
      if (c) setCentres(c);
      if (n) setNotifications(n);
    } catch {
      setToast(
        "Demo mode: backend connect nahi hai. Live values simulated hain.",
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (page !== "dashboard" && page !== "sell" && page !== "centres") return;
    const timer = setInterval(async () => {
      try {
        const c = await fetch(`${API}/api/centres`).then((r) => r.json());
        if (c) setCentres(c);
      } catch {}
    }, 10000);
    return () => clearInterval(timer);
  }, [page]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Guard against missing components
  const SafeComponent = ({ children }) => {
    try {
      return children;
    } catch (err) {
      return (
        <div style={{ padding: "24px", color: "red" }}>
          Error loading component: {err.message}
        </div>
      );
    }
  };

  const contentRoutes = {
    dashboard: (
      <SafeComponent>
        <FarmerPortalHome
          farmer={farmer}
          centres={centres}
          setPage={setPage}
          hi={lang === "HI"}
        />
      </SafeComponent>
    ),
    status: (
      <SafeComponent>
        <ProcurementStatus
          farmer={farmer}
          setToast={setToast}
          hi={lang === "HI"}
        />
      </SafeComponent>
    ),
    sell: (
      <SafeComponent>
        <SellCrop
          farmer={farmer}
          centres={centres}
          setToast={setToast}
          hi={lang === "HI"}
        />
      </SafeComponent>
    ),
    centres: (
      <SafeComponent>
        <Centres centres={centres} setToast={setToast} hi={lang === "HI"} />
      </SafeComponent>
    ),
    prices: (
      <SafeComponent>
        <Prices hi={lang === "HI"} />
      </SafeComponent>
    ),
    assistant: (
      <SafeComponent>
        <AIAssistant
          setToast={setToast}
          hi={lang === "HI"}
          farmerId={farmerId}
        />
      </SafeComponent>
    ),
    notifications: (
      <SafeComponent>
        <Notifications notifications={notifications} hi={lang === "HI"} />
      </SafeComponent>
    ),
    payment: (
      <SafeComponent>
        <Payment farmer={farmer} hi={lang === "HI"} />
      </SafeComponent>
    ),
    feedback: (
      <SafeComponent>
        <Feedback setToast={setToast} hi={lang === "HI"} />
      </SafeComponent>
    ),
    fertilizer: (
      <SafeComponent>
        <Fertilizer hi={lang === "HI"} />
      </SafeComponent>
    ),
    "admin-dashboard": (
      <SafeComponent>
        <ProcurementDashboard hi={lang === "HI"} />
      </SafeComponent>
    ),
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F7F5",
        fontFamily: '"Inter",sans-serif',
      }}
    >
      <AccessibilityControls hi={lang === "HI"} />

      {page !== "intro" &&
        page !== "home" &&
        page !== "role" &&
        page !== "lang" &&
        page !== "login" &&
        page !== "register" && (
          <Navbar
            lang={lang}
            setLang={setLang}
            setPage={setPage}
            hi={lang === "HI"}
          />
        )}

      <div
        style={{
          paddingTop:
            page !== "intro" &&
            page !== "home" &&
            page !== "role" &&
            page !== "lang" &&
            page !== "login" &&
            page !== "register"
              ? "80px"
              : "0",
        }}
      >
        {page === "intro" && (
          <IntroV2
            onNext={() => setPage("home")}
            hi={lang === "HI"}
            setLang={setLang}
          />
        )}
        {page === "home" && (
          <HomePage
            onLogin={() => {
              setPage("lang");
            }}
            hi={lang === "HI"}
          />
        )}
        {page === "lang" && (
          <LanguageSelection
            onSelect={() => setPage("role")}
            lang={lang}
            setLang={setLang}
            hi={lang === "HI"}
          />
        )}
        {page === "role" && (
          <RoleSelection
            onSelect={(role) => {
              if (role === "farmer") setPage("login");
              else setPage("admin-dashboard");
            }}
            hi={lang === "HI"}
          />
        )}

        {page === "login" && (
          <LoginPage
            initialMode="login"
            lang={lang}
            setLang={setLang}
            onLogin={() => {
              setPage("dashboard");
              setToast("Welcome back to Giva.");
            }}
            onHome={() => setPage("home")}
          />
        )}
        {page === "register" && (
          <LoginPage
            initialMode="register"
            lang={lang}
            setLang={setLang}
            onLogin={() => {
              setPage("dashboard");
              setToast("Welcome back to Giva.");
            }}
            onHome={() => setPage("home")}
          />
        )}

        <div id="readable-main-content">{contentRoutes[page]}</div>
      </div>

      {toast && (
        <div
          className="toast"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#12344D",
            color: "white",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
function LoginGuide({ hi }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const steps = hi
    ? [
        [
          "01",
          "मोबाइल नंबर दर्ज करें",
          "पंजीकृत 10 अंकों का मोबाइल नंबर डालें।",
        ],
        [
          "02",
          "पासवर्ड डालें",
          "अपना सुरक्षित पासवर्ड लिखें और जरूरत हो तो ‘मुझे याद रखें’ चुनें।",
        ],
        [
          "03",
          "किसान पंजीयन",
          "पहली बार उपयोग करने वाले किसान ‘किसान पंजीयन’ से अपना profile बनाएं।",
        ],
        [
          "04",
          "पोर्टल में लॉगिन",
          "सारी जानकारी भरकर ‘पोर्टल में लॉगिन’ पर क्लिक करें।",
        ],
      ]
    : [
        [
          "01",
          "Enter mobile number",
          "Type your registered 10-digit mobile number.",
        ],
        [
          "02",
          "Enter password",
          "Write your password and choose Remember me if needed.",
        ],
        [
          "03",
          "New farmer registration",
          "First-time farmers can create a profile using Register as farmer.",
        ],
        [
          "04",
          "Login to portal",
          "Check your details and click Login to portal.",
        ],
      ];
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () => setStep((v) => (v + 1) % steps.length),
      4200,
    );
    return () => clearInterval(timer);
  }, [playing, steps.length]);
  const current = steps[step];
  return (
    <div className="login-guide">
      <button
        className="login-guide-button"
        onClick={() => {
          setOpen(true);
          setPlaying(true);
        }}
      >
        ▶ <span>{hi ? "लॉगिन वीडियो सहायता" : "Login help video"}</span>
      </button>
      {open && (
        <div
          className="guide-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={hi ? "लॉगिन वीडियो सहायता" : "Login help video"}
        >
          <div className="guide-modal">
            <button
              className="guide-close"
              onClick={() => {
                setOpen(false);
                setPlaying(false);
              }}
            >
              ×
            </button>
            <div className="guide-video-screen">
              <div className="guide-play">{playing ? "▶" : "Ⅱ"}</div>
              <span>{hi ? "Giva किसान पोर्टल" : "Giva Farmer Portal"}</span>
              <b>{current[0]} / 04</b>
              <div className="guide-progress">
                <i
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                ></i>
              </div>
            </div>
            <div className="guide-content">
              <span className="eyebrow">
                {hi ? "वीडियो मार्गदर्शन" : "VIDEO GUIDE"}
              </span>
              <h2>{hi ? "Login कैसे करें?" : "How to login?"}</h2>
              <p>
                {hi
                  ? "इस छोटे tutorial में login और किसान पंजीयन की पूरी प्रक्रिया समझें।"
                  : "Watch this quick tutorial to understand login and farmer registration."}
              </p>
              <div className="guide-step">
                <strong>{current[0]}</strong>
                <div>
                  <b>{current[1]}</b>
                  <small>{current[2]}</small>
                </div>
              </div>
              <div className="guide-controls">
                <button
                  className="outline"
                  onClick={() => setPlaying(!playing)}
                >
                  {playing ? (hi ? "रोकें" : "Pause") : hi ? "चलाएं" : "Play"}
                </button>
                <div>
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      className={i === step ? "guide-dot active" : "guide-dot"}
                      onClick={() => {
                        setStep(i);
                        setPlaying(false);
                      }}
                      aria-label={`Step ${i + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FarmerRegistrationPortal({ hi, setMode, onCentre }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    aadhaar: "",
    bank: "",
    khasra: "",
    district: "Sehore",
    tehsil: "",
  });
  const [error, setError] = useState("");
  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = (e) => {
    e.preventDefault();
    if (
      !form.name ||
      form.mobile.length !== 10 ||
      form.aadhaar.length !== 12 ||
      !form.bank ||
      !form.khasra
    ) {
      setError(
        hi
          ? "कृपया नाम, mobile, Aadhaar, bank और Khasra details भरें।"
          : "Please complete name, mobile, Aadhaar, bank and Khasra details.",
      );
      return;
    }
    setError("");
    alert(
      hi
        ? "किसान registration demo में सफल रहा। Documents verification के बाद login ID भेजी जाएगी।"
        : "Farmer registration completed in demo. Login ID will be sent after document verification.",
    );
    setMode("login");
  };
  return (
    <div className="farmer-registration-page">
      <header className="centre-portal-header">
        <div>
          <b>Giva</b>
          <span>
            {hi
              ? "ई‑उपार्जन Farmer Registration Portal"
              : "E‑Procurement Farmer Registration Portal"}
          </span>
        </div>
        <button onClick={() => setMode("login")}>
          {hi ? "लॉगिन" : "Login"}
        </button>
      </header>
      <main className="farmer-registration-card">
        <div className="portal-flash">
          <strong>{hi ? "जरूरी सूचना" : "Required notice"}</strong>
          <p>
            {hi
              ? "Registration के लिए Aadhaar KYC, bank details और जमीन/फसल से जुड़े documents तैयार रखें।"
              : "Keep Aadhaar KYC, bank details and land/crop documents ready for registration."}
          </p>
          <div className="institution-links">
            <span>{hi ? "सहायता संस्थान" : "Help institutions"}</span>
            <b>MP Online</b>
            <b>CSC / Common Service Centre</b>
            <b>Cyber Cafe</b>
            <b>Gram Panchayat</b>
            <b>Janpat Panchayat</b>
            <b>Tehsil Office</b>
          </div>
        </div>
        <div className="portal-section-title">
          {hi ? "नया किसान पंजीयन" : "New farmer registration"}
        </div>
        <div className="registration-role-tabs">
          <button type="button" className="active">
            🌾 {hi ? "किसान" : "Farmer"}
          </button>
          <button type="button" onClick={onCentre}>
            🏢 {hi ? "Centre / Admin" : "Centre / Admin"}
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="portal-grid three">
            <label>
              {hi ? "किसान का नाम" : "Farmer name"}
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder={hi ? "पूरा नाम" : "Full name"}
              />
            </label>
            <label>
              {hi ? "मोबाइल नंबर" : "Mobile number"}
              <input
                value={form.mobile}
                onChange={(e) =>
                  update(
                    "mobile",
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                inputMode="numeric"
                placeholder="10 digit mobile"
              />
            </label>
            <label>
              {hi ? "जिला" : "Select District"}
              <select
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
              >
                <option>Sehore</option>
                <option>Bhopal</option>
                <option>Vidisha</option>
              </select>
            </label>
            <label>
              {hi ? "तहसील" : "Select Tehsil"}
              <select
                value={form.tehsil}
                onChange={(e) => update("tehsil", e.target.value)}
              >
                <option>--Choose--</option>
                <option>Sehore</option>
                <option>Ashta</option>
              </select>
            </label>
            <label>
              {hi ? "Aadhaar नंबर" : "Aadhaar number"}
              <input
                value={form.aadhaar}
                onChange={(e) =>
                  update(
                    "aadhaar",
                    e.target.value.replace(/\D/g, "").slice(0, 12),
                  )
                }
                inputMode="numeric"
                placeholder="12 digit Aadhaar"
              />
            </label>
            <label>
              {hi ? "Bank account नंबर" : "Bank account number"}
              <input
                value={form.bank}
                onChange={(e) =>
                  update("bank", e.target.value.replace(/\D/g, "").slice(0, 18))
                }
                inputMode="numeric"
                placeholder={hi ? "Bank account number" : "Account number"}
              />
            </label>
            <label>
              {hi ? "खसरा / survey नंबर" : "Khasra / survey number"}
              <input
                value={form.khasra}
                onChange={(e) => update("khasra", e.target.value)}
                placeholder={hi ? "खसरा नंबर" : "Khasra number"}
              />
            </label>
            <label>
              {hi ? "फसल" : "Crop"}
              <select>
                <option>Wheat</option>
                <option>Paddy</option>
                <option>Soybean</option>
                <option>Gram</option>
              </select>
            </label>
            <label>
              {hi ? "सीजन" : "Season"}
              <select>
                <option>Rabi 2026-27</option>
                <option>Kharif 2026</option>
              </select>
            </label>
          </div>
          <div className="document-section">
            <div className="portal-section-title">
              {hi ? "जरूरी documents upload करें" : "Upload required documents"}
            </div>
            <div className="document-grid">
              <label>
                {hi ? "Aadhaar card" : "Aadhaar card"}
                <input type="file" accept="image/*,.pdf" />
              </label>
              <label>
                {hi
                  ? "Bank passbook / cancelled cheque"
                  : "Bank passbook / cancelled cheque"}
                <input type="file" accept="image/*,.pdf" />
              </label>
              <label>
                {hi ? "Khasra / land record" : "Khasra / land record"}
                <input type="file" accept="image/*,.pdf" />
              </label>
              <label>
                {hi ? "सहमति / अन्य document" : "Consent / other document"}
                <input type="file" accept="image/*,.pdf" />
              </label>
            </div>
          </div>
          <label className="kyc-consent">
            <input type="checkbox" />{" "}
            {hi
              ? "मैं Aadhaar KYC, document verification और DBT payment के लिए सहमत हूँ।"
              : "I consent to Aadhaar KYC, document verification and DBT payment."}
          </label>
          {error && <div className="form-error">{error}</div>}
          <div className="portal-actions">
            <button type="button" onClick={() => setMode("login")}>
              {hi ? "बाद में करें" : "Cancel"}
            </button>
            <button type="submit">
              {hi ? "सुरक्षित पंजीयन करें" : "Secure registration"}
            </button>
          </div>
        </form>
        <p className="document-footnote">
          {hi
            ? "Documents केवल authorized verification के लिए उपयोग होंगे।"
            : "Documents are used only for authorized verification."}
        </p>
      </main>
      <footer className="nic-footer">
        <b>
          GIVA
          <br />
          KISAN SEVA
        </b>
        <span>
          {hi
            ? "किसानों के लिए सुरक्षित और पारदर्शी digital registration"
            : "Secure and transparent digital registration for farmers"}
        </span>
      </footer>
    </div>
  );
}

function CentreRegistrationPortal({ hi, setMode }) {
  const [form, setForm] = useState({
    district: "",
    tehsil: "",
    village: "",
    institution: "",
    code: "",
    operator: "",
    manager: "",
    aadhaar: "",
    mobile: "",
    email: "",
    address: "",
    otp: "",
  });
  const [notice, setNotice] = useState("");
  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = (e) => {
    e.preventDefault();
    if (
      !form.district ||
      !form.code ||
      !form.operator ||
      !form.manager ||
      form.mobile.length !== 10
    ) {
      setNotice(
        hi
          ? "कृपया district, centre code, operator, manager और mobile details भरें।"
          : "Please complete district, centre code, operator, manager and mobile details.",
      );
      return;
    }
    setNotice("");
    alert(
      hi
        ? "Centre registration demo में सुरक्षित रूप से जमा हो गया।"
        : "Centre registration submitted securely in demo.",
    );
    setMode("login");
  };
  return (
    <div className="centre-portal-page">
      <header className="centre-portal-header">
        <div>
          <b>Giva</b>
          <span>
            {hi
              ? "ई‑उपार्जन Centre Registration Portal"
              : "E‑Procurement Centre Registration Portal"}
          </span>
        </div>
        <button onClick={() => setMode("login")}>
          {hi ? "लॉगिन" : "Login"}
        </button>
      </header>
      <main className="centre-portal-card">
        <div className="centre-portal-title">
          {hi
            ? "खरीफ 2026-27 पंजीयन केंद्र बनाएं"
            : "Created Kharif 2026-27 registration centres"}
        </div>
        <div className="centre-toolbar">
          <button
            type="button"
            onClick={() =>
              setNotice(
                hi ? "नया centre form तैयार है।" : "New centre form is ready.",
              )
            }
          >
            {hi ? "नया" : "New"}
          </button>
          <button
            type="button"
            className="close-action"
            onClick={() => setMode("login")}
          >
            {hi ? "बंद करें" : "Close it"}
          </button>
        </div>
        <p className="centre-note">
          <b>
            {hi
              ? "नोट: Aadhaar KYC और नीचे दिए manager/operator details भरना अनिवार्य है।"
              : "NOTE: It is mandatory to allow Aadhaar KYC and fill manager and operator details given below."}
          </b>
        </p>
        <div className="centre-search">
          <label>
            {hi
              ? "Manager का mobile number / Aadhaar number खोजें"
              : "Search by mobile number/Aadhaar number"}
            <input
              placeholder={
                hi ? "Mobile या Aadhaar number" : "Mobile or Aadhaar number"
              }
            />
          </label>
          <button type="button">{hi ? "खोजें" : "Search"}</button>
        </div>
        <div className="centre-warning">
          {hi
            ? "नोट: यदि manager information पहले से registered है तो mobile/Aadhaar से खोजें।"
            : "NOTE: Obtain information from mobile number or Aadhaar number if manager information is already registered."}
        </div>
        <section>
          <div className="portal-section-title">
            {hi ? "District और centre location" : "Centre location"}
          </div>
          <div className="portal-grid three">
            <label>
              {hi ? "जिला चुनें" : "Select District"}
              <select
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
              >
                <option value="">--Choose--</option>
                <option>Sehore</option>
                <option>Bhopal</option>
                <option>Vidisha</option>
              </select>
            </label>
            <label>
              {hi ? "तहसील चुनें" : "Select Tehsil"}
              <select
                value={form.tehsil}
                onChange={(e) => update("tehsil", e.target.value)}
              >
                <option>--Choose--</option>
                <option>Sehore</option>
                <option>Ashta</option>
              </select>
            </label>
            <label>
              {hi ? "गांव चुनें" : "Select village"}
              <select
                value={form.village}
                onChange={(e) => update("village", e.target.value)}
              >
                <option>--Choose--</option>
                <option>Village 1</option>
                <option>Village 2</option>
              </select>
            </label>
          </div>
        </section>
        <section>
          <div className="portal-section-title">
            {hi ? "Manager की जानकारी" : "Enter manager information"}
          </div>
          <div className="portal-grid three">
            <label>
              {hi ? "संस्था का प्रकार" : "Institution type"}
              <select>
                <option>{hi ? "चुनें" : "Please select"}</option>
                <option>Government</option>
                <option>Cooperative</option>
                <option>Private procurement agency</option>
              </select>
            </label>
            <label>
              {hi ? "Institution code" : "Institution code"}
              <input
                value={form.code}
                onChange={(e) => update("code", e.target.value)}
                placeholder={hi ? "8 digit centre code" : "8 digit centre code"}
              />
            </label>
            <label>
              {hi ? "Operator का नाम" : "Name of operator"}
              <input
                value={form.operator}
                onChange={(e) => update("operator", e.target.value)}
              />
            </label>
            <label>
              {hi ? "Aadhaar number" : "Aadhaar number"}
              <input
                value={form.aadhaar}
                onChange={(e) =>
                  update(
                    "aadhaar",
                    e.target.value.replace(/\D/g, "").slice(0, 12),
                  )
                }
                inputMode="numeric"
              />
            </label>
            <label>
              {hi ? "Mobile number" : "Mobile number"}
              <input
                value={form.mobile}
                onChange={(e) =>
                  update(
                    "mobile",
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                inputMode="numeric"
              />
            </label>
            <label>
              {hi ? "E-mail" : "E-mail"}
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </label>
            <label>
              {hi ? "Address" : "Address"}
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </label>
          </div>
          <div className="kyc-consent">
            <input type="checkbox" />{" "}
            {hi
              ? "मैं Aadhaar KYC और OTP verification के लिए सहमत हूँ।"
              : "I consent to Aadhaar KYC and OTP verification."}
          </div>
          <div className="otp-row">
            <button
              type="button"
              onClick={() =>
                setNotice(hi ? "OTP demo में भेजा गया।" : "OTP sent in demo.")
              }
            >
              {hi ? "OTP भेजें" : "Send OTP"}
            </button>
            <input
              value={form.otp}
              onChange={(e) =>
                update("otp", e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="OTP"
            />
            <button type="button" className="secure-button">
              {hi ? "सत्यापित" : "Secure"}
            </button>
          </div>
        </section>
        <section>
          <div className="portal-section-title">
            {hi ? "Operator की जानकारी" : "Enter operator information"}
          </div>
          <div className="portal-grid three">
            <label>
              {hi ? "Operator name" : "Operator name"}
              <input />
            </label>
            <label>
              {hi ? "E-mail" : "E-mail"}
              <input />
            </label>
            <label>
              {hi ? "Mobile number" : "Mobile number"}
              <input inputMode="numeric" />
            </label>
            <label>
              {hi ? "Aadhaar number" : "Aadhaar number"}
              <input inputMode="numeric" />
            </label>
            <label>
              {hi ? "Aadhaar फिर भरें" : "Fill Aadhaar again"}
              <input inputMode="numeric" />
            </label>
            <label>
              {hi ? "Operator address" : "Operator address"}
              <input />
            </label>
          </div>
        </section>
        <section>
          <div className="portal-section-title">
            {hi
              ? "Registration / authorization letter"
              : "Registration / authorization letter"}
          </div>
          <p className="upload-help">
            {hi
              ? "अपने centre का registration/authorization letter Public Service Centre, MP Online Kiosk, Common Service Centre, Cyber Cafe, Gram Panchayat, Janpat Panchayat या Tehsil Office से attach करें।"
              : "Attach your centre registration/authorization letter from a Public Service Centre, MP Online Kiosk, Common Service Centre, Cyber Cafe, Gram Panchayat, Janpat Panchayat or Tehsil Office."}
          </p>
          <input type="file" />
          <div className="portal-actions">
            <button
              type="button"
              onClick={() =>
                setNotice(
                  hi
                    ? "Authorization letter upload demo में तैयार है।"
                    : "Authorization letter upload is ready in demo.",
                )
              }
            >
              {hi ? "अपलोड करें" : "Upload"}
            </button>
            <button type="submit">{hi ? "सुरक्षित करें" : "Secure it"}</button>
          </div>
        </section>
        {notice && <div className="portal-status">{notice}</div>}
        <div className="certificate-link">
          <b>
            {hi
              ? "Kharif 2026-27 registration certificate upload"
              : "Upload Certificate for Kharif 2026-27 registration"}
          </b>
          <button
            type="button"
            onClick={() =>
              setNotice(
                hi
                  ? "Certificate upload section नीचे उपलब्ध है।"
                  : "Certificate upload section is available below.",
              )
            }
          >
            {hi ? "Certificate upload" : "Upload certificate"}
          </button>
        </div>
      </main>
      <footer className="nic-footer">
        <b>
          NATIONAL
          <br />
          INFORMATICS
          <br />
          CENTRE
        </b>
        <span>
          Designed, Developed and Hosted by National Informatics Centre, Madhya
          Pradesh
          <br />
          Copyright © 2026 All rights reserved - National Informatics Centre
        </span>
      </footer>
    </div>
  );
}

function RegistrationLoginV2({ hi, setMode }) {
  const [role, setRole] = useState("farmer");
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    district: "Sehore",
    center: "",
    operator: "",
    manager: "",
    authorization: "",
  });
  const [error, setError] = useState("");
  const update = (key, value) => setForm({ ...form, [key]: value });
  if (role === "farmer")
    return (
      <FarmerRegistrationPortal
        hi={hi}
        setMode={setMode}
        onCentre={() => setRole("centre")}
      />
    );
  if (role === "centre")
    return <CentreRegistrationPortal hi={hi} setMode={setMode} />;
  const submit = (e) => {
    e.preventDefault();
    const valid =
      role === "farmer"
        ? form.name && form.mobile.length === 10
        : form.center && form.operator && form.manager && form.authorization;
    if (!valid) {
      setError(
        hi
          ? "कृपया सभी जरूरी जानकारी भरें।"
          : "Please complete all required details.",
      );
      return;
    }
    setError("");
    alert(
      hi
        ? "पंजीयन demo में सफल रहा। सत्यापन के बाद login ID भेजी जाएगी।"
        : "Registration completed in demo. Login ID will be sent after verification.",
    );
    setMode("login");
  };
  return (
    <div className="login-page">
      <div className="login-visual">
        <button className="back-home" onClick={() => setMode("login")}>
          ← {hi ? "लॉगिन पर जाएँ" : "Back to login"}
        </button>
        <div className="logo">Giva</div>
        <div className="login-quote">
          <span className="eyebrow light">
            {hi ? "ई‑उपार्जन पंजीयन" : "E-PROCUREMENT REGISTRATION"}
          </span>
          <h1>
            {hi ? (
              <>
                एक portal।
                <br />
                <em>हर किसान सेवा।</em>
              </>
            ) : (
              <>
                One portal.
                <br />
                <em>Every farmer service.</em>
              </>
            )}
          </h1>
          <p>
            {hi
              ? "किसान, उपार्जन केंद्र और विभागीय सेवा को एक सुरक्षित digital flow में जोड़ें।"
              : "Connect farmers, procurement centres and department services in one secure digital flow."}
          </p>
        </div>
        <div className="login-field-art">{role === "farmer" ? "🌾" : "🏢"}</div>
      </div>
      <div className="login-form-wrap">
        <form className="login-form registration-login-form" onSubmit={submit}>
          <div className="gov-ribbon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="gov-login-header">
            <div className="ashoka-mark">✦</div>
            <div>
              <b>{hi ? "सरकारी किसान सेवाएँ" : "Government Farmer Services"}</b>
              <small>भारत सरकार • मध्य प्रदेश शासन</small>
            </div>
            <button type="button" onClick={() => setMode("login")}>
              {hi ? "लॉगिन" : "Login"}
            </button>
          </div>
          <span className="eyebrow">
            {hi ? "नया पंजीयन" : "NEW REGISTRATION"}
          </span>
          <h2>
            {role === "farmer"
              ? hi
                ? "किसान पंजीयन"
                : "Farmer registration"
              : hi
                ? "केंद्र / Admin पंजीयन"
                : "Centre / Admin registration"}
          </h2>
          <p>
            {role === "farmer"
              ? hi
                ? "MSP खरीद के लिए अपना farmer profile बनाएं।"
                : "Create your profile for transparent MSP procurement."
              : hi
                ? "उपार्जन केंद्र बनाने और सत्यापन के लिए यह form भरें।"
                : "Register a procurement centre for department verification."}
          </p>
          <div className="registration-role-tabs">
            <button
              type="button"
              className={role === "farmer" ? "active" : ""}
              onClick={() => {
                setRole("farmer");
                setError("");
              }}
            >
              🌾 {hi ? "किसान" : "Farmer"}
            </button>
            <button
              type="button"
              className={role === "centre" ? "active" : ""}
              onClick={() => {
                setRole("centre");
                setError("");
              }}
            >
              🏢 {hi ? "Centre / Admin" : "Centre / Admin"}
            </button>
          </div>
          {role === "farmer" ? (
            <div className="form-grid">
              <label>
                {hi ? "किसान का नाम" : "Farmer name"}
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder={hi ? "पूरा नाम" : "Full name"}
                />
              </label>
              <label>
                {hi ? "मोबाइल नंबर" : "Mobile number"}
                <input
                  value={form.mobile}
                  onChange={(e) =>
                    update(
                      "mobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                />
              </label>
              <label>
                {hi ? "जिला" : "District"}
                <select
                  value={form.district}
                  onChange={(e) => update("district", e.target.value)}
                >
                  <option>Sehore</option>
                  <option>Bhopal</option>
                  <option>Vidisha</option>
                </select>
              </label>
              <label>
                {hi ? "फसल" : "Crop"}
                <select>
                  <option>Wheat</option>
                  <option>Paddy</option>
                  <option>Soybean</option>
                  <option>Gram</option>
                </select>
              </label>
            </div>
          ) : (
            <>
              <div className="form-grid">
                <label>
                  {hi ? "केंद्र का नाम" : "Centre name"}
                  <input
                    value={form.center}
                    onChange={(e) => update("center", e.target.value)}
                    placeholder={
                      hi ? "उपार्जन केंद्र का नाम" : "Procurement centre name"
                    }
                  />
                </label>
                <label>
                  {hi ? "जिला" : "District"}
                  <select
                    value={form.district}
                    onChange={(e) => update("district", e.target.value)}
                  >
                    <option>Sehore</option>
                    <option>Bhopal</option>
                    <option>Vidisha</option>
                  </select>
                </label>
                <label>
                  {hi ? "Operator का नाम" : "Operator name"}
                  <input
                    value={form.operator}
                    onChange={(e) => update("operator", e.target.value)}
                    placeholder={hi ? "Operator का नाम" : "Operator full name"}
                  />
                </label>
                <label>
                  {hi ? "Manager का नाम" : "Centre manager"}
                  <input
                    value={form.manager}
                    onChange={(e) => update("manager", e.target.value)}
                    placeholder={hi ? "Manager का नाम" : "Manager full name"}
                  />
                </label>
                <label>
                  {hi ? "मोबाइल नंबर" : "Mobile number"}
                  <input
                    value={form.mobile}
                    onChange={(e) =>
                      update(
                        "mobile",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    placeholder="10-digit mobile"
                    inputMode="numeric"
                  />
                </label>
                <label>
                  {hi
                    ? "Authorization letter number"
                    : "Authorization letter no."}
                  <input
                    value={form.authorization}
                    onChange={(e) => update("authorization", e.target.value)}
                    placeholder={
                      hi ? "प्राधिकरण पत्र नंबर" : "Enter letter number"
                    }
                  />
                </label>
              </div>
              <div className="registration-notice">
                <b>
                  {hi
                    ? "Centre verification notice"
                    : "Centre verification notice"}
                </b>
                <small>
                  {hi
                    ? "पहले centre बनाएं, operator और manager की जानकारी भरें तथा authorization letter लगाएं। District Food Supply Officer verification के बाद centre manager के mobile पर login ID और password भेजे जाएंगे।"
                    : "Create the centre, add operator/manager details and attach the authorization letter. The District Food Supply Officer verifies the centre; login ID and password are then sent to the manager’s mobile."}
                </small>
              </div>
            </>
          )}
          {error && <div className="form-error">{error}</div>}
          <button className="primary login-submit" type="submit">
            {role === "farmer"
              ? hi
                ? "किसान पंजीयन पूरा करें"
                : "Complete farmer registration"
              : hi
                ? "Centre registration भेजें"
                : "Submit centre registration"}{" "}
            <ArrowRight size={16} />
          </button>
          <div className="demo-hint">
            <ShieldCheck size={16} />
            <span>
              <b>{hi ? "सुरक्षित demo form" : "Secure demo form"}</b>
              <small>
                {hi
                  ? "सत्यापन और DBT production deployment में जोड़े जाएंगे।"
                  : "Verification and DBT integration are added for production deployment."}
              </small>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

function OldHomePage({ onLogin, onDirectLogin, lang, setLang }) {
  const hi = lang === "HI";
  const [leader, setLeader] = useState(null);
  if (leader)
    return (
      <LeaderInfoPage type={leader} hi={hi} onBack={() => setLeader(null)} />
    );
  const news = [
    [
      "PROCUREMENT UPDATE",
      "MSP procurement window is now open for wheat and soybean farmers.",
      "17 Sep 2026",
    ],
    [
      "WEATHER ADVISORY",
      "Light rain expected in central Madhya Pradesh. Keep harvested produce covered.",
      "16 Sep 2026",
    ],
    [
      "FARMER SERVICES",
      "Digital token booking helps farmers plan their mandi visit with less waiting.",
      "14 Sep 2026",
    ],
  ];
  return (
    <div className="public-home">
      <header className="public-nav">
        <div className="logo">Giva</div>
        <nav>
          <a href="#about">{hi ? "हमारे बारे में" : "About"}</a>
          <a href="#schemes">{hi ? "PM योजनाएँ" : "PM Schemes"}</a>
          <a href="#news">{hi ? "ताज़ा खबरें" : "Latest News"}</a>
        </nav>
        <div className="actions">
          <button
            className="lang-toggle"
            onClick={() => setLang(hi ? "EN" : "HI")}
          >
            {hi ? "English" : "हिंदी"}
          </button>
          <button
            className="nav-signup"
            onClick={() => onDirectLogin("register")}
          >
            {hi ? "साइन अप" : "Sign Up"}
          </button>
          <button className="nav-login" onClick={onLogin}>
            <LogIn size={16} /> {hi ? "लॉगिन" : "Login"}
          </button>
        </div>
      </header>
      <main>
        <section className="landing-hero">
          <div className="landing-copy">
            <span className="eyebrow light">
              {hi ? "डिजिटल किसान सेवाएँ" : "DIGITAL FARMER SERVICES"}
            </span>
            <h1>
              {hi ? (
                <span>
                  समझदारी से बेचें।
                  <br />
                  <em>मजबूती से बढ़ें।</em>
                </span>
              ) : (
                <span>
                  Sell smarter.
                  <br />
                  <em>Grow stronger.</em>
                </span>
              )}
            </h1>
            <p>
              {hi
                ? "Giva खरीद, मंडी अपडेट, बाजार भाव और किसान सहायता को एक आसान मंच पर लाता है."
                : "Giva brings procurement, mandi updates, market prices and farmer support together in one simple platform."}
            </p>
            <div className="hero-cta">
              <button className="primary" onClick={onLogin}>
                {hi ? "किसान पोर्टल लॉगिन" : "Login to farmer portal"}{" "}
                <ArrowRight size={16} />
              </button>
              <a href="#about">{hi ? "Giva जानें ↓" : "Explore Giva ↓"}</a>
            </div>
            <div className="trust">
              <ShieldCheck size={18} />
              <span>
                <b>{hi ? "सुरक्षित और पारदर्शी" : "Safe & transparent"}</b>
                <small>
                  {hi ? "भारत के किसानों के लिए" : "Built for India’s farmers"}
                </small>
              </span>
            </div>
          </div>
          <div className="farmer-art">
            <div className="sun"></div>
            <div className="field field-back"></div>
            <div className="field field-front"></div>
            <div className="farmer-emoji">👩🏽‍🌾</div>
            <div className="art-card">
              <b>₹2,510</b>
              <small>{hi ? "गेहूं का मॉडल भाव" : "Wheat modal price"}</small>
            </div>
          </div>
        </section>
        <section className="feature-strip">
          <div>
            <Sprout />
            <b>{hi ? "आसान उपार्जन" : "Procurement made easy"}</b>
            <span>
              {hi
                ? "टोकन बुक करें और स्लॉट देखें"
                : "Book tokens and track your slot"}
            </span>
          </div>
          <div>
            <Landmark />
            <b>{hi ? "सरकारी योजनाएँ" : "Government schemes"}</b>
            <span>
              {hi ? "भरोसेमंद सहायता पाएं" : "Discover support you can trust"}
            </span>
          </div>
          <div>
            <Newspaper />
            <b>{hi ? "काम की खबरें" : "News that matters"}</b>
            <span>
              {hi ? "खेती से जुड़े अपडेट पाएं" : "Stay updated on your farm"}
            </span>
          </div>
        </section>
        <section className="leaders-section">
          <div className="leaders-copy">
            <span className="eyebrow">
              {hi ? "जनसेवा जानकारी" : "PUBLIC SERVICE INFORMATION"}
            </span>
            <h2>
              {hi ? (
                <span>
                  मध्य प्रदेश के
                  <br />
                  किसानों के लिए
                </span>
              ) : (
                <span>
                  Built for the farmers
                  <br />
                  of Madhya Pradesh
                </span>
              )}
            </h2>
            <p>
              {hi
                ? "Giva आसान, पारदर्शी और किसान-केंद्रित डिजिटल सेवाओं के उद्देश्य से बनाया गया है."
                : "Giva supports the vision of accessible, transparent and farmer-first digital services."}
            </p>
            <div className="official-badge">
              <ShieldCheck size={16} />{" "}
              {hi
                ? "जनहित के लिए जानकारी और सेवाएँ"
                : "Information and services for public benefit"}
            </div>
          </div>
          <div
            className="leader-cards"
            onClick={(e) => {
              const card = e.target.closest(".leader-card");
              if (card) {
                e.preventDefault();
                setLeader(card.href.includes("pmindia") ? "pm" : "cm");
              }
            }}
          >
            <a
              className="leader-card"
              href="https://www.pmindia.gov.in"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://www.pmindia.gov.in/wp-content/uploads/2025/12/02.jpg"
                alt="Shri Narendra Modi, Prime Minister of India"
              />
              <div>
                <span>
                  {hi ? "माननीय प्रधानमंत्री" : "HON’BLE PRIME MINISTER"}
                </span>
                <b>Shri Narendra Modi</b>
                <small>{hi ? "भारत सरकार ↗" : "Government of India ↗"}</small>
              </div>
            </a>
            <a
              className="leader-card"
              href="https://mpeuparjan.nic.in"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://mpeuparjan.nic.in/Images_new/CM_new.png"
                alt="Dr. Mohan Yadav, Chief Minister of Madhya Pradesh"
              />
              <div>
                <span>
                  {hi ? "माननीय मुख्यमंत्री" : "HON’BLE CHIEF MINISTER"}
                </span>
                <b>Dr. Mohan Yadav</b>
                <small>
                  {hi ? "मध्य प्रदेश शासन ↗" : "Government of Madhya Pradesh ↗"}
                </small>
              </div>
            </a>
          </div>
        </section>
        <ProcurementDashboard hi={hi} />
        <section className="department-banner">
          <div className="department-icon">
            <Landmark size={25} />
          </div>
          <div>
            <span className="eyebrow">
              {hi ? "संबंधित विभाग" : "RESPONSIBLE DEPARTMENT"}
            </span>
            <h2>
              {hi
                ? "खाद्य, नागरिक आपूर्ति एवं उपभोक्ता संरक्षण विभाग"
                : "Food, Civil Supplies & Consumer Protection Department"}
            </h2>
            <p>
              {hi
                ? "मध्य प्रदेश शासन का विभाग जो खाद्यान्न उपार्जन, आपूर्ति और किसान भुगतान सेवाओं को सहयोग देता है."
                : "Government of Madhya Pradesh department supporting foodgrain procurement, supply and farmer payment services."}
            </p>
            <div className="department-links">
              <a
                href="https://mpeuparjan.nic.in"
                target="_blank"
                rel="noreferrer"
              >
                e‑Uparjan <ExternalLink size={12} />
              </a>
              <a href="https://epos.mp.gov.in" target="_blank" rel="noreferrer">
                SmartPDS <ExternalLink size={12} />
              </a>
              <a href="https://scm.mp.gov.in" target="_blank" rel="noreferrer">
                IAeSCM <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </section>
        <section className="about-section" id="about">
          <div>
            <span className="eyebrow">
              {hi ? "GIVA के बारे में" : "ABOUT GIVA"}
            </span>
            <h2>
              {hi ? (
                <span>
                  किसानों और अवसरों
                  <br />
                  के बीच एक सेतु.
                </span>
              ) : (
                <span>
                  A bridge between
                  <br />
                  farmers and opportunity.
                </span>
              )}
            </h2>
          </div>
          <p>
            {hi
              ? "Giva किसान-प्रथम डिजिटल प्लेटफॉर्म है, जो फसल बेचना आसान और पारदर्शी बनाता है. लाइव मंडी कतार से भुगतान ट्रैकिंग तक, जरूरी जानकारी एक टैप में."
              : "Giva is a farmer-first digital platform designed to make selling crops more predictable and transparent. From live mandi queues to payment tracking, every important update is just a tap away."}
          </p>
        </section>
        <section className="scheme-section" id="schemes">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {hi ? "सरकारी सहायता" : "GOVERNMENT SUPPORT"}
              </span>
              <h2>{hi ? "अपनी योजनाएँ जानें" : "Know your schemes"}</h2>
            </div>
            <span>
              {hi
                ? "हर किसान के लिए उपयोगी जानकारी"
                : "Helpful information for every farmer"}
            </span>
          </div>
          <div className="scheme-card">
            <div className="scheme-icon">🇮🇳</div>
            <div>
              <span className="scheme-tag">PM-KISAN</span>
              <h3>
                {hi ? "किसानों के लिए आय सहायता" : "Income support for farmers"}
              </h3>
              <p>
                {hi
                  ? "पात्र किसान परिवारों को प्रत्यक्ष लाभ अंतरण के माध्यम से हर साल ₹6,000 तीन समान किस्तों में मिल सकते हैं."
                  : "Eligible farmer families can receive ₹6,000 per year in three equal instalments through direct benefit transfer."}
              </p>
              <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer">
                {hi ? "आधिकारिक वेबसाइट देखें" : "Visit official website"}{" "}
                <ExternalLink size={13} />
              </a>
            </div>
            <div className="scheme-number">
              ₹6,000<small>{hi ? "प्रति वर्ष" : "per year"}</small>
            </div>
          </div>
        </section>
        <section className="news-section" id="news">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {hi ? "खेत से खबर" : "FROM THE FIELD"}
              </span>
              <h2>{hi ? "ताज़ा खबरें और अपडेट" : "Latest news & updates"}</h2>
            </div>
            <span>
              {hi
                ? "आपके अगले फैसले के लिए उपयोगी अपडेट"
                : "Practical updates for your next decision"}
            </span>
          </div>
          <div className="news-grid">
            {news.map(([tag, title, date]) => (
              <article className="news-card" key={title}>
                <div className="news-image">🌾</div>
                <span className="scheme-tag">
                  {hi
                    ? tag === "PROCUREMENT UPDATE"
                      ? "उपार्जन अपडेट"
                      : tag === "WEATHER ADVISORY"
                        ? "मौसम सलाह"
                        : "किसान सेवा"
                    : tag}
                </span>
                <h3>
                  {hi
                    ? tag === "PROCUREMENT UPDATE"
                      ? "गेहूं और सोयाबीन किसानों के लिए MSP खरीद विंडो खुली है."
                      : tag === "WEATHER ADVISORY"
                        ? "मध्य प्रदेश में हल्की बारिश की संभावना, उपज ढककर रखें."
                        : "डिजिटल टोकन से मंडी में कम इंतजार के साथ योजना बनाएं."
                    : title}
                </h3>
                <small>
                  {date} <ArrowRight size={13} />
                </small>
              </article>
            ))}
          </div>
        </section>
        <PublicAssistant hi={hi} />
      </main>
      <footer className="public-footer">
        <div className="logo">Giva</div>
        <span>
          {hi
            ? "बेहतर जानकारी के साथ किसानों को सशक्त बनाना."
            : "Empowering farmers with better information."}
        </span>
        <button className="nav-login" onClick={onLogin}>
          {hi ? "किसान लॉगिन" : "Farmer Login"} <ArrowRight size={15} />
        </button>
      </footer>
    </div>
  );
}

function LeaderInfoPage({ type, hi, onBack }) {
  const pm = type === "pm";
  return (
    <div className="leader-info-page">
      <button className="back-home info-back" onClick={onBack}>
        ← {hi ? "होम पर जाएँ" : "Back to home"}
      </button>
      <div className="leader-info-card">
        <span className="eyebrow">
          {hi ? "जनसेवा जानकारी" : "PUBLIC SERVICE INFORMATION"}
        </span>
        <div className="leader-info-main">
          <img
            src={
              pm
                ? "https://www.pmindia.gov.in/wp-content/uploads/2025/12/02.jpg"
                : "https://mpeuparjan.nic.in/Images_new/CM_new.png"
            }
            alt={pm ? "Shri Narendra Modi" : "Dr. Mohan Yadav"}
          />
          <div>
            <span className="scheme-tag">
              {pm
                ? hi
                  ? "भारत के प्रधानमंत्री"
                  : "PRIME MINISTER OF INDIA"
                : hi
                  ? "मध्य प्रदेश के मुख्यमंत्री"
                  : "CHIEF MINISTER OF MADHYA PRADESH"}
            </span>
            <h1>{pm ? "Shri Narendra Modi" : "Dr. Mohan Yadav"}</h1>
            <p>
              {pm
                ? hi
                  ? "भारत सरकार के नेतृत्व में किसान कल्याण, डिजिटल सेवाओं और समावेशी विकास को आगे बढ़ाने की दिशा."
                  : "Leading national efforts for farmer welfare, digital services and inclusive development."
                : hi
                  ? "मध्य प्रदेश में किसान-केंद्रित योजनाओं और पारदर्शी डिजिटल उपार्जन सेवाओं को मजबूत करने की दिशा."
                  : "Strengthening farmer-focused schemes and transparent digital procurement services in Madhya Pradesh."}
            </p>
            <a
              className="primary dark"
              href={
                pm ? "https://www.pmindia.gov.in" : "https://mpeuparjan.nic.in"
              }
              target="_blank"
              rel="noreferrer"
            >
              {hi ? "आधिकारिक वेबसाइट देखें" : "Visit official website"}{" "}
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
        <div className="leader-info-note">
          <ShieldCheck size={18} />
          <span>
            <b>
              {hi
                ? "किसानों के लिए डिजिटल सेवाएँ"
                : "Digital services for farmers"}
            </b>
            <small>
              {hi
                ? "Giva registration, token, mandi और payment tracking को आसान बनाता है."
                : "Giva makes registration, tokens, mandi updates and payment tracking easier."}
            </small>
          </span>
        </div>
      </div>
    </div>
  );
}

function PublicAssistant({ hi }) {
  const [open, setOpen] = useState(false);
  const [voice, setVoice] = useState(false);
  const [text, setText] = useState("");
  const [reply, setReply] = useState(
    hi
      ? "नमस्ते! मैं किसान सहायक हूँ। आप मंडी, टोकन या भुगतान के बारे में पूछ सकते हैं।"
      : "Namaste! I’m your Kisan Assistant. Ask me about mandi, tokens or payments.",
  );
  const respond = (q) => {
    const v = q.toLowerCase();
    if (v.includes("token") || v.includes("टोकन"))
      return hi
        ? "आपका token Procurement Status में देखा जा सकता है।"
        : "Your token can be viewed in Procurement Status.";
    if (v.includes("भाव") || v.includes("price"))
      return hi
        ? "गेहूं का demo modal price ₹2,510 प्रति quintal है।"
        : "The demo wheat modal price is ₹2,510 per quintal.";
    return hi
      ? "मैं पंजीयन, मंडी, भाव, टोकन और भुगतान में मदद कर सकता हूँ।"
      : "I can help with registration, mandi, prices, tokens and payments.";
  };
  const send = () => {
    if (!text.trim()) return;
    setReply(respond(text));
    setText("");
  };
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setReply(
        hi
          ? "इस browser में voice support उपलब्ध नहीं है।"
          : "Voice support is not available in this browser.",
      );
      return;
    }
    const r = new SR();
    r.lang = hi ? "hi-IN" : "en-IN";
    setVoice(true);
    r.onresult = (e) => {
      const q = e.results[0][0].transcript;
      setText(q);
      setReply(respond(q));
      setVoice(false);
    };
    r.onerror = () => setVoice(false);
    r.onend = () => setVoice(false);
    r.start();
  };
  return (
    <div className="public-assistant">
      <button
        className="assistant-fab"
        onClick={() => setOpen(!open)}
        aria-label="Open AI assistant"
      >
        <Bot size={20} />
        <span>{hi ? "AI सहायता" : "AI Help"}</span>
      </button>
      {open && (
        <div className="assistant-popover">
          <div className="popover-head">
            <div className="assistant-avatar">
              <Bot size={18} />
            </div>
            <div>
              <b>{hi ? "AI किसान सहायक" : "AI Kisan Assistant"}</b>
              <small>
                <span className="online-dot"></span>
                {hi ? "अभी ऑनलाइन" : "Online now"}
              </small>
            </div>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="popover-reply">{reply}</div>
          <div className="popover-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={hi ? "अपना सवाल लिखें..." : "Ask your question..."}
            />
            <button
              onClick={startVoice}
              className={voice ? "recording" : ""}
              aria-label="Voice assistant"
            >
              <Phone size={15} />
            </button>
            <button onClick={send} aria-label="Send">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RegistrationLogin({ hi, setMode, onHome }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    season: "Rabi 2026-27",
    crop: "Wheat",
    khasra: "",
    bank: "",
  });
  const [error, setError] = useState("");
  const update = (k, v) => setForm({ ...form, [k]: v });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || form.mobile.length < 10 || !form.khasra || !form.bank) {
      setError(
        hi
          ? "कृपया सभी जरूरी जानकारी भरें."
          : "Please complete all required details.",
      );
      return;
    }
    setError("");
    alert(
      hi
        ? "किसान पंजीयन demo में सफल रहा."
        : "Farmer registration completed in demo.",
    );
    setMode("login");
  };
  return (
    <div className="login-page">
      <div className="login-visual">
        <button className="back-home" onClick={() => setMode("login")}>
          ← {hi ? "लॉगिन पर जाएँ" : "Back to login"}
        </button>
        <div className="logo">Giva</div>
        <div className="login-quote">
          <span className="eyebrow light">
            {hi ? "किसान पंजीयन" : "FARMER REGISTRATION"}
          </span>
          <h1>
            {hi ? (
              <>
                एक बार पंजीयन।
                <br />
                <em>आसान उपार्जन।</em>
              </>
            ) : (
              <>
                Register once.
                <br />
                <em>Sell with ease.</em>
              </>
            )}
          </h1>
          <p>
            {hi
              ? "अपनी फसल को MSP खरीद के लिए पंजीकृत करें."
              : "Register your crop for transparent MSP procurement."}
          </p>
        </div>
        <div className="login-field-art">🌾</div>
      </div>
      <div className="login-form-wrap">
        <form className="login-form registration-login-form" onSubmit={submit}>
          <div className="gov-ribbon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="gov-login-header">
            <div className="ashoka-mark">✦</div>
            <div>
              <b>{hi ? "सरकारी किसान सेवाएँ" : "Government Farmer Services"}</b>
              <small>भारत सरकार • मध्य प्रदेश शासन</small>
            </div>
            <button type="button" onClick={() => setMode("login")}>
              {hi ? "लॉगिन" : "Login"}
            </button>
          </div>
          <span className="eyebrow">
            {hi ? "नया किसान पंजीयन" : "NEW FARMER REGISTRATION"}
          </span>
          <h2>{hi ? "किसान पंजीयन" : "Farmer registration"}</h2>
          <p>
            {hi
              ? "नीचे की जानकारी भरकर अपना procurement profile बनाएं."
              : "Create your procurement profile with the details below."}
          </p>
          <div className="form-grid">
            <label>
              {hi ? "किसान का नाम" : "Farmer name"}
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder={hi ? "पूरा नाम दर्ज करें" : "Enter full name"}
              />
            </label>
            <label>
              {hi ? "मोबाइल नंबर" : "Mobile number"}
              <input
                value={form.mobile}
                onChange={(e) =>
                  update(
                    "mobile",
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                placeholder={hi ? "10 अंकों का नंबर" : "10-digit number"}
                inputMode="numeric"
              />
            </label>
            <label>
              {hi ? "सीजन" : "Season"}
              <select
                value={form.season}
                onChange={(e) => update("season", e.target.value)}
              >
                <option>Rabi 2026-27</option>
                <option>Kharif 2026</option>
              </select>
            </label>
            <label>
              {hi ? "फसल" : "Crop"}
              <select
                value={form.crop}
                onChange={(e) => update("crop", e.target.value)}
              >
                <option>Wheat</option>
                <option>Paddy</option>
                <option>Maize</option>
                <option>Soybean</option>
              </select>
            </label>
            <label>
              {hi ? "खसरा नंबर" : "Khasra / survey number"}
              <input
                value={form.khasra}
                onChange={(e) => update("khasra", e.target.value)}
                placeholder={hi ? "खसरा नंबर" : "Enter khasra number"}
              />
            </label>
            <label>
              {hi ? "बैंक खाते के अंतिम 4 अंक" : "Bank account last 4 digits"}
              <input
                value={form.bank}
                onChange={(e) =>
                  update("bank", e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="1234"
                inputMode="numeric"
              />
            </label>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="primary login-submit" type="submit">
            {hi ? "पंजीयन पूरा करें" : "Complete registration"}{" "}
            <ArrowRight size={16} />
          </button>
          <div className="demo-hint">
            <ShieldCheck size={16} />
            <span>
              <b>{hi ? "सुरक्षित demo form" : "Secure demo form"}</b>
              <small>
                {hi
                  ? "असली deployment में authorized verification जोड़ा जाएगा."
                  : "Authorized verification will be added for production."}
              </small>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

function OldLoginPage({
  onLogin,
  onHome,
  lang,
  setLang,
  initialMode = "register",
}) {
  const hi = lang === "HI";
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState(initialMode);
  const submit = (e) => {
    e.preventDefault();
    if (mobile.length < 10 || !password) {
      setError("Please enter a valid 10-digit mobile number and password.");
      return;
    }
    onLogin();
  };
  if (mode === "register")
    return <RegistrationLoginV2 hi={hi} setMode={setMode} />;
  return (
    <div className="login-page">
      <div className="login-visual">
        <button className="back-home" onClick={onHome}>
          ← {hi ? "होम पर जाएँ" : "Back to home"}
        </button>
        <div className="logo">Giva</div>
        <div className="login-quote">
          <span className="eyebrow light">
            {hi ? "GIVA में आपका स्वागत है" : "WELCOME TO GIVA"}
          </span>
          <h1>
            {hi ? (
              <span>
                आपका काम।
                <br />
                आपकी फसल।
                <br />
                <em>आपका भविष्य।</em>
              </span>
            ) : (
              <span>
                Your work.
                <br />
                Your crops.
                <br />
                <em>Your future.</em>
              </span>
            )}
          </h1>
          <p>
            {hi
              ? "आपकी खेती की यात्रा के लिए एक भरोसेमंद जगह."
              : "One trusted place to manage your farm journey."}
          </p>
        </div>
        <div className="login-field-art">🌱</div>
      </div>
      <div className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <div className="gov-ribbon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="gov-login-header">
            <div className="ashoka-mark">✦</div>
            <div>
              <b>{hi ? "सरकारी किसान सेवाएँ" : "Government Farmer Services"}</b>
              <small>भारत सरकार • मध्य प्रदेश शासन</small>
            </div>
            <button type="button" onClick={() => setLang(hi ? "EN" : "HI")}>
              {hi ? "English" : "हिंदी"}
            </button>
          </div>
          <div className="auth-switch">
            <span>{hi ? "पहली बार उपयोग कर रहे हैं?" : "New farmer?"}</span>
            <button type="button" onClick={() => setMode("register")}>
              {hi ? "किसान पंजीयन" : "Register as farmer"}
            </button>
          </div>
          <div className="mobile-logo logo">Giva</div>
          <span className="eyebrow">
            {hi ? "किसान पोर्टल लॉगिन" : "FARMER PORTAL LOGIN"}
          </span>
          <h2>{hi ? "फिर से स्वागत है" : "Welcome back"}</h2>
          <p>
            {hi
              ? "अपनी e‑Uparjan सेवाओं को सुरक्षित रूप से खोलें."
              : "Login securely to access your e‑Uparjan services."}
          </p>
          <label>
            {hi ? "पंजीकृत मोबाइल नंबर" : "Registered mobile number"}
            <input
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder={
                hi
                  ? "10 अंकों का मोबाइल नंबर दर्ज करें"
                  : "Enter 10-digit mobile number"
              }
              inputMode="numeric"
            />
          </label>
          <label>
            {hi ? "पासवर्ड" : "Password"}
            <div className="password-field">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={hi ? "पासवर्ड दर्ज करें" : "Enter password"}
              />
              <span>{hi ? "दिखाएँ" : "Show"}</span>
            </div>
          </label>
          <div className="form-row">
            <label className="check">
              <input type="checkbox" /> {hi ? "मुझे याद रखें" : "Remember me"}
            </label>
            <a href="#help">{hi ? "पासवर्ड भूल गए?" : "Forgot password?"}</a>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="primary login-submit" type="submit">
            {hi ? "पोर्टल में लॉगिन" : "Login to portal"}{" "}
            <ArrowRight size={16} />
          </button>
          <div className="demo-hint">
            <ShieldCheck size={16} />
            <span>
              <b>{hi ? "सुरक्षित डेमो एक्सेस" : "Secure demo access"}</b>
              <small>
                {hi
                  ? "कोई भी 10 अंकों का नंबर और पासवर्ड इस्तेमाल करें"
                  : "Use any 10-digit mobile number and password"}
              </small>
            </span>
          </div>
          <div className="login-links">
            <a
              href="https://mpeuparjan.nic.in"
              target="_blank"
              rel="noreferrer"
            >
              {hi ? "आधिकारिक e‑Uparjan ↗" : "Official e‑Uparjan ↗"}
            </a>
            <a href="#help">{hi ? "सहायता" : "Help & support"}</a>
            <a href="#accessibility">{hi ? "सुगम्यता" : "Accessibility"}</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function titleFor(page, hi = false) {
  return (
    (hi
      ? {
          status: "उपार्जन स्थिति",
          sell: "फसल बेचें",
          centres: "मंडी और केंद्र",
          prices: "बाजार भाव",
          assistant: "AI किसान सहायक",
          notifications: "सूचनाएं",
          payment: "भुगतान",
          feedback: "फीडबैक",
        }
      : {
          status: "Procurement Status",
          sell: "Sell Crop",
          centres: "Mandi & Centres",
          prices: "Market Prices",
          assistant: "AI Help Agent",
          notifications: "Notifications",
          payment: "Payment",
          feedback: "Feedback",
        })[page] || "Giva"
  );
}
function hiLabel(label) {
  return (
    {
      Dashboard: "डैशबोर्ड",
      "Farmer Registration": "किसान पंजीयन",
      "Procurement Status": "उपार्जन स्थिति",
      "Sell Crop": "फसल बेचें",
      "Mandi & Centres": "मंडी और केंद्र",
      "Market Prices": "बाजार भाव",
      "AI Help Agent": "AI किसान सहायक",
      Notifications: "सूचनाएं",
      Payment: "भुगतान",
      Feedback: "फीडबैक",
    }[label] || label
  );
}

function OldAIAssistant({ setToast }) {
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Namaste! मैं Giva AI सहायक हूँ। मंडी, पंजीयन, टोकन, भुगतान या फसल के भाव के बारे में पूछिए।",
    },
  ]);
  const [input, setInput] = useState("");
  const quick = [
    "मेरा token status क्या है?",
    "Sehore centre की queue बताओ",
    "गेहूं का आज का भाव क्या है?",
  ];
  const answer = (question) => {
    const q = question.toLowerCase();
    if (q.includes("token") || q.includes("status"))
      return "आपका token #3821 है। Sehore Procurement Centre पर 20 September 2026, 10:30 AM का slot है। पूरी जानकारी Procurement Status में देखें।";
    if (q.includes("queue") || q.includes("centre") || q.includes("मंडी"))
      return "Sehore Procurement Centre पर अभी 32 किसान queue में हैं और अनुमानित waiting time 37 मिनट है।";
    if (q.includes("भाव") || q.includes("price") || q.includes("गेहूं"))
      return "Demo market data के अनुसार गेहूं का modal price ₹2,510 प्रति quintal है। Production में authorised live mandi source जोड़ना होगा।";
    if (q.includes("payment") || q.includes("भुगतान"))
      return "आपका payment procurement और quality check के बाद DBT के माध्यम से process होगा। अभी status Pending है।";
    return "मैं registration, crop procurement, mandi queue, market prices और payment से जुड़े सवालों में मदद कर सकता हूँ।";
  };
  const send = (text = input) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { from: "user", text: text.trim() },
      { from: "ai", text: answer(text) },
    ]);
    setInput("");
  };
  return (
    <span>
      <PageTitle
        title="AI Help Agent"
        sub="किसान सेवाओं के लिए तुरंत digital सहायता पाएँ।"
      />
      <div className="assistant-layout">
        <div className="card assistant-card">
          <div className="assistant-head">
            <div className="assistant-avatar">
              <Bot size={22} />
            </div>
            <div>
              <h3>AI Kisan Assistant</h3>
              <p>
                <span className="online-dot"></span> Online • Hindi & English
                support
              </p>
            </div>
            <span className="badge green">DEMO AI</span>
          </div>
          <div className="chat-window">
            {messages.map((m, i) => (
              <div className={`chat-message ${m.from}`} key={`${m.text}-${i}`}>
                <span>{m.from === "ai" ? <Bot size={14} /> : "You"}</span>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="quick-prompts">
            {quick.map((q) => (
              <button key={q} onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Apna sawal yahan likhein..."
            />
            <button onClick={() => send()} aria-label="Send message">
              <Send size={17} />
            </button>
          </div>
        </div>
        <div className="card assistant-help">
          <Bot size={24} />
          <h3>मैं आपकी मदद कर सकता हूँ</h3>
          <div className="help-item">
            <b>पंजीयन और token</b>
            <span>Registration status, slot और token details</span>
          </div>
          <div className="help-item">
            <b>मंडी और भाव</b>
            <span>Centre queue और demo market prices</span>
          </div>
          <div className="help-item">
            <b>भुगतान सहायता</b>
            <span>Quality check और DBT payment updates</span>
          </div>
          <div className="tip">
            महत्वपूर्ण: यह demo assistant है। Final deployment में authorised
            government APIs और verified data जोड़ें।
          </div>
        </div>
      </div>
    </span>
  );
}

function Registration({ setPage, setToast }) {
  const [form, setForm] = useState({
    season: "Rabi 2026-27",
    crop: "Wheat",
    name: "",
    khasra: "",
    land: "",
    bank: "",
  });
  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.khasra || !form.land || !form.bank) {
      setToast("Please complete all registration details.");
      return;
    }
    setToast("Registration submitted for demo verification.");
    setPage("status");
  };
  return (
    <span>
      <PageTitle
        title="Farmer Registration"
        sub="Register your crop for government procurement at MSP."
      />
      <div className="notice">
        <BadgeCheck />
        <div>
          <b>Secure government-service workflow</b>
          <p>
            Keep your Aadhaar-linked mobile, land record and bank details ready.
            This prototype does not store personal data.
          </p>
        </div>
      </div>
      <form className="card registration-form" onSubmit={submit}>
        <div className="form-section-heading">
          <div>
            <h3>1. Crop and season</h3>
            <p>Select the crop you want to bring for procurement.</p>
          </div>
          <span className="step-badge">STEP 1 OF 3</span>
        </div>
        <div className="form-grid">
          <label>
            Procurement season
            <select
              value={form.season}
              onChange={(e) => update("season", e.target.value)}
            >
              <option>Rabi 2026-27</option>
              <option>Kharif 2026</option>
            </select>
          </label>
          <label>
            Crop
            <select
              value={form.crop}
              onChange={(e) => update("crop", e.target.value)}
            >
              <option>Wheat</option>
              <option>Paddy</option>
              <option>Maize</option>
              <option>Soybean</option>
              <option>Gram</option>
            </select>
          </label>
        </div>
        <div className="form-section-heading second">
          <div>
            <h3>2. Farmer and land details</h3>
            <p>
              These details are required for eligibility and quantity
              verification.
            </p>
          </div>
          <span className="step-badge">STEP 2 OF 3</span>
        </div>
        <div className="form-grid">
          <label>
            Farmer name
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Enter full name"
            />
          </label>
          <label>
            District / Tehsil
            <select>
              <option>Sehore / Sehore</option>
              <option>Bhopal / Berasia</option>
              <option>Vidisha / Vidisha</option>
            </select>
          </label>
          <label>
            Khasra / survey number
            <input
              value={form.khasra}
              onChange={(e) => update("khasra", e.target.value)}
              placeholder="e.g. 124/2"
            />
          </label>
          <label>
            Verified land area
            <input
              value={form.land}
              onChange={(e) => update("land", e.target.value)}
              placeholder="Area in hectares"
            />
          </label>
        </div>
        <div className="form-section-heading second">
          <div>
            <h3>3. Bank verification</h3>
            <p>
              Payment will be sent through direct bank transfer after
              procurement.
            </p>
          </div>
          <span className="step-badge">STEP 3 OF 3</span>
        </div>
        <label>
          Bank account last 4 digits
          <input
            value={form.bank}
            onChange={(e) =>
              update("bank", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="Enter last 4 digits"
            inputMode="numeric"
          />
        </label>
        <div className="form-footer">
          <span>
            <ShieldCheck size={15} /> Details are encrypted in the final
            integration.
          </span>
          <button className="primary dark" type="submit">
            Submit registration <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </span>
  );
}

function ProcurementStatus({ farmer, setToast, hi }) {
  const checkpoints = [
    { id: 'gate', name: hi ? 'प्रवेश द्वार' : 'Entry Gate', active: false, status: 'Completed', farmers: 3, vehicles: 0, time: '--' },
    { id: 'reg', name: hi ? 'पंजीयन' : 'Registration', active: false, status: 'Completed', farmers: 4, vehicles: 0, time: '--' },
    { id: 'wait', name: hi ? 'प्रतीक्षा क्षेत्र' : 'Waiting Area', active: false, status: 'Completed', farmers: 12, vehicles: 5, time: '--' },
    { id: 'quality', name: hi ? 'गुणवत्ता जांच' : 'Quality Check', active: true, status: 'Current', farmers: 7, vehicles: 2, time: '8 min' },
    { id: 'weigh', name: hi ? 'तौल' : 'Weighing', active: false, status: 'Waiting', farmers: 4, vehicles: 1, time: '12 min' },
    { id: 'parchi', name: hi ? 'पर्ची काउंटर' : 'Parchi Counter', active: false, status: 'Waiting', farmers: 2, vehicles: 0, time: '5 min' },
    { id: 'pay', name: hi ? 'भुगतान' : 'Payment', active: false, status: 'Waiting', farmers: 3, vehicles: 0, time: 'Pending' },
  ];

  const getStatusColor = (status) => {
    if(status === 'Completed') return '#176B4C';
    if(status === 'Current') return '#C96B16';
    return '#53645B';
  };

  const downloadSlip = () => {
    const text = `Giva e-Uparjan Token Slip\nFarmer: ${farmer?.name || "Ramesh Kumar"}\nFarmer ID: FR-20481\nCrop: ${farmer?.crop || "Wheat"}\nToken: #${farmer?.token || "WHT-028"}\nCentre: Bhopal Procurement Centre\nDate: 20 September 2026 | Time: 10:30 AM`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Giva-token-slip.txt";
    a.click();
    URL.revokeObjectURL(url);
    setToast(hi ? "टोकन स्लिप डाउनलोड हो गई।" : "Token slip downloaded.");
  };

  return (
    <div style={{maxWidth: '1000px', margin: '0 auto', padding: '24px'}}>
      <PageTitle
        title={hi ? "मेरा उपार्जन केंद्र" : "MY PROCUREMENT CENTRE"}
        sub={hi ? "भोपाल उपार्जन केंद्र - लाइव कतार और चेकपॉइंट स्थिति" : "Bhopal Procurement Centre - Live Queue & Checkpoint Status"}
      />
      
      <div style={{background: 'white', border: '1px solid #D9E2DC', borderRadius: '8px', padding: '24px', marginBottom: '24px'}}>
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px'}}>
            <div>
               <h3 style={{color: '#12344D', margin: '0 0 8px 0', fontSize: '20px'}}>Bhopal Wheat Procurement Centre</h3>
               <p style={{color: '#53645B', margin: 0, fontSize: '14px'}}>District: Bhopal | Address: Mandi Campus, Bhopal | Open: 08:00 AM – 06:00 PM</p>
            </div>
            <span style={{background: '#E8F3EC', color: '#176B4C', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px'}}>STATUS: OPEN</span>
         </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
        <div style={{background: 'white', border: '1px solid #D9E2DC', padding: '16px', borderRadius: '8px'}}>
           <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Your Token</div>
           <div style={{fontSize: '24px', fontWeight: 'bold', color: '#12344D'}}>WHT-028</div>
        </div>
        <div style={{background: 'white', border: '1px solid #D9E2DC', padding: '16px', borderRadius: '8px'}}>
           <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Current Queue Position</div>
           <div style={{fontSize: '24px', fontWeight: 'bold', color: '#12344D'}}>18</div>
           <div style={{fontSize: '12px', color: '#C96B16', marginTop: '4px'}}>12 Farmers Ahead</div>
        </div>
        <div style={{background: 'white', border: '1px solid #D9E2DC', padding: '16px', borderRadius: '8px'}}>
           <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Estimated Waiting Time</div>
           <div style={{fontSize: '24px', fontWeight: 'bold', color: '#12344D'}}>42 min</div>
        </div>
        <div style={{background: 'white', border: '1px solid #D9E2DC', padding: '16px', borderRadius: '8px'}}>
           <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Centre Capacity (Today)</div>
           <div style={{fontSize: '24px', fontWeight: 'bold', color: '#12344D'}}>72 / 100</div>
           <div style={{fontSize: '12px', color: '#176B4C', marginTop: '4px'}}>Moderate Queue</div>
        </div>
      </div>

      <h3 style={{color: '#12344D', marginBottom: '16px', fontSize: '18px', borderBottom: '1px solid #D9E2DC', paddingBottom: '8px'}}>
         {hi ? "केंद्र चेकपॉइंट स्थिति" : "CENTRE CHECKPOINT STATUS"}
      </h3>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
         {checkpoints.map((cp, idx) => (
           <div key={cp.id} style={{display: 'flex', background: 'white', border: cp.active ? '2px solid #C96B16' : '1px solid #D9E2DC', borderRadius: '8px', overflow: 'hidden'}}>
              <div style={{background: cp.active ? '#FFF0E2' : '#F5F7F5', width: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #D9E2DC'}}>
                 <div style={{width: '2px', height: '10px', background: idx === 0 ? 'transparent' : '#D9E2DC'}}></div>
                 <div style={{width: '24px', height: '24px', borderRadius: '50%', background: getStatusColor(cp.status), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'}}>
                   {cp.status === 'Completed' ? '✓' : (idx + 1)}
                 </div>
                 <div style={{width: '2px', height: '10px', background: idx === checkpoints.length - 1 ? 'transparent' : '#D9E2DC', flex: 1}}></div>
              </div>
              <div style={{padding: '16px', flex: 1, display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between'}}>
                 <div>
                    <b style={{display: 'block', fontSize: '16px', color: '#12344D', marginBottom: '4px'}}>{cp.name} {cp.active && <span style={{fontSize: '11px', background: '#C96B16', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px'}}>CURRENT CHECKPOINT</span>}</b>
                    <span style={{fontSize: '13px', color: '#53645B'}}>Status: {cp.status} | Avg Processing: {cp.time}</span>
                 </div>
                 <div style={{display: 'flex', gap: '16px', textAlign: 'center'}}>
                    <div style={{background: '#F5F7F5', padding: '8px 16px', borderRadius: '4px'}}>
                       <b style={{display: 'block', color: '#12344D', fontSize: '16px'}}>{cp.farmers}</b>
                       <span style={{fontSize: '11px', color: '#53645B'}}>{hi ? 'किसान' : 'Farmers'}</span>
                    </div>
                    {cp.id !== 'pay' && cp.id !== 'parchi' && cp.id !== 'reg' && (
                       <div style={{background: '#F5F7F5', padding: '8px 16px', borderRadius: '4px'}}>
                          <b style={{display: 'block', color: '#12344D', fontSize: '16px'}}>{cp.vehicles}</b>
                          <span style={{fontSize: '11px', color: '#53645B'}}>{hi ? 'वाहन' : 'Vehicles'}</span>
                       </div>
                    )}
                 </div>
              </div>
           </div>
         ))}
      </div>
      
      <div style={{display: 'flex', gap: '16px', marginTop: '24px'}}>
         <button onClick={downloadSlip} style={{background: '#176B4C', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Download size={16}/> {hi ? 'टोकन स्लिप डाउनलोड करें' : 'Download Token Slip'}
         </button>
         <div style={{fontSize: '12px', color: '#53645B', alignSelf: 'center'}}>
            * {hi ? 'प्रोटोटाइप / डेमो डेटा' : 'Prototype / Demo Data'} | Last Updated: 2 min ago
         </div>
      </div>
    </div>
  );
}

function Dashboard({ farmer, centres, setPage, setToast, hi = false }) {
  const c = centres[0];
  return (
    <span>
      <section className="hero">
        <div>
          <p className="eyebrow light">
            {hi ? "अगला उपार्जन स्लॉट" : "NEXT PROCUREMENT SLOT"}
          </p>
          <h2>
            {farmer?.crop || "Wheat"}{" "}
            {hi ? "की खरीद निर्धारित है" : "is scheduled for procurement"}
          </h2>
          <p>20 September 2026 • 10:30 AM – 12:00 PM</p>
          <button className="primary" onClick={() => setPage("sell")}>
            {hi ? "लाइव मंडी स्थिति देखें" : "View live mandi status"} →
          </button>
        </div>
        <div className="hero-icon">🌾</div>
      </section>
      <section className="grid four">
        <Stat
          icon={Users}
          label={hi ? "कतार में किसान" : "Farmers in queue"}
          value={c?.queue ?? "--"}
          sub={hi ? "लाइव डेमो" : "live demo value"}
        />
        <Stat
          icon={Clock3}
          label={hi ? "अनुमानित प्रतीक्षा" : "Estimated waiting"}
          value={c ? `${c.estimatedWaitMinutes} ${hi ? "मिनट" : "min"}` : "--"}
          sub={hi ? "हर 10 सेकंड अपडेट" : "updates every 10 sec"}
        />
        <Stat
          icon={TrendingUp}
          label={hi ? "गेहूं का मॉडल भाव" : "Wheat modal price"}
          value="₹2,510"
          sub={hi ? "उदाहरण बाजार data" : "illustrative market data"}
        />
        <Stat
          icon={WalletCards}
          label={hi ? "भुगतान" : "Payment"}
          value={farmer?.paymentStatus || "Pending"}
          sub={hi ? "उपार्जन के बाद" : "after procurement"}
        />
      </section>
      <section className="two-col">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Live mandi status</h3>
              <p>Current queue and centre load</p>
            </div>
            <span className="badge green">LIVE DEMO</span>
          </div>
          <div className="live-box">
            <div>
              <b>{c?.name || "Sehore Procurement Centre"}</b>
              <small>Open today: 8:00 AM – 6:00 PM</small>
            </div>
            <div className="live-metrics">
              <b>
                {c?.queue ?? "--"}
                <small>waiting</small>
              </b>
              <b>
                {c?.estimatedWaitMinutes ?? "--"} min<small>wait</small>
              </b>
              <b>
                {c?.load ?? "--"}%<small>load</small>
              </b>
            </div>
          </div>
          <div className="mini-actions">
            <button className="outline" onClick={() => setPage("centres")}>
              <MapPin size={15} /> Compare centres
            </button>
            <button
              className="outline"
              onClick={() =>
                setToast("Queue change notifications enabled for demo.")
              }
            >
              <Bell size={15} /> Enable alerts
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Smart arrival recommendation</h3>
              <p>Based on slot + current queue</p>
            </div>
            <CalendarClock size={20} />
          </div>
          <div className="recommend">
            <div className="big">10:15 AM</div>
            <div>
              <b>Recommended arrival</b>
              <p>15 minutes before your 10:30 AM slot</p>
            </div>
          </div>
          <div className="tip">
            🔔 Slot/time changes can trigger an app/SMS notification in the
            final integration.
          </div>
        </div>
      </section>
      <section className="quick">
        <button onClick={() => setPage("prices")}>
          <TrendingUp />
          Check crop prices
        </button>
        <button onClick={() => setPage("assistant")}>
          <Bot />
          Ask AI assistant
        </button>
        <button onClick={() => setPage("feedback")}>
          <Star />
          Rate centre
        </button>
      </section>
    </span>
  );
}

function SellCrop({ farmer, centres, setToast, hi = false }) {
  const [bookedSlot, setBookedSlot] = useState(null);
  
  const slots = [
    { time: "09:00 AM – 10:00 AM", capacity: 30, booked: 18, remaining: 12 },
    { time: "10:00 AM – 11:00 AM", capacity: 30, booked: 26, remaining: 4 },
    { time: "11:00 AM – 12:00 PM", capacity: 30, booked: 30, remaining: 0 },
    { time: "12:00 PM – 01:00 PM", capacity: 30, booked: 15, remaining: 15 },
  ];

  const handleBook = (slot) => {
    if(slot.remaining === 0) return;
    setBookedSlot(slot);
    setToast(hi ? "स्लॉट सफलतापूर्वक बुक हो गया।" : "Slot booked successfully.");
  };

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '24px'}}>
      <PageTitle
        title={hi ? "स्लॉट बुकिंग" : "Slot Booking"}
        sub={hi ? "अपनी फसल बेचने के लिए एक खाली स्लॉट चुनें।" : "Select an available time slot to sell your crop."}
      />

      {bookedSlot ? (
        <div style={{background: 'white', border: '2px solid #176B4C', borderRadius: '12px', padding: '32px', textAlign: 'center'}}>
           <div style={{color: '#176B4C', marginBottom: '16px'}}>
              <CheckCircle2 size={48} style={{margin: '0 auto'}}/>
           </div>
           <h3 style={{color: '#12344D', fontSize: '24px', margin: '0 0 16px 0'}}>{hi ? "बुकिंग कन्फर्म हो गई" : "Booking Confirmed"}</h3>
           
           <div style={{background: '#F5F7F5', border: '1px solid #D9E2DC', borderRadius: '8px', padding: '24px', margin: '0 auto', maxWidth: '400px', textAlign: 'left'}}>
              <div style={{marginBottom: '12px'}}>
                 <div style={{fontSize: '12px', color: '#53645B'}}>{hi ? "टोकन नंबर" : "Token Number"}</div>
                 <div style={{fontSize: '24px', fontWeight: 'bold', color: '#12344D'}}>WHT-{Math.floor(100 + Math.random() * 900)}</div>
              </div>
              <div style={{marginBottom: '12px'}}>
                 <div style={{fontSize: '12px', color: '#53645B'}}>{hi ? "उपार्जन केंद्र" : "Procurement Centre"}</div>
                 <div style={{fontSize: '16px', fontWeight: 'bold', color: '#12344D'}}>{farmer?.centre?.name || "Bhopal Procurement Centre"}</div>
              </div>
              <div style={{marginBottom: '12px'}}>
                 <div style={{fontSize: '12px', color: '#53645B'}}>{hi ? "दिनांक" : "Date"}</div>
                 <div style={{fontSize: '16px', fontWeight: 'bold', color: '#12344D'}}>20 September 2026</div>
              </div>
              <div>
                 <div style={{fontSize: '12px', color: '#53645B'}}>{hi ? "समय" : "Time"}</div>
                 <div style={{fontSize: '16px', fontWeight: 'bold', color: '#12344D'}}>{bookedSlot.time}</div>
              </div>
           </div>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
           <div style={{background: 'white', border: '1px solid #D9E2DC', borderRadius: '8px', padding: '24px', marginBottom: '16px'}}>
              <b style={{display: 'block', color: '#12344D', marginBottom: '8px'}}>{hi ? "दिनांक चुनें" : "Select Date"}</b>
              <div style={{padding: '12px', border: '2px solid #176B4C', borderRadius: '4px', background: '#E8F3EC', color: '#176B4C', fontWeight: 'bold', display: 'inline-block'}}>
                 20 September 2026
              </div>
           </div>

           {slots.map((s, idx) => (
             <div key={idx} style={{background: 'white', border: '1px solid #D9E2DC', borderRadius: '8px', padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between', opacity: s.remaining === 0 ? 0.6 : 1}}>
                <div>
                   <b style={{fontSize: '18px', color: '#12344D', display: 'block', marginBottom: '8px'}}>{s.time}</b>
                   <div style={{display: 'flex', gap: '16px'}}>
                      <span style={{fontSize: '14px', color: '#53645B'}}>{hi ? "बुक हुए:" : "Booked:"} <b>{s.booked}</b></span>
                      <span style={{fontSize: '14px', color: '#53645B'}}>{hi ? "कुल क्षमता:" : "Capacity:"} <b>{s.capacity}</b></span>
                   </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
                   <div style={{textAlign: 'right'}}>
                      <span style={{display: 'block', fontSize: '24px', fontWeight: 'bold', color: s.remaining === 0 ? '#991B1B' : '#176B4C'}}>{s.remaining === 0 ? (hi ? "FULL" : "FULL") : s.remaining}</span>
                      <span style={{fontSize: '12px', color: '#53645B'}}>{hi ? "स्लॉट उपलब्ध" : "Available"}</span>
                   </div>
                   <button 
                     onClick={() => handleBook(s)}
                     disabled={s.remaining === 0}
                     style={{background: s.remaining === 0 ? '#D9E2DC' : '#176B4C', color: s.remaining === 0 ? '#53645B' : 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: s.remaining === 0 ? 'not-allowed' : 'pointer'}}
                   >
                     {hi ? "बुक करें" : "Book Slot"}
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}

function Centres({ centres, setToast, hi }) {
  const handle3DView = () => {
     if(window.confirm(hi ? "3D दृश्य अधिक डेटा का उपयोग कर सकता है। क्या आप जारी रखना चाहते हैं?" : "3D view may use more data. Continue?")) {
         setToast(hi ? "3D दृश्य लोड हो रहा है..." : "Loading 3D Crowd View...");
     }
  };

  return (
    <div style={{maxWidth: '1000px', margin: '0 auto', padding: '24px'}}>
      <PageTitle
        title={hi ? "मंडी एवं उपार्जन केंद्र" : "Mandi & Procurement Centres"}
        sub={hi ? "प्रस्थान से पहले कतार, अनुमानित प्रतीक्षा और केंद्र का समय जांचें।" : "Check queue, estimated wait and centre timings before travelling."}
      />
      <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        {centres.map((c) => (
          <div key={c.id} style={{background: 'white', border: '1px solid #D9E2DC', borderRadius: '12px', padding: '24px'}}>
             <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #D9E2DC'}}>
                <div>
                   <h3 style={{color: '#12344D', margin: '0 0 8px 0', fontSize: '22px'}}>{c.name}</h3>
                   <p style={{color: '#53645B', margin: 0, fontSize: '14px', display: 'flex', gap: '16px'}}>
                      <span>District: {c.district}</span>
                      <span>Address: Mandi Campus, {c.district}</span>
                   </p>
                </div>
                <div style={{textAlign: 'right'}}>
                   <span style={{background: c.status === "Low" ? '#E8F3EC' : c.status === "Medium" ? '#FFF0E2' : '#FEE2E2', color: c.status === "Low" ? '#176B4C' : c.status === "Medium" ? '#C96B16' : '#991B1B', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px'}}>
                      {c.status.toUpperCase()} QUEUE
                   </span>
                   <div style={{fontSize: '12px', color: '#53645B', marginTop: '8px'}}>Last Updated: 2 min ago</div>
                </div>
             </div>

             <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', marginBottom: '24px'}}>
                <div>
                   <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Timings</div>
                   <div style={{fontSize: '16px', color: '#12344D', fontWeight: 'bold'}}>08:00 AM – 06:00 PM</div>
                </div>
                <div>
                   <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Today's Status</div>
                   <div style={{fontSize: '16px', color: '#176B4C', fontWeight: 'bold'}}>OPEN</div>
                </div>
                <div>
                   <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Current Crop Procured</div>
                   <div style={{fontSize: '16px', color: '#12344D', fontWeight: 'bold'}}>Wheat</div>
                </div>
                <div>
                   <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Wheat MSP</div>
                   <div style={{fontSize: '16px', color: '#12344D', fontWeight: 'bold'}}>₹2400 / quintal <span style={{fontSize: '10px', color: '#C96B16'}}>[Demo]</span></div>
                </div>
             </div>

             <div style={{background: '#F5F7F5', border: '1px solid #D9E2DC', borderRadius: '8px', padding: '16px', marginBottom: '24px'}}>
                <h4 style={{color: '#12344D', margin: '0 0 16px 0', fontSize: '14px'}}>LIVE QUEUE STATUS</h4>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '24px'}}>
                   <div>
                      <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Current Queue</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: '#12344D'}}>{c.queue} Farmers</div>
                   </div>
                   <div>
                      <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Estimated Waiting</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: '#C96B16'}}>{c.estimatedWaitMinutes} min</div>
                   </div>
                   <div>
                      <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Vehicles Ahead</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: '#12344D'}}>{Math.floor(c.queue / 3)}</div>
                   </div>
                   <div>
                      <div style={{fontSize: '12px', color: '#53645B', marginBottom: '4px'}}>Slot Availability</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: '#176B4C'}}>24 Slots Left</div>
                   </div>
                </div>
             </div>

             <div>
                <button onClick={handle3DView} style={{background: '#12344D', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
                   <Users size={18}/> {hi ? "3D भीड़ दृश्य देखें" : "3D Crowd View"}
                </button>
                <div style={{fontSize: '11px', color: '#53645B', marginTop: '8px'}}>* {hi ? "डेटा का उपयोग हो सकता है" : "May use more data"}</div>
             </div>

          </div>
        ))}
      </div>
    </div>
  );
}

function Prices({ hi }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      initialPrices.filter(
        (p) =>
          p.crop.toLowerCase().includes(query.toLowerCase()) ||
          p.mandi.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <div style={{maxWidth: '1000px', margin: '0 auto', padding: '24px'}}>
      <PageTitle
        title={hi ? "वर्तमान बाज़ार भाव (MSP)" : "Current Market Prices (MSP)"}
        sub={hi ? "प्रोटोटाइप / डेमो डेटा: उत्पादन उपयोग से पहले लाइव मंडी API कनेक्ट करें।" : "Prototype / Demo Data: Connect a live mandi API before production use."}
      />
      <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
        <div style={{flex: 1, position: 'relative'}}>
           <div style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#53645B'}}>
              <Search size={18}/>
           </div>
           <input
             placeholder={hi ? "फसल या मंडी खोजें..." : "Search crop or mandi..."}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #D9E2DC', fontSize: '16px'}}
           />
        </div>
      </div>
      
      <div style={{background: 'white', border: '1px solid #D9E2DC', borderRadius: '8px', overflow: 'hidden'}}>
         <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead style={{background: '#F5F7F5', borderBottom: '1px solid #D9E2DC'}}>
               <tr>
                  <th style={{padding: '16px', color: '#53645B', fontSize: '14px', fontWeight: 'bold'}}>{hi ? "फसल" : "Crop"}</th>
                  <th style={{padding: '16px', color: '#53645B', fontSize: '14px', fontWeight: 'bold'}}>{hi ? "मंडी" : "Mandi"}</th>
                  <th style={{padding: '16px', color: '#53645B', fontSize: '14px', fontWeight: 'bold'}}>{hi ? "न्यूनतम - अधिकतम" : "Min - Max (₹)"}</th>
                  <th style={{padding: '16px', color: '#53645B', fontSize: '14px', fontWeight: 'bold'}}>{hi ? "मॉडल भाव (MSP)" : "Modal Price (MSP)"}</th>
                  <th style={{padding: '16px', color: '#53645B', fontSize: '14px', fontWeight: 'bold'}}>{hi ? "स्थिति" : "Procurement Status"}</th>
               </tr>
            </thead>
            <tbody>
               {filtered.map((p, idx) => (
                  <tr key={p.crop} style={{borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid #D9E2DC'}}>
                     <td style={{padding: '16px', color: '#12344D', fontWeight: 'bold'}}>🌾 {p.crop}</td>
                     <td style={{padding: '16px', color: '#12344D'}}>{p.mandi}</td>
                     <td style={{padding: '16px', color: '#53645B'}}>₹{p.min.toLocaleString()} – ₹{p.max.toLocaleString()}</td>
                     <td style={{padding: '16px', color: '#176B4C', fontWeight: 'bold', fontSize: '16px'}}>₹{p.modal.toLocaleString()}</td>
                     <td style={{padding: '16px'}}>
                        <span style={{background: '#E8F3EC', color: '#176B4C', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'}}>OPEN</span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
      <div style={{fontSize: '12px', color: '#53645B', marginTop: '16px', textAlign: 'right'}}>
         * Last Updated: 5 mins ago (Demo Data)
      </div>
    </div>
  );
}

function Notifications({ notifications }) {
  return (
    <span>
      <PageTitle
        title="Notifications"
        sub="Slot timing, queue and procurement updates."
      />
      <div className="card notif">
        {notifications.map((n) => (
          <div className="notice-row" key={n.id}>
            <div className="notice-icon">
              <Bell size={17} />
            </div>
            <div>
              <b>{n.title}</b>
              <p>{n.text}</p>
            </div>
            <small>{n.time}</small>
          </div>
        ))}
      </div>
    </span>
  );
}

function Payment({ farmer }) {
  return (
    <span>
      <PageTitle
        title="Payment Tracking"
        sub="Follow the amount due after procurement."
      />
      <div className="grid three">
        <Stat
          icon={WalletCards}
          label="Expected value"
          value={`₹${(farmer?.expectedValue || 115200).toLocaleString("en-IN")}`}
          sub="illustrative demo"
        />
        <Stat
          icon={Wheat}
          label="Procurement"
          value={farmer?.procurementStatus || "Scheduled"}
          sub="awaiting centre visit"
        />
        <Stat
          icon={Bell}
          label="Payment alerts"
          value="ON"
          sub="app / SMS ready"
        />
      </div>
      <div className="card payment-note">
        <CheckCircle2 />
        <div>
          <b>Payment journey</b>
          <p>
            Registration → Token → Procurement → Quality check → Payment
            processing → Bank credit.
          </p>
        </div>
      </div>
    </span>
  );
}

function Feedback({ setToast }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const submit = async () => {
    if (!rating) {
      setToast("Please select a rating first.");
      return;
    }
    try {
      await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId,
          centreId: "C001",
          rating,
          comment: text,
        }),
      });
    } catch {}
    setText("");
    setToast(`Feedback submitted: ${rating}/5. Thank you!`);
  };
  return (
    <span>
      <PageTitle
        title="Centre Feedback"
        sub="Tell us about waiting, weighing, staff support and facilities."
      />
      <div className="card feedback">
        <h3>Sehore Procurement Centre</h3>
        <p>How was your selling experience?</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={n <= rating ? "selected" : ""}
              onClick={() => setRating(n)}
            >
              <Star fill={n <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your feedback..."
        />
        <button className="primary dark" onClick={submit}>
          <Send size={16} /> Submit feedback
        </button>
      </div>
    </span>
  );
}

function PageTitle({ title, sub }) {
  const titles = {
    "Sell Crop": "फसल बेचें",
    "Mandi & Procurement Centres": "मंडी और उपार्जन केंद्र",
    "Current Market Prices": "वर्तमान बाजार भाव",
    Notifications: "सूचनाएं",
    "Payment Tracking": "भुगतान ट्रैकिंग",
    "Centre Feedback": "केंद्र फीडबैक",
    Fertilizer: "उर्वरक",
    "AI Help Agent": "AI किसान सहायक",
  };
  const subs = {
    "Track your procurement, slot, queue and seller count by crop.":
      "अपनी खरीद, स्लॉट, कतार और किसानों की संख्या ट्रैक करें.",
    "Check queue, seller count, estimated wait and opening/closing time before travelling.":
      "यात्रा से पहले कतार, किसानों की संख्या, प्रतीक्षा और खुलने-बंद होने का समय देखें.",
    "Illustrative prices for the SIH prototype. Connect an authorized live mandi source before production use.":
      "SIH prototype के उदाहरण भाव. Production में authorized live mandi source जोड़ें.",
    "Slot timing, queue and procurement updates.":
      "स्लॉट समय, कतार और उपार्जन अपडेट.",
    "Follow the amount due after procurement.":
      "उपार्जन के बाद मिलने वाली राशि को ट्रैक करें.",
    "Tell us about waiting, weighing, staff support and facilities.":
      "प्रतीक्षा, तौल, staff support और सुविधाओं के बारे में बताएं.",
  };
  return (
    <div className="page-title">
      <h2>{activeHindi ? titles[title] || title : title}</h2>
      <p>{activeHindi ? subs[sub] || sub : sub}</p>
    </div>
  );
}
function Info({ label, value }) {
  return (
    <div className="info">
      <small>{label}</small>
      <b>{value}</b>
    </div>
  );
}
function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="stat">
      <Icon size={20} />
      <span>{label}</span>
      <b>{value}</b>
      <small>{sub}</small>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
