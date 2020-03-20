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

const { width: screenWidth } = Dimensions.get('window');

const SHOW_SCROLL_INDICATOR = true
const CENTER_ON_LAYOUT = true

const TRACK_PADDING_OFFSET = 10;
const HANDLE_WIDTHS = 30;

const MARKER_INCREMENT = 1000;
const SPECIAL_MARKER_INCREMEMNT = 2;


// const MARKER_MARGIN = 1.792; // 60 seconds
// const MARKER_MARGIN = 8.042; // 30 seconds
const MARKER_MARGIN = 70.542; // 5 seconds


const TRIMMER_WIDTH = 150;
const TRIMMER_LENGTH = 5000;
const MARKER_LENGTH = 3;

const TRACK_BACKGROUND_COLOR = '#FFF';
const TRACK_BORDER_COLOR = '#c8dad3';
const MARKER_COLOR = '#EDEFF3';
const TINT_COLOR = '#93b5b3';
const SCRUBBER_COLOR = '#63707e'

export default class Trimmer extends React.Component {
  scrollX = new Animated.Value(0);
  

  state = {
    markerMargin: 0,
    contentWidth: 0,
  }

  componentDidMount() {
    this.determineMarginLength()
    this.scrollX = new Animated.Value(0);
  }

  componentDidUpdate(prevProps) {

    if(this.props.trimmerLength !== prevProps.trimmerLength) {
      this.determineMarginLength()
    }

    // const newPosition = (this.props.value / this.props.totalDuration) * this.state.contentWidth

    // // Typical usage (don't forget to compare props):
    // console.log('componentDidUpdate', this.props.value, this.state.contentWidth)
    // this.scrollViewRef.scrollTo({x: newPosition, y: 0, animated: false})
  }

  onScroll = ({ nativeEvent: { contentOffset, contentSize }}) => {
    const { scrubbing, totalDuration, onStartValueChanged } = this.props;
    if(scrubbing) {
      return;
    }

    const newStartingTime = (contentOffset.x / contentSize.width) * totalDuration
    onStartValueChanged && onStartValueChanged(newStartingTime)
  }

  determineMarginLength = () => {
    const {
      trimmerLength = TRIMMER_LENGTH,
      totalDuration,
      trimmerWidth = TRIMMER_WIDTH,
      markerIncrement = MARKER_INCREMENT,
      width,
    } = this.props;

    const markerCount = (totalDuration / markerIncrement) | 0;
    const trimmerLengthInSeconds = trimmerLength / 1000
    const contentWidth = ((markerCount / trimmerLengthInSeconds) * (markerIncrement / 1000)) * width

    const markerMargin = (((contentWidth) - (width - trimmerWidth)) / markerCount) - MARKER_LENGTH

    this.setState({
      markerMargin,
      contentWidth,
    })
    console.log('contentWidth: ', contentWidth)
    console.log('width: ', width)
    console.log('trimmerWidth: ', trimmerWidth)
    return markerMargin
  }

  // onLayout = ({ nativeEvent }) => {

  //   if (this.state.viewportWidth) return // layout was already called
  //   this.setState({viewportWidth: nativeEvent.layout.width})
  //   console.log('width', nativeEvent.layout.width);
  // }

  render() {
    const {
      totalDuration,
      trackBackgroundColor = TRACK_BACKGROUND_COLOR,
      trackBorderColor = TRACK_BORDER_COLOR,
      markerColor = MARKER_COLOR,
      tintColor = TINT_COLOR,
      centerOnLayout = CENTER_ON_LAYOUT,
      showScrollIndicator = SHOW_SCROLL_INDICATOR,
      trimmerLength,
      trimmerWidth = TRIMMER_WIDTH,
      width,
      markerIncrement = MARKER_INCREMENT
    } = this.props;

    const {
      markerMargin,
      contentWidth
    } = this.state;

    // if(maxTrimDuration < trimmerRightHandlePosition - trimmerLeftHandlePosition) {
    //   console.error('maxTrimDuration is less than trimRightHandlePosition minus trimmerLeftHandlePosition', {
    //     minimumTrimDuration, trimmerRightHandlePosition, trimmerLeftHandlePosition
    //   })
    //   return null
    // }

    const trackBackgroundStyles = [
      styles.trackBackground,
      // { width: trackWidth, backgroundColor: trackBackgroundColor, borderColor: trackBorderColor
        { width: '100%', backgroundColor: trackBackgroundColor, borderColor: trackBorderColor
      }];
        
    const markerCount = (totalDuration / markerIncrement) | 0;
    const markers = new Array(markerCount).fill(0) || [];

    // bgMarkerColor = this.scrollX.interpolate({
    //   inputRange: [0, 10000],
    //   outputRange: ['rgba(0,0,0,1)', 'rgba(255,0,0,1)']
    // })

    const adjustedScrollValue = (this.scrollX._value / (contentWidth - (width - trimmerWidth))) * contentWidth

    console.log('sX, sX+ tW, asX', this.scrollX._value, this.scrollX._value + trimmerWidth, adjustedScrollValue )

    return (
      <View style={[styles.root, { width }]} onLayout={this.onLayout}>
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
          ref={ref => this.scrollViewRef = ref}
          scrollEnabled={true}
          style={[
            styles.horizontalScrollView,
            { transform: [{ scaleX: 1.0 }] },
          ]} 
          horizontal
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.scrollX}}}],
            {listener: this.onScroll}, // Optional async listener
          )}
          scrollEventThrottle={1}
          bounces={false}
          showsHorizontalScrollIndicator={showScrollIndicator}
          // {...{...this.trackPanResponder.panHandlers, ...onLayoutHandler}}
          // {...this.trackPanResponder.panHandlers}
        >
          <View style={trackBackgroundStyles}>
            <View style={[styles.markersContainer, { paddingHorizontal: (width - trimmerWidth) / 2 }]}>
              {
                markers.map((m,i) => (
                  <Animated.View 
                    key={`marker-${i}`} 
                    style={[
                      styles.marker,
                      i % SPECIAL_MARKER_INCREMEMNT ? {} : styles.specialMarker,
                      
                      { backgroundColor: markerColor, marginRight: markerMargin },
                      i * (contentWidth / markerCount) >= adjustedScrollValue && i * (contentWidth / markerCount) <= adjustedScrollValue + trimmerWidth
                        ? { backgroundColor: tintColor, transform: [{scaleY: 1.5}] }
                        : { backgroundColor: markerColor }
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
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  horizontalScrollView: {
    height: 80,
    overflow: 'hidden',
    position: 'relative',
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
    width: 200,
    height: '100%',
    paddingVertical: 15,
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
  selection: {
    opacity: 0.2,
    backgroundColor: TINT_COLOR,
    width: '100%',
    height: '100%',
  },
  markersContainer: {
    flexDirection: 'row',
    // width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marker: {
    backgroundColor: MARKER_COLOR, // marker color,
    width: MARKER_LENGTH,
    height: 6,
    borderRadius: 3,
  },
  specialMarker: {
    height: 12,
  },
});