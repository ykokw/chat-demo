import React from 'react';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from './screens/Home';
import ThreadScreen from './screens/Thread';

const Navigator = createStackNavigator({
  Home: HomeScreen,
  Thread: {
    screen: ThreadScreen,
    navigationOptions: {
      title: 'Thread',
    }
  },
}, {
  initialRouteName: 'Home',
});

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return <Navigator />;
  }
}

export default App;
// export default createStackNavigator({
//   Home: HomeScreen,
// }, {
//   initialRouteName: 'Home',
// })
