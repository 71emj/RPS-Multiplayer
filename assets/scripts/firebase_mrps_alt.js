function checkIfDataPathExists(rootSnapshot) {
	if (!rootSnapshot.child('message').exists()) {
		initDataPath(dataBase.ref(), ['message']);
		console.log('kdfjadk');
	}
	if (!rootSnapshot.child('gameRecord').exists()) {
		initDataPath(dataBase.ref(), ['gameRecord']);
	}
	if (!rootSnapshot.child('gameInstance').exists()) {
		initDataPath(dataBase.ref(), ['gameInstance']);
	}
	dataBase.ref('gameRecord').update({
		'turn': 0
	});
	dataBase.ref('/gameInstance').set("");
}

// heler function, initializing data tree
function initDataPath(path, childKeys = []) {
	childKeys.forEach(function(elem) {
		const childrenName = elem;
		path.child(childrenName).set('');
	})
}


// if connected player at max, pass true
// need to think of a way to invoke else
function toggleLogin(diableLogin) {
	if (diableLogin) {
		$('#player-login')
			.prop('disabled', true)
			.parent('span')
			.prev('input')
			.prop('disabled', true);
		return;
	}

	$('#player-login')
		.prop('disabled', false)
		.parent('span')
		.prev('input')
		.prop('disabled', false);
}


function recordCurPlayer() {
	return new Promise(resolve => {
		dataBase.ref('/connections').once('value').then((snapshot) => {
			Object.getOwnPropertyNames(snapshot.val()).forEach((elem, index) => {
				console.log(elem);
				if (elem === connectedId) {
					playerStateMirror['playerSequence'] = index;
				} else {
					opponentStateMirror['playerName'] = snapshot.child(elem).child('playerName').val();
					opponentStateMirror['playerSequence'] = index;
				}
			});
		});
		resolve();
	})
}

/// promise that opp true and player true
function curgameState(player, opponent) {
	const opponentState = $('#player-2'),
		playerState = $('#player-1');
	return new Promise(resolve => {
		playerState.html($('<h3>').text(player));

		if (!opponent) {
			opponentState.html($('<h3>').text('You are all alone...').attr({ 'class': 'text-right' }));
			reject(false);
		}

		opponentState.html($('<h3>').text(opponent).attr({ 'class': 'text-right' }));
		console.log('Game Initiate!!');
		if (!!player && !!opponent) {
			resolve(true);
		}
	})
}


// seeting up game interface
function establishPlayerRecord(player, playerRecord) {
	playerRecord.child(player).set({
		'win': playerStateMirror['win'],
		'lose': playerStateMirror['lose'],
		'tie': playerStateMirror['tie']
	});
}

function diableOpponentBtns(opponentBtns) {
	opponentBtns
		.children('button')
		.prop('disabled', 'disabled');
}

function createBtns(playerBtns) {
	playerBtns
		.append(
			$('<button>')
			.attr({
				"class": "btn btn-default list-group-item",
				"data-value": 0,
			})
			.text('Rock')
		).append(
			$('<button>')
			.attr({
				"class": "btn btn-default list-group-item",
				"data-value": 1,
			})
			.text('Paper')
		).append(
			$('<button>')
			.attr({
				"class": "btn btn-default list-group-item",
				"data-value": 2
			})
			.text('Scissors')
		);
}

/////////////////////////////////////////////////////////////////////////////////////////

function reconnectUs() {
	return new Promise(resolve => {
		// connectionsRef.on('child_removed').then(async function(snapshot) {
		// 	if (playerStateMirror['playerSequence'] === 2) {
		// 		alert('Congrats, you are reconnected!!');
		// 		await

		// 		function() {
		// 			connectedId = connectionsRef.push(true).key;
		// 			curConnect = connectionsRef.child(connectedId);
		// 		};

		// 		toggleLogin(false);
		// 		$('#player-login').on('click', function() {
		// 			const input = $(this).parent('span').prev('input');
		// 			curConnect.update({
		// 				'playerName': input.val(),
		// 				'timestamp': firebase.database.ServerValue.TIMESTAMP
		// 			});
		// 			input.val('');
		// 		});
		// 	}
		// 	--playerStateMirror['playerSequence'];
		// })
		// connectionsRef.once('value').then((snapshot) => {
		// 	if (connectedId === Object.getOwnPropertyNames(snapshot.val())[1]) {
		// 		resolve('Finally connecteeeeed');
		// 	}
		// })
		setTimeout(function() {
			resolve('Just testing some stuff');
		}, 5000);
	})
}

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

