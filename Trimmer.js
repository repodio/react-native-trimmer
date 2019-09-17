import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions,
  PanResponder,
  Animated,
  TouchableHighlight,
} from 'react-native';

import * as Arrow from './Arrow';

const { width: screenWidth, height: screenHeight} = Dimensions.get('window');

const TRACK_WIDTH_COEFFICIENT = .1
const TRACK_PADDING_OFFSET = 10;
const HANDLE_WIDTHS = 30;
const MINIMUM_TRACK_DURATION = 5000;
const MAXIMUM_SCALE_VALUE = 5;
const MARKER_INCREMENT = 5000;
const SPECIAL_MARKER_INCREMEMNT = 5;
const TOTAL_TRACK_WIDTH = screenWidth * 3;

export default class Trimmer extends React.Component {
  constructor(props) {
    super(props);

    this.initiateAnimator();
    this.state = {
      trimming: false, // this value means the handles are being moved
      trackScale: 2,         // the scale factor for the track
      trimmingLeftHandleValue: 0,
      trimmingRightHandleValue: 0,
    }
  }

  initiateAnimator = () => {
    
    this.scaleTrackValue = new Animated.Value(0);
    this.lastDy = 0;
    this.trackPanResponder = this.createTrackPanResponder()
    this.leftHandlePanResponder = this.createLeftHandlePanResponder()
    this.rightHandlePanResponder = this.createRightHandlePanResponder()
  }

