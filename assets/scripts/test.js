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


// dataBase.ref().once('value').then(function(snapshot) {
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


//////////////////////////ASSSSYYYYYYYYYNCCCCCCCCCCC so beautifulx

// async function FirstAsync() {
// 	const blah = "Yay Promise";
// 	let string = await timeOUT();
// 	console.log(string);
// 	console.log('ASyNC is AWWWWWWWESOME');
// 	return blah;
// }

// FirstAsync().then(function(promise) {
// 	console.log(promise);
// });


// function timeOUT() {
// 	return new Promise(resolve => {
// 		setTimeout(function() {
// 			resolve('Hello, thank you for your patience');
// 		}, 5000);
// 	})
// }






// // function timeOUT() {
// // 	return new Promise(resolve => {
// // 		setTimeout(function() {
// // 			console.log('Whooo, 10seconds past~');
// // 			resolve();
// // 		}, 10000);
// // 	})
// // }

// let player, opponent, actionCue = 0,
// 	temp;
// // download both player and opponent name to the game
// // should probably use a different handler to manage event fire
// connectionsRef.on("value", recordCurPlayer);

// connectionsRef.on("value", function(snapshot) {
// 	const 


// });








// async function recordCurPlayer(playerSnapshot) {
// 	const curPlayerIds = Object.getOwnPropertyNames(playerSnapshot.val());

// 	// await for logPlayerToLocal to resolve, which will return true or false, if false return
// 	// will need to wait til this is resolved
// 	await logPlayerToLocal(curPlayerIds, playerSnapshot)
// 		.then(function() {
// 			gameInit(player, opponent);
// 		}).catch();

// }

// function logPlayerToLocal(curPlayerIds, playerSnapshot) {
// 	return new Promise((resolve, reject) => {
// 		const player1 = curPlayerIds[0],
// 			player2 = curPlayerIds[1];

// 		try {
// 			if (player1 === connectedId) {
// 				player = playerSnapshot.child(player1).child('playerName').val();
// 				opponent = playerSnapshot.child(player2).child('playerName').val();
// 			} else {
// 				opponent = playerSnapshot.child(player1).child('playerName').val();
// 				player = playerSnapshot.child(player2).child('playerName').val();
// 			}

// 			temp !== connectedId && (actionCue = 1);
// 			temp === connectedId && (actionCue = 2);

// 			if (!opponent && !player) {
// 				throw new Error('No one\'s login atm...I\'m just gonna have lunch myself');
// 			} else if (!opponent || !player) {
// 				throw new Error(!opponent ? 'Waiting for your opponent to logon.' :
// 					'You have to login to play the game, dumb dumb!!');
// 			}

// 			resolve(true);
// 		} catch (error) {
// 			console.log(error.message);
// 			// reject(error);
// 		}
// 	});
// }











// function gameInit(player, opponent) {
// 	const opponentState = $('#player-2'),
// 		playerState = $('#player-1');

// 	if (!player && !opponent) {
// 		playerState.html('');
// 		opponentState.html('');
// 		return;
// 	}

// 	!!player ? playerState.html(
// 		$('<h3>').text(player)) : playerState.html(
// 		$('<h3>').text('You are not login, please enter your name.'));

// 	!!opponent ? opponentState.html(
// 		$('<h3>').text(opponent).attr({ 'class': 'text-right' })) : opponentState.html(
// 		$('<h3>').text('You are all alone...').attr({ 'class': 'text-right' }));

// 	console.log('Game Initiate!!');
// 	if (!!opponent && !!player) {
// 		gameInstance.set({
// 			'gameStart': true,
// 			'playerTurn': 1
// 		})

// 	}
// }