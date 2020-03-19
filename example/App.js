import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native'
import Trimmer from 'react-native-trimmer'
import Scrubber from 'react-native-scrubber'
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
    value: 5000,
    key: "10s",
  },
  {
    value: 5000,
    key: "15s",
  },
  {
    value: 5000,
    key: "20s",
  },
  {
    value: 5000,
    key: "25s",
  },
  {
    value: 5000,
    key: "30s",
  },
  {
    value: 5000,
    key: "35s",
  },
  {
    value: 5000,
    key: "45s",
  },
  {
    value: 5000,
    key: "40s",
  },
  {
    value: 5000,
    key: "45s",
  },
  {
    value: 5000,
    key: "55s",
  },
  {
    value: 5000,
    key: "60s",
  },
]

const TrimmerLengthButton = ({ trimmerLengthOption, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.trimmerButtonRoot}>
        <Text>{trimmerLengthOption.key}</Text>
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

  return `${round(hours)}h:${round(minutes)}m:${seconds.toFixed(3)}s`
}

export default class App extends Component {
  render() {
    return (
      <View style={styles.root}>
        <Example totalDuration={120000}/>
      </View>
    )
  }
  // state = {
  //   playing: false,
  //   trimmerLeftHandlePosition: initialLeftHandlePosition,
  //   trimmerRightHandlePosition: initialRightHandlePosition,
  //   scrubberPosition: 1000,
  //   startPosition: 0,
  // }
  
  // playScrubber = () => {
  //   this.setState({ playling: true });

  //   this.scrubberInterval = setInterval(() => {
  //     this.setState({ scrubberPosition: this.state.scrubberPosition + scrubInterval })
  //   }, scrubInterval)
  // }

  // pauseScrubber = () => {
  //   clearInterval(this.scrubberInterval)

  //   this.setState({ playling: false, scrubberPosition: this.state.trimmerLeftHandlePosition });
  // }

  // onHandleChange = ({ leftPosition, rightPosition }) => {
  //   this.setState({
  //     trimmerRightHandlePosition: rightPosition,
  //     trimmerLeftHandlePosition: leftPosition
  //   })
  // }

  // onScrubbingComplete = (newValue) => {
  //   this.setState({ playing: false, scrubberPosition: newValue })
  // }

  // trimmerProps = () => {
  //   const {
  //     trimmerLeftHandlePosition,
  //     trimmerRightHandlePosition,
  //     scrubberPosition,
  //     playling,
  //   } = this.state;

  //   return {
  //     onHandleChange: this.onHandleChange,
  //     totalDuration: totalDuration,
  //     trimmerLeftHandlePosition: trimmerLeftHandlePosition,
  //     trimmerRightHandlePosition: trimmerRightHandlePosition,
  //     minimumTrimDuration: minimumTrimDuration,
  //     maxTrimDuration: maxTrimDuration,
  //     maximumZoomLevel: 200,
  //     zoomMultiplier: 20,
  //     initialZoomValue: 2,
  //     scaleInOnInit: true,
  //     tintColor: "#f638dc",
  //     markerColor: "#5a3d5c",
  //     trackBackgroundColor: "#382039",
  //     trackBorderColor: "#5a3d5c",
  //     scrubberColor: "#b7e778",
  //     scrubberPosition: scrubberPosition,
  //     onScrubbingComplete: this.onScrubbingComplete,
  //     onLeftHandlePressIn: () => console.log('onLeftHandlePressIn'),
  //     onRightHandlePressIn: () => console.log('onRightHandlePressIn'),
  //     onScrubberPressIn: () => console.log('onScrubberPressIn'),
  //   }
  // }


  // onStartValueChanged = (val) => {
  //   this.setState({ startPosition: val })
  // }

  // trimmerProps2 = () => {
  //   const {
  //     trimmerLeftHandlePosition,
  //     trimmerRightHandlePosition,
  //     scrubberPosition,
  //     playling,
  //   } = this.state;

  //   return {
  //     totalDuration: totalDuration,
  //     tintColor: "#40E1A9",
  //     markerColor: "#EDEFF3",
  //     trackBackgroundColor: "#FFF",
  //     trackBorderColor: "#5a3d5c",
  //     onStartValueChanged: this.onStartValueChanged,
  //     trimmerLength,
  //   }
  // }

