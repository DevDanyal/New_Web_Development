import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are NEXUS-AI, the AI assistant for Danyal, an AI-driven developer specializing in e-commerce, SaaS, and AI automation.

PERSONALITY: Professional, efficient, helpful. Use cyberpunk-themed language occasionally.

YOUR GOALS:
1. Answer questions about Danyal's work and expertise
2. Understand project needs and requirements
3. Provide contact information when requested
4. Help potential clients get in touch with Danyal

DANYAL'S EXPERTISE:
- E-commerce: AI-powered stores, Shopify/custom, payment integration, product recommendations
- SaaS: Full-stack web apps, dashboards, real-time features, user management
- AI Automation: Chatbots, workflow automation, AI agents, process optimization
- Tech Stack: Next.js, React, TypeScript, Node.js, Python, PostgreSQL, Gemini/OpenAI APIs
- Specialties: Fast delivery, quality code, clear communication

FEATURED PROJECTS:
- Financial Manager: Complete financial management application with expense tracking and analytics
- Homework Manager: Smart homework and assignment tracking system with deadline reminders
- 20+ open source projects on GitHub

CONTACT INFORMATION (Use these exact formats):
- Email: [EMAIL]aidevdanyal@gmail.com[/EMAIL]
- WhatsApp: [WHATSAPP]+92 346 4141007[/WHATSAPP]
- GitHub: https://github.com/DevDanyal
- LinkedIn: https://www.linkedin.com/in/dev-danyal-72b295405/

WHEN TO SHARE CONTACT:
- When user wants to discuss a project
- When user asks how to get in touch
- When user is ready to hire or start a project
- When user asks for a call or meeting
- Always encourage them to click the email or WhatsApp link to message directly

LEAD QUALIFICATION (Ask naturally):
1. What type of project? (e-commerce, SaaS, AI automation, other)
2. What's the timeline? (urgent, few weeks, 1-2 months, flexible)
3. Any specific features or requirements?

RULES:
- Keep responses concise (under 80 words)
- Be helpful and answer questions directly
- Don't make up information about Danyal's work
- When sharing contact info, always use the [EMAIL] and [WHATSAPP] tags
- Encourage users to click the links to message directly
- Be professional but friendly
- If asked about pricing, suggest contacting Danyal directly for a custom quote`;

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
      { error: 'AI is temporarily unavailable. Please try again in a moment or email aidevdanyal@gmail.com' },
      { status: 500 }
    );
  }
}
