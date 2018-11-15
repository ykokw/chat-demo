import { createStackNavigator } from "react-navigation";

import HomeScreen from "./screens/Home";
import ThreadScreen from "./screens/Thread";

export default createStackNavigator(
  {
    Home: HomeScreen,
    Thread: {
      screen: ThreadScreen,
      navigationOptions: {
        title: "Thread"
      }
    }
  },
  {
    initialRouteName: "Home"
  }
);