  // render() {
  //   const {
  //     trimmerLeftHandlePosition,
  //     trimmerRightHandlePosition,
  //     scrubberPosition,
  //     playling,
  //     startPosition,
  //   } = this.state;
    
  //   return (
  //     <KeyboardAvoidingView
  //       style={{ flex: 1 }}
  //       behavior={Platform.select( {ios: "position", android: "height"})}
  //       keyboardVerticalOffset={Platform.select( {ios: -100, android: 0})}
  //     >
  //       <ScrollView
  //         scrollEnabled={false}
  //         style={{height: '100%'}}
  //         keyboardDismissMode={Platform === 'ios' ? "interactive" : 'on-drag'}
  //       >
  //         <View>
  //           <View style={{ width: '100%', height: 250, backgroundColor: '#f638dc', padding: 20 }}/>
  //           {
  //             playling
  //               ? <Button title="Pause" color="#f638dc" onPress={this.pauseScrubber}/>
  //               : <Button title="Play" color="#f638dc" onPress={this.playScrubber}/>
  //           }
  //           <Text>Total Time: {formatMilliseconds(totalDuration)}</Text>
  //           <Text>Start Time: {formatMilliseconds(startPosition)}</Text>
  //           <MinimalTrimmer {...this.trimmerProps2()}/>
  //           <ScrollView style={{ width: '100%', height: '100%', backgroundColor: 'blue' }}>
  //             <View style={{ width: '100%', height: 100, backgroundColor: '#f638dc', padding: 20 }}/>
  //             <View style={{ width: '100%', borderWidth: 2, borderColor: '#f638dc', padding: 20 }}>
  //               <TextInput />
  //             </View>
  //           </ScrollView>
  //         </View>
  //       </ScrollView>
  //     </KeyboardAvoidingView>
  //   );
  // }
}

class Example extends Component {
  constructor(props) {
    super(props);


    this.state = {
      playing: false,
      startPosition: 0,
      totalDuration: props.totalDuration,
      trimmerLengthOptionIndex: 0,
    }
  }

  togglePlayButton = () => {
    const { playing, startPosition } = this.state;

    if(playing) {
      clearInterval(this.valueChangeInterval);
      this.setState({ playing: false });
    } else {
      this.valueChangeInterval = setInterval(() => {
        this.setState({ 
          startPosition: startPosition + 1000,
        })
      }, 1000);
      this.setState({ playing: true });
    }
  }

  componentWillUnmount() {
    clearInterval(this.valueChangeInterval);
  }

  onScrubberValueChanged = value => {
    console.log('value', value)
    this.setState({ startPosition: value * 1000 })
  }

  onTrimmerValueChanged = (val) => {
    this.setState({ startPosition: val })
  }

  changeTrimmerLength = () => {
    this.setState({ trimmerLengthOptionIndex: (this.state.trimmerLengthOptionIndex + 1) % TRIMMER_LENGTHS.length })
  }


  render() {
    const {
      totalDuration,
      trimmerLengthOptionIndex,
      playing,
      startPosition,
    } = this.state;

    return (
      <View style={styles.exampleRoot}>
        <Scrubber 
          value={startPosition / 1000}
          onSlidingComplete={this.onScrubberValueChanged}
          totalDuration={totalDuration / 1000}
          trackColor='#666'
          scrubbedColor='#40E1A9'
        />
        <View style={styles.trimmerContainer}>
          <TrimmerLengthButton onPress={this.changeTrimmerLength} trimmerLengthOption={TRIMMER_LENGTHS[trimmerLengthOptionIndex]}/>
          <MinimalTrimmer
              width={screenWidth - 112}
              totalDuration={totalDuration}
              tintColor={"#40E1A9"}
              markerColor={"#EDEFF3"}
              trackBackgroundColor={"#FFF"}
              trackBorderColor={"#5a3d5c"}
              onStartValueChanged={this.onTrimmerValueChanged}
              trimmerLength={TRIMMER_LENGTHS[trimmerLengthOptionIndex].value}
          />
          <PlaybackButton onPress={this.togglePlayButton} playing={playing}/> 
        </View>
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
    borderColor: 'blue',
    borderWidth: 1,
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
  trimmerContainer: {
    // width: screenWidth,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  playbackButtonRoot: {
    marginRight: 16,
    marginLeft: 12,
  }
});