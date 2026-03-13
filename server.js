import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { execSync } from "child_process";
import fs from "fs";
import os from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const STYLE_EXTRACTION_PROMPT = `You are a design system AI that extracts visual taste from images.

Analyze this image and extract a comprehensive design style that can be applied to Material Design 3 components.

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:

{
  "name": "2-4 word evocative style name",
  "vibe": "one sentence describing the overall feeling",
  "colors": {
    "bg": "#hex - main background",
    "card": "#hex - card/surface background", 
    "ac": "#hex - primary accent color",
    "ac2": "#hex - secondary accent",
    "tx": "#hex - primary text (ensure 4.5:1 contrast with bg)",
    "mu": "#hex - muted/secondary text",
    "bd": "rgba() - subtle border color",
    "su": "#hex - subtle surface/hover color"
  },
  "typography": {
    "fontCategory": "sans-serif|serif|monospace|display",
    "fontWeight": "light|regular|medium|bold",
    "letterSpacing": "tight|normal|wide",
    "textTransform": "none|uppercase|lowercase"
  },
  "shape": {
    "borderRadius": "none|sm|md|lg|full",
    "borderWidth": "none|thin|medium|thick"
  },
  "elevation": {
    "style": "flat|subtle|medium|dramatic",
    "type": "shadow|glow|none"
  },
  "density": "compact|comfortable|spacious",
  "texture": {
    "style": "flat|gradient|glassmorphism|neumorphism|grain",
    "gradientAngle": 0-360,
    "gradientIntensity": "subtle|medium|strong"
  },
  "motion": {
    "timing": "instant|snappy|smooth|slow",
    "easing": "linear|ease|bounce|spring",
    "intensity": "minimal|moderate|expressive"
  },
  "personality": ["list", "of", "3-5", "adjectives"]
}

IMPORTANT:
- Extract the VIBE and FEELING, not just literal colors
- Ensure all colors pass WCAG AA accessibility (4.5:1 contrast for text)
- Be creative with the style name - make it evocative and memorable
- If the image has motion/animation, describe the motion style
- Think like a senior product designer interpreting a mood board`;

// Queue for pending analyses (to be processed by Claude)
const pendingAnalyses = new Map();
const completedAnalyses = new Map();

// Save image for analysis and return a ticket
app.post("/api/analyze", async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    // Save image to file for Claude to analyze
    const [, mediaType, base64Data] = match;
    const ext = mediaType.split("/")[1] || "png";
    const ticketId = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    const imgPath = `${os.tmpdir()}/tasteprint-${ticketId}.${ext}`;
    
    fs.writeFileSync(imgPath, Buffer.from(base64Data, "base64"));
    
    // Store pending analysis
    pendingAnalyses.set(ticketId, { imgPath, createdAt: Date.now() });
    
    // Write to a queue file that Claude can read
    const queueFile = `${os.homedir()}/.openclaw/workspace/Tasteprint/.analyze-queue.json`;
    const queue = fs.existsSync(queueFile) ? JSON.parse(fs.readFileSync(queueFile, "utf8")) : [];
    queue.push({ ticketId, imgPath, createdAt: Date.now() });
    fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2));
    
    console.log(`Analysis queued: ${ticketId} -> ${imgPath}`);
    
    res.json({ ticketId, status: "queued" });
  } catch (error) {
    console.error("Queue error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Poll for analysis result
app.get("/api/analyze/:ticketId", (req, res) => {
  const { ticketId } = req.params;
  
  // Check for completed analysis
  const resultFile = `${os.homedir()}/.openclaw/workspace/Tasteprint/.analyze-results/${ticketId}.json`;
  if (fs.existsSync(resultFile)) {
    const style = JSON.parse(fs.readFileSync(resultFile, "utf8"));
    return res.json({ status: "complete", style });
  }
  
  // Check if still pending
  if (pendingAnalyses.has(ticketId)) {
    return res.json({ status: "pending" });
  }
  
  res.status(404).json({ error: "Analysis not found" });
});

// Submit analysis result (called by Claude)
app.post("/api/analyze/:ticketId/result", express.json(), (req, res) => {
  const { ticketId } = req.params;
  const { style } = req.body;
  
  // Save result
  const resultsDir = `${os.homedir()}/.openclaw/workspace/Tasteprint/.analyze-results`;
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
  
  fs.writeFileSync(`${resultsDir}/${ticketId}.json`, JSON.stringify(style, null, 2));
  
  // Clean up
  pendingAnalyses.delete(ticketId);
  
  console.log(`Analysis complete: ${ticketId}`);
  res.json({ success: true });
});

// Serve static files in production
app.use(express.static("dist"));

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`Tasteprint API running on http://localhost:${PORT}`);
});
