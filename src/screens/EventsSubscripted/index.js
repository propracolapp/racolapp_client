import React, {Component} from 'react';
import { Text, View  } from 'react-native';

export default class EventsSubscriptedScreen extends Component {
  static navigationOptions = {
    title: 'Mes participations',
  };

    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Subscripted events!</Text>
        </View>
      );
    }
  }