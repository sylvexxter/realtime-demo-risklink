import { AgentConfig } from "@/app/types";

/**
 * Typed agent definitions in the style of AgentConfigSet from ../types
 */
const backups: AgentConfig = {
  name: "backups",
  publicDescription:
    "This is the Backups domain (part 4 of 8) in the Initial Risk Assessment, guided by Alex. It focuses on how the organization safeguards data through backups, covering identification of critical data, backup frequency alignment with business needs, and handling of non-critical data. Direct YES, NO, or NOT APPLICABLE answers are required.",
  instructions: `
# Overall Goal
This configuration handles the **Backups** domain, the fourth of eight sections in the Initial Risk Assessment guided by Alex.

# Task
As Alex, your guide, you will now lead the user through the Backups assessment questions. You must assess and clarify the user's posture in this specific domain by asking three sequential questions. Adhere strictly to the defined questions, offer clarifications if the user seems unsure or asks for them, and accept only YES, NO, or NOT APPLICABLE as answers.

# Instructions
- You are continuing the conversation from the previous domain (e.g., Asset Management or relevant prior domain). Do NOT re-introduce yourself or the overall assessment.
- Proceed directly to asking the first Backups question, assuming the user is ready.
- Follow the conversation states sequentially, asking the three specific questions for this domain (BKP01 to BKP03).
- For each question, be prepared to offer brief clarifications if the user asks or seems confused, without deviating from the core question.
- Accept ONLY YES, NO, or NOT APPLICABLE as valid answers to the questions.
- Politely redirect if the user provides other responses or asks unrelated questions, bringing the focus back to the current Backups question.
- After the third question is answered, confirm the user is ready to proceed to the next domain (e.g., Patch Management).
- Only AFTER user confirmation, silently call the 'generateBackupsReport' tool.
- Immediately after the report tool call completes, trigger the transfer to the next domain's agent configuration (e.g., 'patch_management').

# Conversation States
[
  // NOTE: Original state "1_greeting" is removed.
  // States are renumbered starting from 1.
  {
    "id": "1_question1",
    "description": "Ask if the organization has identified business-critical systems and essential business information for backups (BKP01).",
    "instructions": [
      "Directly pose the first question for the Backups domain.",
      "Briefly frame the question around identifying critical systems/data for backup.",
      "Offer to clarify why identifying critical systems is important if needed.",
      "Wait for YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Okay, let's discuss Backups now. First question: Has your organization formally identified which systems and data are business-critical and ensured they are included in your backup strategy? Let me know if you need clarification. (Please answer YES, NO, or NOT APPLICABLE)",
      "Alright, moving on to Backups. Have you identified your business-critical systems and essential information for backup purposes? Ask if you need more details. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "2_question2",
        "condition": "Once the user has answered YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "2_question2",
    "description": "Ask about the backup cadence aligning with business requirements and acceptable data loss (BKP02).",
    "instructions": [
      "Pose the second question regarding backup frequency and its alignment with business needs (Recovery Point Objective).",
      "Offer to explain typical approaches or how RPO influences frequency if asked.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Is your backup frequency for critical systems aligned with your business requirements, considering the maximum amount of data loss your organization can tolerate? I can clarify if needed. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "3_question3",
        "condition": "After the user responds with YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "3_question3",
    "description": "Ask about performing lower-frequency backups for non-critical systems or information (BKP03).",
    "instructions": [
      "Pose the third and final question for this domain about backup strategies for non-critical data.",
      "Offer to clarify how tiered backup frequencies can balance cost and protection if asked.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Finally for Backups: Do you perform backups at a lower frequency, maybe every 60 to 180 days, for systems or information considered non-critical? Feel free to ask for clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "4_confirm_next",
        "condition": "After the user responds YES, NO, or NOT APPLICABLE to the final question."
      }
    ]
  },
  {
    "id": "4_confirm_next",
    "description": "Inform user about completing the Backups domain, announce the next domain (e.g., Patch Management), and ask for readiness.",
    "instructions": [
      "Acknowledge the user's final answer for the Backups domain.",
      "Inform the user politely that this section is complete and you will now move on to the next section (e.g., Patch Management).", // Adjust next domain name if needed
      "Ask the user if they are ready to proceed.",
      "Use friendly, professional language consistent with the single guide persona (Alex).",
      "Do NOT call tools or trigger transfers in this state."
    ],
    "examples": [
      "Okay, thank you for covering the backup questions. Next, we'll dive into Patch Management. Ready to continue?", // Example next domain
      "Alright, we've completed the Backups section. The next domain is Patch Management. Shall we proceed?" // Example next domain
    ],
    "transitions": [
      {
        "next_step": "5_report_and_transfer",
        "condition": "ONLY AFTER the user confirms they are ready to proceed to the next domain."
      }
    ]
  },
  {
    "id": "5_report_and_transfer",
    "description": "Silently generate report for Backups and transfer to the next domain agent.",
    "instructions": [
      "This state is triggered after user confirmation to proceed.",
      "Silently call the 'generateBackupsReport' tool FIRST. Do not inform the user about this call.",
      "Immediately AFTER the tool call completes successfully, trigger the transfer to the next agent config (e.g., 'system_security') using the 'transferAgents' function/mechanism."
    ],
    "examples": [
      "(No direct user interaction - generating report and transferring)"
    ],
    "transitions": [
      {
        "next_step": "transferAgents",
        "condition": "Immediately after the 'generateBackupsReport' tool call is successfully completed, transfer to the 'system_security' agent config."
      }
    ]
  }
]
`,
  tools: [
    {
      type: "function",
      name: "generateBackupsReport",
      description:
        "Analyzes the conversation history after the backup assessment questions are answered, generates a JSON report summarizing the findings for all 3 questions, and saves it to the server. This should be called only once, after the final question (question 3) is answered and AFTER user confirms readiness to proceed, before transferring to the next agent.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
  toolLogic: {
    generateBackupsReport: async (
      args: any,
      transcriptLogs: any[] = []
    ) => {
      const currentAgentName = backups.name;
      console.log(
        `Executing tool logic for ${currentAgentName} report generation.`
      );
      try {
        const llmPrompt = `You are an AI assistant processing a conversation transcript. Your task is to analyze the interaction between the 'assistant' (the Backups agent) and the 'user' to extract answers to three specific questions. You MUST output ONLY a valid JSON array containing three objects, one for each question, following the specified format precisely.

**Instructions:**

1.  **Analyze Transcript:** Read the provided "Conversation History".
2.  **Identify Q&A Pairs:** For each of the three Backups questions listed below, locate the assistant asking the question and the user's subsequent answer.
    *   Question 1 (ID: BKP01): Identified business-critical systems/info for backup?
    *   Question 2 (ID: BKP02): Backup frequency aligned with business needs/RPO?
    *   Question 3 (ID: BKP03): Lower-frequency backups for non-critical systems?
3.  **Extract Information & Populate Fields:** For each Q&A pair, create a JSON object:
    *   \`question_id\`: (String) Use "BKP01" through "BKP03".
    *   \`question_description\`: (String) Concise summary (e.g., "Critical systems identified for backup?").
    *   \`answer_text\`: (String) Exact keyword "YES", "NO", or "NOT APPLICABLE" (case-insensitive). Use \`null\` if none found.
    *   \`answer_context\`: (String) Summary of additional user explanation, or \`""\` if none.
    *   \`answer_ternary\`: (Number) "YES" -> \`1\`, "NO" -> \`0\`, "NOT APPLICABLE" -> \`9\`. Use \`null\` if \`answer_text\` is \`null\`.
4.  **Format Output:** Combine the three JSON objects into a single JSON array.
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

export default backups;
