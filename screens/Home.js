import React from "react";
import { StyleSheet, View, Button, FlatList } from "react-native";
import { Permissions, Notifications } from "expo";
import firebase from "firebase";

import { db } from "../services/db";

const saveDeviceToken = async (token) => {
  try {
    // token(ExponentPushToken[xxxxx]の形式)からランダム文字列そうなところだけ取り出す
    // firestoreのパスに記号が使えないため
    const tokenDatas = token.match(/ExponentPushToken\[(.*)\]/);
    const actualToken = tokenDatas[1];
    if (!actualToken) return;
    // デバイストークンが保存済みかを確認
    const user = await firebase.auth().currentUser;
    const userRef = db.collection("users").doc(user.uid);
    const userDoc = await userRef.get();
    const userInfo = userDoc.data();
    const currentTokens = userInfo.tokens || [];
    if(!currentTokens[actualToken]) {
      // Firestore にデバイストークンを保存
      currentTokens[actualToken] = true;
      await userRef.update({ tokens: { ...currentTokens }});
    }
  } catch (err) {
    console.error(`device token save error: ${err}`);
  }
};


// デバイストークンを端末から取得して Firebase に保存する処理
const registerForPushNotificationsAsync = () => {
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
  componentDidMount() {
    registerForPushNotificationsAsync()();
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
