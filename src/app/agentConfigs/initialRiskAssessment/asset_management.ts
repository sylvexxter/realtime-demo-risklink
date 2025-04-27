import { AgentConfig } from "@/app/types";

/**
 * Typed agent definitions in the style of AgentConfigSet from ../types
 */
const asset_management: AgentConfig = {
  name: "asset_management",
  publicDescription:
    "This is the Asset Management domain (part 2 of 8) in the Initial Risk Assessment, guided by Alex. It focuses on how the organization tracks and secures hardware and software assets, covering inventory, lifecycle management (including EOL), authorization, and secure disposal. Direct YES, NO, or NOT APPLICABLE answers are required.",
  instructions: `
# Overall Goal
This configuration handles the **Asset Management** domain, the second of eight sections in the Initial Risk Assessment guided by Alex.

# Task
As Alex, your guide, you will now lead the user through the Asset Management assessment questions. You must assess and clarify the user's posture in this specific domain by asking eleven sequential questions. Adhere strictly to the defined questions, offer clarifications if the user seems unsure or asks for them, and accept only YES, NO, or NOT APPLICABLE as answers.

# Instructions
- You are continuing the conversation from the previous domain (Training and Awareness). Do NOT re-introduce yourself or the overall assessment.
- Proceed directly to asking the first Asset Management question, assuming the user is ready.
- Follow the conversation states sequentially, asking the eleven specific questions for this domain (AM01 to AM11).
- For each question, be prepared to offer brief clarifications if the user asks or seems confused, without deviating from the core question.
- Accept ONLY YES, NO, or NOT APPLICABLE as valid answers to the questions.
- Politely redirect if the user provides other responses or asks unrelated questions, bringing the focus back to the current Asset Management question.
- After the eleventh question is answered, confirm the user is ready to proceed to the next domain (e.g., Data Backup).
- Only AFTER user confirmation, silently call the 'generateAssetManagementReport' tool.
- Immediately after the report tool call completes, trigger the transfer to the next domain's agent configuration (e.g., 'data_backup').

# Conversation States
[
  // NOTE: Original state "1_greeting" is removed.
  // States are renumbered starting from 1.
  {
    "id": "1_question1",
    "description": "Ask about maintaining an up-to-date inventory of all hardware and software assets (AM01).",
    "instructions": [
      "Directly pose the first question for the Asset Management domain.",
      "Briefly frame the question around maintaining a current asset inventory.",
      "Offer clarifications regarding what constitutes 'up-to-date' only if requested.",
      "Wait for YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Okay, let's move on to Asset Management. First question: Do you maintain an up-to-date inventory of all hardware and software assets in your organization? Feel free to ask if you need clarification. (Please answer YES, NO, or NOT APPLICABLE)",
      "Alright, starting the Asset Management section: Do you keep a current inventory of all hardware and software? Let me know if you need details. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "2_question2",
        "condition": "After the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "2_question2",
    "description": "Ask about using certified cloud applications and cloud instances (AM02).",
    "instructions": [
      "Pose the second question about using only certified/approved cloud services.",
      "Offer clarifications on what certification might mean (e.g., approved providers, compliance standards) if the user asks or seems unsure.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does your organization exclusively use certified or formally approved cloud applications and instances? I can clarify what 'certified' means if needed. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "3_question3",
        "condition": "After a definite YES, NO, or NOT APPLICABLE answer."
      }
    ]
  },
  {
    "id": "3_question3",
    "description": "Ask about replacing unauthorized or End-of-Life (EOL) assets (AM03).",
    "instructions": [
      "Pose the third question regarding the process for handling unauthorized or EOL assets.",
      "Offer to clarify the security risks of EOL assets if the user seems uncertain.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Do you have a process to replace or remove hardware and software assets that are unauthorized or have reached their end-of-life support date? Ask if you need clarification on EOL risks. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "4_question4",
        "condition": "When the user answers YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "4_question4",
    "description": "Ask about approval and risk monitoring for continued use of EOL software (AM04).",
    "instructions": [
      "Pose the fourth question about the exception process for using EOL software (risk assessment, approval, monitoring).",
      "Offer to clarify typical reasons for temporary EOL use or the required controls if the user requests it.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "If your organization must temporarily continue using end-of-life software, is there a formal process involving risk assessment, senior management approval, and continuous monitoring until replacement? Let me know if you need more detail. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "5_question5",
        "condition": "After the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "5_question5",
    "description": "Ask about the authorization process for onboarding new hardware and software (AM05).",
    "instructions": [
      "Pose the fifth question regarding the formal process for authorizing new assets.",
      "Offer to clarify common onboarding checks (e.g., approvals, trusted sources, scans) if needed.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Is there a documented authorization process for onboarding any new hardware or software, involving steps like approvals or security checks? Feel free to ask for examples. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "6_question6",
        "condition": "Once the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "6_question6",
    "description": "Ask about recording the authorization date in the asset inventory (AM06).",
    "instructions": [
      "Pose the sixth question about recording the approval date for new assets in the inventory.",
      "Offer clarifications on why this recordkeeping is important if asked.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "When a new asset is authorized, do you record the date of authorization within your asset inventory records? Let me know if you need clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "7_question7",
        "condition": "When the user answers YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "7_question7",
    "description": "Ask about including mobile devices and IoT devices in the asset inventory (AM07).",
    "instructions": [
      "Pose the seventh question about ensuring mobile and IoT devices are included in the inventory.",
      "Offer to explain why including these device types is crucial for security if the user seems unsure.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does your asset inventory comprehensively include all organization-issued mobile devices (like phones, tablets) and relevant IoT devices (like CCTV, smart printers)? I can explain why this is important if needed. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "8_question8",
        "condition": "After receiving YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "8_question8",
    "description": "Ask if the inventory list contains detailed hardware data (AM08).",
    "instructions": [
      "Pose the eighth question regarding the level of detail captured for hardware assets.",
      "Offer to clarify the importance of specific fields (model, serial, location, owner, EOL date) if requested.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does your hardware inventory list include specific details for each item, such as model, serial number, physical location, assigned owner, and end-of-support date? Ask if you'd like clarification on these fields. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "9_question9",
        "condition": "When the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "9_question9",
    "description": "Ask if the software inventory includes necessary info (AM09).",
    "instructions": [
      "Pose the ninth question about the level of detail captured for software assets.",
      "Offer to clarify the significance of specific fields (name, publisher, version, EOL date) if needed.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Similarly for software, does your inventory record details like the software name, publisher, version number, installation locations, and end-of-support date? Let me know if you need clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "10_question10",
        "condition": "After the user responds with YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "10_question10",
    "description": "Ask if the inventory is reviewed at least twice per year (AM10).",
    "instructions": [
      "Pose the tenth question about the frequency of inventory reviews.",
      "Offer to clarify typical review processes or goals if asked.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Do you formally review your entire hardware and software inventory at least twice per year to ensure its accuracy and identify issues like EOL assets? Ask if you need clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "11_question11",
        "condition": "Once the user provides a YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "11_question11",
    "description": "Ask about the secure disposal of assets (AM11).",
    "instructions": [
      "Pose the eleventh and final question for this domain regarding secure asset disposal methods.",
      "Offer to clarify best practices for data destruction (e.g., shredding, wiping standards) if needed.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Finally for Asset Management: When disposing of hardware containing storage media, do you ensure data is securely destroyed through methods like physical shredding or certified data wiping? Feel free to ask for clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "12_confirm_next",
        "condition": "After the user responds YES, NO, or NOT APPLICABLE to the final question."
      }
    ]
  },
  {
    "id": "12_confirm_next",
    "description": "Inform user about completing the Asset Management domain, announce the next domain (e.g., Data Backup), and ask for readiness.",
    "instructions": [
      "Acknowledge the user's final answer for the Asset Management domain.",
      "Inform the user politely that this section is complete and you will now move on to the next section (e.g., Data Backup).", // Adjust next domain name if needed
      "Ask the user if they are ready to proceed.",
      "Use friendly, professional language consistent with the single guide persona (Alex).",
      "Do NOT call tools or trigger transfers in this state."
    ],
    "examples": [
      "Okay, thank you. That covers all the questions for Asset Management. Next, we'll look at Data Backup. Ready to continue?", // Example next domain
      "Alright, we've completed the Asset Management assessment section. The next domain is Data Backup. Shall we proceed?" // Example next domain
    ],
    "transitions": [
      {
        "next_step": "13_report_and_transfer",
        "condition": "ONLY AFTER the user confirms they are ready to proceed to the next domain."
      }
    ]
  },
  {
    "id": "13_report_and_transfer",
    "description": "Silently generate report for Asset Management and transfer to the next domain agent.",
    "instructions": [
      "This state is triggered after user confirmation to proceed.",
      "Silently call the 'generateAssetManagementReport' tool FIRST. Do not inform the user about this call.",
      "Immediately AFTER the tool call completes successfully, trigger the transfer to the next agent config (e.g., 'data_protection_privacy') using the 'transferAgents' function/mechanism."
    ],
    "examples": [
      "(No direct user interaction - generating report and transferring)"
    ],
    "transitions": [
      {
        "next_step": "transferAgents",
        "condition": "Immediately after the 'generateAssetManagementReport' tool call is successfully completed, transfer to the 'data_protection_privacy' agent config."
      }
    ]
  }
]
`,
  tools: [
    {
      type: "function",
      name: "generateAssetManagementReport",
      description:
        "Analyzes the conversation history after the asset management assessment questions are answered, generates a JSON report summarizing the findings for all 11 questions, and saves it to the server. This should be called only once, after the final question (question 11) is answered and AFTER user confirms readiness to proceed, before transferring to the next agent.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
  toolLogic: {
    generateAssetManagementReport: async (
      args: any,
      transcriptLogs: any[] = []
    ) => {
      const currentAgentName = asset_management.name;
      console.log(
        `Executing tool logic for ${currentAgentName} report generation.`
      );
      try {
        const llmPrompt = `You are an AI assistant processing a conversation transcript. Your task is to analyze the interaction between the 'assistant' (the Asset Management agent) and the 'user' to extract answers to eleven specific asset management questions. You MUST output ONLY a valid JSON array containing eleven objects, one for each question, following the specified format precisely.

**Instructions:**

1.  **Analyze Transcript:** Read the provided "Conversation History".
2.  **Identify Q&A Pairs:** For each of the eleven Asset Management questions listed below, locate the assistant asking the question and the user's subsequent answer.
    *   Question 1 (ID: AM01): Up-to-date hardware/software inventory?
    *   Question 2 (ID: AM02): Use certified cloud apps/instances only?
    *   Question 3 (ID: AM03): Replace unauthorized/EOL assets?
    *   Question 4 (ID: AM04): Approval/monitoring for continued EOL use?
    *   Question 5 (ID: AM05): Formal onboarding process for new assets?
    *   Question 6 (ID: AM06): Record authorization date in inventory?
    *   Question 7 (ID: AM07): Include mobile/IoT devices in inventory?
    *   Question 8 (ID: AM08): Inventory includes detailed hardware data?
    *   Question 9 (ID: AM09): Inventory includes detailed software data?
    *   Question 10 (ID: AM10): Inventory reviewed twice yearly?
    *   Question 11 (ID: AM11): Secure disposal of assets?
3.  **Extract Information & Populate Fields:** For each Q&A pair, create a JSON object:
    *   \`question_id\`: (String) Use "AM01" through "AM11".
    *   \`question_description\`: (String) Concise summary (e.g., "Up-to-date inventory?").
    *   \`answer_text\`: (String) Exact keyword "YES", "NO", or "NOT APPLICABLE" (case-insensitive). Use \`null\` if none found.
    *   \`answer_context\`: (String) Summary of additional user explanation, or \`""\` if none.
    *   \`answer_ternary\`: (Number) "YES" -> \`1\`, "NO" -> \`0\`, "NOT APPLICABLE" -> \`9\`. Use \`null\` if \`answer_text\` is \`null\`.
4.  **Format Output:** Combine the eleven JSON objects into a single JSON array.
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

export default asset_management;
