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


const MINIMUM_TRIM_DURATION = 1000;
const MAXIMUM_TRIM_DURATION = 60000;
const MAXIMUM_SCALE_VALUE = 5;

const TRACK_PADDING_OFFSET = 10;
const HANDLE_WIDTHS = 30;

const MARKER_INCREMENT = 5000;
const SPECIAL_MARKER_INCREMEMNT = 5;

const TRACK_BACKGROUND_COLOR = '#F7F9FC';
const TRACK_BORDER_COLOR = '#EDF1F7';
const MARKER_COLOR = '#EDF1F7';
const TINT_COLOR = '#40E1A9';
const SCRUBBER_COLOR = '#EDF1F7'

export default class Trimmer extends React.Component {
  constructor(props) {
    super(props);

    this.initiateAnimator();
    this.state = {
      scrubbing: false,               // this value means scrubbing is currently happening
      trimming: false,                // this value means the handles are being moved
      trackScale: 2,                  // the scale factor for the track
      trimmingLeftHandleValue: 0,
      trimmingRightHandleValue: 0,
      internalScrubbingPosition: 0,
    }
  }
  
  clamp = ({ value, min, max }) => Math.min(Math.max(value, min), max);

  initiateAnimator = () => {
    
    this.scaleTrackValue = new Animated.Value(0);
    this.lastDy = 0;
    this.trackPanResponder = this.createTrackPanResponder()
    this.leftHandlePanResponder = this.createLeftHandlePanResponder()
    this.rightHandlePanResponder = this.createRightHandlePanResponder()
    this.scrubHandlePanResponder = this.createScrubHandlePanResponder()
  }


