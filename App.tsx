import React, {useState, useRef, useEffect} from 'react';
import {View, Button} from 'react-native';

import {captureRef} from 'react-native-view-shot';
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Svg, {Circle} from 'react-native-svg';

import {Platform, PermissionsAndroid} from 'react-native';

const App = () => {
  const [path, setPath] = useState([]);
  const [isCircle, setIsCircle] = useState(false);
  const svgRef = useRef();
  const captureViewRef = useRef();
  const onPanGestureEvent = event => {
    const {translationX, translationY, state} = event.nativeEvent;

    if (state === State.ACTIVE) {
      setPath([...path, {x: translationX, y: translationY}]);
    } else if (state === State.END) {
      const isApproximatelyCircle = checkIfApproximatelyCircle(path);
      setIsCircle(isApproximatelyCircle);
    }
  };
  const captureScreenshot = async () => {
    try {
      if (isCircle) {
        const screenshotURI = await captureRef(captureViewRef, {
          format: 'jpg',

          quality: 0.8,
        }); // Use the screenshotURI as needed (e.g., save to device, share, etc.)

        console.log('Screenshot captured:', screenshotURI);
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };
  const checkIfApproximatelyCircle = path => {
    // Implement a logic to check if the drawn path resembles a circle.
    // For simplicity, we check if there are enough points and if the
    // path forms a closed shape with a roughly similar aspect ratio.
    if (path.length < 10) {
      return false;
    }

    const firstPoint = path[0];
    const lastPoint = path[path.length - 1];
    const deltaX = lastPoint.x - firstPoint.x;
    const deltaY = lastPoint.y - firstPoint.y;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // You may need to adjust this threshold based on your requirements.
    const aspectRatioThreshold = 0.2;

    return (
      Math.abs(deltaX / distance) < aspectRatioThreshold &&
      Math.abs(deltaY / distance) < aspectRatioThreshold
    );
  };
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

      {
        title: 'Storage Permission',

        message:
          'This app needs access to your device storage to save screenshots.',

        buttonNeutral: 'Ask Me Later',

        buttonNegative: 'Cancel',

        buttonPositive: 'OK',
      },
    ).then(result => {
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission denied.');
      }
    });
  }
  const takeScreenshot = async () => {
    // try {
    // if (isCircle) {
    const svgSnapshot = await svgRef.current.toDataURL();
    // console.log('Screenshot taken:', svgRef?.current?.);
    // }
    // } catch (error) {
    // console.error('Error taking screenshot:', error);
    // }
  };
  useEffect(() => {
    if (path?.length >= 10) {
      // return false;
      if (isCircle) {
        captureScreenshot;
      } else {
        console.log('it is not a circle');
      }
    }
  }, [path]);

  return (
    <GestureHandlerRootView style={{flex: 1, margin: 10}}>
      {/* Content to be captured */}

      <PanGestureHandler onGestureEvent={onPanGestureEvent}>
        <View ref={captureViewRef} style={{flex: 1}}>
          <Svg height={'399'} width={'200'} ref={svgRef}>
            {path.map((point, index) => (
              <Circle key={index} cx={point.x} cy={point.y} r={2} fill="blue" />
            ))}
          </Svg>
        </View>
      </PanGestureHandler>
      <Button title="Take Screenshot" onPress={captureScreenshot} />
    </GestureHandlerRootView>
  );
};

export default App;
