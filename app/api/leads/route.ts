import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate email
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert lead (only if DATABASE_URL is configured)
    if (process.env.DATABASE_URL) {
      try {
        const [lead] = await db.insert(leads).values({
          email: data.email,
          name: data.name,
          projectType: data.projectType,
          timeline: data.timeline,
          budgetRange: data.budgetRange,
          message: data.message,
          conversationHistory: data.conversationHistory,
        }).returning();

        console.log('Lead saved:', lead.id);
      } catch (dbError: any) {
        // Handle duplicate email
        if (dbError.code === '23505') {
          return NextResponse.json(
            { error: 'This email is already registered' },
            { status: 409 }
          );
        }
        console.error('Database error:', dbError);
        // Continue even if DB fails - we'll still log the lead
      }
    } else {
      console.log('Lead captured (DB not configured):', data.email);
    }

    // Send email notifications (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send notification to you
        await resend.emails.send({
          from: 'NEXUS-AI <nexus@aidevdanyal.com>',
          to: process.env.NOTIFICATION_EMAIL || 'contact@aidevdanyal.com',
          subject: `🚀 New Lead: ${data.email}`,
          html: `
            <h2>New Lead from aidevdanyal.com</h2>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
            <p><strong>Project Type:</strong> ${data.projectType || 'Not specified'}</p>
            <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
            <p><strong>Budget:</strong> ${data.budgetRange || 'Not specified'}</p>
            <p><strong>Message:</strong> ${data.message || 'None'}</p>
          `,
        });

        // Send confirmation to lead
        await resend.emails.send({
          from: 'Danyal <danyal@aidevdanyal.com>',
          to: data.email,
          subject: 'Thanks for reaching out!',
          html: `
            <h2>Hey${data.name ? ' ' + data.name : ''}!</h2>
            <p>Thanks for your interest in working together. I'll review your project details and get back to you within 24 hours.</p>

            <h3>In the meantime, check out my work:</h3>
            <ul>
              <li><a href="https://aidevdanyal.com/cyberstore">CYBERSTORE - AI E-commerce Demo</a></li>
              <li><a href="https://aidevdanyal.com/workflow-ai">WORKFLOW_AI - SaaS Platform Demo</a></li>
              <li><a href="https://github.com/${process.env.GITHUB_USERNAME || 'yourusername'}">GitHub Projects</a></li>
            </ul>

            <p>Need to talk sooner? <a href="${process.env.NEXT_PUBLIC_CAL_LINK || 'https://cal.com/aidevdanyal/30min'}">Book a call directly</a></p>

            <p>Best,<br>Danyal</p>

            <hr>
            <p style="color: #666; font-size: 12px;">
              AI Dev Danyal | E-commerce & SaaS Developer<br>
              <a href="https://aidevdanyal.com">aidevdanyal.com</a>
            </p>
          `,
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Continue even if email fails
      }
    } else {
      console.log('Email not sent (Resend not configured)');
    }

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully'
    });

  } catch (error: any) {
    console.error('Lead API error:', error);

    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}
