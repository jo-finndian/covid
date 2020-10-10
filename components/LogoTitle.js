import React from "react";
import { Image } from "react-native";

export default function LogoTitle() {
  return (
    <Image
      style={{ width: 45, height: 45 }}
      source={require("../assets/images/humber.png")}
    />
  );
}
