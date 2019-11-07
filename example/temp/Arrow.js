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

const BaseArrow = ({rotationStyle}) => {
  return (
    <View style={[styles.root, rotationStyle]}>
      <View style={[styles.arrow, styles.top]}/>
      <View style={[styles.arrow, styles.bottom]}/>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rootRight: {
    transform: [{ rotate: '180deg'}],
  },
  arrow: {
    position: 'absolute',
    height: 10,
    width: 2,
    backgroundColor: 'white'
  },
  top: {
    transform: [{ rotate: '20deg'}],
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    bottom: '49%',
  },
  bottom: {
    transform: [{ rotate: '-20deg'}],
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    top: '49%',
  }
});


export const Left = props => (
  <BaseArrow { ...props } rotationStyle={styles.rootLeft} />
);

export const Right = props => (
  <BaseArrow { ...props } rotationStyle={styles.rootRight} />
);


