
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.onMessageCreate = functions.firestore
    .document("chats/{chatId}/messages/{messageId}")
    .onCreate((snap, context) => {
        // Check if limit is reached
        const newValue = snap.data();
        console.log(newValue);
        const ref = admin.firestore().collection("chats").doc(context.params.chatId).collection("messages")
        .orderBy("timestamp");

        ref.onSnapshot(snapshot => {
            i = 0;
            size = snapshot.size;
            sizeToDelete = size - 10;
            console.log("Messages Count: " + size);
            
            snapshot.forEach((doc) => {
                if (i < sizeToDelete) {
                    doc.ref.delete().then(()=>{
                        console.log("Document successfully deleted");
                    }).catch((error) => {
                        console.log("Error removing document: ", error);
                    });
                }
                i++;  
            });
        });
    });