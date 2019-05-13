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

const res =
  [
  {
      "ID": 1,
      "name": "soirée",
      "created_at": null,
      "updated_at": null,
      "EventID": null
  },
  {
      "ID": 2,
      "name": "ciné",
      "created_at": null,
      "updated_at": null,
      "EventID": null
  },
  {
      "ID": 3,
      "name": "parc",
      "created_at": null,
      "updated_at": null,
      "EventID": null
    }
]

export default class App extends Component {
  static navigationOptions = {
    title: "NOUVEL EVENEMENT"
  };

  constructor(props) {
    super(props);
    this.state = {
      searchedLocation: "",
      name: "",
      description: "",
      location: "",
      long: "",
      lat: "",
      date: "",
      capacity: "",
      typeEvent: "",
      TypeEventsID: "",
      fetchedData: false
    };
    this.resultToSearchLocation = [];
    this._listTypesEvents = [];
  }

  componentDidMount = async() => {
    await this._fetchAllTypesEvents()
  }

  // TODO: POST NEW EVENT
  _addEvent = async () => {
    const response = await fetch("https://racolapp.herokuapp.com/users", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(this.state)
    });
    const json = await response.json();

    // TODO
    // console.log("############# RESPONSE JSON ###############");
    // console.log(json);

    // TODO: personnaliser l'alerte?
    if (json.error) {
      Alert.alert(
        "Impossible d'ajouter m'évènement",
        "Vérifiez les informations saisies",
        [
          {
            text: "OK",
            onPress: () => console.log("Add event error - OK pressed")
          }
        ]
      );
    }
  };

  _fetchAllTypesEvents = async () => {
    const response = await fetch("https://racolapp.herokuapp.com/typeevents", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "GET",
    });
    const json = await response.json();

    if (json.error){
      console.log("Fetch events types failed")
      console.log(json.error)
    }
    else {
      this._listTypesEvents = json.data
      this.setState({fetchedData: true})
    }
  };

  _fetchListLocations = async adress => {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${adress}`,
      {
        headers: {
          "Content-Type": "application/json"
        },
        method: "GET"
      }
    );
    const json = await response.json();

    // HANDLE NO API RESPONSE
    if (json.title == "Missing query" || json.features.length == 0) {
      console.log("No API response")
    }
    else {
      this.resultToSearchLocation = json.features;
    }
  };

  _mapListResultLocation = () => {
    try {
      return this.resultToSearchLocation.map(item => {
        return (
          <Picker.Item
            label={item.properties.label}
            key={item.properties.id}
            value={item.properties.label}
            color={styleMainColor}
          />
        );
      });
    } catch (err) {
      console.log("Fetch api adress failed");
      console.log(err.message);
    }
  };

  _mapListTypesEvents = () => {
    try {
      return this._listTypesEvents.map(item => {
        return (
          <Picker.Item
            label={item.name}
            key={item}
            value={item.name}
            color={styleMainColor}
          />
        );
    });
    } catch (err) {
      console.log("Fetch api Type Event failed");
      console.log(err.message);
    }
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
          placeholder="Renseigne ICI ton titre!"
          placeholderTextColor="white"
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
      </View>

      <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
        <TextInput
          style={globalStyles.h2}
          placeholder="Décris-nous ICI ton évènement en quelques lignes"
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
            // minDate={Date.now()} // not compatible?
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
              },
              placeholderText: {
                color: styleMainColor
              }
            }}
            onDateChange={date => {
              this.setState({ date: date });
            }}
          />
        </View>

        <View style={{ borderWidth: 1, borderColor: styleMainColor }} />

        <View>
          <Text style={[globalStyles.h2]}>
            Lieu de l'évènement
          </Text>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={[globalStyles.h3, globalStyles.h3Flex1]}>
              Renseignes ici les 1ères lettres
            </Text>
            <TextInput
              style={[
                globalStyles.textInputLightRectangular,
                globalStyles.textInputLightRectangularFlex1
              ]}
              placeholder="A toi de nous dire"
              placeholderTextColor={styleMainColor}
              onChangeText={searchedLocation => {
                this.setState({ searchedLocation });
                this._fetchListLocations(this.state.searchedLocation);
              }}
              value={this.state.searchedLocation}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={[globalStyles.h3, globalStyles.h3Flex1]}>
              Puis choisi le bon lieu
            </Text>
            <View style={{ flex: 1 }}>
            <Picker
              selectedValue={this.state.location}
              onValueChange={(value, key) => {
                this.setState({
                  location: value,
                  long: this.resultToSearchLocation[key].geometry.coordinates[0],
                  lat: this.resultToSearchLocation[key].geometry.coordinates[1],
                });
              }}
            >
              {this._mapListResultLocation()}
            </Picker>
            </View>
          </View>
        </View>

        <View style={{ borderWidth: 1, borderColor: styleMainColor }} />

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
            value={this.state.capacity}
          />
        </View>

        {/* <View style={{ flex: 1, flexDirection: "row" }}>
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
        </View> */}

        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={[globalStyles.h3, globalStyles.h3Flex1]}>
            Choisi le type de l'évènement
            </Text>
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={this.state.typeEvent}
              onValueChange={(value, key) => {
                this.setState({
                  typeEvent: value,
                  TypeEventsID: this._listTypesEvents[key].ID
                });
              }}
            >
              {this._mapListTypesEvents()}
            </Picker>
          </View>
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
      {console.log("this.state")}
      {console.log(this.state)}
      {/* {console.log(this.resultToSearchLocation)} */}
    </ScrollView>
  );

  render() {
    return <>
    {this.state.fetchedData == true && this._renderScrollView()}
    </>;
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
