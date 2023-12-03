import React, { useRef, createRef, useState } from "react";
import { Animated } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const Zoom = (props) => {
  const pinchRef = createRef();
  const panRef = createRef();
  const [panEnabled, setPanEnabled] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    {
      useNativeDriver: false,
    }
  );

  const onPinchEvent = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: false,
  });

  const handlePinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setPanEnabled(true);
    }

    if (event.nativeEvent.scale < 1) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 2,
      }).start();
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setPanEnabled(false);
    }
  };

  return (
    <GestureHandlerRootView>
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onPanEvent}
        enabled={panEnabled}
        simultaneousHandlers={[pinchRef]}
      >
        <PinchGestureHandler
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={handlePinchStateChange}
          simultaneousHandlers={[panRef]}
          ref={pinchRef}
        >
          <Animated.Image
            source={props.source}
            style={{
              width: '100%',
              height: 300,
              transform: [
                { scale },
                { perspective: 200 },
                { translateX: translateX },
                { translateY: translateY },
              ],
              resizeMode: 'contain',
            }}
          />
        </PinchGestureHandler>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Zoom;
