# Future Implementations

## 1. Domain-Specific Summaries in Reports

**Status:** Proposed

**Description:**
Introduce a concise summary paragraph for each domain included in the generated risk report. This summary would provide a high-level overview of the findings specific to that domain.

**Motivation:**
*   Provide users with a quick "at-a-glance" understanding of the key takeaways for each domain.
*   Improve report readability and scannability.
*   Clearly highlight areas where the user's company excels and areas needing attention within each specific domain.

**Proposed Implementation:**

1.  **Modify Secondary LLM Prompt:**
    *   Update the prompt sent to the secondary LLM (`gpt-4.1-nano`) responsible for generating domain-specific report data.
    *   **Location:** Within the `toolLogic` of report-generating functions in agent configurations (e.g., `llmPrompt` in `generateTrainingAwarenessReport` within `src/app/agentConfigs/initialRiskAssessment/training_awareness.ts`).
    *   **Required Change:** Modify the prompt to instruct the LLM to generate both the existing structured JSON *and* a new narrative summary paragraph, synthesizing strengths and weaknesses from the conversation.
2.  **Summary Content Requirements:**
    *   Prompt asks LLM to identify/synthesize key strengths and weaknesses for the domain based on the user's answers.
    *   Summary should be neutral, factual, and concise.
3.  **LLM Consideration:**
    *   `gpt-4.1-nano` might struggle with the dual task (JSON + summary). Evaluating more powerful models is likely necessary.

**Potential Challenges & Considerations:**

*   **Model Capability & Cost:** Upgrading the secondary LLM might be necessary, impacting costs.
*   **Latency:** More complex prompts/larger models will increase secondary LLM processing time, potentially slowing overall report generation.
*   **Prompt Engineering & Output Parsing:**
    *   Designing a prompt for reliable dual output (JSON + summary) is complex.
    *   The LLM output format needs clear definition (e.g., delimiters, JSON structure containing both) so the receiving function (e.g., `generateTrainingAwarenessReport`) can parse *both* the JSON and the summary text. The current expectation of JSON-only output needs to change.
*   **Data Handling (`saveReport` API):**
    *   The `/api/saveReport` endpoint and associated server-side logic need modification.
    *   Currently, it receives and saves only the JSON string (`reportContent`) to files like `training_awareness_report.json`.
    *   It must be updated to accept and store both the JSON data *and* the new summary text. This might involve:
        *   Changing the file structure (e.g., saving a single JSON file containing both `summary` and `details` keys).
        *   Saving two separate files per domain (e.g., `_report.json` and `_summary.txt`).
*   **Report Generation Script (`pdf_reporting/report_generation.py`):**
    *   This script reads the JSON files (e.g., `training_awareness_report.json`) listed in `DOMAIN_FILES` and generates the final `.docx` report using the `python-docx` library and a template (`risk_assessment_template.docx`).
    *   **Modification Required:** The loop iterating through `DOMAIN_FILES` needs changes:
        *   It must read the new summary text (either from the modified JSON structure or a separate summary file, depending on the `saveReport` API changes).
        *   Before creating the table (`doc.add_table(...)`) for a domain, it needs to insert the summary paragraph into the document using `python-docx` methods like `doc.add_paragraph(summary_text)`. Appropriate styling might also be applied here.
*   **Report Template (`risk_assessment_template.docx`):**
    *   The Word template might need adjustments if specific placeholder fields or formatting styles are desired for the summaries, although programmatic insertion via `python-docx` might be sufficient.
*   **Summary Quality & Consistency:** Ensuring consistent tone, style, and accuracy across domains.
*   **Placement in Report:** Deciding where the summary appears within each domain section (e.g., before the detailed Q&A table).
*   **UI Integration:** How the summaries are presented in the final report UI.

**Open Questions:**

*   Acceptable latency increase threshold?
*   Alternative LLM models for evaluation?
*   Specific requirements for summary length/style?
*   Optimal LLM output structure for parsing JSON and summary?
*   Best approach for `saveReport` API and file storage (combined JSON, separate files)?
*   Should summaries be configurable (on/off)?
*   Fallback if summary generation fails?
