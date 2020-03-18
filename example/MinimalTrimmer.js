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

const { width: screenWidth, height: screenHeight} = Dimensions.get('window');


const MINIMUM_TRIM_DURATION = 1000;
const MAXIMUM_TRIM_DURATION = 60000;
const MAXIMUM_SCALE_VALUE = 50;
const ZOOM_MULTIPLIER = 5;
const INITIAL_ZOOM = 2;
const SCALE_ON_INIT_TYPE = 'trim-duration'
const SHOW_SCROLL_INDICATOR = true
const CENTER_ON_LAYOUT = true

const TRACK_PADDING_OFFSET = 10;
const HANDLE_WIDTHS = 30;

const MARKER_INCREMENT = 2000;
const SPECIAL_MARKER_INCREMEMNT = 2;


const TRIMMER_WIDTH = 200;


const TRACK_BACKGROUND_COLOR = '#FFF';
const TRACK_BORDER_COLOR = '#c8dad3';
const MARKER_COLOR = '#EDEFF3';
const TINT_COLOR = '#93b5b3';
const SCRUBBER_COLOR = '#63707e'

export default class Trimmer extends React.Component {
  constructor(props) {
    super(props);

    let trackScale = props.initialZoomValue || INITIAL_ZOOM
    if(props.scaleInOnInit) {
      const { 
        maxTrimDuration = MAXIMUM_TRIM_DURATION,
        scaleInOnInitType = SCALE_ON_INIT_TYPE,
        trimmerRightHandlePosition,
        trimmerLeftHandlePosition
      } = this.props;
      const isMaxDuration = scaleInOnInitType === 'max-duration';
      const trimDuration = isMaxDuration ? maxTrimDuration : (trimmerRightHandlePosition - trimmerLeftHandlePosition);
      const smartScaleDivider = isMaxDuration ? 3 : 5; // Based on testing, 3 works better when the goal is to have the entire trimmer fit in the visible area
      const percentTrimmed = trimDuration / props.totalDuration;
      const smartScaleValue = (2 / percentTrimmed) / smartScaleDivider;
      trackScale = this.clamp({ value: smartScaleValue, min: 1, max: props.maximumZoomLevel || MAXIMUM_SCALE_VALUE})
    }

    this.initiateAnimator();
    this.state = {
      trackScale,                                             // the scale factor for the track
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
  }

  calculatePinchDistance = (x1, y1, x2, y2) => {
    let dx = Math.abs(x1 - x2)
    let dy = Math.abs(y1 - y2)
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return distance
  }
  
  createTrackPanResponder = () => PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // this.lastScaleDy = 0;

        this.lastScaleDX = 0;

      },
      onPanResponderMove: (evt, gestureState) => {
        const stepValue = (gestureState.dx - this.lastScaleDX);
        this.lastScaleDX = gestureState.dx

        // console.log('gestureState.dx', gestureState.dx, 'stepValue', stepValue)
        console.log('gestureState', gestureState)
        // const stepValue = (gestureState.dy - this.lastScaleDy);
        // this.lastScaleDy = gestureState.dy

        // const scaleStep = (stepValue * zoomMultiplier) / screenHeight
        // const { trackScale } = this.state;

        // const newTrackScaleValue = trackScale + scaleStep;
        // const newBoundedTrackScaleValue = Math.max(Math.min(newTrackScaleValue, maximumZoomLevel), 1)

        // this.setState({trackScale: newBoundedTrackScaleValue})
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true
  })

  handleScrubbingValueChange = (newScrubPosition) => {
    const { onScrubbingComplete } = this.props;
    onScrubbingComplete && onScrubbingComplete(newScrubPosition | 0)
  }

  handleHandleSizeChange = () => {
    const { onHandleChange } = this.props;
    const { trimmingLeftHandleValue, trimmingRightHandleValue } = this.state;
    onHandleChange && onHandleChange({
      leftPosition: trimmingLeftHandleValue | 0,
      rightPosition: trimmingRightHandleValue | 0,
    });
  }

  handleLeftHandlePressIn = () => {
    const { onLeftHandlePressIn } = this.props;
    onLeftHandlePressIn && onLeftHandlePressIn()
  }

  handleRightHandlePressIn = () => {
    const { onRightHandlePressIn } = this.props;
    onRightHandlePressIn && onRightHandlePressIn()
  }

  handleScrubberPressIn = () => {
    const { onScrubberPressIn } = this.props;
    onScrubberPressIn && onScrubberPressIn()
  }

  onScroll = (event) => {
    console.log('event.nativeEvent.contentOffset.x ', event.nativeEvent.contentOffset.x)
  }

  render() {
    const {
      maxTrimDuration,
      minimumTrimDuration,
      totalDuration,
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      trackBackgroundColor = TRACK_BACKGROUND_COLOR,
      trackBorderColor = TRACK_BORDER_COLOR,
      markerColor = MARKER_COLOR,
      tintColor = TINT_COLOR,
      centerOnLayout = CENTER_ON_LAYOUT,
      showScrollIndicator = SHOW_SCROLL_INDICATOR,
    } = this.props;

    // if(maxTrimDuration < trimmerRightHandlePosition - trimmerLeftHandlePosition) {
    //   console.error('maxTrimDuration is less than trimRightHandlePosition minus trimmerLeftHandlePosition', {
    //     minimumTrimDuration, trimmerRightHandlePosition, trimmerLeftHandlePosition
    //   })
    //   return null
    // }

    if(minimumTrimDuration > trimmerRightHandlePosition - trimmerLeftHandlePosition) {
      console.error('minimumTrimDuration is less than trimRightHandlePosition minus trimmerLeftHandlePosition', {
        minimumTrimDuration, trimmerRightHandlePosition, trimmerLeftHandlePosition
      })
      return null
    }

    const {
      trackScale,
    } = this.state;

    const trackWidth = screenWidth * trackScale
    if(isNaN(trackWidth)) {
      console.log('ERROR render() trackWidth !== number. screenWidth', screenWidth, ', trackScale', trackScale, ', ', trackWidth)
    }
    const trackBackgroundStyles = [
      styles.trackBackground,
      { width: trackWidth, backgroundColor: trackBackgroundColor, borderColor: trackBorderColor
    }];
        
 
    // const onLayoutHandler = centerOnLayout
    //     ? {
    //         onLayout: () => {
    //         const centerOffset = actualTrimmerOffset + (actualTrimmerWidth / 2) - (screenWidth / 2);
    //         this.scrollView.scrollTo({x: centerOffset, y: 0, animated: false});
    //         }
    //     }
    //     : null

    const markers = new Array((totalDuration / MARKER_INCREMENT) | 0).fill(0) || [];
    console.log('Total markers', markers)
    return (
      <View style={styles.root}>
        <View style={styles.trimmerContainer} pointerEvents="none">
          <View style={[
            styles.trimmer,
            { width: TRIMMER_WIDTH },
            { borderColor: tintColor }
          ]} >
            <View style={[styles.selection, { backgroundColor: tintColor }]}/>
          </View>
        </View>
        
        <ScrollView 
          ref={scrollView => this.scrollView = scrollView}
          scrollEnabled={true}
          style={[
            styles.horizontalScrollView,
            { transform: [{ scaleX: 1.0 }] },
          ]} 
          horizontal
          onScroll={this.onScroll}
          scrollEventThrottle={1}
          bounces={false}
          showsHorizontalScrollIndicator={showScrollIndicator}
          // {...{...this.trackPanResponder.panHandlers, ...onLayoutHandler}}
          // {...this.trackPanResponder.panHandlers}
        >
          <View style={trackBackgroundStyles}>
            <View style={styles.markersContainer}>
              {
                markers.map((m,i) => (
                  <View 
                    key={`marker-${i}`} 
                    style={[
                      styles.marker,
                      i % SPECIAL_MARKER_INCREMEMNT ? {} : styles.specialMarker,
                      { backgroundColor: markerColor }
                    ]}/>
                ))
              }
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: 90,
    borderColor: 'red',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  horizontalScrollView: {
    height: 90,
    overflow: 'hidden',
    position: 'relative',
    borderColor: 'green',
    borderWidth: 1,
  },
  trackBackground: {
    overflow: 'hidden',
    marginVertical: 20,
    backgroundColor: TRACK_BACKGROUND_COLOR,
    height: 45,
    // marginHorizontal: HANDLE_WIDTHS + TRACK_PADDING_OFFSET,
  },
  trimmerContainer: {
    // flex: 1,
    width: '100%',
    borderColor: 'blue',
    borderWidth: 1,
    height: '100%',
    paddingVertical: 17,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  trimmer: {
    // marginVertical: 17,
    // position: 'absolute',
    // left: TRACK_PADDING_OFFSET,
    // top: 17,
    // bottom: 17,
    // left: 0,
    // right: 0,
    borderColor: TINT_COLOR,
    borderWidth: 3,
    borderRadius: 3,
    // height: 106,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_WIDTHS,
    height: 106,
    backgroundColor: TINT_COLOR,
    top: 17,
  },
  leftHandle: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightHandle: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  selection: {
    opacity: 0.2,
    backgroundColor: TINT_COLOR,
    width: '100%',
    height: '100%',
  },
  markersContainer: {
    paddingHorizontal: (screenWidth - TRIMMER_WIDTH) / 2,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marker: {
    backgroundColor: MARKER_COLOR, // marker color,
    width: 3,
    height: 6,
    borderRadius: 3,
  },
  specialMarker: {
    height: 12,
  },
  hiddenMarker: {
    opacity: 0
  },
  scrubberContainer: {
    zIndex: 1,
    position: 'absolute',
    width: 14,
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