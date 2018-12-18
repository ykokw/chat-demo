import { createStackNavigator, createSwitchNavigator } from "react-navigation";

import HomeScreen from "./screens/Home";
import ThreadScreen from "./screens/Thread";
import LoginScreen from "./screens/Login";

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Thread: {
    screen: ThreadScreen,
    navigationOptions: {
      title: "HOME"
    }
  }
});

const AuthStack = createStackNavigator({
  Login: LoginScreen
});

export default createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: "Auth"
  }
);
