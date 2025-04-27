# 1. Cybersecurity Risk Assessment with OpenAI Realtime API

## 2. Introduction

This project demonstrates a conversational cybersecurity risk assessment tool built using the OpenAI Realtime API. Engage in a natural conversation with an AI agent that guides you through various cybersecurity domains, asks relevant questions based on common frameworks, and helps identify potential areas of risk within your organization. The system leverages multiple specialized AI agents, each focusing on a specific domain like Access Control, Data Protection, or Incident Response.

## 3. Screenshot

*(Placeholder for screenshot - path to be provided)*
![Screenshot of the Realtime API Agents Demo](/public/screenshot.png)


## 4. Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js:** Required to run the application runtime.
*   **npm (or yarn):** Node package manager, usually included with Node.js.
*   **OpenAI API Key:** Needed for the AI agents to function.
*   **LibreOffice:** Required for the PDF report generation feature.

### Installation Instructions:

**macOS:**

*   **Node.js & npm:**
    *   The easiest way is using Homebrew:
        ```bash
        brew install node
        ```
    *   Alternatively, download the installer from [nodejs.org](https://nodejs.org/).
*   **LibreOffice:**
    *   Using Homebrew:
        ```bash
        brew install --cask libreoffice
        ```
    *   Or download from the [LibreOffice website](https://www.libreoffice.org/download/download-libreoffice/).

**Windows:**

*   **Node.js & npm:**
    *   Download the installer from [nodejs.org](https://nodejs.org/). npm is included.
*   **LibreOffice (Optional):**
    *   Download the installer from the [LibreOffice website](https://www.libreoffice.org/download/download-libreoffice/).

## 5. Getting Started

Once the prerequisites are installed:

1.  **Clone the repository:**
    ```bash
    git clone <https://github.com/sylvexxter/realtime-demo-risklink.git> 
    cd <realtime-demo-risklink>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(If you prefer yarn: `yarn install`)*
3.  **Configure Environment Variables:**
    *   Create a file named `.env` in the root directory of the project.
    *   Add your OpenAI API Key to this file:
        ```
        OPENAI_API_KEY=your_api_key_here
        ```
4.  **Run the application:**
    ```bash
    npm run dev
    ```
5.  Open your browser to [http://localhost:3000](http://localhost:3000). The application should load and be ready for interaction.

## 6. PDF Report Generation

This application includes a feature to generate a consolidated PDF report summarizing the risk assessment findings up to a certain point.

## 7. Core Contributors

This project was developed as part of a capstone project for the Master of Science in Information Security Policy and Management (MSISPM) program at Carnegie Mellon University.

*   **OpenAI Contacts:**
    *   Noah MacCallum - [noahmacca](https://x.com/noahmacca)
    *   Ilan Bigio - [ibigio](https://github.com/ibigio)
*   **CMU Capstone Team:**
    *   Sneh Sadaria - [sylvexxter]
    *   Khushi Shah
    *   Wendy Hu
    *   Yan Tian
    *   Tra-Vaughn James 