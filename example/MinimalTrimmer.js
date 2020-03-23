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
const MARKER_WIDTH = 3;

const TRACK_BACKGROUND_COLOR = '#FFF';
const TRACK_BORDER_COLOR = '#c8dad3';
const MARKER_COLOR = '#EDEFF3';
const TINT_COLOR = '#93b5b3';
const SCRUBBER_COLOR = '#63707e'

export default class Trimmer extends React.Component {
  scrollX = new Animated.Value(0);
  trackProgress = new Animated.Value(0);
  

  state = {
    markerMargin: 0,
    contentWidth: 0,
  }

  componentDidMount() {
    this.determineMarginLength()
    this.scrollX = new Animated.Value(0);
    this.trackProgress = new Animated.Value(0);
  }

  componentDidUpdate(prevProps) {
    if(this.props.trimmerLength !== prevProps.trimmerLength) {
      this.determineMarginLength()
    }
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

    const markerMargin = (((contentWidth) - (width - trimmerWidth)) / markerCount) - MARKER_WIDTH

    this.setState({
      markerMargin,
      contentWidth,
    })
    
    return markerMargin
  }

  startTrackProgressAnimation = () => {
    const { trimmerLength } = this.props;

    this.trackProgress.setValue(0);
    
    Animated.loop(
      Animated.timing(this.trackProgress, {
        toValue: 1,
        duration: trimmerLength,
      })
    ).start();
  }

  stopTrackProgressAnimation = () => {
    Animated.timing(this.trackProgress).stop();
    this.trackProgress.setValue(0);
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
      width,
      markerIncrement = MARKER_INCREMENT,
      onScrollBeginDrag,
      onScrollEndDrag,
    } = this.props;

    const {
      markerMargin,
      contentWidth
    } = this.state;

    const trackBackgroundStyles = [
      styles.trackBackground,
        { width: '100%', backgroundColor: trackBackgroundColor, borderColor: trackBorderColor
      }];
        
    const markerCount = (totalDuration / markerIncrement) | 0;
    const markers = new Array(markerCount).fill(0) || [];

    const trackProgressWidth = this.trackProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, TRIMMER_WIDTH - 6]
    })

    const adjustedScrollValue = ((this.scrollX._value / (contentWidth - trimmerWidth)) * (contentWidth - trimmerWidth))
    
    return (
      <View style={[styles.root, { width }]} onLayout={this.onLayout}>
        <View style={styles.trimmerContainer} pointerEvents="none">
          <View style={[
            styles.trimmer,
            { width: TRIMMER_WIDTH },
            { borderColor: tintColor }
          ]} >
            <Animated.View style={[styles.selection, { backgroundColor: tintColor, width: trackProgressWidth }]}/>
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
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.scrollX}}}],
            {listener: this.onScroll}, // Optional async listener
          )}
          scrollEventThrottle={1}
          bounces={false}
          showsHorizontalScrollIndicator={showScrollIndicator}
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
                      ((MARKER_WIDTH + markerMargin) * i) + MARKER_WIDTH >= adjustedScrollValue && ((MARKER_WIDTH + markerMargin) * i) + MARKER_WIDTH <= adjustedScrollValue + trimmerWidth
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
  },
  trimmerContainer: {
    width: 200,
    height: '100%',
    paddingVertical: 15,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  trimmer: {
    borderColor: TINT_COLOR,
    borderWidth: 3,
    borderRadius: 3,
  },
  selection: {
    opacity: 0.2,
    backgroundColor: TINT_COLOR,
    width: 0,
    height: '100%',
  },
  markersContainer: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marker: {
    backgroundColor: MARKER_COLOR, // marker color,
    width: MARKER_WIDTH,
    height: 6,
    borderRadius: 3,
  },
  specialMarker: {
    height: 12,
  },
});