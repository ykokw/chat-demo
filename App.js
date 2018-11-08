import React from 'react';
import { createStackNavigator } from 'react-navigation';
import firebase from 'firebase';

import HomeScreen from './screens/Home';
import ThreadScreen from './screens/Thread';

const Navigator = createStackNavigator({
  Home: HomeScreen,
  Thread: ThreadScreen,
}, {
  initialRouteName: 'Home',
});

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const config = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
    }
    firebase.initializeApp(config);
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
