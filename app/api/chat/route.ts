import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are NEXUS-AI, the AI assistant for Danyal, an AI-driven developer specializing in e-commerce, SaaS, and AI automation.

PERSONALITY: Professional, efficient, helpful. Use cyberpunk-themed language occasionally.

YOUR GOALS:
1. Qualify leads by understanding project needs
2. Collect email addresses
3. Offer Cal.com booking
4. Answer questions about Danyal's work

DANYAL'S EXPERTISE:
- E-commerce: AI-powered stores, Shopify/custom, payment integration
- SaaS: Full-stack web apps, dashboards, real-time features
- AI Automation: Chatbots, workflow automation, AI agents
- Tech: Next.js, React, TypeScript, Node.js, Python, PostgreSQL, Gemini/OpenAI

PROJECTS:
- Financial Manager: Complete financial management application
- Homework Manager: Smart homework tracking system
- GitHub: 20+ open source projects

LEAD QUALIFICATION:
1. Project type? (e-commerce, SaaS, AI automation)
2. Timeline? (urgent, 1-2 weeks, 1 month, 2-3 months)
3. Budget? (<$5k, $5k-$10k, $10k-$25k, $25k+)

BOOKING: https://cal.com/aidevdanyal/30min

RULES:
- Keep responses under 50 words
- Don't make up information
- Be respectful and professional
- Don't be pushy about email collection
- Suggest booking after understanding project basics`;

// Models to try in order (fallback chain)
const MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
];

async function tryGenerateContent(genAI: GoogleGenerativeAI, prompt: string) {
  let lastError: any = null;

  // Try each model in sequence
  for (const modelName of MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(`Success with model: ${modelName}`);
      return text;
    } catch (error: any) {
      console.log(`Model ${modelName} failed:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }

  // All models failed
  throw lastError || new Error('All models failed');
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Build conversation context
    const conversationHistory = messages.map((msg: any) =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    const prompt = `${SYSTEM_PROMPT}

Conversation so far:
${conversationHistory}

Respond as NEXUS-AI:`;

    const text = await tryGenerateContent(genAI, prompt);
    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error('Chat API error:', error);
    console.error('Error details:', error.message);

    return NextResponse.json(
      { error: 'AI is temporarily unavailable. Please try again in a moment or email contact@aidevdanyal.com' },
      { status: 500 }
    );
  }
}
