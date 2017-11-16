// Initialize Firebase
const config = {
	apiKey: "AIzaSyDOzeFUxECaCJobCKCj77iGEi5GYQSB4ds",
	authDomain: "multiplayer-rps-df38e.firebaseapp.com",
	databaseURL: "https://multiplayer-rps-df38e.firebaseio.com",
	projectId: "multiplayer-rps-df38e",
	storageBucket: "multiplayer-rps-df38e.appspot.com",
	messagingSenderId: "1075181514713"
};

firebase.initializeApp(config);
const dataBase = firebase.database();

// setting up initial connection state

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
const connectionsRef = dataBase.ref('/connections');
// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
const connectedRef = dataBase.ref(".info/connected");
// This is incredibly important because it is a reference to the connectionsRef
let curConnect, connectId;

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
	if (snap.val()) {
		connectedId = connectionsRef.push(true).key;
		curConnect = connectionsRef.child(connectedId);
		// console.log(curConnect);
		curConnect.onDisconnect().remove();
		console.log(connectionsRef);
		console.log(curConnect.parent);
	}
});

// we only checked this once
connectionsRef.once('value').then(function(snapshot) {
	if (snapshot.numChildren() > 2) {
		connectionsRef.child(connectedId).remove();
	}
})


dataBase.ref().once('value').then(function(snapshot) {
	if (!snapshot.child('message').exists()) {
		console.log('data path, message exists,  ' + !snapshot.child('message').exists());
		console.log(snapshot.child('message').exists());
		console.log(snapshot);
	}
	if (!snapshot.child('gameRecord').exists()) {
		console.log('data path, message exists,  ' + !snapshot.child('gameRecord').exists());
	}
	if (!snapshot.child('gameInstance').exists()) {
		console.log('data path, message exists,  ' + !snapshot.child('gameInstance').exists());
	}
	// if (snapshot.child('gameRecord').numChildren <= 1) {
	// 	dataBase.ref('gameRecord').set({
	// 		'turn': 0
	// 	});
	// }
	// console.log(snapshot.child('message').exists());
	// console.log(snapshot.child('gameRecord').exists());
	return;
});

// dataBase.ref().once('child_added').then(function(snapshot) {
// 	if (!snapshot.child('message').exists()) {
// 		console.log('data path, message exists,  ' + !snapshot.child('message').exists());
// 		console.log(snapshot.child('message').exists());
// 		console.log(snapshot);
// 	}
// 	if (!snapshot.child('gameRecord').exists()) {
// 		console.log('data path, message exists,  ' + !snapshot.child('gameRecord').exists());
// 	}
// 	if (!snapshot.child('gameInstance').exists()) {
// 		console.log('data path, message exists,  ' + !snapshot.child('gameInstance').exists());
// 	}
// 	// if (snapshot.child('gameRecord').numChildren <= 1) {
// 	// 	dataBase.ref('gameRecord').set({
// 	// 		'turn': 0
// 	// 	});
// 	// }
// 	// console.log(snapshot.child('message').exists());
// 	// console.log(snapshot.child('gameRecord').exists());
// 	return;
// });


//////////////////////////ASSSSYYYYYYYYYNCCCCCCCCCCC so beautiful

async function FirstAsync() {
	const blah = "Yay Promise";
	console.log('ASyNC is AWWWWWWWESOME');
	return blah;
}

FirstAsync().then(function(promise) {
	console.log(promise);
});

