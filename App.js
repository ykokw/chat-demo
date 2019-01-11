import { createStackNavigator, createSwitchNavigator } from "react-navigation";

import LoadingScreen from "./screens/Loading";
import HomeScreen from "./screens/Home";
import ThreadScreen from "./screens/Thread";
import LoginScreen from "./screens/Login";

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Thread: {
    screen: ThreadScreen,
    navigationOptions: {
      title: "Thread"
    }
  }
});

const AuthStack = createStackNavigator({
  Login: LoginScreen
});

export default createSwitchNavigator(
  {
    InitialLoading: LoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "InitialLoading"
  }
);
