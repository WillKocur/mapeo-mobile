// @flow
import React from 'react';
import { withNavigationFocus } from 'react-navigation';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import type { Observation } from '../../../types/observation';
import { CHARCOAL, WHITE } from '../../../lib/styles.js';

import AddButton from '../../../images/add-button.png';

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: CHARCOAL,
    justifyContent: 'center',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  cancelText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: WHITE
  },
  capture: {
    alignSelf: 'center',
    marginTop: 375
  },
  preview: {
    flex: 1,
    alignItems: 'center'
  }
});

export type Props = {
  navigation: any,
  isFocused: boolean
};

export type StateProps = {
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void,
  goToObservationEditor: () => void
};

type State = {
  loading: boolean
};

class CameraView extends React.Component<
  Props & StateProps & DispatchProps,
  State
> {
  state = {
    loading: false
  };

  shouldComponentUpdate(
    nextProps: Props & StateProps & DispatchProps,
    nextState: State
  ) {
    if (nextProps.isFocused) {
      return nextProps !== this.props || nextState !== this.state;
    }

    return false;
  }

  camera: RNCamera;

  takePicture = async () => {
    const {
      updateObservation,
      selectedObservation,
      goToObservationEditor
    } = this.props;
    if (this.camera) {
      const options = { quality: 0.5, base64: true, fixOrientation: true };
      try {
        this.setState({ loading: true });
        const data = await this.camera.takePictureAsync(options);
        this.setState({ loading: false });

        if (selectedObservation) {
          updateObservation({
            ...selectedObservation,
            media: selectedObservation.media.concat([
              {
                type: 'Photo',
                source: data.uri
              }
            ])
          });
          goToObservationEditor();
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  render() {
    const { loading } = this.state;
    const { isFocused } = this.props;

    if (!isFocused) {
      console.log('RN - Unmount RNCamera in CameraView');
      return <View />;
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          permissionDialogTitle="Permission to use camera"
          permissionDialogMessage="We need your permission to use your camera phone"
        >
          <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
            <Image
              source={AddButton}
              style={{
                width: 125,
                height: 125
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </RNCamera>
        {loading && (
          <View
            style={{
              position: 'absolute',
              height: Dimensions.get('window').height - 30,
              width: Dimensions.get('window').width,
              backgroundColor: 'rgba(66,66,66,.8)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <View
              style={{
                backgroundColor: '#FFF',
                paddingHorizontal: 50,
                paddingVertical: 30,
                justifyContent: 'center',
                borderRadius: 3
              }}
            >
              <ActivityIndicator />
              <Text>Saving Image</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigationFocus(CameraView);
