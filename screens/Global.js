import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView, ImageBackground, Animated, AsyncStorage } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import firebase from "firebase";

export default function Global ({ navigation, route }) {
  
  var [active, setActive] = useState();
  var [newActive, setNewActive] = useState();
  var [recovered, setRecovered] = useState();
  var [newRecovered, setNewRecovered] = useState();
  var [confirmed, setConfirmed] = useState();
  var [deaths, setDeaths] = useState();
  var [newDeaths, setNewDeaths] = useState();
  var [newCases, setNewCases] = useState();
  var [mortalityRate, setMortality] = useState();

  //API fetch
  const fetchApiCall = () => {
    fetch("https://covid-19-statistics.p.rapidapi.com/reports/total", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
        "x-rapidapi-key": "f08704135emsh71b036d8723772fp11defcjsna39e16a56750"
      }
    })
      .then(response => response.json())
      .then(response => {
        // console.log(response["data"]["active"]);
        setActive(response["data"]["active"]);
        setNewActive("+" + response["data"]["active_diff"]);
        setRecovered(response["data"]["recovered"]);
        setNewRecovered("+" + response["data"]["recovered_diff"]);
        setConfirmed(response["data"]["confirmed"]);
        setDeaths(response["data"]["deaths"]);
        setNewDeaths("+" + response["data"]["deaths_diff"]);
        setNewCases("+" + response["data"]["confirmed_diff"]);

        var fatality = response["data"]["fatality_rate"];
        var num = fatality * 100;
        
        setMortality(num + "%");
      })
      .catch(err => {
        console.log(err);
      });
  }

  const [userInfo, setUserInfo] = useState();

  //get user info from Firebase
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        !userInfo ? setUserInfo(user) : null;
      }
      else {
        navigation.navigate("Login");
      }
    });
  }, [userInfo]);

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const isFocused = useIsFocused();

  //animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    return () => fadeAnim.setValue(0); //checking to see if checking out of navigation, and resetting
  }, [fadeAnim, isFocused]);

  //call API function
  fetchApiCall();

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
        <Text style={styles.title}>Global Covid Rates</Text>

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
    marginHorizontal: 20,
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
