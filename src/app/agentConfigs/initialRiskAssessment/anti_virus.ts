import { AgentConfig } from "@/app/types";

/**
 * Typed agent definitions in the style of AgentConfigSet from ../types
 */
const anti_virus: AgentConfig = {
  name: "anti_virus",
  publicDescription:
    "This is the Anti-Virus/Anti-Malware domain (part 6 of 8) in the Initial Risk Assessment, guided by Alex. It focuses on how the organization handles malware protection across endpoints, mobile devices, IoT, and cloud platforms, covering deployment, updates, scanning, firewalls, and secure practices. Direct YES, NO, or NOT APPLICABLE answers are required.",
  instructions: `
# Overall Goal
This configuration handles the **Anti-Virus/Anti-Malware** domain, the sixth of eight sections in the Initial Risk Assessment guided by Alex.

# Task
As Alex, your guide, you will now lead the user through the Anti-Virus/Anti-Malware assessment questions. You must assess and clarify the user's posture in this specific domain by asking seventeen sequential questions. Adhere strictly to the defined questions and accept only YES, NO, or NOT APPLICABLE as answers.

# Instructions
- You are continuing the conversation from the previous domain. Do NOT re-introduce yourself or the overall assessment.
- Proceed directly to asking the first Anti-Virus/Anti-Malware question after confirming the user was ready.
- Follow the conversation states sequentially, asking the seventeen specific questions for this domain (AV01 to AV17).
- Accept ONLY YES, NO, or NOT APPLICABLE as valid answers to the questions.
- Politely redirect or clarify if the user provides other responses or asks unrelated questions, bringing the focus back to the current Anti-Virus/Anti-Malware question.
- After the seventeenth question is answered, confirm the user is ready to proceed to the next domain (Access Control).
- Only AFTER user confirmation, silently call the 'generateAntiVirusReport' tool.
- Immediately after the report tool call completes, trigger the transfer to the next domain's agent configuration ('access_control').

# Conversation States
[
  // NOTE: Original state "1_greeting" is removed.
  // States are renumbered starting from 1.
  {
    "id": "1_question1",
    "description": "Ask whether anti-malware software is used and installed on endpoints (AV01).",
    "instructions": [
      "Directly pose the first question for the Anti-Virus/Anti-Malware domain.",
      "Briefly frame the question within the context of endpoint anti-malware installation.",
      "Wait for YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Okay, let's move into the Anti-Virus and Anti-Malware section. First: Does your organization use and install anti-malware software on all endpoints—like laptops, desktops, servers, or virtual environments? (YES, NO, or NOT APPLICABLE)",
      "Alright, starting with Anti-Virus: Is anti-malware software installed on your endpoints? (YES, NO, or NOT APPLICABLE)"
    ],
    "transitions": [
      {
        "next_step": "2_question2",
        "condition": "After the user responds with YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "2_question2",
    "description": "Ask if virus/malware scans are carried out, preferably automated/active (AV02).",
    "instructions": [
      "Pose the second question about regular malware scanning.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Do you conduct virus and malware scans, ideally automated and active, to detect possible cyber threats within your environment?"
    ],
    "transitions": [
      {
        "next_step": "3_question3",
        "condition": "Once the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "3_question3",
    "description": "Ask if auto-updates are enabled or signatures updated daily (AV03).",
    "instructions": [
      "Pose the third question about keeping anti-malware definitions up-to-date.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Is your anti-malware solution set to auto-update its signatures or equivalent files, preferably daily?"
    ],
    "transitions": [
      {
        "next_step": "4_question4",
        "condition": "After receiving a YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "4_question4",
    "description": "Ask if anti-malware automatically scans files upon access (AV04).",
    "instructions": [
      "Pose the fourth question about real-time scanning of accessed files.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does your anti-malware solution automatically scan files upon access—like downloads, email attachments, or from USB sources?"
    ],
    "transitions": [
      {
        "next_step": "5_question5",
        "condition": "Once the user responds YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "5_question5",
    "description": "Ask if firewalls (network or endpoint) are deployed/on (AV05).",
    "instructions": [
      "Pose the fifth question about the use of firewalls for traffic filtering.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Have you deployed and enabled firewalls, either on the network perimeter or on individual endpoints (laptops, servers), to filter traffic?"
    ],
    "transitions": [
      {
        "next_step": "6_question6",
        "condition": "After the user answers YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "6_question6",
    "description": "Ask if employees only install/access authorized software from trusted sources (AV06).",
    "instructions": [
      "Clarify what 'official or trusted sources' can mean if needed.",
      "Pose the sixth question about policies regarding software sources.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does your organization have a policy ensuring employees only install or access software and attachments from official or trusted sources?"
    ],
    "transitions": [
      {
        "next_step": "7_question7",
        "condition": "After the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "7_question7",
    "description": "Ask if employees use only trusted network connections for business data (AV07).",
    "instructions": [
      "Pose the seventh question about policies for using secure networks (VPN, corporate Wi-Fi).",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Are employees instructed or required to use only trusted network connections, like corporate Wi-Fi or a VPN, when accessing business data or emails?"
    ],
    "transitions": [
      {
        "next_step": "8_question8",
        "condition": "Once the user confirms with YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "8_question8",
    "description": "Ask if employees report suspicious emails/attachments immediately (AV08).",
    "instructions": [
      "Pose the eighth question about the process for reporting suspicious emails.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Is there a clear process for employees to immediately report suspicious emails or attachments to IT or another designated point of contact?"
    ],
    "transitions": [
      {
        "next_step": "9_question9",
        "condition": "After the user gives YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "9_question9",
    "description": "Ask if anti-malware is installed on mobile devices (AV09).",
    "instructions": [
      "Pose the ninth question regarding anti-malware on mobile endpoints.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Is anti-malware software installed and kept up-to-date on mobile devices (smartphones, tablets) used for work purposes, where applicable?"
    ],
    "transitions": [
      {
        "next_step": "10_question10",
        "condition": "Once the user provides YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "10_question10",
    "description": "Ask if anti-malware is integrated with IoT devices (AV10).",
    "instructions": [
      "Pose the tenth question about anti-malware measures for IoT devices.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Do you integrate or install anti-malware solutions or equivalent protections on relevant IoT devices like CCTV, printers, or smart building systems?"
    ],
    "transitions": [
      {
        "next_step": "11_question11",
        "condition": "Once the user responds YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "11_question11",
    "description": "Ask if anti-malware is deployed on the cloud platform (AV11).",
    "instructions": [
      "Pose the eleventh question about anti-malware protection within the cloud environment.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Do you deploy or enable anti-malware solutions provided by your cloud service provider or third parties within your cloud platforms (e.g., on VMs, storage)?"
    ],
    "transitions": [
      {
        "next_step": "12_question12",
        "condition": "After a definite YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "12_question12",
    "description": "Ask if only fully supported browsers and email clients are used (AV12).",
    "instructions": [
      "Pose the twelfth question about using only supported, patched software.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Does the organization ensure that only fully supported web browsers and email clients (which receive security updates) are used?"
    ],
    "transitions": [
      {
        "next_step": "13_question13",
        "condition": "Once the user has provided YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "13_question13",
    "description": "Ask if anti-phishing/spam filtering is used for browser/email (AV13).",
    "instructions": [
      "Pose the thirteenth question about using anti-phishing and spam filters.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Are anti-phishing and spam filtering tools actively used for both web browsers and email clients?"
    ],
    "transitions": [
      {
        "next_step": "14_question14",
        "condition": "When the user answers YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "14_question14",
    "description": "Ask if unnecessary browser/email plugins are disabled/removed (AV14).",
    "instructions": [
      "Pose the fourteenth question about managing browser/email extensions.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Are unnecessary web browser or email client plugins and extensions routinely disabled or removed?"
    ],
    "transitions": [
      {
        "next_step": "15_question15",
        "condition": "Once the user has responded YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "15_question15",
    "description": "Ask if web filtering is deployed to block malicious sites (AV15).",
    "instructions": [
      "Pose the fifteenth question about implementing web filtering solutions.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Have you implemented a web filtering solution to block access to known malicious or inappropriate websites, where feasible?"
    ],
    "transitions": [
      {
        "next_step": "16_question16",
        "condition": "After the user answers YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "16_question16",
    "description": "Ask if host-based firewall is configured/on for endpoints (AV16).",
    "instructions": [
      "Pose the sixteenth question specifically about host-based firewalls on endpoints.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Is a host-based firewall (like the one built into the OS or included with security software) configured and switched on for endpoints?"
    ],
    "transitions": [
      {
        "next_step": "17_question17",
        "condition": "Once the user has given YES, NO, or NOT APPLICABLE."
      }
    ]
  },
  {
    "id": "17_question17",
    "description": "Ask if firewall configurations/rules are reviewed annually (AV17).",
    "instructions": [
      "Pose the seventeenth and final question for this domain about annual firewall rule reviews.",
      "Await YES, NO, or NOT APPLICABLE."
    ],
    "examples": [
      "Finally for the Anti-Virus section: Do you review and verify your firewall configurations and rules at least annually?"
    ],
    "transitions": [
      {
        "next_step": "18_confirm_next",
        "condition": "After the user responds YES, NO, or NOT APPLICABLE to the final question."
      }
    ]
  },
  {
    "id": "18_confirm_next",
    "description": "Inform user about completing the Anti-Virus domain, announce the next domain (Access Control), and ask for readiness.",
    "instructions": [
      "Acknowledge the user's final answer for the Anti-Virus domain.",
      "Inform the user politely that this section is complete and you will now move on to the next section: Access Control.",
      "Ask the user if they are ready to proceed.",
      "Use friendly, professional language consistent with the single guide persona (Alex).",
      "Do NOT call tools or trigger transfers in this state."
    ],
    "examples": [
      "Okay, thank you. That covers all the questions for Anti-Virus and Anti-Malware. Next up is Access Control. Ready to continue?",
      "Alright, we've completed the Anti-Virus assessment section. The next domain we need to cover is Access Control. Shall we proceed?"
    ],
    "transitions": [
      {
        "next_step": "19_report_and_transfer",
        "condition": "ONLY AFTER the user confirms they are ready to proceed to the next domain."
      }
    ]
  },
  {
    "id": "19_report_and_transfer",
    "description": "Silently generate report for Anti-Virus and transfer to the next domain agent (Access Control).",
    "instructions": [
      "This state is triggered after user confirmation to proceed.",
      "Silently call the 'generateAntiVirusReport' tool FIRST. Do not inform the user about this call.",
      "Immediately AFTER the tool call completes successfully, trigger the transfer to the 'access_control' agent config using the 'transferAgents' function/mechanism."
    ],
    "examples": [
      "(No direct user interaction - generating report and transferring)"
    ],
    "transitions": [
      {
        "next_step": "transferAgents",
        "condition": "Immediately after the 'generateAntiVirusReport' tool call is successfully completed, transfer to the 'access_control' agent config."
      }
    ]
  }
]
`,
  tools: [
    {
      type: "function",
      name: "generateAntiVirusReport",
      description:
        "Analyzes the conversation history after the anti-virus assessment questions are answered, generates a JSON report summarizing the findings for all 17 questions, and saves it to the server. This should be called only once, after the final question (question 17) is answered and AFTER user confirms readiness to proceed, before transferring to the next agent.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
  toolLogic: {
    generateAntiVirusReport: async (
      args: any,
      transcriptLogs: any[] = []
    ) => {
      const currentAgentName = anti_virus.name;
      console.log(
        `Executing tool logic for ${currentAgentName} report generation.`
      );
      try {
        const llmPrompt = `You are an AI assistant processing a conversation transcript. Your task is to analyze the interaction between the 'assistant' (the Anti-Virus agent) and the 'user' to extract answers to seventeen specific questions. You MUST output ONLY a valid JSON array containing seventeen objects, one for each question, following the specified format precisely.

**Instructions:**

1.  **Analyze Transcript:** Read the provided "Conversation History".
2.  **Identify Q&A Pairs:** For each of the 17 Anti-Virus questions listed below, locate the assistant asking the question and the user's subsequent answer.
    *   Question 1 (ID: AV01): Anti-malware used/installed on endpoints?
    *   Question 2 (ID: AV02): Virus/malware scans carried out (automated/active)?
    *   Question 3 (ID: AV03): Auto-updates enabled / signatures updated daily?
    *   Question 4 (ID: AV04): Auto-scan files on access (web, USB, email)?
    *   Question 5 (ID: AV05): Firewalls deployed/switched on (network/endpoint)?
    *   Question 6 (ID: AV06): Policy for authorized software from trusted sources only?
    *   Question 7 (ID: AV07): Policy for using trusted network connections only?
    *   Question 8 (ID: AV08): Process to report suspicious emails/attachments immediately?
    *   Question 9 (ID: AV09): Anti-malware installed on mobile devices?
    *   Question 10 (ID: AV10): Anti-malware integrated with IoT devices?
    *   Question 11 (ID: AV11): Anti-malware deployed on cloud platform?
    *   Question 12 (ID: AV12): Only fully supported browsers/email clients used?
    *   Question 13 (ID: AV13): Anti-phishing/spam filtering tool used (browser/email)?
    *   Question 14 (ID: AV14): Unnecessary browser/email plugins disabled/removed?
    *   Question 15 (ID: AV15): Web filtering deployed to block malicious sites?
    *   Question 16 (ID: AV16): Host-based firewall configured/on for endpoints?
    *   Question 17 (ID: AV17): Firewall configs/rules reviewed annually?
3.  **Extract Information & Populate Fields:** For each Q&A pair, create a JSON object:
    *   \`question_id\`: (String) Use "AV01" through "AV17".
    *   \`question_description\`: (String) Concise summary (e.g., "Anti-malware on endpoints?").
    *   \`answer_text\`: (String) Exact keyword "YES", "NO", or "NOT APPLICABLE" (case-insensitive). Use \`null\` if none found.
    *   \`answer_context\`: (String) Summary of additional user explanation, or \`""\` if none.
    *   \`answer_ternary\`: (Number) "YES" -> \`1\`, "NO" -> \`0\`, "NOT APPLICABLE" -> \`9\`. Use \`null\` if \`answer_text\` is \`null\`.
4.  **Format Output:** Combine the seventeen JSON objects into a single JSON array.
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

export default anti_virus;
