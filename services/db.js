import 'firebase/firestore';

import firebase from './firebase';

const dbSettings = { timestampsInSnapshots: true };

export const db = firebase.firestore();
db.settings(dbSettings);
