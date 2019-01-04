import React from "react";
import firebase from "firebase";
import {
  ActivityIndicator,
  View
} from "react-native";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        this.props.navigation.navigate("Home");
        return;
      }
      this.props.navigation.navigate("Login");
    });
  }

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}

export default AuthLoadingScreen;
