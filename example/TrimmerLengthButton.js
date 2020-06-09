import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const TrimmerLengthButton = ({ trimmerLengthOption, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.root}>
        <Text style={styles.trimmerButtonLabel}>{trimmerLengthOption.key}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    marginLeft: 12,
    marginRight: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderColor: "#222B45",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  trimmerButtonLabel: {
    fontSize: 11,
  },
});

export default TrimmerLengthButton;
