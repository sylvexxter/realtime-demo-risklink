// Create new API route for report download
export const runtime = 'nodejs';

import { spawn } from 'child_process';
import { promises as fs, existsSync } from 'fs';
import path from 'path';

// GET /api/report/download
export async function GET(request: Request) {
  // Ensure report JSON data is present before generating PDF
  const jsonDir = path.join(process.cwd(), 'src', 'json_reports', 'initialRiskAssessment');
  const userInfoFile = path.join(jsonDir, 'user_information.json');
  if (!existsSync(userInfoFile)) {
    return new Response(
      'No report data found. Please complete the initial risk assessment first.',
      { status: 404 }
    );
  }
  // Directory containing the Python script and templates
  const scriptDir = path.join(process.cwd(), 'pdf_reporting');
  const scriptFile = 'report_generation.py';

  // Determine python interpreter in venv (check python3 and python)
  const venvDir = path.join(process.cwd(), 'venv');
  const venvBin = path.join(venvDir, 'bin');
  const venvPython3 = path.join(venvBin, 'python3');
  const venvPython = path.join(venvBin, 'python');
  const pythonExec = existsSync(venvPython3)
    ? venvPython3
    : existsSync(venvPython)
    ? venvPython
    : 'python3';

  // Prepare environment for spawn to activate venv
  const childEnv = {
    ...process.env,
    VIRTUAL_ENV: venvDir,
    PATH: `${venvBin}:${process.env.PATH}`,
  };

  // Spawn Python to generate the PDF using the correct interpreter and venv
  const child = spawn(pythonExec, [scriptFile], {
    cwd: scriptDir,
    env: childEnv,
  });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (data) => { stdout += data.toString(); });
  child.stderr.on('data', (data) => { stderr += data.toString(); });

  // Wait for Python script to finish
  const exitCode: number = await new Promise((resolve) => {
    child.on('close', resolve);
  });

  if (exitCode !== 0) {
    console.error('Error generating report:', stderr);
    // Include stderr in response for debugging
    const message = stderr || 'Failed to generate report';
    return new Response(message, { status: 500 });
  }

  // Extract PDF filename from script output
  const match = stdout.match(/PDF generated: (.+\.pdf)/);
  const pdfName = match ? match[1].trim() : 'Risk_Assessment_Report.pdf';
  const pdfPath = path.join(scriptDir, pdfName);

  let fileBuffer: Buffer;
  try {
    fileBuffer = await fs.readFile(pdfPath);
  } catch (err) {
    console.error('Error reading PDF file:', err);
    return new Response('Report generated but could not be read', { status: 500 });
  }

  // Return the PDF as a downloadable attachment
  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${path.basename(pdfPath)}"`,
    },
  });
}