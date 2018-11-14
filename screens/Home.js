import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Permissions, Notifications } from 'expo';

import { db } from '../services/db';

function registerForPushNotificationsAsync(navigation) {
    return async () => {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
          // Android remote notification permissions are granted during the app
          // install, so this will only ask on iOS
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
          return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
  
        db.collection('tokens').add({
            token,
        })
        .then(docRef => console.log(`document written with ID:` + docRef))
        .catch(err => console.error(`error: ${err}`));

        // UI待ちを防ぐためにすぐnavigate
        navigation.navigate('Thread');
    }
}

const Home = ({ navigation }) => (
    <View style={styles.home}>
        <Text style={styles.title}>chat-demo</Text>
        <Text>This app use push notification for notify new messages.</Text>
        <Text>Please enable push notification when you starting chat-demo</Text>
        <Button title="Start with push notification" onPress={registerForPushNotificationsAsync(navigation)} />
    </View>
);

const styles = StyleSheet.create({
    home: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
    }
});

export default Home;