  createScrubHandlePanResponder = () => PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      this.setState({
        scrubbing: true,
        internalScrubbingPosition: this.props.scrubberPosition,
      })
    },
    onPanResponderMove: (evt, gestureState) => {
      const { trackScale } = this.state;
      const {
        scrubberPosition,
        trimmerLeftHandlePosition,
        trimmerRightHandlePosition,
        totalDuration,
      } = this.props;
      
      const trackWidth = (screenWidth) * trackScale
      const calculatedScrubberPosition = (scrubberPosition / totalDuration) * trackWidth;
      
      const newScrubberPosition = ((calculatedScrubberPosition + gestureState.dx) / trackWidth ) * totalDuration
      
      const lowerBound = Math.max(0, trimmerLeftHandlePosition)
      const upperBound = trimmerRightHandlePosition

      const newBoundedScrubberPosition = this.clamp({
        value: newScrubberPosition,
        min: lowerBound,
        max: upperBound
      })
      
      this.setState({ internalScrubbingPosition: newBoundedScrubberPosition })
    },
    onPanResponderRelease: (evt, gestureState) => {
      this.handleScrubbingValueChange(this.state.internalScrubbingPosition)
      this.setState({ scrubbing: false })
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onShouldBlockNativeResponder: (evt, gestureState) => true
  })

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
      const { 
        trimmerRightHandlePosition,
        trimmerLeftHandlePosition,
        totalDuration,
        minimumTrimDuration = MINIMUM_TRIM_DURATION,
        maxTrimDuration = MAXIMUM_TRIM_DURATION,
      } = this.props;
      
      const trackWidth = screenWidth * trackScale
      const calculatedTrimmerRightHandlePosition = (trimmerRightHandlePosition / totalDuration) * trackWidth;

      const newTrimmerRightHandlePosition = ((calculatedTrimmerRightHandlePosition + gestureState.dx) / trackWidth ) * totalDuration
    
      const lowerBound = trimmerLeftHandlePosition + minimumTrimDuration
      const upperBound = Math.min(totalDuration, trimmerLeftHandlePosition + maxTrimDuration)

      const newBoundedTrimmerRightHandlePosition = this.clamp({
        value: newTrimmerRightHandlePosition,
        min: lowerBound,
        max: upperBound
      })

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
      const {
        trimmerLeftHandlePosition,
        trimmerRightHandlePosition,
        totalDuration,
        minimumTrimDuration = MINIMUM_TRIM_DURATION,
        maxTrimDuration = MAXIMUM_TRIM_DURATION,
      } = this.props;
      
      const trackWidth = (screenWidth) * trackScale
      const calculatedTrimmerLeftHandlePosition = (trimmerLeftHandlePosition / totalDuration) * trackWidth;
      
      const newTrimmerLeftHandlePosition = ((calculatedTrimmerLeftHandlePosition + gestureState.dx) / trackWidth ) * totalDuration
      
      const lowerBound = Math.max(0, trimmerRightHandlePosition - maxTrimDuration)
      const upperBound = trimmerRightHandlePosition - minimumTrimDuration

      const newBoundedTrimmerLeftHandlePosition = this.clamp({
        value: newTrimmerLeftHandlePosition,
        min: lowerBound,
        max: upperBound
      })
      
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
      onStartShouldSetPanResponder: (evt, gestureState) => !this.state.scrubbing && !this.state.trimming,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => !this.state.scrubbing && !this.state.trimming,
      onMoveShouldSetPanResponder: (evt, gestureState) => !this.state.scrubbing && !this.state.trimming,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => !this.state.scrubbing && !this.state.trimming,
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
        const { maxScaleValue = MAXIMUM_SCALE_VALUE } = this.props;

        if (touches.length == 2) {
          const pinchDistance = this.calculatePinchDistance(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);

          if(this.lastScalePinchDist === undefined) {
            this.lastScalePinchDist = pinchDistance
          }

          const stepValue = pinchDistance - this.lastScalePinchDist;
          this.lastScalePinchDist = pinchDistance
  
          const scaleStep = (stepValue * 2) / screenHeight
          const { trackScale } = this.state;
  
          const newTrackScaleValue = trackScale + scaleStep;
          const newBoundedTrackScaleValue = Math.max(Math.min(newTrackScaleValue, maxScaleValue), 1)
  
          this.setState({trackScale: newBoundedTrackScaleValue})
        } else {
          const stepValue = (gestureState.dy - this.lastScaleDy);
          this.lastScaleDy = gestureState.dy
  
          const scaleStep = (stepValue * 2) / screenHeight
          const { trackScale } = this.state;
  
          const newTrackScaleValue = trackScale + scaleStep;
          const newBoundedTrackScaleValue = Math.max(Math.min(newTrackScaleValue, maxScaleValue), 1)
  
          this.setState({trackScale: newBoundedTrackScaleValue})
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true
  })

  handleScrubbingValueChange = (newScrubPosition) => {
    const { onScrubbingComplete } = this.props;
    onScrubbingComplete && onScrubbingComplete(newScrubPosition | 0)
  }

  handleLeftHandleSizeChange = (newPosition) => {
    const { onLeftHandleChange } = this.props;
    onLeftHandleChange && onLeftHandleChange(newPosition | 0)
    this.handleScrubbingValueChange(newPosition)
  }

  handleRightHandleSizeChange = (newPosition) => {
    const { onRightHandleChange } = this.props;
    onRightHandleChange && onRightHandleChange(newPosition | 0)
  }

  render() {
    const {
      maxTrimDuration,
      minimumTrimDuration,
      totalDuration,
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      scrubberPosition,
      trackBackgroundColor = TRACK_BACKGROUND_COLOR,
      trackBorderColor = TRACK_BORDER_COLOR,
      markerColor = MARKER_COLOR,
      tintColor = TINT_COLOR,
      scrubberColor = SCRUBBER_COLOR,
    } = this.props;

    if(maxTrimDuration < trimmerRightHandlePosition - trimmerLeftHandlePosition) {
      console.error('maxTrimDuration is less than trimRightHandlePosition minus trimmerLeftHandlePosition', {
        minimumTrimDuration, trimmerRightHandlePosition, trimmerLeftHandlePosition
      })
      return null
    }

    if(minimumTrimDuration > trimmerRightHandlePosition - trimmerLeftHandlePosition) {
      console.error('minimumTrimDuration is less than trimRightHandlePosition minus trimmerLeftHandlePosition', {
        minimumTrimDuration, trimmerRightHandlePosition, trimmerLeftHandlePosition
      })
      return null
    }

    const { trimming, scrubbing, internalScrubbingPosition, trackScale, trimmingLeftHandleValue, trimmingRightHandleValue } = this.state;

    const trackWidth = screenWidth * trackScale
    if(isNaN(trackWidth)) {
      console.log('ERROR render() trackWidth !== number. screenWidth', screenWidth, ', trackScale', trackScale, ', ', trackWidth)
    }
    const trackBackgroundStyles = [
      styles.trackBackground,
      { width: trackWidth, backgroundColor: trackBackgroundColor, borderColor: trackBorderColor
    }];
        
    const leftPosition = trimming ? trimmingLeftHandleValue : trimmerLeftHandlePosition
    const rightPosition = trimming ? trimmingRightHandleValue : trimmerRightHandlePosition
    const scrubPosition = scrubbing ? internalScrubbingPosition : scrubberPosition

    const boundedLeftPosition = Math.max(leftPosition, 0)
    const boundedScrubPosition = this.clamp({ value: scrubPosition, min: boundedLeftPosition, max: rightPosition })
    const boundedTrimTime = Math.max(rightPosition - boundedLeftPosition, 0)

    const actualTrimmerWidth = (boundedTrimTime / totalDuration) * trackWidth;
    const actualTrimmerOffset = ((boundedLeftPosition / totalDuration) * trackWidth) + TRACK_PADDING_OFFSET + HANDLE_WIDTHS;
    const actualScrubPosition = ((boundedScrubPosition / totalDuration) * trackWidth) + TRACK_PADDING_OFFSET + HANDLE_WIDTHS;
 
    if(isNaN(actualTrimmerWidth)) {
      console.log('ERROR render() actualTrimmerWidth !== number. boundedTrimTime', boundedTrimTime, ', totalDuration', totalDuration, ', trackWidth', trackWidth)
    }

    const markers = new Array((totalDuration / MARKER_INCREMENT) | 0).fill(0) || [];

    return (
      <View style={styles.root}>
        <ScrollView 
          scrollEnabled={!trimming && !scrubbing}
          style={[
            styles.horizontalScrollView,
            { transform: [{ scaleX: 1.0 }] },
          ]} 
          horizontal
          {...this.trackPanResponder.panHandlers}
        >
          {
            typeof scrubberPosition === 'number'
              ? (
                <View style={[
                  styles.scrubberContainer,
                  { left: actualScrubPosition },
                ]} >
                  <View
                    hitSlop={{top: 20, bottom: 5, right: 20, left: 20}}
                    {...this.scrubHandlePanResponder.panHandlers}
                    style={[styles.scrubberHead, { backgroundColor: scrubberColor }]}
                  />
                  <View style={[styles.scrubberTail, { backgroundColor: scrubberColor }]} />
                </View>
              )
              : null
          }
          <View style={trackBackgroundStyles}>
            <View style={styles.markersContainer}>
              {
                markers.map((m,i) => (
                  <View 
                    key={`marker-${i}`} 
                    style={[
                      styles.marker,
                      i % SPECIAL_MARKER_INCREMEMNT ? {} : styles.specialMarker,
                      i === 0 || i === markers.length - 1 ? styles.hiddenMarker : {},
                      { backgroundColor: markerColor }
                    ]}/>
                ))
              }
            </View>
          </View>
          <View {...this.leftHandlePanResponder.panHandlers} style={[
            styles.handle, 
            styles.leftHandle,
            { backgroundColor: tintColor, left: actualTrimmerOffset - HANDLE_WIDTHS }
          ]}>
            <Arrow.Left />
          </View>
          <View style={[
            styles.trimmer,
            { width: actualTrimmerWidth, left: actualTrimmerOffset },
            { borderColor: tintColor }
          ]}>
            <View style={[styles.selection, { backgroundColor: tintColor }]}/>
          </View>
          <View {...this.rightHandlePanResponder.panHandlers} style={[
            styles.handle,
            styles.rightHandle,
            { backgroundColor: tintColor, left: actualTrimmerOffset + actualTrimmerWidth }
          ]} >
            <Arrow.Right />
          </View>
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
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  trackBackground: {
    marginVertical: 20,
    backgroundColor: TRACK_BACKGROUND_COLOR,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: TRACK_BORDER_COLOR,
    height: 100,
    marginHorizontal: HANDLE_WIDTHS + TRACK_PADDING_OFFSET,
  },
  trimmer: {
    position: 'absolute',
    left: TRACK_PADDING_OFFSET,
    top: 17,
    borderColor: TINT_COLOR,
    borderWidth: 3,
    height: 106,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_WIDTHS,
    height: 106,
    backgroundColor: TINT_COLOR,
    top: 17,
  },
  leftHandle: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightHandle: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  selection: {
    opacity: 0.2,
    backgroundColor: TINT_COLOR,
    width: '100%',
    height: '100%',
  },
  markersContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marker: {
    backgroundColor: MARKER_COLOR, // marker color,
    width: 2,
    height: 8,
    borderRadius: 2,
  },
  specialMarker: {
    height: 22,
  },
  hiddenMarker: {
    opacity: 0
  },
  scrubberContainer: {
    zIndex: 1,
    position: 'absolute',
    width: 3,
    height: "100%",
    // justifyContent: 'center',
    alignItems: 'center',
  },
  scrubberHead: {
    position: 'absolute',
    backgroundColor: SCRUBBER_COLOR,
    width: 14,
    height: 14,
    borderRadius: 14,
  },
  scrubberTail: {
    backgroundColor: SCRUBBER_COLOR,
    height: 123,
    width: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});
