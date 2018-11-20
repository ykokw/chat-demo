import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { Permissions, Notifications } from "expo";

import { db } from "../services/db";

function saveDeviceToken(token) {
    // Firestoreにデバイストークンを保存
    db.collection("tokens")
      .add({ token })
      .then(docRef => console.log(`document written with ID:${docRef}`))
      .catch(err => console.error(`error: ${err}`));
}

function registerForPushNotificationsAsync(navigation) {
  return async () => {
    // プッシュ通知のパーミッションを取得
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // すでにプッシュ通知が許可されていればなにもしない
    if (existingStatus !== "granted") {
      // (iOS向け) プッシュ通知の許可をユーザーに求める
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // プッシュ通知が許可されなかった場合なにもしない
    if (finalStatus !== "granted") {
      return;
    }

    // Expo用のデバイストークンを取得
    const token = await Notifications.getExpoPushTokenAsync();

    // Firebaseにデバイストークンを保存
    saveDeviceToken(token);

    // UI待ちを防ぐためにすぐnavigate
    navigation.navigate("Thread");
  };
}

const Home = ({ navigation }) => (
  <View style={styles.home}>
    <Text style={styles.title}>chat-demo</Text>
    <Text>This app use push notification for notify new messages.</Text>
    <Text>Please enable push notification when you starting chat-demo</Text>
    <Button
      title="Start with push notification"
      onPress={registerForPushNotificationsAsync(navigation)}
    />
  </View>
);

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    marginBottom: 24
  }
});

export default Home;
