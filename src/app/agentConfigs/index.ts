import { AllAgentConfigsType } from "@/app/types";
import frontDeskAuthentication from "./frontDeskAuthentication";
import customerServiceRetail from "./customerServiceRetail";
import simpleExample from "./simpleExample";
import riskAssessment from "./riskAssessment";
import initialRiskAssessment from "./initialRiskAssessment";

export const allAgentSets: AllAgentConfigsType = {
  frontDeskAuthentication,
  riskAssessment,
  customerServiceRetail,
  simpleExample,
  initialRiskAssessment,
};

export const defaultAgentSetKey = "initialRiskAssessment";
