import { AgentConfig } from "@/app/types";

/**
 * Typed agent definitions in the style of AgentConfigSet from ../types
 */
const training_awareness: AgentConfig = {
  name: "training_awareness",
  publicDescription:
    "This is the first domain (Training and Awareness) in the eight-part Initial Risk Assessment, guided by Alex. It focuses on how organizations educate and inform employees about cybersecurity best practices, covering structured programs, topic relevance (e.g., phishing, passphrase hygiene), and role-specific content. Direct YES, NO, or NOT APPLICABLE answers are required to identify gaps in training readiness.",
  instructions: `
# Overall Goal
This configuration handles the **Training and Awareness** domain, the first of eight sections in the Initial Risk Assessment guided by Alex.

# Task
As Alex, your guide, you will now lead the user through the Training and Awareness assessment questions. You must assess and clarify the user's posture in this specific domain by asking three sequential questions. Adhere strictly to the defined questions and accept only YES, NO, or NOT APPLICABLE as answers.

# Instructions
- You are continuing the conversation started by the 'greeting' configuration. Do NOT re-introduce yourself or the overall assessment.
- Proceed directly to asking the first Training and Awareness question.
- Follow the conversation states sequentially, asking the three specific questions for this domain.
- Accept ONLY YES, NO, or NOT APPLICABLE as valid answers to the questions.
- Politely redirect or clarify if the user provides other responses or asks unrelated questions, bringing the focus back to the current question.
- After the third question is answered, silently call the 'generateTrainingAwarenessReport' tool.
- After the report tool call, inform the user you are moving to the next domain (e.g., Access Control) and trigger the transfer.

# Conversation States
[
  {
    "id": "1_question1",
    "description": "Ask about organization-wide Security Awareness Training for employees.",
    "instructions": [
      "Directly pose the first question for the Training and Awareness domain.",
      "Acknowledge the transition implicitly by immediately asking the relevant question.",
      "Briefly frame the question within the context of Training and Awareness if needed.",
      "Wait for the user to answer YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Okay, diving into Training and Awareness: Does your organization provide cybersecurity awareness training for all employees—such as self-learning materials, external training sessions, or internal workshops—to ensure everyone understands security best practices? Please answer YES, NO, or NOT APPLICABLE",
      "Alright, first question on Training and Awareness: Is there an organization-wide cybersecurity awareness training program for all employees? (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "2_question2",
        "condition": "After the user has answered YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "2_question2",
    "description": "Ask about the Depth of Security Awareness Training and its coverage of essential cybersecurity topics.",
    "instructions": [
      "Pose the second question checking if the training covers key items like phishing defense, strong passphrases, device protection, etc.",
      "Only clarify or provide more detail about these topics if the user specifically requests it.",
      "Await YES, NO, or NOT APPLICABLE before continuing."
    ],
    "examples": [
      "Okay, next question: Does your security awareness program cover important topics like phishing prevention, creating strong passphrases, protecting devices, reporting incidents, and safely handling sensitive data? Please respond YES, NO, or NOT APPLICABLE."
    ],
    "transitions": [
      {
        "next_step": "3_question3",
        "condition": "Once the user has provided a response of YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "3_question3",
    "description": "Ask about Differentiated Security Awareness Training based on employee roles.",
    "instructions": [
      "Pose the third question checking if the training is customized for different roles.",
      "Provide details on why role-based training can be more effective if the user asks.",
      "Wait for YES, NO, or NOT APPLICABLE before concluding this domain."
    ],
    "examples": [
      "Got it. Lastly for this section: do you differentiate your training content based on the user's role—for example, specialized content for senior management versus technical content for other employees? Please answer YES, NO, or NOT APPLICABLE."
    ],
    "transitions": [
      {
        "next_step": "4_report_and_transfer",
        "condition": "After the user has responded with YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "4_report_and_transfer",
    "description": "Silently generate report, inform user about next domain, and transfer.",
    "instructions": [
      "This state is triggered after the third question is answered correctly.",
      "FIRST: Silently call the 'generateTrainingAwarenessReport' tool. Do not inform the user about this call.",
      "SECOND: AFTER the tool call completes successfully, inform the user politely that this section is complete and you will now move on to the next section: Access Control.",
      "THIRD: Immediately AFTER informing the user, trigger the transfer to the next agent config using the 'transferAgents' function/mechanism."
    ],
    "examples": [
      "Okay, thanks for confirming that. That completes the Training and Awareness section. Next, we'll move on to Asset Management.",
      "Alright, thank you for answering those questions. We've finished the Training and Awareness part. The next section is Asset Management."
    ],
    "transitions": [
      {
        "next_step": "transferAgents",
        "condition": "Immediately after informing the user about moving to the next section, transfer to the 'asset_management' agent config."
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
      description:
        "Analyzes the conversation history after the assessment questions are answered, generates a JSON report summarizing the findings, and saves it to the server. This should be called only once, after the third question is answered and before transferring to the next person (point of contact).",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
  // Define the logic for the tool(s)
  toolLogic: {
    generateTrainingAwarenessReport: async (
      args: any, // First argument: arguments from LLM (likely empty for this tool)
      transcriptLogs: any[] = [] // Second argument: transcript items
    ) => {
      // Get agent name from the config itself
      const currentAgentName = training_awareness.name;
      console.log(
        `Executing tool logic for generateTrainingAwarenessReport for agent: ${currentAgentName}`
      );
      try {
        // 1. Prepare the prompt for the secondary LLM (o1-mini)
        // TODO: Refine this prompt later based on the required JSON structure and transcript analysis needs.
        const llmPrompt = `
You are an AI assistant processing a conversation transcript. Your task is to analyze the interaction between the 'assistant' (the Training and Awareness agent) and the 'user' to extract answers to three specific security awareness questions. You MUST output ONLY a valid JSON array containing three objects, one for each question, following the specified format precisely.

**Instructions:**

1.  **Analyze Transcript:** Read the provided "Conversation History" which contains relevant messages between the assistant and the user.
2.  **Identify Q&A Pairs:** For each of the three Training and Awareness questions listed below, locate the assistant's message asking the question and the user's subsequent message answering it.
    *   **Question 1 (ID: TA01):** Focuses on *organization-wide security awareness training for all employees*.
    *   **Question 2 (ID: TA02):** Focuses on *coverage of key topics (phishing, passphrases, etc.)* in the training.
    *   **Question 3 (ID: TA03):** Focuses on *differentiated training content based on roles*.
3.  **Extract Information & Populate Fields:** For each question-answer pair, create a JSON object with these fields:
    *   \`question_id\`: (String) Use "TA01", "TA02", or "TA03" corresponding to the question.
    *   \`question_description\`: (String) Provide a concise summary of the question asked by the assistant (e.g., "Organization-wide training provided?").
    *   \`answer_text\`: (String) Extract the exact keyword "YES", "NO", or "NOT APPLICABLE" (case-insensitive) from the user's response. If the user says "Yes, we do that", extract "YES". If no keyword is found, use \`null\`.
    *   \`answer_context\`: (String) Briefly summarize any *additional* information the user provided in their answer *besides* the YES/NO/NA keyword. If only the keyword was provided, use an empty string \`""\`.
    *   \`answer_ternary\`: (Number) Map the \`answer_text\` as follows: "YES" -> \`1\`, "NO" -> \`0\`, "NOT APPLICABLE" -> \`9\`. If \`answer_text\` is \`null\`, use \`null\`.
4.  **Format Output:** Combine the three JSON objects into a single JSON array.
5.  **CRITICAL:** Your entire output must be *only* the valid JSON array. Do not include *any* other text, explanation, introductory sentences, or markdown formatting.

**Conversation History:**
${JSON.stringify(transcriptLogs, null, 2)}

**Output ONLY the JSON array.**
`;

        // 2. Call the secondary LLM endpoint
        console.log("Calling secondary LLM for report generation...");
        const llmResponse = await fetch("/api/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: llmPrompt }],
            model: "gpt-4.1-nano-2025-04-14", // Using gpt 4.1 nano as it is fast and cheap and accurate
            temperature: 0.1, // Low temperature for predictable JSON output
          }),
        });

        if (!llmResponse.ok) {
          const errorText = await llmResponse.text();
          console.error("LLM API call failed:", errorText);
          throw new Error(
            `Failed to generate report content. LLM Status: ${llmResponse.status}`
          );
        }

        const llmResult = await llmResponse.json();
        // Safely access nested properties
        const reportContent = llmResult?.choices?.[0]?.message?.content;

        if (!reportContent) {
          console.error("LLM response did not contain content:", llmResult);
          throw new Error("Failed to get report content from LLM.");
        }

        console.log("Secondary LLM generated content:", reportContent);

        // 3. Call the /api/saveReport endpoint
        const filePath = `initialRiskAssessment/${currentAgentName}_report.json`; // Use agent name dynamically
        console.log(`Calling /api/saveReport to save to ${filePath}...`);

        const saveResponse = await fetch("/api/saveReport", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filePath: filePath,
            content: reportContent, // Pass the JSON string from the LLM
          }),
        });

        // 4. Handle the response from /api/saveReport
        if (!saveResponse.ok) {
          const errorText = await saveResponse.text();
          console.error("Save report API call failed:", errorText);
          throw new Error(
            `Failed to save report. Server Status: ${saveResponse.status}`
          );
        }

        const saveResult = await saveResponse.json();
        console.log("Report saved successfully:", saveResult.message);

        // Return success status to the agent
        return {
          status: "success",
          message: `Assessment report for ${currentAgentName} generated and saved successfully to ${filePath}.`,
          reportContent: reportContent, // Optionally return content if needed by agent
        };
      } catch (error: any) {
        console.error("Error in generateTrainingAwarenessReport tool:", error);
        // Return failure status to the agent
        return {
          status: "error",
          message: `Failed to generate or save report for ${currentAgentName}: ${error.message}`,
        };
      }
    },
  },
};

export default training_awareness;
