import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

export default function App() {
  const [color, setColor] = useState('#000000'); // Default stroke color
  const [strokeWidth, setStrokeWidth] = useState(5); // Default stroke width

  const clearCanvas = () => {
    Alert.alert(
      'Clear Canvas',
      'Are you sure you want to clear the canvas?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => canvasRef.clear() },
      ],
    );
  };

  const canvasRef = React.createRef();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Note-Taking App</Text>
      <View style={styles.toolbar}>
        <Button title="Red" onPress={() => setColor('#FF0000')} color="#FF0000" />
        <Button title="Blue" onPress={() => setColor('#0000FF')} color="#0000FF" />
        <Button title="Green" onPress={() => setColor('#00FF00')} color="#00FF00" />
        <Button title="Clear" onPress={clearCanvas} color="#FF6347" />
      </View>
      <SketchCanvas
        ref={(ref) => (canvasRef.current = ref)}
        style={styles.canvas}
        strokeColor={color}
        strokeWidth={strokeWidth}
        onStrokeEnd={(path) => console.log('Stroke path:', path)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  canvas: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
  },
});
