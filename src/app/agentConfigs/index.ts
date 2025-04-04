import { AllAgentConfigsType } from "@/app/types";
import frontDeskAuthentication from "./frontDeskAuthentication";
import customerServiceRetail from "./customerServiceRetail";
import simpleExample from "./simpleExample";
import riskAssessment from "./riskAssessment";

export const allAgentSets: AllAgentConfigsType = {
  frontDeskAuthentication,
  riskAssessment,
  customerServiceRetail,
  simpleExample,
};

export const defaultAgentSetKey = "riskAssessment";
