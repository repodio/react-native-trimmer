import React from "react";
import { TextInput, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

const BUBBLE_WIDTH = 100;

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

/**
 * a component to show text inside a ballon
 */
export default class ClipPositionText extends React.Component {
  startingText = React.createRef();
  endingText = React.createRef();

  /**
   * sets the text inside the ballon. it uses `setNativeProps` to perform fast while sliding
   */
  setText = (value) => {
    const { trimmerLength = 0 } = this.props;
    const endingValue = value + trimmerLength;

    this.startingText.current.setNativeProps({
      text: formatMilliseconds(value),
    });
    this.endingText.current.setNativeProps({
      text: formatMilliseconds(endingValue),
    });
  };

  render() {
    const { trimmerLength = 0 } = this.props;

    return (
      <Animated.View style={styles.root}>
        <Animated.View style={styles.labelWrapper}>
          <TextInput
            editable={false}
            ref={this.startingText}
            style={styles.label}
            text={formatMilliseconds(0)}
          />
        </Animated.View>
        <Animated.View style={styles.labelWrapper}>
          <TextInput
            editable={false}
            ref={this.endingText}
            style={styles.label}
            text={formatMilliseconds(trimmerLength)}
          />
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 56,
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelWrapper: {
    padding: 2,
    borderRadius: 5,
    maxWidth: BUBBLE_WIDTH,
  },
  label: {
    letterSpacing: 1,
  },
});
