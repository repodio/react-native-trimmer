import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Trimmer from './Trimmer';
import moment from 'moment';


const maxTrimDuration = 60000;
const minimumTrimDuration = 1000;
const totalDuration = 180000

const initialLeftHandlePosition = 0;
const initialRightHandlePosition = 36000;

const scrubInterval = 50;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      trimmerLeftHandlePosition: initialLeftHandlePosition, // left handle position
      trimmerRightHandlePosition: initialRightHandlePosition, // right handle position
      scrubberPosition: initialLeftHandlePosition
    }
  }

  playScrubber = () => {
    this.setState({ playling: true });

    this.scrubberInterval = setInterval(() => {
      this.setState({ scrubberPosition: this.state.scrubberPosition + scrubInterval })
    }, scrubInterval)
  }

  pauseScrubber = () => {
    clearInterval(this.scrubberInterval)

    this.setState({ playling: false, scrubberPosition: this.state.trimmerLeftHandlePosition });
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

  onScrubbingComplete = (newValue) => {
    console.log('onScrubbingComplete', newValue)
    this.setState({ playing: false, scrubberPosition: newValue })
  }

  render() {
    const {
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      scrubberPosition,
      playling,
    } = this.state;
    
    return (
      <View style={styles.container}>
        {
          playling
            ? <Button title="Pause" color="#40E1A9" onPress={this.pauseScrubber}/>
            : <Button title="Play" color="#40E1A9" onPress={this.playScrubber}/>
        }
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
          totalDuration={totalDuration}
          trimmerLeftHandlePosition={trimmerLeftHandlePosition}
          trimmerRightHandlePosition={trimmerRightHandlePosition}
          minimumTrimDuration={minimumTrimDuration}
          maxTrimDuration={maxTrimDuration}
          maxScaleValue={20}
          tintColor="#f638dc"
          markerColor="#5a3d5c"
          trackBackgroundColor="#382039"
          trackBorderColor="#5a3d5c"
          scrubberPosition={scrubberPosition}
          onScrubbingComplete={this.onScrubbingComplete}
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
