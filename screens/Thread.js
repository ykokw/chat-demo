import React from "react";
import {
  KeyboardAvoidingView,
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  StyleSheet
} from "react-native";

import { db } from "../services/db";

const ThreadItem = ({ item }) => (
  <View style={styles.listItemContainer}>
    <Text style={styles.listItem}>{item.text}</Text>
  </View>
);

class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      messages: []
    };
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleSubmitText = this.handleSubmitText.bind(this);

    // メッセージが追加されたときのイベントリスナーを用意
    this.messagePath = `rooms/${this.props.navigation.getParam('roomId', '')}/messages`;
    db.collection(this.messagePath)
      .orderBy("created_at")
      .onSnapshot(snapshot => {
        this.setState({
          text: '',
          messages: snapshot.docs.map(doc => doc.data())
        });
      });
  }

  handleChangeText(text) {
    this.setState({
      text
    });
  }

  handleSubmitText() {
    // messages コレクションにデータを保存
    db.collection(this.messagePath).add({
      text: this.state.text,
      created_at: new Date()
    });
  }

  componentDidMount() {
    console.log(this.props.navigation.getParam('roomId', ''));
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        contentContainerStyle={styles.thread}
        style={styles.thread}
      >
        <FlatList
          style={styles.list}
          data={this.state.messages}
          renderItem={ThreadItem}
        />
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="comment..."
            onChangeText={this.handleChangeText}
          />
          <Button
            title="submit"
            onPress={this.handleSubmitText}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  thread: {
    flex: 1
  },
  list: {
    flex: 1,
    backgroundColor: "#CCC"
  },
  listItem: {
    fontSize: 18
  },
  listItemContainer: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    height: 50
  },
  textInputContainer: {
    height: 50,
    flexDirection: "row",
    backgroundColor: "#FFF"
  },
  textInput: {
    flex: 1
  },
  submitButton: {
    width: 60,
    backgroundColor: "#555"
  }
});

export default Thread;
