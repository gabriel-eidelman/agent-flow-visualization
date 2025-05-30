import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'
import {Dispatch, SetStateAction} from 'react'

const ViewToggle = ({ displayType, setDisplayType }: { displayType: string, setDisplayType: Dispatch<SetStateAction<"chat" | "flow">>}) => {
  const nextLabel = displayType === 'chat' ? 'Switch to Graph 📈' : 'Switch to Chat 💬';

  return (
    <TouchableOpacity
      onPress={() => setDisplayType(displayType === 'chat' ? 'flow' : 'chat')}
      style={styles.toggleButton}
      activeOpacity={0.8}
    >
      <Text style={styles.toggleButtonText}>{nextLabel}</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: '#00FFF7', // Bright background to pop
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#00FFF7',
    shadowColor: '#00FFF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },

  toggleButtonText: {
    color: '#0F0F1A', // Invert color for contrast
    fontFamily: 'Courier New',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ViewToggle;