import React from "react";
import { StyleSheet, ScrollView, View, Easing, Text } from "react-native";
import Animated from "react-native-reanimated";

import StartingText from "./StartingText";

const { block, call, event } = Animated;

const SHOW_SCROLL_INDICATOR = true;

const MARKER_INCREMENT = 1000;
const SPECIAL_MARKER_INCREMEMNT = 2;

const TRIMMER_WIDTH = 150;
const TRIMMER_LENGTH = 5000;
const MARKER_WIDTH = 3;
const TRACK_BORDER_RADIUS = 5;

const TRACK_BACKGROUND_COLOR = "#FFF";
const TRACK_BORDER_COLOR = "#c8dad3";
const MARKER_COLOR = "#EDEFF3";
const TINT_COLOR = "#93b5b3";
const TRACK_PROGRESS_COLOR = "#93b5b3";

round = (num) => Math.round(num).toFixed(0);

clamp = ({ num, min, max }) => (num <= min ? min : num >= max ? max : num);

formatMilliseconds = (ms) => {
  // 1- Convert to seconds:
  var seconds = ms / 1000;
  // 2- Extract hours:
  var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;

  return `${round(hours)}:${
    round(minutes) < 10 ? `0${round(minutes)}` : round(minutes)
  }:${seconds < 10 ? `0${seconds.toFixed(0)}` : seconds.toFixed(0)}`;
};

export default class Trimmer extends React.Component {
  scrollX = new Animated.Value(0);
  trackProgress = new Animated.Value(0);
  ballon = React.createRef();

  state = {
    markerMargin: 0,
    contentWidth: 0,
    ballon: "",
  };

  componentDidMount() {
    this.determineMarginLength();
    this.scrollX = new Animated.Value(0);
    this.trackProgress = new Animated.Value(0);
    this.lastStartPosition = 0;
    // this.calledScrollX = block([
    //   call([this.scrollX], (r) => console.log(r[0])),
    //   this.scrollX,
    // ]);
  }

  componentDidUpdate(prevProps) {
    if (this.props.trimmerLength !== prevProps.trimmerLength) {
      this.determineMarginLength();
    }
  }

  onScroll = (positionX) => {
    const { scrubbing, totalDuration, onStartValueChanged } = this.props;
    if (scrubbing) {
      return;
    }
    const newStartingTime =
      (positionX / this.state.contentWidth) * totalDuration;

    this.ballon.current.setText(formatMilliseconds(newStartingTime));

    // if (
    //   Math.abs(
    //     Math.floor(newStartingTime / 1000) -
    //       Math.floor(this.lastStartPosition / 1000)
    //   ) >= +1
    // ) {
    //   console.log("onScroll newStartingTime", newStartingTime);
    //   onStartValueChanged && onStartValueChanged(newStartingTime);
    // }

    this.lastStartPosition = newStartingTime;
  };

  determineMarginLength = () => {
    const {
      trimmerLength = TRIMMER_LENGTH,
      totalDuration,
      trimmerWidth = TRIMMER_WIDTH,
      markerIncrement = MARKER_INCREMENT,
      width,
    } = this.props;

    const markerCount = (totalDuration / markerIncrement) | 0;
    const trimmerLengthInSeconds = trimmerLength / 1000;
    const contentWidth =
      (markerCount / trimmerLengthInSeconds) * (markerIncrement / 1000) * width;

    const markerMargin =
      (contentWidth - (width - trimmerWidth)) / markerCount - MARKER_WIDTH;

    this.setState({
      markerMargin,
      contentWidth,
    });

    return markerMargin;
  };

  startTrackProgressAnimation = () => {
    //TODO Get these to work
    // const { trimmerLength } = this.props;
    // this.trackProgress.setValue(0);
    // Animated.loop(
    //   Animated.timing(this.trackProgress, {
    //     toValue: 1,
    //     duration: trimmerLength,
    //     // easing: Easing.linear,
    //     // useNativeDriver: true,
    //   })
    // ).start();
  };

  stopTrackProgressAnimation = () => {
    //TODO Get these to work
    // Animated.timing(this.trackProgress).stop();
    // this.trackProgress.setValue(0);
  };

  _renderStartingText = () => {
    return <StartingText ref={this.ballon} />;
  };

