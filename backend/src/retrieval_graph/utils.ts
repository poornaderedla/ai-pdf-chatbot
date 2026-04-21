import { Document } from '@langchain/core/documents';
import { BaseMessage } from '@langchain/core/messages';

export function formatDoc(doc: Document): string {
  const metadata = doc.metadata || {};
  const meta = Object.entries(metadata)
    .map(([k, v]) => ` ${k}=${v}`)
    .join('');
  const metaStr = meta ? ` ${meta}` : '';

  return `<document${metaStr}>\n${doc.pageContent}\n</document>`;
}

export function formatDocs(docs?: Document[]): string {
  /**Format a list of documents as XML. */
  if (!docs || docs.length === 0) {
    return '<documents></documents>';
  }
  const formatted = docs.map(formatDoc).join('\n');
  return `<documents>\n${formatted}\n</documents>`;
}

export function formatChatHistory(messages: BaseMessage[]): string {
  if (!messages || messages.length === 0) return 'No previous chat history.';
  return messages
    .slice(-4)
    .map((msg) => {
      const role = msg._getType() === 'human' ? 'User' : 'Assistant';
      return `${role}: ${msg.content}`;
    })
    .join('\n');
}
