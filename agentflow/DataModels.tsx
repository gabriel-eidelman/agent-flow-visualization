export type NodeType = 'agent' | 'tool';

export interface Node {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
  output: string;
}

export interface Edge {
  from: string;
  to: string;
}

export enum MessageType {
  text = 'Agent Message',
  tool = 'Tool Response',
  termination = 'Terminating',
  unknown = 'Unkown Type'
}

export interface Message {
  id: string;
  type: MessageType,
  sender: string,
  recipient: string,
  output: string;
}
