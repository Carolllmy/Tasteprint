import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const client = new Anthropic();

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

app.post("/api/analyze", async (req, res) => {
  try {
    const { image } = req.body; // base64 data URL
    
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Extract base64 data and media type
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    const [, mediaType, base64Data] = match;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: STYLE_EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    const text = response.content[0].text;
    
    // Parse the JSON response
    let style;
    try {
      style = JSON.parse(text);
    } catch (e) {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        style = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse style from response");
      }
    }

    res.json({ style });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files in production
app.use(express.static("dist"));

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`Tasteprint API running on http://localhost:${PORT}`);
});
