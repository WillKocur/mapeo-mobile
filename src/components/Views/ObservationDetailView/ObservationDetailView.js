// @flow
import React from 'react';
import {
  Button,
  Dimensions,
  Image,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { NavigationActions, withNavigation } from 'react-navigation';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import type { Observation } from '@types/observation';
import { CHARCOAL, DARK_GREY, MANGO } from '@lib/styles';

import LeftChevron from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

type State = {
  showStillHappening: boolean
};

export type StateProps = {
  selectedObservation?: Observation
};

export type DispatchProps = {
  goToTabNav: () => void,
  addObservation: (o: Observation) => void
};

type Props = {
  navigation: NavigationActions
};

const styles = StyleSheet.create({
  backChevron: {
    marginLeft: 15
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    backgroundColor: DARK_GREY,
    position: 'absolute',
    bottom: 0,
    padding: 15
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center'
  },
  cancelButton: {
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginRight: 10,
    backgroundColor: 'gray'
  },
  close: {
    position: 'absolute',
    left: 10
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column'
  },
  containerReview: {
    backgroundColor: DARK_GREY,
    flex: 1,
    flexDirection: 'column'
  },
  date: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  topSection: {
    alignSelf: 'stretch',
    backgroundColor: '#ccffff',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    height: 200,
    paddingVertical: 20
  },
  mapBox: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15
  },
  mapEditIcon: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 20
  },
  observedByText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    paddingLeft: 10
  },
  profileImage: {
    marginLeft: 10,
    marginBottom: 20
  },
  saveButton: {
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: MANGO
  },
  section: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    flex: 1
  },
  sectionReview: {
    borderBottomColor: CHARCOAL,
    borderBottomWidth: 1,
    flex: 1
  },
  sectionText: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 15
  },
  stillHappening: {
    color: 'black',
    fontSize: 12,
    fontWeight: '400',
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center'
  },
  textNotes: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
    margin: 20,
    textAlign: 'center'
  },
  textNotesReview: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  time: {
    color: 'grey',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center'
  },
  title: {
    color: 'black',
    fontFamily: 'HelveticaNeue',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: DARK_GREY,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white'
  }
});

class ObservationDetailView extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  state = { showStillHappening: true };

  isReviewMode() {
    const { navigation } = this.props;

    return !!(
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.review
    );
  }

  dismissStillHappening = () => {
    if (this.state.showStillHappening) {
      this.setState({ showStillHappening: false });
    }
  };

  saveObservation = () => {
    const { selectedObservation, addObservation, goToTabNav } = this.props;

    if (selectedObservation) {
      addObservation(selectedObservation);
      goToTabNav();
    }
  };

  render() {
    const { navigation, selectedObservation } = this.props;
    const reviewMode = this.isReviewMode();
    let mediaText = '';
    const thereIsMedia =
      selectedObservation &&
      selectedObservation.media &&
      selectedObservation.media.length > 0;
    if (thereIsMedia) mediaText = '1 Photo';

    if (!selectedObservation) {
      return <View />;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={reviewMode ? styles.containerReview : styles.container}
        >
          {reviewMode && (
            <View style={styles.header}>
              <TouchableHighlight
                style={styles.close}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcon color="gray" name="close" size={25} />
              </TouchableHighlight>
              <Text style={styles.headerTitle}>Revisíon</Text>
            </View>
          )}
          <View style={styles.topSection}>
            {!reviewMode && (
              <TouchableHighlight
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <LeftChevron
                  color="black"
                  name="chevron-left"
                  size={25}
                  style={styles.backChevron}
                />
              </TouchableHighlight>
            )}
            <Text style={styles.title}>{selectedObservation.type}</Text>
            <Text style={styles.date}>
              {moment(selectedObservation.created).format('MMMM D, YYYY')}
            </Text>
            <Text style={styles.time}>
              {moment(selectedObservation.created).format('h:mm A')}
            </Text>
          </View>
          <View style={reviewMode ? styles.sectionReview : styles.section}>
            <Text style={styles.sectionText}>{mediaText}</Text>
            {selectedObservation &&
              selectedObservation.media &&
              selectedObservation.media[0] &&
              selectedObservation.media[0].source && (
                <View
                  style={{
                    flexDirection: 'row',
                    height: 125,
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    source={{ uri: selectedObservation.media[0].source }}
                    style={{
                      width: Dimensions.get('window').width * 0.3
                    }}
                  />
                </View>
              )}
            <Text
              style={reviewMode ? styles.textNotesReview : styles.textNotes}
            >
              {selectedObservation.notes}
            </Text>
          </View>
          <View style={reviewMode ? styles.sectionReview : styles.section}>
            <Text style={styles.sectionText}>0.0 km</Text>
            <View style={{ height: 240 }}>
              <MapboxGL.MapView
                style={styles.mapBox}
                styleURL={MapboxGL.StyleURL.Street}
                zoomLevel={15}
                centerCoordinate={[11.256, 43.77]}
              />
              {reviewMode && (
                <TouchableHighlight
                  onPress={() => {
                    navigation.navigate('Position');
                  }}
                >
                  <FontAwesomeIcon
                    color="lightgray"
                    name="pencil"
                    size={20}
                    style={styles.mapEditIcon}
                  />
                </TouchableHighlight>
              )}
            </View>
          </View>
          <View style={reviewMode ? styles.sectionReview : styles.section}>
            <Text style={styles.sectionText}>Observado por</Text>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                color="lightgray"
                name="user-circle-o"
                size={30}
                style={styles.profileImage}
              />
              <Text style={styles.observedByText}>
                {selectedObservation.observedBy}
              </Text>
            </View>
          </View>
          {reviewMode && <View style={{ height: 75 }} />}
          {!reviewMode && this.state.showStillHappening ? (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
              <Text style={styles.stillHappening}>
                Is this still happening here?
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Button onPress={this.dismissStillHappening} title="Yes" />
                <Button onPress={this.dismissStillHappening} title="No" />
              </View>
            </View>
          ) : null}
        </ScrollView>
        {reviewMode && (
          <View style={styles.bottomButtonContainer}>
            <TouchableHighlight
              style={styles.cancelButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.bottomButtonText}>Editar</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.saveButton}
              onPress={this.saveObservation}
            >
              <Text style={styles.bottomButtonText}>Guardar</Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(ObservationDetailView);
