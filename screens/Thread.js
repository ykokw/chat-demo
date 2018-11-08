import React from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native'

import { db } from '../services/db';

class Thread extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            messages: [],
        };
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleSubmitText = this.handleSubmitText.bind(this);
        db.collection('messages').where('text', '>', '').onSnapshot(collections => {
            const messages = [];
            collections.forEach(doc => messages.push(doc.data()));
            this.setState({
                text: this.state.text,
                messages,
            });
        });
    }
    componentDidMount() {
        db.collection('messages').where('text', '>', '').get().then(collections => {
            const messages = [];
            collections.forEach(doc => messages.push(doc.data()));
            this.setState({
                text: this.state.text,
                messages,
            });
        })
    }
    handleChangeText(text) {
        this.setState({
            text,
        })
    }
    handleSubmitText() {
        db.collection('messages').add({
            text: this.state.text,
        });
    }
    render () {
        return (
            <View style={styles.thread}>
                <FlatList style={styles.list} data={this.state.messages} renderItem={({ item }) => <View style={styles.listItemContainer} ><Text style={styles.listItem}>{item.text}</Text></View>} />
                <View style={styles.textInputContainer}>
                    <TextInput style={styles.textInput} placeholder="comment..." onChangeText={this.handleChangeText} />
                    <Button title="submit" onPress={this.handleSubmitText} style={styles.submitButton} />
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    thread: {
        flex: 1,
        backgroundColor: "#CCC",
    },
    list: {
        flex: 1,
        backgroundColor: '#99C',
    },
    listItem: {
        fontSize: 18,
    },
    listItemContainer: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        height: 50,
    },
    textInputContainer: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#FFF'
    },
    textInput: {
        flex: 1,
    },
    submitButton: {
        width: 60,
        backgroundColor: '#555',
    }
})

export default Thread;