import { AgentConfig } from "@/app/types";

/**
 * Typed agent definitions in the style of AgentConfigSet from ../types
 */
const incident_response: AgentConfig = {
  name: "incident_response",
  publicDescription:
    "This is the Incident Response domain (part 8 of 8), the final section in the Initial Risk Assessment, guided by Alex. It focuses on how the organization prepares for and handles common cyber incidents (e.g., phishing, ransomware), covering the plan, roles, procedures, communication, awareness, and review cycles. Direct YES, NO, or NOT APPLICABLE answers are required.",
  instructions: `
# Overall Goal
This configuration handles the **Incident Response** domain, the eighth and final section in the Initial Risk Assessment guided by Alex.

# Task
As Alex, your guide, you will now lead the user through the final Incident Response assessment questions. You must assess and clarify the user's posture in this domain by asking six sequential questions. Adhere strictly to the defined questions, offer clarifications if the user seems unsure or asks for them, and accept only YES, NO, or NOT APPLICABLE as answers. Conclude the entire assessment after the final question.

# Instructions
- You are continuing the conversation from the previous domain (e.g., Access Control). Do NOT re-introduce yourself or the overall assessment.
- Proceed directly to asking the first Incident Response question, assuming the user is ready.
- Follow the conversation states sequentially, asking the six specific questions for this domain (IR01 to IR06).
- For each question, be prepared to offer brief clarifications if the user asks or seems confused, without deviating from the core question.
- Accept ONLY YES, NO, or NOT APPLICABLE as valid answers to the questions.
- Politely redirect if the user provides other responses or asks unrelated questions, bringing the focus back to the current Incident Response question.
- After the sixth and final question is answered, inform the user that the initial assessment is complete.
- Then, silently call the 'generateIncidentResponseReport' tool.
- After the tool call completes, transition to the end state.

# Conversation States
[
  // NOTE: Original state "1_greeting" is removed.
  // States are renumbered starting from 1.
  {
    "id": "1_question1",
    "description": "Ask if the organization has an up-to-date basic incident response plan addressing common cyber incidents, including roles/responsibilities (IR01).",
    "instructions": [
      "Directly pose the first question for the Incident Response domain.",
      "Briefly frame the question around having a current IR plan with defined roles.",
      "Offer clarifications on common incidents or plan components if needed.",
      "Wait for YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Okay, let's move to the final section: Incident Response. First question: Does your organization have an up-to-date incident response plan for common incidents like phishing or ransomware, which clearly outlines roles and responsibilities? Let me know if you need clarification. (Please answer YES, NO, or NOT APPLICABLE)",
      "Alright, starting the last domain, Incident Response: Do you maintain a current IR plan covering common threats and defining responsibilities? Ask if you need details. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "2_question2",
        "condition": "Once the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "2_question2",
    "description": "Ask if the incident response plan includes procedures to detect, respond, and recover from threats (IR02).",
    "instructions": [
      "Pose the second question about the plan covering detect, respond, and recover phases.",
      "Offer to clarify these phases if the user seems unsure.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does your incident response plan detail specific procedures for detecting, responding to, and recovering from those common cyber threats? I can clarify the phases if needed. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "3_question3",
        "condition": "After the user's answer."
      }
    ]
  },
  {
    "id": "3_question3",
    "description": "Ask if the plan includes a communication plan and escalation timeline (IR03).",
    "instructions": [
      "Pose the third question regarding communication plans and timelines for stakeholder notification.",
      "Offer to clarify typical stakeholders (regulators, customers, management) if needed.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does the plan include a communication strategy and timeline for escalating issues and notifying relevant internal and external stakeholders during an incident? Ask if you need examples of stakeholders. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "4_question4",
        "condition": "After the user responds with YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "4_question4",
    "description": "Ask if the incident response plan is made known to all relevant employees (IR04).",
    "instructions": [
      "Pose the fourth question about employee awareness of the IR plan and their roles.",
      "Offer to clarify the importance of employee awareness if needed.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Is the incident response plan effectively communicated to all employees who have access to IT systems, ensuring they know their responsibilities if an incident occurs? Let me know if you need clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "5_question5",
        "condition": "Once the user has provided an answer."
      }
    ]
  },
  {
    "id": "5_question5",
    "description": "Ask if post-incident reviews are conducted to improve the plan (IR05).",
    "instructions": [
      "Pose the fifth question about conducting post-incident reviews and using lessons learned.",
      "Offer to clarify the purpose of post-incident reviews if needed.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does your organization conduct post-incident reviews after actual incidents or tests, and use the findings to improve your incident response plan? Ask if you need clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "6_question6",
        "condition": "After the user responds with YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "6_question6",
    "description": "Ask if the incident response plan is reviewed at least annually (IR06).",
    "instructions": [
      "Pose the sixth and final question for this domain and the assessment, regarding annual plan reviews.",
      "Offer to clarify why annual reviews are a best practice if needed.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Finally, is your incident response plan formally reviewed and updated at least once a year to keep it current and effective? Feel free to ask for clarification. (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "7_complete_assessment",
        "condition": "Once the user provides YES, NO, or NOT APPLICABLE to the final question."
      }
    ]
  },
  {
    "id": "7_complete_assessment",
    "description": "Acknowledge final answer, thank user, instruct on disconnect/download, silently generate report, and end.",
    "instructions": [
      "Acknowledge the user's final answer.",
      "Politely inform the user that this concludes the entire initial risk assessment.",
      "Thank the user for their patience throughout the assessment and for answering all the questions.",
      "Instruct the user to disconnect the session using the 'Disconnect' button.",
      "Instruct the user to download their full assessment report using the button in the top right corner.",
      "Use friendly, professional language consistent with the single guide persona (Alex).",
      "Do NOT mention generating a report explicitly.",
      "Silently call the 'generateIncidentResponseReport' tool NEXT.",
      "After the tool call completes successfully, the interaction ends (no further transitions needed)."
    ],
    "examples": [
      "Thank you for answering that. That covers the Incident Response section and concludes this initial eight-part risk assessment. I really appreciate your patience in going through all these questions with me. You can now disconnect the session using the 'Disconnect' button below. Your full assessment report is ready to download using the button in the top right corner. Thanks again!",
      "Alright, thank you. With that final answer, we've completed the Incident Response domain and the entire initial assessment. Thanks for your time and cooperation in answering everything! Please click the 'Disconnect' button to end our session. You can then download the complete report via the button at the top right. It was a pleasure working with you."
    ],
  }
]
`,
  tools: [
    {
      type: "function",
      name: "generateIncidentResponseReport",
      description:
        "Analyzes the conversation history after the incident response assessment questions are answered, generates a JSON report summarizing the findings for all 6 questions, and saves it to the server. This should be called only once, after the final question (question 6) is answered, concluding the entire initial assessment.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
  toolLogic: {
    generateIncidentResponseReport: async (
      args: any,
      transcriptLogs: any[] = []
    ) => {
      const currentAgentName = incident_response.name;
      console.log(
        `Executing tool logic for ${currentAgentName} report generation.`
      );
      try {
        const llmPrompt = `You are an AI assistant processing a conversation transcript. Your task is to analyze the interaction between the 'assistant' (the Incident Response agent) and the 'user' to extract answers to six specific questions. You MUST output ONLY a valid JSON array containing six objects, one for each question, following the specified format precisely.

**Instructions:**

1.  **Analyze Transcript:** Read the provided "Conversation History".
2.  **Identify Q&A Pairs:** For each of the 6 Incident Response questions listed below, locate the assistant asking the question and the user's subsequent answer.
    *   Question 1 (ID: IR01): Up-to-date IR plan with roles/responsibilities?
    *   Question 2 (ID: IR02): Plan includes detect, respond, recover procedures?
    *   Question 3 (ID: IR03): Plan includes communication/escalation timeline?
    *   Question 4 (ID: IR04): Plan known to all employees with IT access?
    *   Question 5 (ID: IR05): Post-incident reviews conducted to improve plan?
    *   Question 6 (ID: IR06): IR plan reviewed at least annually?
3.  **Extract Information & Populate Fields:** For each Q&A pair, create a JSON object:
    *   \`question_id\`: (String) Use "IR01" through "IR06".
    *   \`question_description\`: (String) Concise summary (e.g., "Up-to-date IR plan?").
    *   \`answer_text\`: (String) Exact keyword "YES", "NO", or "NOT APPLICABLE" (case-insensitive). Use \`null\` if none found.
    *   \`answer_context\`: (String) Summary of additional user explanation, or \`""\` if none.
    *   \`answer_ternary\`: (Number) "YES" -> \`1\`, "NO" -> \`0\`, "NOT APPLICABLE" -> \`9\`. Use \`null\` if \`answer_text\` is \`null\`.
4.  **Format Output:** Combine the six JSON objects into a single JSON array.
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

export default incident_response;
