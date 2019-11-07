import React, { Component } from 'react'
import {
  View,
  Button,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native'
import Trimmer from 'react-native-trimmer'


const maxTrimDuration = 60000;
const minimumTrimDuration = 5000;
const totalDuration = 180000

const initialLeftHandlePosition = 0;
const initialRightHandlePosition = 36000;

const scrubInterval = 50;

export default class Example extends Component {
  state = {
    playing: false,
    trimmerLeftHandlePosition: initialLeftHandlePosition,
    trimmerRightHandlePosition: initialRightHandlePosition,
    scrubberPosition: 1000
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

  onHandleChange = ({ leftPosition, rightPosition }) => {
    this.setState({
      trimmerRightHandlePosition: rightPosition,
      trimmerLeftHandlePosition: leftPosition
    })
  }

  onScrubbingComplete = (newValue) => {
    this.setState({ playing: false, scrubberPosition: newValue })
  }

  trimmerProps = () => {
    const {
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      scrubberPosition,
      playling,
    } = this.state;

    return {
      onHandleChange: this.onHandleChange,
      totalDuration: totalDuration,
      trimmerLeftHandlePosition: trimmerLeftHandlePosition,
      trimmerRightHandlePosition: trimmerRightHandlePosition,
      minimumTrimDuration: minimumTrimDuration,
      maxTrimDuration: maxTrimDuration,
      maximumZoomLevel: 200,
      zoomMultiplier: 20,
      initialZoomValue: 2,
      scaleInOnInit: true,
      tintColor: "#f638dc",
      markerColor: "#5a3d5c",
      trackBackgroundColor: "#382039",
      trackBorderColor: "#5a3d5c",
      scrubberColor: "#b7e778",
      scrubberPosition: scrubberPosition,
      onScrubbingComplete: this.onScrubbingComplete,
      onLeftHandlePressIn: () => console.log('onLeftHandlePressIn'),
      onRightHandlePressIn: () => console.log('onRightHandlePressIn'),
      onScrubberPressIn: () => console.log('onScrubberPressIn'),
    }
  }

  render() {
    const {
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      scrubberPosition,
      playling,
    } = this.state;
    
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select( {ios: "position", android: "height"})}
        keyboardVerticalOffset={Platform.select( {ios: -100, android: 0})}
      >
        <ScrollView
          scrollEnabled={false}
          style={{height: '100%'}}
          keyboardDismissMode={Platform === 'ios' ? "interactive" : 'on-drag'}
        >
          <View>
            <View style={{ width: '100%', height: 250, backgroundColor: '#f638dc', padding: 20 }}/>
            {
              playling
                ? <Button title="Pause" color="#f638dc" onPress={this.pauseScrubber}/>
                : <Button title="Play" color="#f638dc" onPress={this.playScrubber}/>
            }
            <Text>left: {trimmerLeftHandlePosition}</Text>
            <Text>right: {trimmerRightHandlePosition}</Text>
            <Trimmer
              {...this.trimmerProps()}
            />
            <ScrollView style={{ width: '100%', height: '100%', backgroundColor: 'blue' }}>
              <View style={{ width: '100%', height: 100, backgroundColor: '#f638dc', padding: 20 }}/>
              <View style={{ width: '100%', borderWidth: 2, borderColor: '#f638dc', padding: 20 }}>
                <TextInput />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}