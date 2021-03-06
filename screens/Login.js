import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import firebase from "firebase";
import { Google } from "expo";
import { db } from "../services/db";

const clientIds = {
  androidClientId: process.env.ANDROID_CLIENT_ID,
  iosClientId: process.env.IOS_CLIENT_ID
};

const signUpWithGoogleAccount = async nav => {
  try {
    const result = await Google.logInAsync({
      // FIXME: https://github.com/expo/expo/issues/2678#issuecomment-440531616
      behavior: "web",
      androidClientId: clientIds.androidClientId,
      iosClientId: clientIds.iosClientId,
      scopes: ["profile", "email"]
    });
    if (result.type === "success") {
      const { idToken } = result;
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
      const user = await firebase.auth().signInWithCredential(credential);
      // user情報をfirestoreに保存
      await db.collection('users').doc(user.uid).set({ email: user.email })
      nav.navigate("Home");
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    console.log(e);
    return { error: true };
  }
};

class Login extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.login}>
        <Text style={styles.title}>chat-demo</Text>
        <Button
          title="Sign up with Google account"
          onPress={() => signUpWithGoogleAccount(navigation)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  login: {
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

export default Login;
