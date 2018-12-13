import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { Permissions, Notifications } from "expo";

import { db } from "../services/db";

const saveDeviceToken = async (token) => {
  try {
    // Firestore にデバイストークンを保存
    const docRef = await db.collection("tokens").add({ token })
    console.log(`document written with ID:${docRef}`); // デバッグ用
  } catch (err) {
    console.error(`error: ${err}`);
  }
};


// デバイストークンを端末から取得して Firebase に保存する処理
const registerForPushNotificationsAsync = (navigation) => {
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

    // Expo 用のデバイストークンを取得
    const token = await Notifications.getExpoPushTokenAsync();

    // Firebase にデバイストークンを保存するメソッドを呼び出す
    saveDeviceToken(token);

    // React Navigation で画面遷移
    navigation.navigate("Thread");
  };
};

const Home = ({ navigation }) => (
  <View style={styles.home}>
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
});

export default Home;
