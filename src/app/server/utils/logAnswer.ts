// src/server/utils/logAnswer.ts
import { writeFileSync, readFileSync, existsSync } from "fs";
const filePath = "./access_control_responses.json";

export function logAnswer(answer: string) {
  let responses: string[] = [];

  if (existsSync(filePath)) {
    responses = JSON.parse(readFileSync(filePath, "utf-8"));
  }

  responses.push(answer);
  writeFileSync(filePath, JSON.stringify(responses, null, 2));
}
