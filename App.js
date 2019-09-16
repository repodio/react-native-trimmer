import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Trimmer from './Trimmer';


const maxTrimDuration = 60000;
const totalDuration = 180000;


const initialLeftHandlePosition = 30000;
const initialRightHandlePosition = 75000;


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trimmerLeftHandlePosition: initialLeftHandlePosition, // left handle position
      trimmerRightHandlePosition: initialRightHandlePosition, // right handle position
    }
  }

  onLeftHandleChange = (newLeftHandleValue) => {
    // this.setState({ trimDuration: duration, trimOffset: offset });
    console.log('onLeftHandleChange', newLeftHandleValue)
    this.setState({trimmerLeftHandlePosition: newLeftHandleValue })
  }

  formatTime = (time) => {
    return time
  }

  render() {
    const {
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
    } = this.state;
    
    return (
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeLabel}>Start Time</Text>
            <Text style={styles.time}>{this.formatTime(trimmerLeftHandlePosition)}</Text>
          </View>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeLabel}>End Time</Text>
            <Text style={styles.time}>{this.formatTime(trimmerRightHandlePosition)}</Text>
          </View>
        </View>
        <Trimmer 
          onLeftHandleChange={this.onLeftHandleChange}
          maxTrimDuration={maxTrimDuration}
          totalDuration={totalDuration}
          trimmerLeftHandlePosition={trimmerLeftHandlePosition}
          trimmerRightHandlePosition={trimmerRightHandlePosition}
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
  timeContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabel: {
    color: "#8F9BB3",
    fontSize: 12,
    textAlign: 'center',
  },
  timeLabel: {
    color: "#222B45",
    fontSize: 14,
    textAlign: 'center',
  }
});
