import governanceAgent from './governance';
import greetingAgent from "./greeting";
import procedureAgent from "./procedure";
import systemSecurityAgent from './systemSecurity';
import antiVirusAgent from './antiVirus';
import sdlc from './sdlc';
import accessControlAgent from './accessControl';
import threatManagementAgent from './threatManagement';
import thirdPartyRiskAgent from './thirdPartyRisk';
import vulnerabilityAssessmentAgent from './vulnerabilityAssessment';
import physicalSecurityAgent from './physicalSecurity';
import networkSecurityAgent from './networkSecurity';
import incidentResponseAgent from './incidentResponse';
import BCDR from './BCDR'; // Assuming export is named bcdrAgent from BCDR.ts
import { injectTransferTools } from '../utils';

// Set up the downstream agents in the specified sequence
greetingAgent.downstreamAgents = [governanceAgent];
governanceAgent.downstreamAgents = [procedureAgent];
procedureAgent.downstreamAgents = [systemSecurityAgent];
systemSecurityAgent.downstreamAgents = [antiVirusAgent];
antiVirusAgent.downstreamAgents = [sdlc];
sdlc.downstreamAgents = [accessControlAgent];
accessControlAgent.downstreamAgents = [threatManagementAgent];
threatManagementAgent.downstreamAgents = [thirdPartyRiskAgent];
thirdPartyRiskAgent.downstreamAgents = [vulnerabilityAssessmentAgent];
vulnerabilityAssessmentAgent.downstreamAgents = [physicalSecurityAgent];
physicalSecurityAgent.downstreamAgents = [networkSecurityAgent];
networkSecurityAgent.downstreamAgents = [incidentResponseAgent];
incidentResponseAgent.downstreamAgents = [BCDR];
// The last agent (bcdrAgent) has no downstream agents in this sequence
BCDR.downstreamAgents = [];


// Inject the transfer tools into all the agents in the sequence
const agents = injectTransferTools([
  greetingAgent,
  governanceAgent,
  procedureAgent,
  systemSecurityAgent,
  antiVirusAgent,
  sdlc,
  accessControlAgent,
  threatManagementAgent,
  thirdPartyRiskAgent,
  vulnerabilityAssessmentAgent,
  physicalSecurityAgent,
  networkSecurityAgent,
  incidentResponseAgent,
  BCDR
]);

export default agents;