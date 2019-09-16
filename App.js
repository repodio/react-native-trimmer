import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Trimmer from './Trimmer';


const maxTrimDuration = 60000;
const initialTrimSize = 45000;
const totalDuration = 180000;
const initialTrimOffset = 30000;


const initialLeftHandlePosition = 30000;
const initialRightHandlePosition = 75000;


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trimDuration: initialTrimSize, // this value means the handles are being moved
      trimOffset: initialTrimOffset, // this value means the handles are being moved


      trimmerLeftHandlePosition: initialLeftHandlePosition, // left handle position
      trimmerRightHandlePosition: initialRightHandlePosition, // right handle position
    }
  }

  onLeftHandleChange = (newLeftHandleValue) => {
    // this.setState({ trimDuration: duration, trimOffset: offset });
    console.log('onLeftHandleChange', newLeftHandleValue)
    this.setState({trimmerLeftHandlePosition: newLeftHandleValue })
  }

  render() {
  
    console.log('trimmerLeftHandlePosition', this.state.trimmerLeftHandlePosition)
    console.log('trimmerRightHandlePosition', this.state.trimmerRightHandlePosition)

    
    return (
      <View style={styles.container}>
        <Trimmer 
          onLeftHandleChange={this.onLeftHandleChange}
          maxTrimDuration={maxTrimDuration}
          trimDuration={this.state.trimDuration}
          trimOffset={this.state.trimOffset}
          totalDuration={totalDuration}
          trimmerLeftHandlePosition={this.state.trimmerLeftHandlePosition}
          trimmerRightHandlePosition={this.state.trimmerRightHandlePosition}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
