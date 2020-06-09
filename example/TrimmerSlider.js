import React from "react";
import { Slider } from "react-native";
import Animated from "react-native-reanimated";

/**
 * a component to show slider inside a ballon
 */
export default class TrimmerSlider extends React.Component {
  slider = React.createRef();

  setSliderValue = (value) => {
    this.slider.current.setNativeProps({ value });
  };

  render() {
    const {
      containerStyle,
      onSliderValueChanged,
      onSlidingComplete,
    } = this.props;

    return (
      <Animated.View style={[containerStyle, { alignItems: "center" }]}>
        <Slider
          style={{ borderColor: "red", borderWidth: 1, width: "100%" }}
          ref={this.slider}
          thumbImage={require("./assets/thumb-image.png")}
          thumbTintColor="#222B45"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          minimumValue={0}
          minimumTrackTintColor="#40E1A9"
          maximumTrackTintColor="#B3BED3"
          step={0}
          maximumValue={1}
          onValueChange={onSliderValueChanged}
          onSlidingComplete={onSlidingComplete}
          value={0}
        />
      </Animated.View>
    );
  }
}
