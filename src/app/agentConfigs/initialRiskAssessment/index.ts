import greeting_Agent from "./greeting";
import training_awareness_Agent from './training_awareness';
import asset_management_Agent from "./asset_management";
import data_protection_privacy_Agent from "./data_protection_privacy";
import backups_Agent from "./backups";
import system_security_Agent from "./system_security";
import anti_virus_Agent from "./anti_virus";
import access_control_Agent from "./access_control";
import incident_response_Agent from "./incident_response";

import { injectTransferTools } from '../utils';

// Set up the downstream agents
greeting_Agent.downstreamAgents = [training_awareness_Agent]
training_awareness_Agent.downstreamAgents = [asset_management_Agent]
asset_management_Agent.downstreamAgents = [data_protection_privacy_Agent]
data_protection_privacy_Agent.downstreamAgents = [backups_Agent]
backups_Agent.downstreamAgents = [system_security_Agent]
system_security_Agent.downstreamAgents = [anti_virus_Agent]
anti_virus_Agent.downstreamAgents = [access_control_Agent]
access_control_Agent.downstreamAgents = [incident_response_Agent]
incident_response_Agent.downstreamAgents = []


// Inject the transfer tools into the agents
const agents = injectTransferTools([greeting_Agent, training_awareness_Agent, asset_management_Agent, data_protection_privacy_Agent, backups_Agent, system_security_Agent, anti_virus_Agent, access_control_Agent, incident_response_Agent]);

export default agents;