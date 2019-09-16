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

const TRACK_WIDTH_COEFFICIENT = .1
const TRACK_PADDING_OFFSET = 10;
const HANDLE_WIDTHS = 30;
const MINIMUM_TRACK_DURATION = 5000;
const MAXIMUM_SCALE_VALUE = 5;
const TOTAL_TRACK_WIDTH = screenWidth * 3;

export default class Trimmer extends React.Component {
  constructor(props) {
    super(props);

    this.initiateAnimator();
    this.state = {
      trimming: false, // this value means the handles are being moved
      trackScale: 2,         // the scale factor for the track
      trimmingLeftHandleValue: 0,
    }
  }


  initiateAnimator = () => {
    
    this.scaleTrackValue = new Animated.Value(0);
    // this.trimmingLeftHandleValue = new Animated.Value(0);
    this.lastDy = 0;
    this.trackPanResponder = this.createTrackPanResponder()
    this.leftHandlePanResponder = this.createLeftHandlePanResponder()
    // this.rightHandlePanResponder = this.createRightHandlePanResponder()
  }


  createLeftHandlePanResponder = () => PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now
      console.log('Left Handle grant')
      // this.trimmingLeftHandleValue.setValue(this.props.trimmerLeftHandlePosition);

      this.setState({ trimming: true, trimmingLeftHandleValue: this.props.trimmerLeftHandlePosition })
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}


      // const stepValue = (gestureState.dy - this.lastDy);
      // this.lastDy = gestureState.dy

      const { trackScale } = this.state;
      const { trimmerLeftHandlePosition, totalDuration } = this.props;
      
      const trackWidth = screenWidth * trackScale
      const calculatedTrimmerLeftHandlePosition = (trimmerLeftHandlePosition / totalDuration) * trackWidth;

      const newTrimmerLeftHandlePosition = ((calculatedTrimmerLeftHandlePosition + gestureState.dx) / trackWidth ) * totalDuration
      
      const newBoundedTrimmerLeftHandlePosition = Math.max(newTrimmerLeftHandlePosition, 0)

      // console.log(gestureState.dx, 'newTrimmerLeftHandlePosition', trimmerLeftHandlePosition, newBoundedTrimmerLeftHandlePosition, minimumValue)

      
      this.setState({ trimmingLeftHandleValue: newBoundedTrimmerLeftHandlePosition })

      // this.trimmingLeftHandleValue.setValue(newBoundedTrimmerLeftHandlePosition)



      // this.handleLeftHandleSizeChange(gestureState.dx)
      // let touches = evt.nativeEvent.touches;
      // if (touches.length == 2) {
      //     let touch1 = touches[0];
      //     let touch2 = touches[1];

      //     console.log('onPanResponderMove 2 TOUCHES touch1: ', touch1, ' , touch2: ', touch2)
      // } else if (touches.length == 1 && !this.state.isZooming) {
      //     this.processTouch(touches[0].pageX, touches[0].pageY);
      // }
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded

      this.handleLeftHandleSizeChange(this.state.trimmingLeftHandleValue)

      this.setState({ trimming: false })
      // this.trimmingLeftHandleValue = 0;

    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    },
})
  
  createTrackPanResponder = () => PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => !this.state.trimming,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => !this.state.trimming,
      onMoveShouldSetPanResponder: (evt, gestureState) => !this.state.trimming,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => !this.state.trimming,

      onPanResponderGrant: (evt, gestureState) => {
        this.lastScaleDy = 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        const stepValue = (gestureState.dy - this.lastScaleDy);
        this.lastScaleDy = gestureState.dy

        const scaleStep = (stepValue * 2) / screenHeight
        const { trackScale } = this.state;

        const newTrackScaleValue = trackScale + scaleStep;
        const newBoundedTrackScaleValue = Math.max(Math.min(newTrackScaleValue, MAXIMUM_SCALE_VALUE), 1)

        this.setState({trackScale: newBoundedTrackScaleValue})

        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}


        // const stepValue = (gestureState.dy - this.lastDy);
        // this.lastDy = gestureState.dy
        // console.log('onPanResponderMove gestureState', stepValue, gestureState.dy)
  
        // let touches = evt.nativeEvent.touches;
        // if (touches.length == 2) {
        //     let touch1 = touches[0];
        //     let touch2 = touches[1];

        //     console.log('onPanResponderMove 2 TOUCHES touch1: ', touch1, ' , touch2: ', touch2)
        // } else if (touches.length == 1 && !this.state.isZooming) {
        //     this.processTouch(touches[0].pageX, touches[0].pageY);
        // }



      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        console.log('createTrackPanResponder onPanResponderRelease')

        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
  })

  // handleResetZoomScale = (event) => {
  //   this.scrollResponderRef.scrollResponderZoomTo({ 
  //      x: 0, 
  //      y: 0, 
  //      width: screenWidth, 
  //      height: 140, 
  //      animated: true 
  //   })
  // }
  // setZoomRef = node => { //the ScrollView has a scrollResponder which allows us to access more methods to control the ScrollView component
  //   if (node) {
  //     this.zoomRef = node
  //     this.scrollResponderRef = this.zoomRef.getScrollResponder()
  //   }
  // }

  handleLeftHandleSizeChange = (newPosition) => {
    const { onLeftHandleChange } = this.props;
    // console.log('new position', newPosition)
    onLeftHandleChange(newPosition)
  }

  render() {
    const {
      maxTrimDuration,
      trimDuration,
      totalDuration,
      trimOffset,
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition
    } = this.props;

    const { trimming, trackScale, trimmingLeftHandleValue } = this.state;

    const trackWidth = screenWidth * trackScale
    
    const trackBackgroundStyles = [styles.trackBackground, { width: trackWidth }];
    

    const minimumTrackOffset = (TRACK_PADDING_OFFSET / trackWidth) * totalDuration

    const leftPosition = trimming ? trimmingLeftHandleValue : trimmerLeftHandlePosition
    const boundedLeftPosition = Math.max(leftPosition, minimumTrackOffset)


    const totalTrimTime = Math.max(trimmerRightHandlePosition - boundedLeftPosition, 0)

    const actualTrimmerWidth = (totalTrimTime / totalDuration) * trackWidth;
    const actualTrimmerOffset = (boundedLeftPosition / totalDuration) * trackWidth;
 
    // console.log('actualTrimmerWidth ', actualTrimmerWidth, 'actualTrimmerOffset ', actualTrimmerOffset, 'boundedLeftPosition ', boundedLeftPosition, )
    // console.log(trimming, ' actualTrimmerOffset: ', typeof actualTrimmerOffset, ' actualTrimmerWidth: ', typeof actualTrimmerWidth);

    const scaleValue = this.scaleTrackValue.interpolate({
      inputRange: [0, 1],
      outputRange: [2.0, 1.0],
    })
    const scaleStyle = { scaleX: scaleValue };

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
          <View style={trackBackgroundStyles}></View>
          <Animated.View style={[
            styles.trimmer,
            { width: actualTrimmerWidth, left: actualTrimmerOffset }
          ]}>
            <View style={[styles.handle, styles.leftHandle]} {...this.leftHandlePanResponder.panHandlers}></View>
            <View style={[styles.handle, styles.rightHandle]}></View>

          </Animated.View>
        </ScrollView>
      </View>
    );

    // return (
    //   <View style={styles.root}>
    //     <ScrollView
    //       contentContainerStyle={{ alignItems: 'center’', justifyContent: 'center' }}
    //       centerContent //centers content when zoom is less than scroll view bounds 
    //       maximumZoomScale={2}
    //       minimumZoomScale={1}
    //       showsHorizontalScrollIndicator={true}
    //       showsVerticalScrollIndicator={false}
    //       ref={this.setZoomRef} //helps us get a reference to this ScrollView instance
    //       style={styles.horizontalScrollView}
    //     >
    //       <TouchableHighlight
    //         onPress={this.handleResetZoomScale}
    //       >
    //           <View style={trackBackgroundStyles}>

    //           </View>
    //       </TouchableHighlight>
    //     </ScrollView>
    //   </View>
    //  )
  }
}

const styles = StyleSheet.create({
  root: {

    height: 200,
    backgroundColor: 'pink'
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  horizontalScrollView: {
    backgroundColor: 'red',
    paddingVertical: 20,
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  trackBackground: {
    backgroundColor: 'blue',
    borderRadius: 5,
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
    height: '100%',
    backgroundColor: '#40E1A9',
  },
  leftHandle: {
    left: 0,
  },
  rightHandle: {
    right: 0,
  }
});
