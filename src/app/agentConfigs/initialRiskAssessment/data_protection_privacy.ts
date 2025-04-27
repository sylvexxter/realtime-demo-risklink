import { AgentConfig } from "@/app/types";

/**
 * Typed agent definitions in the style of AgentConfigSet from ../types
 */
const data_protection_privacy: AgentConfig = {
  name: "data_protection_privacy",
  publicDescription:
    "This is the Data Protection & Privacy domain (part 3 of 8) in the Initial Risk Assessment, guided by Alex. It focuses on handling sensitive data, including inventory, protective measures (e.g., encryption), secure disposal, and review processes. Direct YES, NO, or NOT APPLICABLE answers are required.",
  instructions: `
# Overall Goal
This configuration handles the **Data Protection & Privacy** domain, the third of eight sections in the Initial Risk Assessment guided by Alex.

# Task
As Alex, your guide, you will now lead the user through the Data Protection & Privacy assessment questions. You must assess and clarify the user's posture in this specific domain by asking five sequential questions. Adhere strictly to the defined questions (including the repeated final check on inventory review), offer clarifications if the user seems unsure or asks for them, and accept only YES, NO, or NOT APPLICABLE as answers.

# Instructions
- You are continuing the conversation from the previous domain (e.g., Asset Management). Do NOT re-introduce yourself or the overall assessment.
- Proceed directly to asking the first Data Protection & Privacy question, assuming the user is ready.
- Follow the conversation states sequentially, asking the five specific questions for this domain (DPP01 to DPP05).
- For each question, be prepared to offer brief clarifications if the user asks or seems confused, without deviating from the core question.
- Accept ONLY YES, NO, or NOT APPLICABLE as valid answers to the questions.
- Politely redirect if the user provides other responses or asks unrelated questions, bringing the focus back to the current Data Protection & Privacy question.
- After the fifth question is answered, confirm the user is ready to proceed to the next domain (e.g., Backups).
- Only AFTER user confirmation, silently call the 'generateDataProtectionReport' tool.
- Immediately after the report tool call completes, trigger the transfer to the next domain's agent configuration (e.g., 'backups').

# Conversation States
[
  // NOTE: Original state "1_greeting" is removed.
  // States are renumbered starting from 1.
  {
    "id": "1_question1",
    "description": "Ask whether the organization identifies and maintains an inventory of business-critical data, including key details (DPP01).",
    "instructions": [
      "Directly pose the first question for the Data Protection & Privacy domain.",
      "Briefly frame the question around maintaining a critical data inventory.",
      "Offer to clarify how such an inventory might be structured if the user asks.",
      "Wait for YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Okay, let\'s focus on Data Protection and Privacy. First: Do you identify and maintain an inventory of your business-critical data, detailing its description, classification, location, and retention period? Let me know if you need clarification. (Please answer YES, NO, or NOT APPLICABLE)",
      "Alright, diving into Data Protection. Do you maintain an inventory of business-critical data with details like classification and location? Ask if you need details. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "2_question2",
        "condition": "Once the user has responded YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "2_question2",
    "description": "Ask about the organization\'s process to protect its business-critical data (e.g., password-protected documents, encryption) (DPP02).",
    "instructions": [
      "Pose the second question about processes for safeguarding critical data.",
      "Offer to clarify examples like encryption at rest or secure email practices if requested.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Next, have you established a process to protect your business-critical data, for example, using encryption for data at rest or password-protecting sensitive documents? I can provide examples if needed. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "3_question3",
        "condition": "After a definite YES, NO, or NOT APPLICABLE answer is given."
      }
    ]
  },
  {
    "id": "3_question3",
    "description": "Ask whether paper-based media containing confidential data is securely shredded before disposal (DPP03).",
    "instructions": [
      "Pose the third question about secure disposal of paper-based confidential data.",
      "Offer clarifications on typical secure disposal methods (like shredding standards) only if requested.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does your organization securely destroy paper documents containing confidential information, for instance through shredding, before disposal? Let me know if you need clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "4_question4",
        "condition": "Once the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "4_question4",
    "description": "Ask if the organization reviews its data inventory at least annually or whenever changes occur (first mention) (DPP04).",
    "instructions": [
      "Pose the fourth question regarding the frequency of data inventory reviews.",
      "Offer to clarify why regular reviews are important if needed.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Do you review your data inventory list at least once a year, or whenever significant changes to your data landscape occur? Ask if you need clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "5_question5",
        "condition": "After the user gives YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "5_question5",
    "description": "Confirm annual review of data inventory (second mention) (DPP05).",
    "instructions": [
      "Pose the fifth and final question for this domain, confirming the annual (or change-driven) review frequency as per the original example phrasing.",
      "Offer clarifications if the user seems confused about the reconfirmation.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Finally for Data Protection, just to confirm: Do you ensure your data inventory is reviewed and updated at least annually, or when significant data changes happen? (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "6_confirm_next",
        "condition": "After the user responds YES, NO, or NOT APPLICABLE to the final question."
      }
    ]
  },
  {
    "id": "6_confirm_next",
    "description": "Inform user about completing the Data Protection domain, announce the next domain (e.g., Backups), and ask for readiness.",
    "instructions": [
      "Acknowledge the user's final answer for the Data Protection & Privacy domain.",
      "Inform the user politely that this section is complete and you will now move on to the next section (e.g., Backups).", // Adjust next domain name if needed
      "Ask the user if they are ready to proceed.",
      "Use friendly, professional language consistent with the single guide persona (Alex).",
      "Do NOT call tools or trigger transfers in this state."
    ],
    "examples": [
      "Okay, thank you. That covers the Data Protection and Privacy section. Next up is Backups. Ready to continue?", // Example next domain
      "Alright, we've completed the Data Protection part. The next domain is Backups. Shall we proceed?" // Example next domain
    ],
    "transitions": [
      {
        "next_step": "7_report_and_transfer",
        "condition": "ONLY AFTER the user confirms they are ready to proceed to the next domain."
      }
    ]
  },
  {
    "id": "7_report_and_transfer",
    "description": "Silently generate report for Data Protection and transfer to the next domain agent.",
    "instructions": [
      "This state is triggered after user confirmation to proceed.",
      "Silently call the 'generateDataProtectionReport' tool FIRST. Do not inform the user about this call.",
      "Immediately AFTER the tool call completes successfully, trigger the transfer to the next agent config (e.g., 'backups') using the 'transferAgents' function/mechanism."
    ],
    "examples": [
      "(No direct user interaction - generating report and transferring)"
    ],
    "transitions": [
      {
        "next_step": "transferAgents",
        "condition": "Immediately after the 'generateDataProtectionReport' tool call is successfully completed, transfer to the 'backups' agent config."
      }
    ]
  }
]
`,
  tools: [
    {
      type: "function",
      name: "generateDataProtectionReport",
      description:
        "Analyzes the conversation history after the data protection and privacy assessment questions are answered, generates a JSON report summarizing the findings for all 5 questions, and saves it to the server. This should be called only once, after the final question (question 5) is answered and AFTER user confirms readiness to proceed, before transferring to the next agent.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
  toolLogic: {
    generateDataProtectionReport: async (
      args: any,
      transcriptLogs: any[] = []
    ) => {
      const currentAgentName = data_protection_privacy.name;
      console.log(
        `Executing tool logic for ${currentAgentName} report generation.`
      );
      try {
        const llmPrompt = `You are an AI assistant processing a conversation transcript. Your task is to analyze the interaction between the 'assistant' (the Data Protection & Privacy agent) and the 'user' to extract answers to five specific questions. You MUST output ONLY a valid JSON array containing five objects, one for each question, following the specified format precisely.

**Instructions:**

1.  **Analyze Transcript:** Read the provided "Conversation History".
2.  **Identify Q&A Pairs:** For each of the five Data Protection & Privacy questions listed below, locate the assistant asking the question and the user's subsequent answer.
    *   Question 1 (ID: DPP01): Maintain inventory of critical data (desc, class, loc, retention)?
    *   Question 2 (ID: DPP02): Process to protect critical data (encryption, password)?
    *   Question 3 (ID: DPP03): Securely shred paper-based confidential data?
    *   Question 4 (ID: DPP04): Review data inventory annually or on change (first mention)?
    *   Question 5 (ID: DPP05): Review data inventory annually or on change (second mention)?
3.  **Extract Information & Populate Fields:** For each Q&A pair, create a JSON object:
    *   \`question_id\`: (String) Use "DPP01" through "DPP05".
    *   \`question_description\`: (String) Concise summary (e.g., "Maintain critical data inventory?").
    *   \`answer_text\`: (String) Exact keyword "YES", "NO", or "NOT APPLICABLE" (case-insensitive). Use \`null\` if none found.
    *   \`answer_context\`: (String) Summary of additional user explanation, or \`""\` if none.
    *   \`answer_ternary\`: (Number) "YES" -> \`1\`, "NO" -> \`0\`, "NOT APPLICABLE" -> \`9\`. Use \`null\` if \`answer_text\` is \`null\`.
4.  **Format Output:** Combine the five JSON objects into a single JSON array.
5.  **CRITICAL:** Output *only* the valid JSON array. No extra text or formatting.

**Conversation History:**
${JSON.stringify(transcriptLogs, null, 2)}

**Output ONLY the JSON array.**
`;

        console.log(`Calling secondary LLM for ${currentAgentName} report...`);
        const llmResponse = await fetch("/api/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: llmPrompt }],
            model: "gpt-4.1-nano-2025-04-14",
            temperature: 0.1,
          }),
        });

        if (!llmResponse.ok) {
          const errorText = await llmResponse.text();
          console.error(`LLM API call failed for ${currentAgentName}:`, errorText);
          throw new Error(
            `Failed to generate report content. LLM Status: ${llmResponse.status}`
          );
        }

        const llmResult = await llmResponse.json();
        const reportContent = llmResult?.choices?.[0]?.message?.content;

        if (!reportContent) {
          console.error(`LLM response missing content for ${currentAgentName}:`, llmResult);
          throw new Error("Failed to get report content from LLM.");
        }

        console.log(`${currentAgentName} LLM generated content:`, reportContent);

        const filePath = `initialRiskAssessment/${currentAgentName}_report.json`;
        console.log(`Calling /api/saveReport to save to ${filePath}...`);

        const saveResponse = await fetch("/api/saveReport", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filePath: filePath,
            content: reportContent,
          }),
        });

        if (!saveResponse.ok) {
          const errorText = await saveResponse.text();
          console.error(`Save report API call failed for ${currentAgentName}:`, errorText);
          throw new Error(
            `Failed to save report. Server Status: ${saveResponse.status}`
          );
        }

        const saveResult = await saveResponse.json();
        console.log(`Report saved successfully for ${currentAgentName}:`, saveResult.message);

        return {
          status: "success",
          message: `Assessment report for ${currentAgentName} saved to ${filePath}.`,
          reportContent: reportContent,
        };
      } catch (error: any) {
        console.error(`Error in ${currentAgentName} tool logic:`, error);
        return {
          status: "error",
          message: `Failed to generate/save report for ${currentAgentName}: ${error.message}`,
        };
      }
    },
  },
};

export default data_protection_privacy;
