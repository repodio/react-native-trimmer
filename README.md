# React Native Trimmer
A Trimmer component that renders in iOS and Android and built entirely in React Native.

<img src="https://i.imgur.com/ASrdaq4.gif" >

## Install

```
npm install react-native-trimmer 
or 
yarn add react-native-trimmer`

import Trimmer from 'react-native-trimmer'
``` 

<img src="https://i.imgur.com/SyUqGSB.png" >

### Required Props

Name | Type | Description
:--- | :--- | :---
`trimmerLeftHandlePosition` | Number | This is the value **in milliseconds** of the left handle. This value will always control the left handle unless the left handle is currently being selected and positioned
`trimmerRightHandlePosition` | Number | This is the value  **in milliseconds** of the left handle. This value will always control the left handle unless the left handle is currently being selected and positioned
`totalDuration` | Number | The total duration **in milliseconds**
`onLeftHandleChange` | Function | Callback for when the Trimmer component updates the `trimmerLeftHandlePosition`. Function has 1 arguemnt, the new value in milliseconds
`onRightHandleChange` | Function | Callback for when the Trimmer component updates the `trimmerRightHandlePosition`. Function has 1 arguemnt, the new value in milliseconds

### Optional Props

Name | Type | Default Value | Description
:--- | :--- | :--- | :---
`maxTrimDuration` | Number | 60000 | The maxium value  **in milliseconds**  the trimmer can be expanded too
`maximumZoomLevel` | Number | 50 | The maxium value zoom level the Trimmer can zoom into. The minimum value is always 1. A value of 50 would be you can scale the trimmer to 50x the minimum.
`zoomMultiplier` | Number | 5 | This is a multiplier on how fast the zoom will zoom. A value of 1 will zoom a lot slower than a value of 20
`initialZoomValue` | Number | 2 | Initial zoom for the Trimmer when it is constructed
`scaleInOnInit` | Boolean | false | This boolean will disregard the above `initialZoomValue` and attempt to zoom in the proper level so the trimmer renders half width of the screen while also staying within the bounds of the maximumZoomLevel. This is a useful prop if the ratio of 
`scaleInOnInitType` | String | `trim-duration` | Provides an option for `scaleInOnInit` to either use the duration of the trimmer `trim-duration` or the `maxTrimDuration` with `max-duration`. Using `max-duration` ensures that the trimmer will always fit in the visible area.
`trimmerRightHandlePosition - trimmerLeftHandlePosition` to `totalDuration` varying by magnitudes
`scrubberPosition` | Number | null | Position of the scrubber to be controlled by the parent component. A value of null will not render the scrubber
`onScrubbingComplete` | Function | null | A callback for when the scrubbing is completed on the Trimmer
`onLeftHandlePressIn` | Function | null | A callback for when the left handle is initially pressed in. Useful if you want to provide some haptics to the user on this press in.
`onRightHandlePressIn` | Function | null | A callback for when the right handle is initially pressed in. Useful if you want to provide some haptics to the user on this press in.
`onScrubberPressIn` | Function | null | A callback for when the scrubber is initially pressed in. Useful if you want to provide some haptics to the user on this press in.
`tintColor` | String | '#93b5b3' | Color of the trimmer
`markerColor` | String | '#c8dad3' | Color of the markers in the track
`trackBackgroundColor` | String | '#f2f6f5' | Color of the track background
`trackBorderColor` | String | '#c8dad3' | Color of the track border
`scrubberColor` | String | '#63707e' | Color of the scrubber
          scrubberPosition={scrubberPosition}
`showScrollIndicator` | Boolean | true | Option to show or hide the scroll indicator.
`centerOnLayout` | Boolean | true | Enabling this option ensure that the trimmer is visible / centered after the component's onLayout. 


## Basic Example

<img src="https://i.imgur.com/vBM5VMX.jpg" >

```javascript
import React, { Component } from 'react'
import { View } from 'react-native'
import Trimmer from 'react-native-trimmer'

