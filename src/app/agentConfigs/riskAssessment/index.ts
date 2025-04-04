import governanceAgent from './governance';
import greetingAgent from "./greeting";
import procedureAgent from "./procedure";
import { injectTransferTools } from '../utils';

// Set up the downstream agents
greetingAgent.downstreamAgents = [governanceAgent]
governanceAgent.downstreamAgents = [procedureAgent]


// Inject the transfer tools into the agents
const agents = injectTransferTools([greetingAgent,governanceAgent, procedureAgent]);

export default agents;