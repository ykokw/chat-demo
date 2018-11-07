import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const Home = () => (
    <View style={styles.home}>
        <Text>Hello chat-demo</Text>
        <Text>This app use push notification for notify new messages.</Text>
        <Text>Please enable push notification when you starting chat-demo</Text>
        <Button title="Start with push notification" onPress={() => {}} />
    </View>
);

const styles = StyleSheet.create({
    home: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Home;