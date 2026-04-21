import { StateGraph, START, END } from '@langchain/langgraph';
import { AgentStateAnnotation } from './state.js';
import { makeRetriever } from '../shared/retrieval.js';
import { formatDocs, formatChatHistory } from './utils.js';
import { HumanMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { RESPONSE_SYSTEM_PROMPT, ROUTER_SYSTEM_PROMPT, REFORMULATE_SYSTEM_PROMPT } from './prompts.js';
import { RunnableConfig } from '@langchain/core/runnables';
import {
  AgentConfigurationAnnotation,
  ensureAgentConfiguration,
} from './configuration.js';
import { loadChatModel } from '../shared/utils.js';

async function checkQueryType(
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig,
): Promise<{
  route: 'retrieve' | 'direct';
}> {
  //schema for routing
  const schema = z.object({
    route: z.enum(['retrieve', 'direct']),
    directAnswer: z.string().optional(),
  });

  const configuration = ensureAgentConfiguration(config);
  const model = await loadChatModel(configuration.queryModel);

  const routingPrompt = ROUTER_SYSTEM_PROMPT;
  const chatHistory = formatChatHistory(state.messages);

  const formattedPrompt = await routingPrompt.invoke({
    chat_history: chatHistory,
    query: state.query,
  });

  const response = await model
    .withStructuredOutput(schema)
    .invoke(formattedPrompt.toString());

  const route = response.route;

  return { route };
}

async function answerQueryDirectly(
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig,
): Promise<typeof AgentStateAnnotation.Update> {
  const configuration = ensureAgentConfiguration(config);
  const model = await loadChatModel(configuration.queryModel);
  const userHumanMessage = new HumanMessage(state.query);
  
  const messageHistory = [...state.messages, userHumanMessage];

  const response = await model.invoke(messageHistory);
  return { messages: [userHumanMessage, response] };
}

async function routeQuery(
  state: typeof AgentStateAnnotation.State,
): Promise<'retrieveDocuments' | 'directAnswer'> {
  const route = state.route;
  if (!route) {
    throw new Error('Route is not set');
  }

  if (route === 'retrieve') {
    return 'retrieveDocuments';
  } else if (route === 'direct') {
    return 'directAnswer';
  } else {
    throw new Error('Invalid route');
  }
}

async function retrieveDocuments(
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig,
): Promise<typeof AgentStateAnnotation.Update> {
  const configuration = ensureAgentConfiguration(config);
  const retriever = await makeRetriever(config);
  const chatHistory = formatChatHistory(state.messages);
  
  let searchString = state.query;
  
  if (chatHistory && chatHistory !== 'No previous chat history.') {
    const model = await loadChatModel(configuration.queryModel);
    const reformulatePrompt = REFORMULATE_SYSTEM_PROMPT;
    const formattedPrompt = await reformulatePrompt.invoke({
      chat_history: chatHistory,
      query: state.query,
    });
    const response = await model.invoke(formattedPrompt.toString());
    searchString = response.content as string;
  }
  
  const response = await retriever.invoke(searchString);

  return { documents: response };
}

async function generateResponse(
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig,
): Promise<typeof AgentStateAnnotation.Update> {
  const configuration = ensureAgentConfiguration(config);
  const context = formatDocs(state.documents);
  const model = await loadChatModel(configuration.queryModel);
  const promptTemplate = RESPONSE_SYSTEM_PROMPT;

  const formattedPrompt = await promptTemplate.invoke({
    question: state.query,
    context: context,
  });

  const userHumanMessage = new HumanMessage(state.query);

  // Create a human message with the formatted prompt that includes context
  const formattedPromptMessage = new HumanMessage(formattedPrompt.toString());

  const messageHistory = [...state.messages, formattedPromptMessage];

  // Let MessagesAnnotation handle the message history
  const response = await model.invoke(messageHistory);

  // Return both the current query and the AI response to be handled by MessagesAnnotation's reducer
  return { messages: [userHumanMessage, response] };
}

const builder = new StateGraph(
  AgentStateAnnotation,
  AgentConfigurationAnnotation,
)
  .addNode('retrieveDocuments', retrieveDocuments)
  .addNode('generateResponse', generateResponse)
  .addNode('checkQueryType', checkQueryType)
  .addNode('directAnswer', answerQueryDirectly)
  .addEdge(START, 'checkQueryType')
  .addConditionalEdges('checkQueryType', routeQuery, [
    'retrieveDocuments',
    'directAnswer',
  ])
  .addEdge('retrieveDocuments', 'generateResponse')
  .addEdge('generateResponse', END)
  .addEdge('directAnswer', END);

export const graph = builder.compile().withConfig({
  runName: 'RetrievalGraph',
});
