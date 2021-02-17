import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating color={"green"} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: '5%',
    width: '100%'
  },
});
