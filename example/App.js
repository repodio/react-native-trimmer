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
  //           <MinimalTrimmer {...this.trimmerRefProps2()}/>
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
      trimmerLengthOptionIndex: 5,
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

  onSliderValueChanged = value => {
    this.setState({ scrubbing: true })

    if( this.trimmerRef && this.trimmerRef.scrollViewRef)  {
      const { totalDuration, trimmerLengthOptionIndex } = this.state;

      const newStartingPosition = value * (totalDuration - TRIMMER_LENGTHS[trimmerLengthOptionIndex].value)
      const newScrollPosition = (newStartingPosition / totalDuration) * this.trimmerRef.state.contentWidth
      console.log('newScrollPosition', newStartingPosition)

      this.trimmerRef.scrollViewRef.scrollTo({x: newScrollPosition, y: 0, animated: false})
      this.setState({ startPositionLabel: newStartingPosition })

    }
  }

  onTrimmerValueChanged = value => {
    console.log('onTrimmerValueChanged', value)

    this.setState({ startPosition: value })
  }

  changeTrimmerLength = () => {
    this.setState({ trimmerLengthOptionIndex: (this.state.trimmerLengthOptionIndex + 1) % TRIMMER_LENGTHS.length })
  }

  onSlidingComplete = value => {
    this.setState({ scrubbing: false })
    
    if( this.trimmerRef && this.trimmerRef.scrollViewRef)  {
      const { totalDuration, trimmerLengthOptionIndex } = this.state;

      const newStartingPosition = value * (totalDuration - TRIMMER_LENGTHS[trimmerLengthOptionIndex].value)
      console.log('onSlidingComplete newScrollPosition', newStartingPosition)

      // this.trimmerRef.scrollViewRef.scrollTo({x: newScrollPosition, y: 0, animated: false})
      this.setState({ startPosition: newStartingPosition })

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
        {/* <Scrubber 
          value={startPosition / 1000}
          onSlidingComplete={this.onSliderValueChanged}
          totalDuration={totalDuration / 1000}
          trackColor='#666'
          scrubbedColor='#40E1A9'
        /> */}
        
        <View style={styles.sliderContainer}>
          <View style={{ flex: 0 }}>
            <TrimmerLengthButton onPress={this.changeTrimmerLength} trimmerLengthOption={TRIMMER_LENGTHS[trimmerLengthOptionIndex]}/>
          </View>
          <View style={{ flex: 1 }}>
            <Slider
              // style={styles.containerSlide}
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
          // value={startPosition}
          width={screenWidth - 24}
          totalDuration={totalDuration}
          tintColor={"#40E1A9"}
          markerColor={"#EDEFF3"}
          trackBackgroundColor={"#FFF"}
          trackBorderColor={"#5a3d5c"}
          onStartValueChanged={this.onTrimmerValueChanged}
          trimmerLength={TRIMMER_LENGTHS[trimmerLengthOptionIndex].value}
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