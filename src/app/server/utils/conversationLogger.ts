import fs from 'fs';
import path from 'path';

interface ConversationMessage {
    agentName: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    message: any; // The actual message content
    error?: any;
}

const logFilePath = path.resolve(process.cwd(), 'conversation_log.json');

// Function to clear/create the log file
function initializeLogFile(): void {
    try {
        // Write an empty array to start fresh or create the file
        fs.writeFileSync(logFilePath, JSON.stringify([], null, 2), 'utf-8');
        console.log(`[Logger] Initialized/Cleared log file: ${logFilePath}`);
    } catch (error) {
        console.error('[Logger] Error initializing conversation log file:', error);
    }
}

// Initialize the log file on module load
initializeLogFile();

// Keep history in memory, but it starts empty now
const conversationHistory: ConversationMessage[] = []; 

// Function to save history to file (appends now)
function appendToLogFile(entry: ConversationMessage): void {
    try {
        // Read current content (or empty array if error/non-existent)
        let currentHistory: ConversationMessage[] = [];
        if (fs.existsSync(logFilePath)) {
            try {
                const fileContent = fs.readFileSync(logFilePath, 'utf-8');
                const parsedData = JSON.parse(fileContent);
                if (Array.isArray(parsedData)) {
                    currentHistory = parsedData;
                }
            } catch (readError) {
                console.error('[Logger] Error reading log file before append, starting fresh:', readError);
            }
        }
        // Append new entry
        currentHistory.push(entry);
        // Write back the full history
        fs.writeFileSync(logFilePath, JSON.stringify(currentHistory, null, 2), 'utf-8');
    } catch (error) {
        console.error('[Logger] Error appending to conversation history file:', error);
    }
}

/**
 * Logs a single message (from user or assistant) to memory and appends to file.
 */
export function logMessage(agentName: string, role: 'user' | 'assistant', message: any, error?: any): void {
    // Basic validation
    if (typeof agentName !== 'string' || !role || message === undefined) {
        console.error('[Logger] logMessage called with incomplete data. Logging skipped.', { agentName, role, messageExists: message !== undefined });
        return;
    }

    const entry: ConversationMessage = {
        agentName,
        role,
        timestamp: new Date(),
        message,
        error,
    };
    // Add to in-memory array (optional, could rely solely on file reading if needed)
    conversationHistory.push(entry); 
    // Append new entry to the log file
    appendToLogFile(entry);

    console.log(`[Logger] Logged ${role} message for ${entry.agentName}`);
    if (entry.error) {
        console.error(`[Logger] Error:`, entry.error);
    }
}

// Returns the history from memory (useful for current session, doesn't re-read file constantly)
export function getFullConversationHistory(): ReadonlyArray<ConversationMessage> {
    // OPTIONAL: Could re-read the file here every time if strict consistency needed
    // return loadHistoryFromFile(); // If loadHistoryFromFile is kept/re-added
    return [...conversationHistory]; 
}

// Clears history from memory and file
export function clearFullConversationHistory(): void {
    console.log('[Logger] Clearing full conversation history from memory and file.');
    // Clear in-memory array
    conversationHistory.length = 0;
    // Clear file content by re-initializing
    initializeLogFile();
}

// Keep logAnswer if it's used elsewhere or for specific answer logging (reverted)
export function logAnswer(questionNumber: number, userResponse: any): void {
    console.log(`[Logger - Answer] Q${questionNumber}: ${userResponse}`);
    // Note: This function does NOT currently save to the persistent log file.
} 