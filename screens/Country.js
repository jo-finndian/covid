import React, {useEffect, useRef, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  Dimensions, 
  ImageBackground, 
  View, 
  ScrollView, 
  Animated,
  AsyncStorage } 
from "react-native";
import { useIsFocused } from "@react-navigation/native";

export default function Country ({ navigation, props }) {
  var [country, setCountry] = useState();

  var [active, setActive] = useState();
  var [recovered, setRecovered] = useState();
  var [confirmed, setConfirmed] = useState();
  var [deaths, setDeaths] = useState();
  var [newDeaths, setNewDeaths] = useState();
  var [newCases, setNewCases] = useState();
  var [mortalityRate, setMortality] = useState();

  async function fetchInfo() {
    const countryStored = await AsyncStorage.getItem("country");

    setCountry(countryStored);

    console.log("data fetched");
  }

  fetchInfo();

  const url = "https://covid-19-tracking.p.rapidapi.com/v1/" + country;

  // api fetch call
  const fetchApiCall = () => {
    fetch(url, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "covid-19-tracking.p.rapidapi.com",
        "x-rapidapi-key": "f08704135emsh71b036d8723772fp11defcjsna39e16a56750"
      }
    })
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        setActive(response["Active Cases_text"]);
        setRecovered(response["Total Recovered_text"]);
        setConfirmed(response["Total Cases_text"]);
        setDeaths(response["Total Deaths_text"]);
        setNewDeaths(response["New Deaths_text"]);
        setNewCases(response["New Cases_text"]);

        var num1 = confirmed.replace(',', '');
        var num2 = deaths.replace(',', '');
    
        var num3 = (num2 / num1) * 100;
    
        num3 = Math.round(num3 * 100) / 100;
        
        setMortality(num3+"%");
      })
      .catch(err => {
        console.log(err);
      });
  }

  fetchApiCall();
  
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const isFocused = useIsFocused();

  // animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    return () => fadeAnim.setValue(0); //checking to see if checking out of navigation, and resetting
  }, [fadeAnim, isFocused]);
  
  return (
    <View style={styles.container}>
      <ImageBackground source={require("../assets/images/covid-bg-dark.png")} style={styles.image}>
      <Animated.View   style={{
        backgroundColor: "white",
        height: Dimensions.get("window").height - 140,
        width: Dimensions.get("window").width - 40,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
          },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
        opacity: fadeAnim,
        transform: [
          {
          translateX: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
          }),
          },
        ],
        }}>
        <Text style={styles.title}>Country Covid Rates</Text>

        <ScrollView style={styles.scrollView}>

          <View style={styles.row}>
            <Text style={styles.subtitle}>Active</Text>
            <Text style={styles.rate}>{active}</Text>
            <Text style={ styles.diff}>{newCases}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.subtitle }>Recovered</Text>
            <Text style={styles.rate }>{recovered}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.subtitle}>Confirmed</Text>
            <Text style={styles.rate}>{confirmed}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.subtitle}>Deaths</Text>
            <Text style={styles.rate}>{deaths}</Text>
            <Text style={styles.diff}>{newDeaths}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.subtitle}>Mortality Rate</Text>
            <Text style={styles.rate}>{mortalityRate}</Text>
          </View>
        </ScrollView>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

// export default Country;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  image: {
    alignItems: "center",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  scrollView: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignContent: "center",
  },
  button: {
    backgroundColor: "mediumpurple",
    borderRadius: 40,
    marginBottom: 10,
    padding: 20,
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
    width: 100,
    fontSize: 20,
    marginVertical: 40,
    marginHorizontal: 30,
    fontWeight: "bold",
  },
  rate: {
    width: 100,
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 40,
  },
  diff: {
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 40,
  } 
});