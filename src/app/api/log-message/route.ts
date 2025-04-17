import { NextResponse } from 'next/server';
import { logMessage } from '@/app/server/utils/conversationLogger'; // Import the server-side logger

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
    const { agentName, role, message, error } = body;

    // Basic validation on the server side as well
    if (typeof agentName !== 'string' || (role !== 'user' && role !== 'assistant') || message === undefined) {
      // Log the problematic body before sending the error response
      console.error('[API /api/log-message] Invalid log data received:', body);
      return NextResponse.json({ error: 'Invalid log data' }, { status: 400 });
    }

    // Call the actual logger function (which writes to file)
    logMessage(agentName, role, message, error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/log-message] Error:', err);
    // Log the body if available, especially useful for JSON parsing errors
    if (err instanceof SyntaxError) {
        console.error('[API /api/log-message] Request body causing SyntaxError:', await request.text().catch(() => 'Could not read body'));
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    // Log the potentially already parsed body if error happened later
    if (body) {
        console.error('[API /api/log-message] Request body during other error:', body);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 