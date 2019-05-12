import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Picker
} from "react-native";
import {
  setStorage,
  readStorage,
  removeStorage
} from "../../utils/asyncStorage";
import { globalStyles, styleMainColor } from "../../utils/styles";
import DatePicker from "react-native-datepicker";

export default class App extends Component {
  static navigationOptions = {
    title: "NOUVEL EVENEMENT"
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "Partie de billard",
      description: "Pour retrouver des amateurs de billard et de bonnes bières",
      location: "",
      long: "",
      lat: "",
      date: "",
      capacity: "",
      TypeEventsID: "1",
      UserID: 1
    };
  }

  _addEvent = async () => {
    const response = await fetch("https://racolapp.herokuapp.com/users", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(this.state)
    });

    console.log("############# RESPONSE ###############");
    console.log(response);

    const json = await response.json();
    console.log("############# RESPONSE JSON ###############");
    console.log(json);
  };

  _renderScrollView = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: styleMainColor }}>
        <TextInput
          style={{
            fontWeight: "bold",
            color: "white",
            fontSize: 20,
            fontStyle: "italic",
            textAlign: "center"
          }}
          placeholder="Renseigne ici ton titre!"
          placeholderTextColor="white"
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        {/* <TextInput
          style={{
            color: "white",
            fontSize: 15,
            fontStyle: "italic",
            textAlign: "center"
          }}
          placeholder="Et ton lieu"
          placeholderTextColor="white"
          onChangeText={location => this.setState({ location })}
          value={this.state.location}
        /> */}
        <Picker
          selectedValue={this.state.long}
          onValueChange={itemValue =>
            this.setState({
              location: itemValue.label,
              long: itemValue.long,
              lat: itemValue.lat
            })
          }
        >
          <Picker.Item label="Dans quelle ville se déroulera ton évènement?" />
          <Picker.Item
            label="Paris - 1er arrondissement"
            value={{
              label: "Paris - 1er arrondissement",
              long: 2.3488,
              lat: 48.8534
            }}
          />
          <Picker.Item
            label="Paris - 2ème arrondissement"
            value={{
              label: "Paris - 2ème arrondissement",
              long: 2.3,
              lat: 48.8
            }}
          />
          <Picker.Item
            label="Paris - 3ème arrondissement"
            value={{
              label: "Paris - 3ème arrondissement",
              long: 2.37,
              lat: 48.88
            }}
          />
          <Picker.Item
            label="Paris - 4ème arrondissement"
            value={{
              label: "Paris - 4ème arrondissement",
              long: 2.4,
              lat: 48.9
            }}
          />
        </Picker>
        <Text>{this.state.location}</Text>
      </View>

      <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
        <TextInput
          style={globalStyles.h2}
          placeholder="Décris-nous ton évènement en quelques lignes"
          placeholderTextColor={styleMainColor}
          multiline={true}
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
        />

        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Text style={[globalStyles.h3, globalStyles.h3Flex1]}>
            Date de l'évènement
          </Text>
          <DatePicker
            style={globalStyles.datePicker}
            date={this.state.date}
            mode="datetime"
            placeholder="Sélectionne le jour et l'heure"
            format=""
            minDate={Date.now()}
            confirmBtnText="OK"
            cancelBtnText="Annuler"
            is24Hour={true}
            showIcon={false}
            customStyles={{
              dateInput: {
                borderWidth: 0
              },
              dateText: {
                color: styleMainColor
              }
            }}
            onDateChange={date => {
              this.setState({ date: date });
            }}
          />

          {/* <TextInput
            style={[
              globalStyles.textInputLightRectangular,
              globalStyles.textInputLightRectangularFlex1
            ]}
            placeholder="A toi de nous dire"
            placeholderTextColor={styleMainColor}
            onChangeText={date => this.setState({ date })}
            value={this.state.date}
          /> */}
        </View>

        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={[globalStyles.h3, globalStyles.h3Flex1]}>
            Nombre de personnes
          </Text>
          <TextInput
            style={[
              globalStyles.textInputLightRectangular,
              globalStyles.textInputLightRectangularFlex1
            ]}
            placeholder="A toi de nous dire"
            placeholderTextColor={styleMainColor}
            keyboardType="numeric"
            onChangeText={capacity =>
              this.setState({ capacity: Number(capacity) })
            }
            numeric
            value={this.state.capacity}
          />
          {console.log(this.state)}
        </View>

        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={[globalStyles.h3, globalStyles.h3Flex1]}>
            Type d'évènement
          </Text>
          <TextInput
            style={[
              globalStyles.textInputLightRectangular,
              globalStyles.textInputLightRectangularFlex1
            ]}
            placeholder="A toi de nous dire"
            placeholderTextColor={styleMainColor}
            onChangeText={TypeEventsID => this.setState({ TypeEventsID })}
            value={this.state.TypeEventsID}
          />
        </View>

        <TouchableOpacity
          style={localStyles.button}
          onPress={() => {
            this._addEvent();
          }}
        >
          <Text style={globalStyles.buttonText}> VALIDE </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  render() {
    return <>{this._renderScrollView()}</>;
  }
}

const localStyles = StyleSheet.create({
  button: {
    backgroundColor: styleMainColor,
    borderRadius: 20,
    padding: 10,
    marginTop: 30,
    marginBottom: 10
  }
});
