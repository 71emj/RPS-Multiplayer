(function() {
	"use strict";

	(function($) {

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

		// // initializing data tree
		function initDataPath(path, childKeys = []) {
			childKeys.forEach(function(elem) {
				const childrenName = elem;
				path.child(childrenName).set('');
			})
		}

		dataBase.ref().once('value').then(function(snapshot) {
			if (!snapshot.child('message').exists()) {
				initDataPath(dataBase.ref(), ['message']);
				console.log('kdfjadk');
			}
			if (!snapshot.child('gameRecord').exists()) {
				initDataPath(dataBase.ref(), ['gameRecord']);
			}
			if (!snapshot.child('gameInstance').exists()) {
				initDataPath(dataBase.ref(), ['gameInstance']);
			}
			dataBase.ref('gameRecord').update({
				'turn': 0
			});

			dataBase.ref('/gameInstance').set("");
			return;
		});

		// setting up initial connection state

		// '.info/connected' is a special location provided by Firebase that is updated every time
		// the client's connection state changes.
		// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
		const connectedRef = dataBase.ref(".info/connected");

		// connections is a made up location to store connected users
		const connectionsRef = dataBase.ref('/connections'),
			message = dataBase.ref('/message'),
			gameInstance = dataBase.ref('/gameInstance'),
			gameRecord = dataBase.ref('/gameRecord');
		// This is incredibly important because it is a reference to the connectionsRef
		let curConnect, connectedId;

		// When the client's connection state changes...
		connectedRef.on("value", function(snap) {
			if (snap.val()) {
				connectedId = connectionsRef.push(true).key;
				curConnect = connectionsRef.child(connectedId);

				// initiating datapaths at the start of the game 
				initDataPath(curConnect, ['playerName', 'timestamp']);

				// console.log(curConnect);
				// console.log(curConnect.parent);
				curConnect.onDisconnect().remove();
				// somebug existed but not too serious,
				// likely cause by the late logintime query
				dataBase.ref('gameRecord/player' + actionCue).onDisconnect().remove();
			}
		});

		// we only checked this once
		// check for limited 2 simultaneous connection
		connectionsRef.once('value').then(function(snapshot) {
			try {
				if (snapshot.numChildren() > 2) {
					connectionsRef.child(connectedId).remove();
					throw new Error("Unfortunately, the current player spots are fulled. We\'ll reconnect you as soon as player spots are available.");
				}
			} catch (error) {
				alert(error.message);
				disableConnection(true);
				return;
			}
		});

		// if connected player at max, pass true
		// need to think of a way to invoke else
		function disableConnection(isFull) {
			if (isFull) {
				$('#player-login')
					.prop('disabled', true)
					.parent('span')
					.prev('input')
					.prop('disabled', true);
			} else if (isFull === false) {
				$('#player-login')
					.prop('disabled', false)
					.parent('span')
					.prev('input')
					.prop('disabled', false);
			}
			return;
		}


		// push player name and login timestamp to dataBase
		$('#player-login').on('click', function() {
			const input = $(this).parent('span').prev('input');
			curConnect.update({
				'playerName': input.val(),
				'timestamp': firebase.database.ServerValue.TIMESTAMP
			});
			input.val('');
			input.prop('disabled', true);
			$(this).prop('disabled', true);
			return;
		});


		function timeOUT() {
			return new Promise(resolve => {
				setTimeout(function() {
					console.log('Whooo, 10seconds past~');
					resolve();
				}, 10000);
			})
		}

		let player, opponent, actionCue = 0,
			temp;
		// download both player and opponent name to the game
		// should probably use a different handler to manage event fire
		connectionsRef.on("value", recordCurPlayer);

		// async function recordCurPlayer(playerSnapshot) {
		// 	const curPlayerIds = Object.getOwnPropertyNames(playerSnapshot.val());
		// 	curPlayerIds.forEach(function(elem) {
		// 		elem === connectedId && (player = playerSnapshot.child(elem).child('playerName').val());
		// 		elem !== connectedId && (opponent = playerSnapshot.child(elem).child('playerName').val());
		// 		if (parseInt(playerSnapshot.child(elem).child('timestamp').val()) > actionCue) {
		// 			temp = elem;
		// 		}
		// 	})

		// 	temp !== connectedId && (actionCue = 1);
		// 	temp === connectedId && (actionCue = 2);

		// 	console.log(opponent);
		// 	console.log(player);

		// 	await timeOUT();

		// 	// console.log(temp);
		// 	console.log('Current action cue is....' + actionCue);
		// 	// const gameReady = gameInit(player, opponent);
		// 	const gameReady = gameInit(player, opponent);
		// 	// if (gameReady) {
		// 	// 	gameStart(actionCue);
		// 	// }
		// }


		async function recordCurPlayer(playerSnapshot) {
			const curPlayerIds = Object.getOwnPropertyNames(playerSnapshot.val());

			// await for logPlayerToLocal to resolve, which will return true or false, if false return
			// will need to wait til this is resolved
			await logPlayerToLocal(curPlayerIds, playerSnapshot)
				.then(function() {
					gameInit(player, opponent);
				}).catch();

		}

		function logPlayerToLocal(curPlayerIds, playerSnapshot) {
			return new Promise((resolve, reject) => {
				const player1 = curPlayerIds[0],
					player2 = curPlayerIds[1];

				try {
					if (player1 === connectedId) {
						player = playerSnapshot.child(player1).child('playerName').val();
						opponent = playerSnapshot.child(player2).child('playerName').val();
					} else {
						opponent = playerSnapshot.child(player1).child('playerName').val();
						player = playerSnapshot.child(player2).child('playerName').val();
					}

					temp !== connectedId && (actionCue = 1);
					temp === connectedId && (actionCue = 2);

					if (!opponent && !player) {
						throw new Error('No one\'s login atm...I\'m just gonna have lunch myself');
					} else if (!opponent || !player) {
						throw new Error(!opponent ? 'Waiting for your opponent to logon.' :
							'You have to login to play the game, dumb dumb!!');
					}

					resolve(true);
				} catch (error) {
					console.log(error.message);
					// reject(error);
				}
			});
		}







		function gameInit(player, opponent) {
			const opponentState = $('#player-2'),
				playerState = $('#player-1');

			if (!player && !opponent) {
				playerState.html('');
				opponentState.html('');
				return;
			}

			!!player ? playerState.html(
				$('<h3>').text(player)) : playerState.html(
				$('<h3>').text('You are not login, please enter your name.'));

			!!opponent ? opponentState.html(
				$('<h3>').text(opponent).attr({ 'class': 'text-right' })) : opponentState.html(
				$('<h3>').text('You are all alone...').attr({ 'class': 'text-right' }));

			console.log('Game Initiate!!');
			if (!!opponent && !!player) {
				gameInstance.set({
					'gameStart': true,
					'playerTurn': 1
				})

			}
		}


		// // needs to await for previous action complete
		// // cur for game start
		// dataBase.ref('gameInstance/gameStart').on('value', function(startSnapshot) {
		// 	if (startSnapshot.val()) {
		// 		// should create the reference earlier 
		// 		dataBase.ref('gameRecord/player' + actionCue).set({
		// 			'name': player,
		// 			'id': connectedId,
		// 			'win': 0,
		// 			'lose': 0,
		// 			'tie': 0,
		// 			'timestamp': firebase.database.ServerValue.TIMESTAMP
		// 		});
		// 	}

		// 	gameInstance.set({
		// 		'gameStart': true,
		// 		'playerTurn': 1
		// 	})

		// 	// console.log('gameStart');
		// 	// console.log(snapshot.val());
		// 	// console.log(snapshot);
		// });



		// turnStart(startSnapshot.parent.child('playerTurn'));



		function gameStart(actionCue) {
			console.log('Game Started');
			console.log(actionCue);

		}

		// dataBase.ref('/gameRecord').on('child_added', function(snapshot) {
		// 	turnStart(actionCue);
		// })


		function turnStart(actionCue) {
			if (actionCue === 1) {
				createBtns($('#player-1'));
			}
		}

		function createBtns(player) {
			player
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









		var msgHistory = {};




		$('#sendmsg').on('click', function() {
			msgHistory = {
				'name': 'Player1',
				'message': $(this).prev('textarea').val().trim(),
				'timestamp': firebase.database.ServerValue.TIMESTAMP
			}

			$(this).prev('textarea').val('');
			// console.log(msgHistory);
			syncMsg(msgHistory);
		})



		// key blocks in game:
		// game handler
		// user input, pinging data to firebase, 
		// retrieving data from firebase, determined win lose, 
		// ping data back to firebase and retrieving data 
		// display result
		// seems logical to create an object to handle all the download and upload


		// 0 === r, 1 === p, 2 === s && 0 > 2
		function rpsCore(firstPlayerChoice, secondPlayerChoice) {
			let winner;
			if (firstPlayerChoice === secondPlayerChoice) {
				return -1;
			}
			firstPlayerChoice > secondPlayerChoice ? winner = firstPlayerName : winner = secondPlayerName;
			(firstPlayerChoice === 0 && secondPlayerChoice === 2) && (winner = firstPlayerName);
			(firstPlayerChoice === 2 && secondPlayerChoice === 0) && (winner = secondPlayerName);

			return winner;
		} // return the name of the winner or -1 (when tie)




		// sync method prototype
		function syncMsg(msgHistoryObj) {
			// dataBase.ref("/message").set(msgHistoryObj);
			dataBase.ref("/message").push(msgHistoryObj);
			return;
		}




		// chatbox
		// lorem





	}(jQuery));

}());