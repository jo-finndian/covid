import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  AsyncStorage,
  ImageBackground
} from "react-native";

export default function Settings({ navigation }) {
  var [country, setCountry] = useState();
  var [province, setProvince] = useState(); 

  const updateInfo = () => {
    console.log(country)
    console.log(province)
    updateAsyncStorage(country, province);
  }

  function updateAsyncStorage(country, province) {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem("country");
        await AsyncStorage.removeItem("province");

        await AsyncStorage.setItem("country", country);
        await AsyncStorage.setItem("province", province);
        
        console.log("async updated successfully");
        fetchInfo();
        return resolve(true);
      } catch (e) {
        return reject(e);
      } 
    }); 
  };
  
  async function fetchInfo() {
    const countryStored = await AsyncStorage.getItem("country");
    const provStored = await AsyncStorage.getItem("province");

    if (countryStored) {
      setCountry(countryStored);
      setProvince(provStored);
    }

    console.log("data fetched. Country: " + countryStored + " Province: " + provStored);
  }

  useEffect(() => {
    fetchInfo();
  }, []);


  return (
    <View style={styles.mainCard}>
      <Text style={styles.title}>Settings</Text>

      <ImageBackground source={require("../assets/images/covid-bg-light.png")} style={styles.image}>
      <View style={styles.scrollView}>
      <Text style={styles.subtitle}>Location Information</Text>
        <TextInput
          onChangeText={province => setProvince(province)}
          placeholder={province}
          style={styles.input}
        />
        <TextInput
          onChangeText={country => setCountry(country)}
          placeholder={country}
          style={styles.input}
        />
        <TouchableOpacity style={styles.btnSave} onPress={updateInfo}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Global')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
    </View>
  );

};

const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: "white",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    alignContent: "center",
    backgroundColor: "white",
  },
  image: {
    alignItems: "center",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  scrollView: {
    backgroundColor: "rgba(255,255,255, 1)",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    height: Dimensions.get("window").height-250,
    width: Dimensions.get("window").width - 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
      },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
    backgroundColor: "whitesmoke",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  subtitle: {
    marginBottom: 30,
    fontSize: 20,
    marginHorizontal: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 40,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
      },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
  btn: {
    backgroundColor: "#7100B7",
    borderRadius: 40,
    marginBottom: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
      },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnSave: {
    backgroundColor: "#01B289",
    borderRadius: 40,
    marginBottom: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
      },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
});