import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AppButton(props) {
  return (
    <TouchableOpacity
      style={styles.counterBtn}
      onPress={props.countIncrementHandler}
    >
      <Text style={styles.counterBtnText}>Press here</Text>
    </TouchableOpacity>
  );
}
// test github
const styles = StyleSheet.create({
  counterBtn: {
    marginTop: 10,
    backgroundColor: "purple",
    padding: 20,
  },
  counterBtnText: {
    color: "white",
  },
});
