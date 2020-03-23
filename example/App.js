import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  Slider
} from 'react-native'
import Trimmer from 'react-native-trimmer'
// import Slider from '@react-native-community/slider';
import MinimalTrimmer from './MinimalTrimmer'
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const maxTrimDuration = 60000;
const minimumTrimDuration = 5000;
const totalDuration = 120000;

const trimmerLength = 30000

const initialLeftHandlePosition = 0;
const initialRightHandlePosition = 36000;

const scrubInterval = 50;

const TRIMMER_LENGTHS = [
  {
    value: 5000,
    key: "5s",
  },
  {
    value: 10000,
    key: "10s",
  },
  {
    value: 15000,
    key: "15s",
  },
  {
    value: 20000,
    key: "20s",
  },
  {
    value: 25000,
    key: "25s",
  },
  {
    value: 30000,
    key: "30s",
  },
  {
    value: 35000,
    key: "35s",
  },
  {
    value: 40000,
    key: "40s",
  },
  {
    value: 45000,
    key: "45s",
  },
  {
    value: 50000,
    key: "50s",
  },
  {
    value: 55000,
    key: "55s",
  },
  {
    value: 60000,
    key: "60s",
  },
]

const TrimmerLengthButton = ({ trimmerLengthOption, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.trimmerButtonRoot}>
        <Text style={styles.trimmerButtonLabel}>{trimmerLengthOption.key}</Text>
      </View>
    </TouchableOpacity>
  )
}

const PlaybackButton = ({ playing, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.playbackButtonRoot}>
      <MaterialIcons name={playing ? "pause-circle-filled" : "play-circle-filled"} size={28} color="#222B45" />
    </TouchableOpacity>
  )
}

round = num => Math.round(num).toFixed(0)

clamp = ({ num, min, max }) => num <= min ? min : num >= max ? max : num;

formatMilliseconds = ( ms ) => {
  // 1- Convert to seconds:
  var seconds = ms / 1000;
  // 2- Extract hours:
  var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;

  return `${round(hours)}:${round(minutes) < 10 ? `0${round(minutes)}` : round(minutes)}:${seconds < 10 ? `0${seconds.toFixed(0)}` : seconds.toFixed(0) }`
}

export default class App extends Component {
  render() {
    return (
      <View style={styles.root}>
        <Example totalDuration={120000} trimmerLengthOptionIndex={0}/>
        {/* <View style={{ height: 1, width: '100%', backgroundColor: '#AAA' }}/>
        <Example totalDuration={1200000} trimmerLengthOptionIndex={5}/>
        <View style={{ height: 1, width: '100%', backgroundColor: '#AAA' }}/>
        <Example totalDuration={12000000} trimmerLengthOptionIndex={3}/> */}
      </View>
    )
  }
}

class Example extends Component {
  constructor(props) {
    super(props);


    this.state = {
      playing: false,
      startPosition: 0,
      totalDuration: props.totalDuration,
      trimmerLengthOptionIndex: props.trimmerLengthOptionIndex,
    }
  }

  togglePlayButton = () => {
    const { playing } = this.state;

    if(playing) {
      this.trimmerRef.stopTrackProgressAnimation();
      this.setState({ playing: false });
    } else {
      this.trimmerRef.startTrackProgressAnimation()
      this.setState({ playing: true });
    }
  }

  componentWillUnmount() {
    clearInterval(this.valueChangeInterval);
  }

  onSliderValueChanged = value => {
    this.setState({ scrubbing: true })

    if( this.trimmerRef && this.trimmerRef.scrollViewRef)  {
      const { totalDuration, trimmerLengthOptionIndex } = this.state;

      const newStartingPosition = value * (totalDuration - TRIMMER_LENGTHS[trimmerLengthOptionIndex].value)
      const newScrollPosition = (newStartingPosition / totalDuration) * this.trimmerRef.state.contentWidth

      this.trimmerRef.scrollViewRef.scrollTo({x: newScrollPosition, y: 0, animated: false})
      this.setState({ startPositionLabel: newStartingPosition });
    }
    this.trimmerRef.stopTrackProgressAnimation();
  }

