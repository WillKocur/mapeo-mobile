// @flow
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from '../../Views/MapView';
import CameraTabView from '../../Views/CameraTabView';

import { DARK_GREY, MAPEO_BLUE, WHITE } from '../../../lib/styles';

const routeConfiguration = {
  MapView: {
    screen: MapView,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: string }) => (
        <Icon
          color={tintColor}
          name="near-me"
          size={30}
          style={{ marginLeft: -3 }}
        />
      )
    }
  },
  CameraTabView: {
    screen: CameraTabView,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: string }) => (
        <Icon
          color={tintColor}
          name="photo-camera"
          size={30}
          style={{ marginLeft: -3 }}
        />
      )
    }
  }
};

const tabConfiguration = {
  swipeEnabled: false,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: MAPEO_BLUE,
    inactiveTintColor: DARK_GREY,
    showIcon: true,
    showLabel: false,
    style: {
      backgroundColor: WHITE,
      borderTopWidth: 0
    }
  }
};

const TabBar = createBottomTabNavigator(routeConfiguration, tabConfiguration);

export default TabBar;
