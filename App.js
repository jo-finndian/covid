import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AntDesign, Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Settings from "./screens/Settings";
import Global from "./screens/Global";
import Country from "./screens/Country";
import Province from "./screens/Province";

import Login from "./screens/Login";
import Signup from "./screens/Signup";

import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8JuBeYg89lGZjgBLxFp6x90CGIsaghU0",
  authDomain: "smannila-7be39.firebaseapp.com",
  databaseURL: "https://smannila-7be39.firebaseio.com",
  projectId: "smannila-7be39",
  storageBucket: "smannila-7be39.appspot.com",
  messagingSenderId: "259311576564",
  appId: "1:259311576564:web:7fc11b29038d6f8d4b05a1",
  measurementId: "G-X7P36WMSDN"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Drawer = createDrawerNavigator();
const RootTab = createBottomTabNavigator();

const RootTabNavigator = () => {
  return (
    <RootTab.Navigator
      tabBarOptions={{
        activeTintColor: "purple",
        inactiveTintColor: "gray",
      }}
    >
      <RootTab.Screen 
        name="Global" 
        component={Global} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="globe" size={24} color={focused ? "purple" : "gray"} />
          ),
      }}/>

      <RootTab.Screen 
        name="Country" 
        component={Country} 
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign name="flag" size={24} color={focused ? "purple" : "gray"} />
          ),
      }}/>

      <RootTab.Screen 
        name="Province" 
        component={Province} 
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="city-variant-outline" size={24} color={focused ? "purple" : "gray"} />
          ),
      }}/>
    </RootTab.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Log Out"
        onPress={() => {
          console.log("logout");
          firebase
            .auth()
            .signOut()
            .then(() => {
              console.log("Signout successfull!");
              // props.navigation('Login');
              props.navigation.closeDrawer();
            })
            .catch((err) => alert(err.message));
        }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
      <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={RootTabNavigator} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Signup" component={Signup} />
    </Drawer.Navigator>   
  );
};

export default function App() {

  return (
    <NavigationContainer >
      <DrawerNavigator />
    </NavigationContainer>
  );

}