const dataBase = firebase.database(),
	playerStateMirror = {
		'loginKey': '',
		'loginTime': '',
		'playerSequence': '',
		'playerName': '',
		'win': 0,
		'lose': 0,
		'tie': 0
	},
	opponentStateMirror = {
		'loginKey': '',
		'playerName': '',
		'playerSequence': '',
	};

let curConnect, connectedId;

// connectionsRef.on('value', (snapshot) => {
// 	connectionsRef.once('value').then((snapshot) => {
// 		console.log('Access once');
// 	})
// })


dataBase.ref().once('value').then(async function(snapshot) {
	await checkIfDataPathExists(snapshot);
	return snapshot;
}).then(function(snapshot) {
	return new Promise(resolve => {
		const connectedRef = dataBase.ref(".info/connected"),
			connectionsRef = dataBase.ref('/connections');

		// When the client's connection state changes...
		connectedRef.on("value", async function(snap) {
			if (snap.val()) {
				connectedId = connectionsRef.push(true).key;
				curConnect = connectionsRef.child(connectedId);

				// initiating datapaths at the start of the game 
				initDataPath(curConnect, ['playerName', 'timestamp']);
				await connectionsRef.once('value').then((snapshot) => {
					Object.getOwnPropertyNames(snapshot.val()).forEach((elem, index) => {
						console.log(elem);
						if (elem === connectedId) {
							playerStateMirror['playerSequence'] = index;
						}
					});
				});
				console.log(playerStateMirror['playerSequence']);
				curConnect.onDisconnect().remove();
				dataBase.ref('gameRecord/' + playerStateMirror['playerName']).onDisconnect().remove();
			}
			resolve(connectionsRef);
		});
	})
}).then(async function(connectionsRef) {
	console.log(connectionsRef);
	return new Promise((resolve, reject) => {
		connectionsRef.once('value').then(function(snapshot) {

			if (snapshot.numChildren() > 2) {
				connectionsRef.child(connectedId).remove();
				toggleLogin(true);
				throw new Error("Unfortunately, the current player spots are fulled. We\'ll reconnect you as soon as player spots are available.");
			}

			$('#player-login').on('click', async function() {
				const input = $(this).parent('span').prev('input');
				curConnect.update({
					'playerName': input.val(),
					'timestamp': firebase.database.ServerValue.TIMESTAMP
				});
				input.val('');

				await connectionsRef.once('value').then((snapshot) => {
					playerStateMirror['playerName'] = snapshot.child(connectedId).child('playerName').val();
					playerStateMirror['loginTime'] = snapshot.child(connectedId).child('timestamp').val();
					console.log(playerStateMirror['playerName']);
					console.log(playerStateMirror['loginTime']);
				});

				resolve(connectionsRef);
			});
		})
	}).catch((msg) => {
		console.log(msg);
		dataBase.goOffline();
	}); // reconnectUs();

}).then(function(connectionsRef) {
	toggleLogin(true);

	let opponent, player;
	connectionsRef.on("value", async function gameInit() {
		await recordCurPlayer().then(() => {
			opponent = opponentStateMirror['playerName'];
			player = playerStateMirror['playerName'];
		});
		console.log(opponentStateMirror['playerName']);
		console.log(opponent);
		console.log(opponentStateMirror['playerSequence']);
		console.log(playerStateMirror['playerSequence']);
		curgameState(player, opponent) // .then (we know everything is in place, call game)
			.then((state) => {
				if (!state) {
					return;
				}
				gameStarts(player, opponent);
			}).catch(() => { console.log('I feel so rejected') });
	});

});

async function gameStarts(player, opponent) {
	console.log('Thanks for calling me');
	const playerRecord = dataBase.ref('/gameRecord'),
		gameInstance = dataBase.ref('/gameInstance');

	dataBase.ref('/connections').off('value', gameInit);

	createBtns($('#player-1')); // player
	createBtns($('#player-2')); // opponent
	await diableOpponentBtns($('#player-2'));
	await establishPlayerRecord(player, playerRecord);
	await initGameInstance(player, gameInstance);

	gameplayHandler(player, opponent, gameInstance);
	console.log('awaited');
}


function initGameInstance(player, gameInstance) {
	gameInstance.child(player).set({
		'playerMove': -1
	})
}


async function gameplayHandler(player, opponent, gameInstance) {
	let playerChoice, opponentChoice;

	await $('#player-1').on('click', '.btn', (event) => {
		event.preventDefault();

		playerChoice = $(this).data('value');
		gameInstance.child(player).update({
			'playerMove': playerChoice
		});
	})

	await gameInstance.child(opponent).once('value').then((snapshot) => {
		opponentChoice = snapshot.val().playerMove;
		console.log(opponentChoice);
	})

	console.log(opponentChoice);


}