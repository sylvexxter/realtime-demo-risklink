# Realtime API Agents Demo

This is a simple demonstration of more advanced, agentic patterns built on top of the Realtime API. In particular, this demonstrates:
- Sequential agent handoffs according to a defined agent graph (taking inspiration from [OpenAI Swarm](https://github.com/openai/swarm))
- Background escalation to more intelligent models like o1-mini for high-stakes decisions
- Prompting models to follow a state machine, for example to accurately collect things like names and phone numbers with confirmation character by character to authenticate a user.

You should be able to use this repo to prototype your own multi-agent realtime voice app in less than 20 minutes!

![Screenshot of the Realtime API Agents Demo](/public/screenshot.png)

## Setup

- This is a Next.js typescript app
- Install dependencies with `npm i`
- Add your `OPENAI_API_KEY` to your env
- Start the server with `npm run dev`
- Open your browser to [http://localhost:3000](http://localhost:3000) to see the app. It should automatically connect to the `simpleExample` Agent Set.

## Configuring Agents
Configuration in `src/app/agentConfigs/simpleExample.ts`
```javascript
import { AgentConfig } from "@/app/types";
import { injectTransferTools } from "./utils";

// Define agents
const haiku: AgentConfig = {
  name: "haiku",
  publicDescription: "Agent that writes haikus.", // Context for the agent_transfer tool
  instructions:
    "Ask the user for a topic, then reply with a haiku about that topic.",
  tools: [],
};

const greeter: AgentConfig = {
  name: "greeter",
  publicDescription: "Agent that greets the user.",
  instructions:
    "Please greet the user and ask them if they'd like a Haiku. If yes, transfer them to the 'haiku' agent.",
  tools: [],
  downstreamAgents: [haiku],
};

// add the transfer tool to point to downstreamAgents
const agents = injectTransferTools([greeter, haiku]);

export default agents;
```

This fully specifies the agent set that was used in the interaction shown in the screenshot above.

### Next steps
- Check out the configs in `src/app/agentConfigs`. The example above is a minimal demo that illustrates the core concepts.
- [frontDeskAuthentication](src/app/agentConfigs/frontDeskAuthentication) Guides the user through a step-by-step authentication flow, confirming each value character-by-character, authenticates the user with a tool call, and then transfers to another agent. Note that the second agent is intentionally "bored" to show how to prompt for personality and tone.
- [customerServiceRetail](src/app/agentConfigs/customerServiceRetail) Also guides through an authentication flow, reads a long offer from a canned script verbatim, and then walks through a complex return flow which requires looking up orders and policies, gathering user context, and checking with `o1-mini` to ensure the return is eligible. To test this flow, say that you'd like to return your snowboard and go through the necessary prompts!

### Defining your own agents
- You can copy these to make your own multi-agent voice app! Once you make a new agent set config, add it to `src/app/agentConfigs/index.ts` and you should be able to select it in the UI in the "Scenario" dropdown menu.
- To see how to define tools and toolLogic, including a background LLM call, see [src/app/agentConfigs/customerServiceRetail/returns.ts](src/app/agentConfigs/customerServiceRetail/returns.ts)
- To see how to define a detailed personality and tone, and use a prompt state machine to collect user information step by step, see [src/app/agentConfigs/frontDeskAuthentication/authentication.ts](src/app/agentConfigs/frontDeskAuthentication/authentication.ts)
- To see how to wire up Agents into a single Agent Set, see [src/app/agentConfigs/frontDeskAuthentication/index.ts](src/app/agentConfigs/frontDeskAuthentication/index.ts)
- If you want help creating your own prompt using these conventions, we've included a metaprompt [here](src/app/agentConfigs/voiceAgentMetaprompt.txt), or you can use our [Voice Agent Metaprompter GPT](https://chatgpt.com/g/g-678865c9fb5c81918fa28699735dd08e-voice-agent-metaprompt-gpt)

## UI
- You can select agent scenarios in the Scenario dropdown, and automatically switch to a specific agent with the Agent dropdown.
- The conversation transcript is on the left, including tool calls, tool call responses, and agent changes. Click to expand non-message elements.
- The event log is on the right, showing both client and server events. Click to see the full payload.
- On the bottom, you can disconnect, toggle between automated voice-activity detection or PTT, turn off audio playback, and toggle logs.

## Core Contributors
- Noah MacCallum - [noahmacca](https://x.com/noahmacca)
- Ilan Bigio - [ibigio](https://github.com/ibigio)



### New Feature: Saving Agent Assessment Reports

To facilitate capturing the results of agent assessments (like the `initialRiskAssessment` flow), a new backend utility has been added.

**What was added:**

*   A generic server-side API endpoint: `/api/saveReport`.

**Purpose:**

*   This endpoint securely receives a JSON string (typically generated by an LLM analyzing the conversation) and saves it as a `.json` file within the `src/json_reports/` directory on the server.

**How it works:**

1.  It only accepts `POST` requests.
2.  The request body must be JSON and contain:
    *   `filePath`: A string specifying the desired filename, relative to the `src/json_reports/` directory (e.g., `"training_awareness_report.json"` or `"subdir/asset_mgmt.json"`). Subdirectories will be created automatically if needed.
    *   `content`: A string containing the JSON data to be saved (usually the direct output from the secondary LLM).
3.  **Security:** The endpoint validates the `filePath` to prevent writing files outside the designated `src/json_reports/` directory.

**Testing the Endpoint (Server-Side Verification):**

Before implementing the client-side logic, you can test this endpoint directly using `curl` or an API client (like Postman/Insomnia) to ensure it works correctly. Make sure your development server (`npm run dev`) is running.

*   **Example 1: Successful Save** (Saves `test_success.json` in `src/json_reports/`)
    ```bash
    curl -X POST http://localhost:3000/api/saveReport \
    -H "Content-Type: application/json" \
    -d '{"filePath": "test_success.json", "content": "{\"message\": \"Test successful\"}"}'
    ```
    *Verify:* Check for the file creation and success message (`{"message":"Report saved successfully to src/json_reports/test_success.json"}`).

*   **Example 2: Save with Subdirectory** (Creates `src/json_reports/subdir/` if needed)
    ```bash
    curl -X POST http://localhost:3000/api/saveReport \
    -H "Content-Type: application/json" \
    -d '{"filePath": "subdir/test_subdir.json", "content": "[1, 2, 3]"}'
    ```
    *Verify:* Check for directory/file creation and success message.

*   **Example 3: Test Directory Traversal (Security)** (Should fail)
    ```bash
    curl -i -X POST http://localhost:3000/api/saveReport \
    -H "Content-Type: application/json" \
    -d '{"filePath": "../test_fail.json", "content": "{\"access\": \"denied\"}"}'
    ```
    *Verify:* Look for a `403 Forbidden` HTTP status and the error message `{"message":"Forbidden: Invalid file path specified."}`. Ensure no file was created outside `src/json_reports/`. Check server logs for a security warning.

*   **Example 4: Test Bad Request (Missing `content`)** (Should fail)
    ```bash
    curl -i -X POST http://localhost:3000/api/saveReport \
    -H "Content-Type: application/json" \
    -d '{"filePath": "bad_request.json"}'
    ```
    *Verify:* Look for a `400 Bad Request` HTTP status and the error message `{"message":"Bad Request: Both filePath (string) and content (string) are required."}`.

**Next Steps: Client-Side Implementation (for each relevant agent):**

1.  **Define a Tool:** In the agent's configuration file (e.g., `src/app/agentConfigs/initialRiskAssessment/training_awareness.ts`), add a new tool definition to the `tools: []` array.
    *   **Name:** Suggest `generate<AgentName>Report` (e.g., `generateTrainingAwarenessReport`).
    *   **Description:** Explain that this tool analyzes the conversation, generates a JSON report, and saves it using the backend API. Mention it should be called after the assessment questions are complete.
    *   **Parameters:** This tool likely doesn't need any parameters passed from the agent itself (`"parameters": { "type": "object", "properties": {}, "required": [] }`), as the necessary context comes from the `transcriptLogs` provided to the `toolLogic`.

2.  **Implement `toolLogic`:** Add the corresponding function to the `toolLogic: {}` object for the agent. This function should:
    *   **(Optional but Recommended):** Prepare a prompt and call the secondary LLM endpoint (`/api/chat/completions`) to generate the desired JSON content string based on the `transcriptLogs`. The prompt should instruct the LLM on the exact JSON structure needed (e.g., `[{id: "...", question: "...", answer: "...", context: "..."}, ...]`).
    *   **(Crucial):** Make a `fetch` call using the `POST` method to the `/api/saveReport` endpoint.
    *   In the `fetch` call's `body`, send a JSON object containing:
        *   `filePath`: The specific filename for this agent's report (e.g., `"training_awareness_report.json"`).
        *   `content`: The JSON string obtained from the secondary LLM.
    *   Handle the response from `/api/saveReport` (check `response.ok`, parse potential errors) and return a success/failure status from the `toolLogic` function.

3.  **Update Agent Instructions:** Modify the agent's `instructions` (specifically the `conversationStates` array and its `transitions`):
    *   Identify the state where the agent finishes asking its questions.
    *   Change the transition from that state to point to a *new intermediate state* dedicated to calling the report generation tool.
    *   Define this new state to simply instruct the agent to call the `generate<AgentName>Report` tool.
    *   Add a transition *from this new state* to perform the original action (e.g., `transferAgents` to the next agent in the sequence). This ensures the report is saved *before* moving on.

By following these steps for each agent in the `initialRiskAssessment` flow (or any other agent needing this functionality), you can leverage the single `/api/saveReport` backend endpoint to save structured assessment results.