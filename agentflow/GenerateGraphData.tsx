import { Dimensions } from 'react-native';
import { Message, MessageType } from './DataModels';
import { Node, Edge } from './DataModels';

export default function generateGraphData(messages: Message[]): { nodes: Node[]; edges: Edge[] } {
  const nodeMap = new Map<string, Node>();
  const edges: Edge[] = [];

  const { width, height } = Dimensions.get('window');
  const nodeCountEstimate = new Set(messages.flatMap(m => [m.sender, m.recipient])).size;

  const maxRadius = Math.min(width, height) / 2.2;
  const radius = Math.min(maxRadius, 50 + nodeCountEstimate * 12);
  const canvasSize = Math.max(600, nodeCountEstimate * 60);
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;


  const angleIncrement = (2 * Math.PI) / nodeCountEstimate;
  let index = 0;

  const getNodeType = (id: string): 'agent' | 'tool' =>
    id.startsWith('tool') ? 'tool' : 'agent';

  for (const msg of messages) {
    const { sender, recipient, type, output } = msg;

    for (const id of [sender, recipient]) {
      if (!nodeMap.has(id)) {
        const angle = index * angleIncrement;
        nodeMap.set(id, {
          id,
          name: id,
          type: getNodeType(id),
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          output: output,
        });
        index++;
      }
    }

    edges.push({ from: sender, to: recipient });

    if (type === MessageType.tool) {
      edges.push({ from: recipient, to: sender });
    }
  }

  return { nodes: Array.from(nodeMap.values()), edges };
}