class Example extends Component {
  state = {
    trimmerLeftHandlePosition: 0,
    trimmerRightHandlePosition: 10000,
  }
  
  onLeftHandleChange = (newLeftHandleValue) => {
    this.setState({ trimmerLeftHandlePosition: newLeftHandleValue })
  }

  onRightHandleChange = (newRightHandleValue) => {
    this.setState({ trimmerRightHandlePosition: newRightHandleValue })
  }

  render() {
    const {
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
    } = this.state;
    return (
      <View>
        <Trimmer
          onLeftHandleChange={this.onLeftHandleChange}
          onRightHandleChange={this.onRightHandleChange}
          totalDuration={60000}
          trimmerLeftHandlePosition={trimmerLeftHandlePosition}
          trimmerRightHandlePosition={trimmerRightHandlePosition}
        />
      </View>
    );
  }
}
```

## Advanced Example

<img src="https://i.imgur.com/lybYRYo.jpg" >

```javascript
import React, { Component } from 'react'
import { View, Button } from 'react-native'
import Trimmer from 'react-native-trimmer'


const maxTrimDuration = 60000;
const minimumTrimDuration = 1000;
const totalDuration = 180000

const initialLeftHandlePosition = 0;
const initialRightHandlePosition = 36000;

const scrubInterval = 50;

class Example extends Component {
  state = {
    playing: false,
    trimmerLeftHandlePosition: initialLeftHandlePosition,
    trimmerRightHandlePosition: initialRightHandlePosition,
    scrubberPosition: 1000
  }
  

  playScrubber = () => {
    this.setState({ playling: true });

    this.scrubberInterval = setInterval(() => {
      this.setState({ scrubberPosition: this.state.scrubberPosition + scrubInterval })
    }, scrubInterval)
  }

  pauseScrubber = () => {
    clearInterval(this.scrubberInterval)

    this.setState({ playling: false, scrubberPosition: this.state.trimmerLeftHandlePosition });
  }

  onLeftHandleChange = (newLeftHandleValue) => {
    this.setState({ trimmerLeftHandlePosition: newLeftHandleValue })
  }

  onRightHandleChange = (newRightHandleValue) => {
    this.setState({ trimmerRightHandlePosition: newRightHandleValue })
  }

  onScrubbingComplete = (newValue) => {
    this.setState({ playing: false, scrubberPosition: newValue })
  }

  render() {
    const {
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      scrubberPosition,
      playling,
    } = this.state;
    
    return (
      <View>
        {
          playling
            ? <Button title="Pause" color="#f638dc" onPress={this.pauseScrubber}/>
            : <Button title="Play" color="#f638dc" onPress={this.playScrubber}/>
        }
        <Trimmer
          onLeftHandleChange={this.onLeftHandleChange}
          onRightHandleChange={this.onRightHandleChange}
          totalDuration={totalDuration}
          trimmerLeftHandlePosition={trimmerLeftHandlePosition}
          trimmerRightHandlePosition={trimmerRightHandlePosition}
          minimumTrimDuration={minimumTrimDuration}
          maxTrimDuration={maxTrimDuration}
          maximumZoomLevel={200}
          zoomMultiplier={20}
          initialZoomValue={2}
          scaleInOnInit={true}
          tintColor="#f638dc"
          markerColor="#5a3d5c"
          trackBackgroundColor="#382039"
          trackBorderColor="#5a3d5c"
          scrubberColor="#b7e778"
          scrubberPosition={scrubberPosition}
          onScrubbingComplete={this.onScrubbingComplete}
          onLeftHandlePressIn={() => console.log('onLeftHandlePressIn')}
          onRightHandlePressIn={() => console.log('onRightHandlePressIn')}
          onScrubberPressIn={() => console.log('onScrubberPressIn')}
        />
      </View>
    );
  }
}
```