  createRightHandlePanResponder = () => PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      this.setState({
        trimming: true,
        trimmingRightHandleValue: this.props.trimmerRightHandlePosition,
        trimmingLeftHandleValue: this.props.trimmerLeftHandlePosition,
      })
    },
    onPanResponderMove: (evt, gestureState) => {
      const { trackScale } = this.state;
      const { trimmerRightHandlePosition, totalDuration } = this.props;
      
      const trackWidth = screenWidth * trackScale
      const calculatedTrimmerRightHandlePosition = (trimmerRightHandlePosition / totalDuration) * trackWidth;

      const newTrimmerRightHandlePosition = ((calculatedTrimmerRightHandlePosition + gestureState.dx) / trackWidth ) * totalDuration
      
      const newBoundedTrimmerRightHandlePosition = Math.min(newTrimmerRightHandlePosition, totalDuration)
      
      
      console.log('newBoundedTrimmerRightHandlePosition', newBoundedTrimmerRightHandlePosition)

      this.setState({ trimmingRightHandleValue: newBoundedTrimmerRightHandlePosition })
    },
    onPanResponderRelease: (evt, gestureState) => {
      this.handleRightHandleSizeChange(this.state.trimmingRightHandleValue)
      this.setState({ trimming: false })
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onShouldBlockNativeResponder: (evt, gestureState) => true
  })

  createLeftHandlePanResponder = () => PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      this.setState({
        trimming: true,
        trimmingRightHandleValue: this.props.trimmerRightHandlePosition,
        trimmingLeftHandleValue: this.props.trimmerLeftHandlePosition,
      })
    },
    onPanResponderMove: (evt, gestureState) => {
      const { trackScale } = this.state;
      const { trimmerLeftHandlePosition, totalDuration } = this.props;
      
      const trackWidth = (screenWidth) * trackScale
      const calculatedTrimmerLeftHandlePosition = (trimmerLeftHandlePosition / totalDuration) * trackWidth;




      const trackOffset = TRACK_PADDING_OFFSET * trackScale
      console.log('trackOffset', trackOffset, (trackOffset / trackWidth) * totalDuration)

      
      const newTrimmerLeftHandlePosition = ((calculatedTrimmerLeftHandlePosition + gestureState.dx) / trackWidth ) * totalDuration
      
      const newBoundedTrimmerLeftHandlePosition = Math.max(newTrimmerLeftHandlePosition, 0)

      console.log('newBoundedTrimmerLeftHandlePosition', newBoundedTrimmerLeftHandlePosition, ', newTrimmerLeftHandlePosition', newTrimmerLeftHandlePosition)

      this.setState({ trimmingLeftHandleValue: newBoundedTrimmerLeftHandlePosition })
    },
    onPanResponderRelease: (evt, gestureState) => {
      this.handleLeftHandleSizeChange(this.state.trimmingLeftHandleValue)
      this.setState({ trimming: false })
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onShouldBlockNativeResponder: (evt, gestureState) => true
  })

  calculatePinchDistance = (x1, y1, x2, y2) => {
    let dx = Math.abs(x1 - x2)
    let dy = Math.abs(y1 - y2)
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return distance
  }
  
  createTrackPanResponder = () => PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => !this.state.trimming,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => !this.state.trimming,
      onMoveShouldSetPanResponder: (evt, gestureState) => !this.state.trimming,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => !this.state.trimming,
      onPanResponderGrant: (evt, gestureState) => {
        this.lastScaleDy = 0;
        const touches = evt.nativeEvent.touches || {};
        if (touches.length == 2) {
          const pinchDistance = this.calculatePinchDistance(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);

          this.lastScalePinchDist = pinchDistance;
        } 
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length == 2) {
          const pinchDistance = this.calculatePinchDistance(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
          
          const stepValue = pinchDistance - this.lastScalePinchDist;
          this.lastScalePinchDist = pinchDistance
  
          const scaleStep = (stepValue * 2) / screenHeight
          const { trackScale } = this.state;
  
          const newTrackScaleValue = trackScale + scaleStep;
          const newBoundedTrackScaleValue = Math.max(Math.min(newTrackScaleValue, MAXIMUM_SCALE_VALUE), 1)
  
          this.setState({trackScale: newBoundedTrackScaleValue})
        } else {
          const stepValue = (gestureState.dy - this.lastScaleDy);
          this.lastScaleDy = gestureState.dy
  
          const scaleStep = (stepValue * 2) / screenHeight
          const { trackScale } = this.state;
  
          const newTrackScaleValue = trackScale + scaleStep;
          const newBoundedTrackScaleValue = Math.max(Math.min(newTrackScaleValue, MAXIMUM_SCALE_VALUE), 1)
  
          this.setState({trackScale: newBoundedTrackScaleValue})
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true
  })

  handleLeftHandleSizeChange = (newPosition) => {
    const { onLeftHandleChange } = this.props;
    onLeftHandleChange(newPosition | 0)
  }

  handleRightHandleSizeChange = (newPosition) => {
    const { onRightHandleChange } = this.props;
    onRightHandleChange(newPosition | 0)
  }

  render() {
    const {
      maxTrimDuration,
      totalDuration,
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition
    } = this.props;

    const { trimming, trackScale, trimmingLeftHandleValue, trimmingRightHandleValue } = this.state;

    const trackWidth = screenWidth * trackScale
    if(typeof trackWidth !== 'number') {
      console.log('ERROR render() trackWidth !== number. screenWidth', screenWidth, ', trackScale', trackScale, ', ', trackWidth)
    }
    const trackBackgroundStyles = [styles.trackBackground, { width: trackWidth }];
    

    // const minimumTrackOffset = (TRACK_PADDING_OFFSET / trackWidth) * totalDuration
    
    const leftPosition = trimming ? trimmingLeftHandleValue : trimmerLeftHandlePosition
    const rightPosition = trimming ? trimmingRightHandleValue : trimmerRightHandlePosition

    const boundedLeftPosition = Math.max(leftPosition, 0)
    const boundedTrimTime = Math.max(rightPosition - boundedLeftPosition, 0)

    const actualTrimmerWidth = (boundedTrimTime / totalDuration) * trackWidth;
    const actualTrimmerOffset = ((boundedLeftPosition / totalDuration) * trackWidth) + TRACK_PADDING_OFFSET + HANDLE_WIDTHS;
 
    // console.log('actualTrimmerWidth ', actualTrimmerWidth, 'actualTrimmerOffset ', actualTrimmerOffset, 'boundedLeftPosition ', boundedLeftPosition, )
    // console.log(trimming, ' actualTrimmerWidth: ', actualTrimmerWidth, ' actualTrimmerOffset: ', actualTrimmerOffset);

    if(typeof actualTrimmerWidth !== 'number') {
      console.log('ERROR render() actualTrimmerWidth !== number. boundedTrimTime', boundedTrimTime, ', totalDuration', totalDuration, ', trackWidth', trackWidth)
    }

    const markers = new Array((totalDuration / MARKER_INCREMENT) | 0).fill(0) || [];
    console.log('markers', markers.length, totalDuration / MARKER_INCREMENT, (totalDuration / MARKER_INCREMENT) | 0, totalDuration, MARKER_INCREMENT)
    return (
      <View style={styles.root}>
        <ScrollView 
          scrollEnabled={!trimming}
          style={[
            styles.horizontalScrollView,
            { transform: [{ scaleX: 1.0 }] },
          ]} 
          horizontal
          {...this.trackPanResponder.panHandlers}
        >
          <View style={trackBackgroundStyles}>
            <View style={styles.markersContainer}>
              {
                markers.map((m,i) => <View key={`marker-${i}`} style={[styles.marker, i % SPECIAL_MARKER_INCREMEMNT ? {} : styles.specialMarker]}/>)
              }
            </View>
          </View>
          <Animated.View style={[
            styles.trimmer,
            { width: actualTrimmerWidth, left: actualTrimmerOffset }
          ]}>
            <View style={[styles.handle, styles.leftHandle]} {...this.leftHandlePanResponder.panHandlers}>
              <Arrow.Left />
            </View>
            <View style={[styles.handle, styles.rightHandle]} {...this.rightHandlePanResponder.panHandlers}>
              <Arrow.Right />
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: 140,
  },
  horizontalScrollView: {
    borderColor: 'red',
    borderWidth: 1,
    paddingVertical: 20,
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  trackBackground: {
    backgroundColor: '#F7F9FC',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EDF1F7',
    height: 100,
    marginHorizontal: HANDLE_WIDTHS + TRACK_PADDING_OFFSET,
  },
  trimmer: {
    position: 'absolute',
    left: TRACK_PADDING_OFFSET,
    top: -3,
    borderColor: '#40E1A9',
    borderWidth: 3,
    borderRadius: 5,
    height: 106,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_WIDTHS,
    height: 106,
    backgroundColor: '#40E1A9',
    top: -3,
  },
  leftHandle: {
    left: -30,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightHandle: {
    right: -30,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  markersContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  marker: {
    backgroundColor: '#EDF1F7', // marker color,
    width: 2,
    height: 8,
    // borderColor: 'red',
    borderRadius: 2,
  },
  specialMarker: {
    height: 22,
  }
});
