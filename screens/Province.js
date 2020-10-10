import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView, ImageBackground, Animated, AsyncStorage } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import firebase from "firebase";

export default function Province ({ navigation }) {
  
  var [province, setProv] = useState();

  var [active, setActive] = useState();
  var [newActive, setNewActive] = useState();
  var [recovered, setRecovered] = useState();
  var [newRecovered, setNewRecovered] = useState();
  var [confirmed, setConfirmed] = useState();
  var [deaths, setDeaths] = useState();
  var [newDeaths, setNewDeaths] = useState();
  var [newCases, setNewCases] = useState();
  var [mortalityRate, setMortality] = useState();

  async function fetchInfo() {
    const provStored = await AsyncStorage.getItem("province");

    setProv(provStored);

    console.log("data fetched");
  }

  fetchInfo();

  const url = "https://covid-19-statistics.p.rapidapi.com/reports?region_province=" + province + "&iso=CAN&region_name=Canada";

  // api fetch call
  const fetchApiCall = () => {
    fetch("https://covid-19-statistics.p.rapidapi.com/reports?region_province=Ontario&iso=CAN&region_name=Canada", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
        "x-rapidapi-key": "f08704135emsh71b036d8723772fp11defcjsna39e16a56750"
      }
    })
      .then(response => response.json())
      .then(response => {
        // console.log(response["data"][0]["active"]);
        setActive(response["data"][0]["active"]);
        setNewActive(response["data"][0]["active_diff"]);
        setRecovered(response["data"][0]["recovered"]);
        setNewRecovered(response["data"][0]["recovered_diff"]);
        setConfirmed(response["data"][0]["confirmed"]);
        setDeaths(response["data"][0]["deaths"]);
        setNewDeaths(response["data"][0]["deaths_diff"]);
        setNewCases(response["data"][0]["confirmed_diff"]);

        var fatality = response["data"][0]["fatality_rate"];
        var num = fatality * 100;
        
        setMortality(num + "%");
      })
      .catch(err => {
        console.log(err);
      });
  }

  fetchApiCall();

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const isFocused = useIsFocused();

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
        <Text style={styles.title}>Provincial Covid Rates</Text>

        <ScrollView style={styles.scrollView}>

          <View style={styles.row}>
            <Text style={styles.subtitle}>Active</Text>
            <Text style={styles.rate}>{active}</Text>
            <Text style={ styles.diff}>{newActive}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.subtitle }>Recovered</Text>
            <Text style={styles.rate }>{recovered}</Text>
            <Text style={styles.diff }>{newRecovered}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.subtitle}>Confirmed</Text>
            <Text style={styles.rate}>{confirmed}</Text>
            <Text style={styles.diff}>{newCases}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.subtitle}>Deaths</Text>
            <Text style={styles.rate}>{deaths}</Text>
            <Text style={styles.diff}>{newDeaths}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.subtitle}>Fatality Rate</Text>
            <Text style={styles.rate}>{mortalityRate}</Text>
          </View>
        </ScrollView>
      </Animated.View>
      </ImageBackground>
    </View>
  );
};

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
  mainCard: {
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
  },
  scrollView: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignContent: "center",
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
    marginVertical: 35,
    marginHorizontal: 30,
    fontWeight: "bold",
  },
  rate: {
    width: 100,
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 35,
  },
  diff: {
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 35,
  } 
});
