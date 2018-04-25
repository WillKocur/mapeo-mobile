// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationCell from './ObservationCell';
import { createObservation } from '../../../mocks/observations';

describe('ObservationCell tests', () => {
  const onPress = jest.fn();

  beforeEach(() => {
    onPress.mockReset();
  });

  test('snapshots', () => {
    const cases = [{ observation: createObservation() }];

    let tree;
    cases.forEach(props => {
      tree = renderer.create(
        <ObservationCell
          currentLocale="es"
          observation={props.observation}
          onPress={onPress}
        />
      );
      expect(tree).toMatchSnapshot();
    });
  });

  test('should call onPress with the observation when pressed', () => {
    const observation = createObservation();
    const tree = shallow(
      <ObservationCell
        currentLocale="es"
        observation={observation}
        onPress={onPress}
      />
    );
    tree
      .find('TouchableOpacity')
      .first()
      .props()
      .onPress();
    expect(onPress).toHaveBeenCalledWith(observation);
  });
});
