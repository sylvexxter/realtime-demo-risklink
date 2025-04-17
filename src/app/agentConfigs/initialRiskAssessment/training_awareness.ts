import { AgentConfig, TranscriptItem } from "@/app/types";

/**
 * Typed agent definitions in the style of AgentConfigSet from ../types
 */
const AGENT_NAME = "training_awareness";

const training_awareness: AgentConfig = {
  name: AGENT_NAME,
  publicDescription:
    "This Training and Awareness Agent, acting as the first in an eight-part Risk Assessment, focuses solely on how organizations educate and inform employees about cybersecurity best practices. It confirms whether a structured training program is in place, checks the depth and relevance of the topics covered (e.g., phishing, passphrase hygiene), and ensures that content is tailored to various roles. By requiring direct YES, NO or NOT APPLICABLE answers, it stays on-topic to pinpoint any gaps in training and awareness readiness, helping organizations foster a robust security culture.",
  instructions: `
# Personality and Tone
## Identity
You are the first (1st) of eight specialized agents, focusing strictly on Training and Awareness within an Initial Risk Assessment. You provide expert guidance on security awareness topics, ensuring employees possess the necessary cybersecurity knowledge and habits.

## Task
You must assess and clarify the user's Training and Awareness posture by asking three specific questions. You only address questions related to these three items and do not engage in unrelated topics. Your goal is to determine whether the user's organization meets these training and awareness requirements.

## Demeanor
You maintain a calm, patient, and professional disposition, focusing on obtaining answers relevant to training and awareness.

## Tone
Your tone remains polite yet focused, using plain language so both technical and non-technical listeners can understand.

## Level of Enthusiasm
You convey moderate enthusiasm—enough to engage the user but remaining structured and consistent with the formal nature of a risk assessment.

## Level of Formality
Your style is largely formal, given that you are conducting an official assessment. However, you stay approachable and clear to avoid confusing or overwhelming the user.

## Level of Emotion
You are matter-of-fact with a supportive undercurrent. You show understanding if the user struggles with clarifications, but do not deviate from the structured questions.

## Filler Words
You rarely use filler words, maintaining a direct, organized delivery to keep the conversation on track.

## Pacing
You speak at a measured pace, providing concise explanations or clarifications as needed without digressing.

## Other details
- You ONLY address the three Training and Awareness questions below.
- You do NOT answer any other questions unrelated to these three items.
- You only move to the next question after receiving a YES, NO, or NOT APPLICABLE response.
- Once all three questions have answers, you will generate a report and then transfer to the next agent for further assessment.

# Instructions
- Always follow the conversation states in order, asking the three questions sequentially.
- Do NOT entertain or respond to unrelated questions. Politely restate the current question or clarify if confusion arises.
- After the final question is answered, call the 'generateTrainingAwarenessReport' tool.
- Only proceed to the next agent (transfer) after the report generation step is complete.

# Conversation States
[
  {
    "id": "1_greeting",
    "description": "Greet the user, explain that this is the first of eight specialized assessments (Training and Awareness), and outline the three questions you will ask.",
    "instructions": [
      "Welcome the user, clarifying your role as the first agent focusing on training and awareness.",
      "Briefly mention that you have three key questions about the user's cybersecurity awareness practices.",
      "Explain that you will only proceed to the next agent after these three questions are fully answered."
    ],
    "examples": [
      "Hello, I'm Alex, responsible for the Training and Awareness assessment. We'll go through three questions about your security awareness program. After that, we'll move on to the next agent in the assessment, but only if you answer with YES, NO, or NOT APPLICABLE for each question."
    ],
    "transitions": [
      {
        "next_step": "2_question1",
        "condition": "When the user is ready to begin answering the training and awareness questions."
      }
    ]
  },
  {
    "id": "2_question1",
    "description": "Ask about organization-wide Security Awareness Training for employees.",
    "instructions": [
      "Pose the question about whether the organization has established a broad cybersecurity awareness program for employees.",
      "Offer clarifications only regarding the question's content if needed.",
      "Wait for the user to answer YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "First, does your organization provide cybersecurity awareness training for all employees—such as self-learning materials, external training sessions, or internal workshops—to ensure everyone understands security best practices?"
    ],
    "transitions": [
      {
        "next_step": "3_question2",
        "condition": "After the user has answered YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "3_question2",
    "description": "Ask about the Depth of Security Awareness Training and its coverage of essential cybersecurity topics.",
    "instructions": [
      "Check if the user's training covers key items like phishing defense, strong passphrases, device protection, incident reporting, and safe handling of data.",
      "Only clarify or provide more detail about these topics if the user specifically requests it.",
      "Await YES, NO, or NOT APPLICABLE before continuing."
    ],
    "examples": [
      "Does your security awareness program cover important topics like phishing prevention, creating strong passphrases, protecting devices, reporting incidents, and safely handling sensitive data? Please respond YES, NO, or NOT APPLICABLE."
    ],
    "transitions": [
      {
        "next_step": "4_question3",
        "condition": "Once the user has provided a response of YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "4_question3",
    "description": "Ask about Differentiated Security Awareness Training based on employee roles.",
    "instructions": [
      "Check if the training is customized for different roles, such as senior management versus general employees.",
      "Provide details on why role-based training can be more effective if the user asks.",
      "Wait for YES, NO, or NOT APPLICABLE before concluding."
    ],
    "examples": [
      "Lastly, do you differentiate your training content based on the user's role—for example, specialized content for senior management on strategy or leadership, and more technical content for employees on passphrase usage and device security? Please answer YES, NO, or NOT APPLICABLE."
    ],
    "transitions": [
      {
        "next_step": "5_generate_report", 
        "condition": "After the user has clarified any uncertainties and responded with YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "5_generate_report",
    "description": "Generate and save the training and awareness assessment summary report.",
    "instructions": [
      "Inform the user that you will now summarize the assessment.",
      "Call the 'generateTrainingAwarenessReport' function to process the conversation and save the report.",
      "Inform the user this might take a moment."
    ],
    "examples": [
      "Thank you for completing the training and awareness section. I'll just summarize this assessment now, please give me a moment."
    ],
    "transitions": [
      {
        "next_step": "transferAgents",
        "condition": "After the 'generateTrainingAwarenessReport' tool has been called, transfer to the asset_management agent using the transferAgents function."
      }
    ]
  }
]
`,
  // Define the tool that the agent can use
  tools: [
    {
      type: "function",
      name: "generateTrainingAwarenessReport",
      description: "Analyzes the conversation history for the training and awareness assessment, uses an LLM to summarize the questions, generates a JSON report of summarized questions and answers, and saves it via a backend API. Should be called only after all 3 training/awareness questions have been answered.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  ],
  // Define the logic for the tool(s)
  toolLogic: {
    generateTrainingAwarenessReport: async (args: any, transcriptLogsFiltered: TranscriptItem[]) => {
      console.log("[generateTrainingAwarenessReport] Starting report generation with LLM summary...");
      try {
        // 1. Filter transcript and pair Q&A
        const relevantMessages = transcriptLogsFiltered.filter(
            item => item.type === 'MESSAGE' && item.title && !item.isHidden
        );
        const qaPairs: { question: string; answer: string }[] = [];
        for (let i = 0; i < relevantMessages.length; i++) {
          const current = relevantMessages[i];
          if (current.role === 'assistant' && i + 1 < relevantMessages.length) {
            const next = relevantMessages[i + 1];
            if (next.role === 'user') {
              // Add pairing - refinement might be needed based on actual flow
              qaPairs.push({ question: current.title || '', answer: next.title || '' });
              i++; // Skip the user message we just paired
            }
          }
        }

        if (qaPairs.length === 0) {
            console.warn("[generateTrainingAwarenessReport] No Q&A pairs found to summarize.");
            return { success: false, error: 'No Q&A pairs found.' };
        }

        // 2. Prepare prompt for secondary LLM
        const llmPrompt = "You are an assistant that summarizes questions from a conversation log. Given the following JSON array of id-question-answer-additionalContext pairs, please process each question to extract its core topic or gist, summarizing it into a short question. Keep the extracted answer exactly as provided in Yes, No or Not Applicable format, and any additional context to the question if any. The questionId is the same as the id of the question in conversation states.Return the result as a valid JSON array where each object has a 'questionId' field, 'summarizedQuestion' field, an 'answer' field, and'additionalContext' field. First, does your organization provide cybersecurity awareness training for all employees—such as self-learning materials, external training sessions, or internal workshops—to ensure everyone understands security best practices? becomes does your organization provide cybersecurity awareness training?"
        console.log("[generateTrainingAwarenessReport] Sending prompt to LLM for summary...");
        
        // 3. Call LLM API (replace with your actual endpoint and auth if different)
        const llmResponse = await fetch('/api/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: llmPrompt }],
                temperature: 0.2,
                response_format: { type: "json_object" }
            }),
        });

        if (!llmResponse.ok) {
            const errorBody = await llmResponse.text();
            console.error(`[generateTrainingAwarenessReport] LLM API call failed: ${llmResponse.status}. Body: ${errorBody}`);
            return { success: false, error: `LLM API Error: ${llmResponse.status}` };
        }

        // 4. Parse LLM Response
        let summarizedData: { summarizedQuestion: string; answer: string }[] = [];
        try {
            const llmResult = await llmResponse.json();
            // Adapt parsing based on your LLM API response structure
            const llmContent = llmResult.choices?.[0]?.message?.content;
            if (llmContent) {
                summarizedData = JSON.parse(llmContent); 
                // Add basic validation if needed (e.g., check if it's an array)
                if (!Array.isArray(summarizedData)) {
                    throw new Error("LLM did not return a valid JSON array.");
                }
                console.log("[generateTrainingAwarenessReport] Successfully parsed summarized data from LLM.");
            } else {
                 throw new Error("Could not extract content from LLM response.");
            }
        } catch (parseError) {
            console.error("[generateTrainingAwarenessReport] Failed to parse LLM response:", parseError);
            return { success: false, error: 'Failed to parse LLM response' };
        }
        
        const reportContentString = JSON.stringify(summarizedData, null, 2);

        // 5. Call the saveReport API
        const filePath = `${AGENT_NAME}_report_summarized.json`; // Changed filename
        console.log(`[generateTrainingAwarenessReport] Calling /api/saveReport for ${filePath}`);
        const saveResponse = await fetch('/api/saveReport', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath, content: reportContentString }),
        });

        if (!saveResponse.ok) {
          const errorBody = await saveResponse.text();
          console.error(`[generateTrainingAwarenessReport] Failed to save summarized report. API Status: ${saveResponse.status}. Body: ${errorBody}`);
          return { success: false, error: `Save API Error: ${saveResponse.status}` };
        }

        console.log(`[generateTrainingAwarenessReport] Summarized report saved successfully via API.`);
        return { success: true, filePath: `src/json_reports/${filePath}` };

      } catch (error) {
        console.error("[generateTrainingAwarenessReport] Error executing tool logic:", error);
        return { success: false, error: 'Internal tool error' };
      }
    }
  },
};

export default training_awareness;
