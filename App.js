import { createStackNavigator } from "react-navigation";

import HomeScreen from "./screens/Home";
import ThreadScreen from "./screens/Thread";
import LoginScreen from './screens/Login';

export default createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen,
    Thread: {
      screen: ThreadScreen,
      navigationOptions: {
        title: "Thread"
      }
    }
  },
  {
    initialRouteName: "Login"
  }
);
