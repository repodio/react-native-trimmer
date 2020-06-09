// import React, { useRef, useCallback, useState } from "react";
// import { Button, View, StyleSheet, Text } from "react-native";
// import Reanimated, { Easing } from "react-native-reanimated";

// round = (num) => Math.round(num).toFixed(0);

// formatMilliseconds = (ms) => {
//   // 1- Convert to seconds:
//   var seconds = ms / 1000;
//   // 2- Extract hours:
//   var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
//   seconds = seconds % 3600; // seconds remaining after extracting hours
//   // 3- Extract minutes:
//   var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
//   // 4- Keep only seconds not extracted to minutes:
//   seconds = seconds % 60;

//   return `${round(hours)}:${
//     round(minutes) < 10 ? `0${round(minutes)}` : round(minutes)
//   }:${seconds < 10 ? `0${seconds.toFixed(0)}` : seconds.toFixed(0)}`;
// };

// const AnimatedText = ({ initialValue = 0 }) => {
//   const arcAngle = useRef(new Reanimated.Value(Math.random() * 240));
//   const [text, setText] = useState(formatMilliseconds(initialValue));

//   return (
//     <View>
//       <View style={styles.container}>
//         <Reanimated.Code
//           exec={Reanimated.call([arcAngle.current], ([value]) => {
//             setText(`${Math.round((value / 240) * 100)}%`);
//           })}
//         />
//         <Text style={styles.text}>{text}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     justifyContent: "center",
//     alignItems: "center",
//     width: 200,
//     height: 200,
//   },
//   absolute: {
//     position: "absolute",
//   },
//   text: {
//     transform: [{ translateY: -10 }],
//     fontSize: 40,
//   },
// });
// export default AnimatedText;

import React, { useRef, useCallback, useState } from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import Reanimated, { Easing } from "react-native-reanimated";

const AnimatedText = () => {
  const arcAngle = useRef(new Reanimated.Value(Math.random() * 240));
  const [text, setText] = useState("0%");
  const randomizeProgress = useCallback(() => {
    Reanimated.timing(arcAngle.current, {
      toValue: Math.random() * 240,
      easing: Easing.inOut(Easing.quad),
      duration: 0,
    }).start();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <Reanimated.Code
          exec={Reanimated.call([arcAngle.current], ([value]) => {
            setText(`${Math.round((value / 240) * 100)}%`);
          })}
        />
        <Text style={styles.text}>{text}</Text>
      </View>
      <Button title="Randomize progress" onPress={randomizeProgress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
  },
  absolute: {
    position: "absolute",
  },
  text: {
    transform: [{ translateY: -10 }],
    fontSize: 40,
  },
});
export default AnimatedText;
