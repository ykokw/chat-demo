import React from "react";
import { StyleSheet, View, Button, FlatList } from "react-native";
import { Permissions, Notifications } from "expo";
import firebase from "firebase";

import { db } from "../services/db";

const saveDeviceToken = async (token) => {
  try {
    // Firestore にデバイストークンを保存
    const docRef = await db.collection("tokens").add({ token })
    console.log(`document written with ID:${docRef}`); // デバッグ用
  } catch (err) {
    console.error(`error: ${err}`);
  }
};


// デバイストークンを端末から取得して Firebase に保存する処理
const registerForPushNotificationsAsync = (navigation) => {
  return async () => {
    // プッシュ通知のパーミッションを取得
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // すでにプッシュ通知が許可されていればなにもしない
    if (existingStatus !== "granted") {
      // (iOS向け) プッシュ通知の許可をユーザーに求める
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // プッシュ通知が許可されなかった場合なにもしない
    if (finalStatus !== "granted") {
      return;
    }

    // Expo 用のデバイストークンを取得
    const token = await Notifications.getExpoPushTokenAsync();

    // Firebase にデバイストークンを保存するメソッドを呼び出す
    saveDeviceToken(token);

    // React Navigation で画面遷移
    // navigation.navigate("Thread");
  };
};


const RoomItem = ({ room, navigation }) => {
  return (
  <View style={styles.listItemContainer}>
    <Button title={room.name || ""} style={styles.listItem} onPress={() => handleSelectRoom(room.id, navigation)} />
  </View>
  );
}

const handleSelectRoom = (id, navigation) => {
  navigation.navigate("Thread", { roomId: id });
}

const handleSignOut = async () => {
  await firebase.auth().signOut();
}

class Home extends React.Component {
  static navigationOptions = {
    title: "chat-demo: HOME",
    headerRight: <Button title="logout" onPress={() => handleSignOut()}/>
  }
  constructor(props) {
    super(props);
    this.state = {
      rooms: []
    };
    db.collection("rooms")
      .onSnapshot(snapshot => {
        this.setState({
          rooms: snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }))
        });
      });
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.home}>
        <FlatList
          style={styles.list}
          data={this.state.rooms}
          renderItem={({ item }) => <RoomItem room={{...item}} navigation={navigation} />}
        />
        {/*
        <Text>This app use push notification for notify new messages.</Text>
        </View><Text>Please enable push notification when you starting chat-demo</Text>
        </View><Button
        </View>  title="Start with push notification"
        </View>  onPress={registerForPushNotificationsAsync(navigation)}
        </View>
        */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: "#CCC"
  },
  listItem: {
    fontSize: 18,
  },
  listItemContainer: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    height: 50
  },
});

export default Home;
