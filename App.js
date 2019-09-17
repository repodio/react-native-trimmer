import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Trimmer from './Trimmer';
import moment from 'moment';


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
    this.setState({ trimmerLeftHandlePosition: newLeftHandleValue })
  }

  onRightHandleChange = (newRightHandleValue) => {
    // this.setState({ trimDuration: duration, trimOffset: offset });
    console.log('onRightHandleChange', newRightHandleValue)
    this.setState({ trimmerRightHandlePosition: newRightHandleValue })
  }

  formatDuration = milliseconds => moment.utc(milliseconds).format('HH:mm:ss')

  render() {
    const {
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
    } = this.state;
    
    return (
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeLabel}>Total Time</Text>
            <Text style={styles.time}>{this.formatDuration(totalDuration)}</Text>
          </View>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeLabel}>Trimmed Time</Text>
            <Text style={styles.time}>{this.formatDuration(trimmerRightHandlePosition - trimmerLeftHandlePosition)}</Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeLabel}>Start Time</Text>
            <Text style={styles.time}>{this.formatDuration(trimmerLeftHandlePosition)}</Text>
          </View>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeLabel}>End Time</Text>
            <Text style={styles.time}>{this.formatDuration(trimmerRightHandlePosition)}</Text>
          </View>
        </View>
        <Trimmer
          onLeftHandleChange={this.onLeftHandleChange}
          onRightHandleChange={this.onRightHandleChange}
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
  time: {
    color: "#222B45",
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 1,
  }
});