  onTrimmerValueChanged = value => {
    this.setState({ startPosition: value })
  }

  changeTrimmerLength = () => {
    this.trimmerRef.stopTrackProgressAnimation();
    this.setState({ trimmerLengthOptionIndex: (this.state.trimmerLengthOptionIndex + 1) % TRIMMER_LENGTHS.length }, () => {
      this.trimmerRef.startTrackProgressAnimation();
    })
  }

  onSlidingComplete = value => {
    this.setState({ scrubbing: false })
    
    if( this.trimmerRef && this.trimmerRef.scrollViewRef )  {
      const { totalDuration, trimmerLengthOptionIndex } = this.state;

      const newStartingPosition = value * (totalDuration - TRIMMER_LENGTHS[trimmerLengthOptionIndex].value)

      this.setState({ startPosition: newStartingPosition })
    }
    if(this.state.playing) {
      this.trimmerRef.startTrackProgressAnimation();
    }
  }

  onScrollBeginDrag = () => {
    this.trimmerRef.stopTrackProgressAnimation();
  }

  onScrollEndDrag = () => {
    if(this.state.playing) {
      this.trimmerRef.startTrackProgressAnimation();
    }
  }

  render() {
    const {
      totalDuration,
      trimmerLengthOptionIndex,
      playing,
      startPosition,
      startPositionLabel,
      scrubbing,
    } = this.state;

    return (
      <View style={styles.exampleRoot}>
        <View style={styles.sliderContainer}>
          <View style={{ flex: 0 }}>
            <TrimmerLengthButton onPress={this.changeTrimmerLength} trimmerLengthOption={TRIMMER_LENGTHS[trimmerLengthOptionIndex]}/>
          </View>
          <View style={{ flex: 1 }}>
            <Slider
              thumbImage={require("./assets/thumb-image.png")}
              minimumValue={0}
              minimumTrackTintColor="#40E1A9"
              maximumTrackTintColor="#B3BED3"
              step={0}
              maximumValue={1}
              onValueChange={this.onSliderValueChanged}
              onSlidingComplete={this.onSlidingComplete}
              value={startPosition / (totalDuration - TRIMMER_LENGTHS[trimmerLengthOptionIndex].value)}
            />
            <View style={styles.timesContainer}>
              <Text style={styles.timesLabel}>{scrubbing ? formatMilliseconds(startPositionLabel) : formatMilliseconds(startPosition)}</Text>
              <Text style={styles.timesLabel}>{scrubbing ? formatMilliseconds(startPositionLabel + TRIMMER_LENGTHS[trimmerLengthOptionIndex].value) : formatMilliseconds(startPosition + TRIMMER_LENGTHS[trimmerLengthOptionIndex].value)}</Text>
            </View>
          </View>
          <View style={{ flex: 0 }}>
            <PlaybackButton onPress={this.togglePlayButton} playing={playing}/> 
          </View>
        </View>
        <MinimalTrimmer
          scrubbing={scrubbing}
          ref={ref => this.trimmerRef = ref}
          showScrollIndicator={false}
          width={screenWidth - 24}
          totalDuration={totalDuration}
          tintColor={"#40E1A9"}
          markerColor={"#EDEFF3"}
          trackBackgroundColor={"#FFF"}
          trackBorderColor={"#5a3d5c"}
          onStartValueChanged={this.onTrimmerValueChanged}
          trimmerLength={TRIMMER_LENGTHS[trimmerLengthOptionIndex].value}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onScrollEndDrag={this.onScrollEndDrag}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleRoot: {
    width: '100%',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trimmerButtonRoot: {
    marginLeft: 12,
    marginRight: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderColor: "#222B45",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  trimmerButtonLabel: {
    fontSize: 11,
  },
  sliderContainer: {
    // width: screenWidth,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8
  },
  playbackButtonRoot: {
    marginRight: 16,
    marginLeft: 12,
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timesLabel: {
    fontSize: 12,
    color: '#666',
    letterSpacing: 1,
  }
});