  render() {
    const {
      totalDuration,
      trackBackgroundColor = TRACK_BACKGROUND_COLOR,
      trackBorderColor = TRACK_BORDER_COLOR,
      markerColor = MARKER_COLOR,
      tintColor = TINT_COLOR,
      trackProgressColor = TRACK_PROGRESS_COLOR,
      showScrollIndicator = SHOW_SCROLL_INDICATOR,
      trimmerWidth = TRIMMER_WIDTH,
      width,
      markerIncrement = MARKER_INCREMENT,
      onScrollBeginDrag,
      onMomentumScrollEnd,
    } = this.props;

    const { markerMargin, contentWidth } = this.state;

    const trackBackgroundStyles = [
      styles.trackBackground,
      {
        width: "100%",
        backgroundColor: trackBackgroundColor,
        borderColor: trackBorderColor,
      },
    ];

    const markerCount = (totalDuration / markerIncrement) | 0;
    const markers = new Array(markerCount).fill(0) || [];

    const trackProgressWidth = this.trackProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, TRIMMER_WIDTH - 6],
    });

    const adjustedScrollValue =
      (this.scrollX._value / (contentWidth - trimmerWidth)) *
      (contentWidth - trimmerWidth);

    return (
      <View style={styles.root}>
        <View>{this._renderStartingText()}</View>
        <View style={[styles.trimmerRoot, { width }]} onLayout={this.onLayout}>
          <Animated.ScrollView
            ref={(ref) => (this.scrollViewRef = ref)}
            // scrollEnabled={true}
            style={[
              styles.horizontalScrollView,
              { transform: [{ scaleX: 1.0 }] },
            ]}
            horizontal
            onScrollBeginDrag={onScrollBeginDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: (x, ...rest) =>
                        Animated.block([
                          Animated.set(this.scrollX, x),
                          Animated.call(
                            [x],
                            // ([offsetY]) => (this.listOffsetY = offsetY)
                            ([X]) => {
                              this.onScroll(X);
                            }
                          ),
                        ]),
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
              }
            )}
            // onScroll={Animated.event(
            //   [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
            //   { listener: this.onScroll, useNativeDriver: true } // Optional async listener
            // )}
            scrollEventThrottle={1}
            bounces={false}
            showsHorizontalScrollIndicator={showScrollIndicator}
          >
            <View style={trackBackgroundStyles}>
              <View
                style={[
                  styles.markersContainer,
                  { paddingHorizontal: (width - trimmerWidth) / 2 },
                ]}
              >
                {markers.map((m, i) => {
                  const position =
                    (MARKER_WIDTH + markerMargin) * i + MARKER_WIDTH;
                  return (
                    <View
                      key={`marker-${i}`}
                      style={[
                        styles.marker,
                        i % SPECIAL_MARKER_INCREMEMNT
                          ? {}
                          : styles.specialMarker,
                        {
                          backgroundColor: markerColor,
                          marginRight: markerMargin,
                        },
                        position >= adjustedScrollValue &&
                        position <= adjustedScrollValue + trimmerWidth
                          ? {
                              backgroundColor: tintColor,
                              transform: [{ scaleY: 1.5 }],
                            }
                          : { backgroundColor: markerColor },
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          </Animated.ScrollView>
          <View style={styles.trimmerContainer} pointerEvents="none">
            <View
              style={[
                styles.trimmer,
                { width: TRIMMER_WIDTH },
                { borderColor: tintColor },
              ]}
            >
              <Animated.View
                style={[
                  styles.selection,
                  {
                    backgroundColor: trackProgressColor,
                    width: trackProgressWidth,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  trimmerRoot: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  horizontalScrollView: {
    zIndex: 1,
    height: 80,
    // overflow: 'hidden',
    position: "relative",
  },
  trackBackground: {
    overflow: "hidden",
    marginVertical: 20,
    backgroundColor: TRACK_BACKGROUND_COLOR,
    height: 45,
  },
  trimmerContainer: {
    width: 200,
    height: "100%",
    paddingVertical: 15,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  trimmer: {
    borderColor: TINT_COLOR,
    borderWidth: 3,
    borderRadius: TRACK_BORDER_RADIUS,
  },
  selection: {
    opacity: 0.5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: TRACK_BORDER_RADIUS - 3,
    borderBottomLeftRadius: TRACK_BORDER_RADIUS - 3,
    backgroundColor: TRACK_PROGRESS_COLOR,
    width: 0,
    height: "100%",
  },
  markersContainer: {
    flexDirection: "row",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
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
