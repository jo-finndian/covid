import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";

const Login = ({navigation}) => {
  const [singupForm, setSignupForm] = useState({
    email: "",
    password: "",
  });

  const onChangeTextEmail = (email) => {
    setSignupForm({
      ...singupForm,
      email,
    });
  };
  const onChangeTextPassword = (password) => {
    setSignupForm({
      ...singupForm,
      password,
    });
  };

  var isLoggedIn ;
  
  const loginHandler = () => {
    return new Promise(() => {
      firebase
        .auth()
        .signInWithEmailAndPassword(singupForm.email, singupForm.password)
        .then((res) => {
          navigation.navigate("Home", {
            screen: "Global",
            params: { email: res.user.email },
          });
          isLoggedIn = true;
        })
        .catch((err) => alert(err.message));
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={onChangeTextEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={onChangeTextPassword}
      />
      <TouchableOpacity style={styles.button} onPress={loginHandler}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Signup");
        }}
      >
        <Text style={styles.link, styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkslateblue",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 40,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "mediumpurple",
    borderRadius: 40,
    marginBottom: 10,
    padding: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
});
