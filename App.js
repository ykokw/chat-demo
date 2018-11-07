import React from 'react';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from './screens/Home';

export default createStackNavigator({
  Home: HomeScreen,
}, {
  initialRouteName: 'Home',
})

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>chat-demo: Open up App.js to start working on your app!!</Text>
//       </View>
//     );
//   }
// }
