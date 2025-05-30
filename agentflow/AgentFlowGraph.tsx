import React, { useState, useRef, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, ScrollView , Dimensions} from 'react-native';
import Svg, { Circle, Text as SvgText, Line, Polygon } from 'react-native-svg';
import { Node, Edge } from './DataModels';
import { ScrollView as RNScrollView } from 'react-native';

interface Props {
  nodes: Node[];
  edges: Edge[];
}

export default function AgentFlowGraph({ nodes, edges }: Props) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const baseNodeRadius = 20;
  const minNodeRadius = 10;
  const maxNodeRadius = 28;
  const baseCanvasSize = 600;
  const nodeSpacingFactor = 60;
  const nodeCount = nodes.length;
  const canvasWidth = Math.max(baseCanvasSize, nodeCount * nodeSpacingFactor);
  const canvasHeight = Math.max(baseCanvasSize, nodeCount * nodeSpacingFactor);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const scrollXRef = useRef<RNScrollView>(null);
  const scrollYRef = useRef<RNScrollView>(null);

  const nodeRadius = Math.max(
    minNodeRadius,
    Math.min(maxNodeRadius, baseNodeRadius + (10 - nodes.length)));

    useEffect(() => {
      // Scroll to center after render
      setTimeout(() => {
        scrollXRef.current?.scrollTo({ x: canvasWidth / 2 - screenWidth / 2, animated: false });
        scrollYRef.current?.scrollTo({ y: canvasHeight / 2 - screenHeight / 2, animated: false });
      }, 0);
    }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollXRef}
        horizontal
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ScrollView
          ref={scrollYRef}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Svg width={canvasWidth} height={canvasHeight}>
        {edges.map((edge, idx) => {
          const from = nodes.find(n => n.id === edge.from);
          const to = nodes.find(n => n.id === edge.to);
          if (!from || !to) return null;

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const normX = dx / length;
          const normY = dy / length;
          const arrowLength = 12;
          const arrowWidth = 10;

          // Arrow tip position (just before target circle)
          const tipX = to.x - normX * (nodeRadius + 2);
          const tipY = to.y - normY * (nodeRadius + 2);


          // Base corners of the triangle
          const baseLeftX = tipX - normX * arrowLength - normY * (arrowWidth / 2);
          const baseLeftY = tipY - normY * arrowLength + normX * (arrowWidth / 2);

          const baseRightX = tipX - normX * arrowLength + normY * (arrowWidth / 2);
          const baseRightY = tipY - normY * arrowLength - normX * (arrowWidth / 2);

          return (
            <React.Fragment key={idx}>
              <Line
                x1={from.x}
                y1={from.y}
                x2={tipX}
                y2={tipY}
                stroke="#00FFF7"
                strokeWidth={2}
              />
              <Polygon
                points={`${tipX},${tipY} ${baseLeftX},${baseLeftY} ${baseRightX},${baseRightY}`}
                fill="#00FFF7"
              />
            </React.Fragment>
          );
        })}
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            <Circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill="#1E1E2F"
              stroke="#00FFF7"
              strokeWidth={2}
              onPressIn={() => setSelectedNode(node)} // <-- this is the fix
            />
            <SvgText
              x={node.x}
              y={node.y + 7}
              fontSize={nodeRadius}
              fontWeight="bold"
              fill="#00FFF7"
              textAnchor="middle"
            >
              {node.type === 'agent' ? '🤖' : '🛠️'}
            </SvgText>
          </React.Fragment>
        ))}

          </Svg>
        </ScrollView>
      </ScrollView>

      <Modal visible={!!selectedNode} transparent animationType="fade">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>{selectedNode?.name}</Text>
            <Text style={styles.popupText}>Type: {selectedNode?.type}</Text>
            <ScrollView style={styles.outputScroll} nestedScrollEnabled>
              <Text style={styles.popupOutput}>
                {selectedNode?.output || "No recent output."}
              </Text>
            </ScrollView>
            <TouchableOpacity onPress={() => setSelectedNode(null)}>
              <Text style={styles.closeBtn}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  popupContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#1E1E2F',
    padding: 20,
    borderRadius: 10,
    borderColor: '#00FFF7',
    borderWidth: 2,
    shadowColor: '#00FFF7',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    width: '80%',
  },
  popupTitle: {
    fontSize: 20,
    color: '#00FFF7',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  popupText: {
    fontSize: 16,
    color: '#EDEDED',
    marginBottom: 6,
  },
  popupOutput: {
    fontSize: 14,
    color: '#AAAAAA',
    fontFamily: 'Courier New',
  },
    outputScroll: {
    maxHeight: 200, // Adjust based on how much vertical space you want
    marginTop: 8,
    marginBottom: 8,
  },
  closeBtn: {
    marginTop: 16,
    color: '#00FFF7',
    fontSize: 16,
    textAlign: 'center',
  },
});
