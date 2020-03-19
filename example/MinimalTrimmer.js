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

const MARKER_INCREMENT = 1000;
const SPECIAL_MARKER_INCREMEMNT = 2;


// const MARKER_MARGIN = 1.792; // 60 seconds
// const MARKER_MARGIN = 8.042; // 30 seconds
const MARKER_MARGIN = 70.542; // 5 seconds


const TRIMMER_WIDTH = 200;
const TRIMMER_LENGTH = 5000;
const MARKER_LENGTH = 3;

const TRACK_BACKGROUND_COLOR = '#FFF';
const TRACK_BORDER_COLOR = '#c8dad3';
const MARKER_COLOR = '#EDEFF3';
const TINT_COLOR = '#93b5b3';
const SCRUBBER_COLOR = '#63707e'

export default class Trimmer extends React.Component {
  onScroll = ({ nativeEvent: { contentOffset, contentSize }}) => {
    const { totalDuration, onStartValueChanged } = this.props;

    const newStartingTime = (contentOffset.x / contentSize.width) * totalDuration
    console.log('stats ', {
      offset: contentOffset.x,
      contentWidth: contentSize.width,
      screenWidth,
      totalDuration,
      twimmerWidth: TRIMMER_WIDTH,
    })

    onStartValueChanged && onStartValueChanged(newStartingTime)
    // console.log('contentOffset.x ', contentOffset.x, totalDuration)
    
  }

  determineMarginLength = () => {
    const {
      trimmerLength = TRIMMER_LENGTH,
      totalDuration,
      trimmerWidth = TRIMMER_WIDTH,
      markerIncrement = MARKER_INCREMENT,
    } = this.props;

    const markerCount = (totalDuration / markerIncrement) | 0;
    const trimmerLengthInSeconds = trimmerLength / 1000
    const contentWidth = ((markerCount / trimmerLengthInSeconds) * (markerIncrement / 1000))

    const markerMargin = ((((contentWidth) * screenWidth) - (screenWidth - trimmerWidth)) / markerCount) - MARKER_LENGTH

    return markerMargin
  }

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
    } = this.props;

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
        
 
    // const onLayoutHandler = centerOnLayout
    //     ? {
    //         onLayout: () => {
    //         const centerOffset = actualTrimmerOffset + (actualTrimmerWidth / 2) - (screenWidth / 2);
    //         this.scrollView.scrollTo({x: centerOffset, y: 0, animated: false});
    //         }
    //     }
    //     : null

    const markers = new Array((totalDuration / MARKER_INCREMENT) | 0).fill(0) || [];

    const markerMargin = this.determineMarginLength()

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
            <View style={[styles.markersContainer, { paddingHorizontal: (screenWidth - trimmerWidth) / 2 }]}>
              {
                markers.map((m,i) => (
                  <Animated.View 
                    key={`marker-${i}`} 
                    style={[
                      styles.marker,
                      i % SPECIAL_MARKER_INCREMEMNT ? {} : styles.specialMarker,
                      { backgroundColor: markerColor, marginRight: markerMargin }
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  horizontalScrollView: {
    height: 90,
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
    width: '100%',
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


    borderLeftWidth: 0,
    borderRightWidth: 0,
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