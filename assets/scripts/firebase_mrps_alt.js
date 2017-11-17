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
function toggleLogin(isDisabled = false) {
	$('#player-login')
		.prop('disabled', isDisabled)
		.parent('span')
		.prev('input')
		.prop('disabled', isDisabled);
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
				"class": "btn btn-default list-group-item animate-color",
				"data-value": 0,
			})
			.text('Rock')
		).append(
			$('<button>')
			.attr({
				"class": "btn btn-default list-group-item animate-color",
				"data-value": 1,
			})
			.text('Paper')
		).append(
			$('<button>')
			.attr({
				"class": "btn btn-default list-group-item animate-color",
				"data-value": 2
			})
			.text('Scissors')
		);
}

async function initGameInstance(player, gameInstance) {
	console.log('djfkdajf');
	gameInstance.child(player).set({
		'playerMove': true
	})
}

function rpsCore(playerChoice, opponentChoice, player, opponent) {
	let winner;
	console.log(player + "   " + opponent);
	console.log('player\'s move:   ' + playerChoice);
	console.log('opponent\'s move:   ' + opponentChoice);
	if (playerChoice === opponentChoice) {
		return 'nowinner';
	}

	playerChoice > opponentChoice ? winner = player : winner = opponent;

	if (playerChoice === 0 && opponentChoice === 2) {
		winner = player;
	} else if (playerChoice === 2 && opponentChoice === 0) {
		winner = opponent;
	}
	return winner;
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
		'playerName': '',
		'playerSequence': '',
		'win': 0,
		'lose': 0,
		'tie': 0
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

		$('#game-info').children().eq(2).css('display', 'none');

		curgameState(player, opponent) // .then (we know everything is in place, call game)
			.then((state) => {
				if (!state) {
					return;
				}
				gameStarts(player, opponent).then((state) => {
					if (!state) {
						return;
					}
					// choiceListener(player, opponent, dataBase.ref('/gameInstance'))
					// 	.then((result) => {
					// 		console.log('The winner is....' + result);
					// 		processResult(result);
					// 	})
					gameOn(player, opponent, dataBase.ref('/gameInstance'));
				});
			}).catch(() => { console.log('I feel so rejected') });
	});
});


async function gameStarts(player, opponent) {
	return new Promise(resolve => {
		console.log('Thanks for calling me');
		const playerRecord = dataBase.ref('/gameRecord'),
			gameInstance = dataBase.ref('/gameInstance');

		$('#game-info').children().eq(2).fadeIn(0, function() {
			$('#game-info').css('display', 'block');
			createBtns($('#player-1')); // player
			createBtns($('#player-2')); // opponent
			diableOpponentBtns($('#player-2'));
			establishPlayerRecord(player, playerRecord);
			initGameInstance(player, gameInstance);
		});

		gameInstance.child(player).on('value', (snap) => {
			if (snap.val().playerMove) {
				resolve(true);
			}
		});
	});
}

function choiceListener(player, opponent, gameInstance) {
	console.log('Make your move');
	let playerChoice, opponentChoice;
	return new Promise(resolve => {
		$('#player-1').on('click', '.btn', function listener(event) {
			// event.preventDefault();
			console.log('somewhat early');
			const $eventTarget = $(event.currentTarget);
			playerChoice = parseInt($eventTarget.data('value'));

			// avoid multiple choice issue 
			disableSiblings($eventTarget);
			animateChoice($eventTarget);
			dataBase.ref('/gameInstance').child(player).update({
				'playerMove': playerChoice
			});

			waitForOpponent();
			gameInstance.child(opponent).on('value', (snapshot) => {
				opponentChoice = snapshot.child('playerMove').val();

				console.log('later than onclick');
				if ($.isNumeric(playerChoice) && $.isNumeric(opponentChoice)) {
					// this is to prevent multiple listener on btn click
					$('#player-1').off('click', '.btn', listener);
					waitForOpponent(true);
					animateChoice($('#player-2').children('button').eq(opponentChoice));
					resolve(rpsCore(playerChoice, opponentChoice, player, opponent));
				}
			});
		});
	})
}


function animateChoice(targetBtn) {
	targetBtn.addClass('selected');
}

function waitForOpponent(clearMsg = false) {
	const $gameInfo = $('#turn-outcome');
	if (clearMsg) {
		$gameInfo.children().fadeOut(300, function() {
			$gameInfo.empty();
		});
		return;
	}
	$gameInfo.html(
		$('<h2>').text('Waiting for your opponent to make a move..').fadeIn(300)
	);
}

function disableSiblings(targetBtn) {
	targetBtn.siblings('.btn').prop('disabled', true);
}

function processResult(winner) {
	const player = playerStateMirror['playerName'],
		opponent = opponentStateMirror['playerName'];

	switch (winner) {
		case player:
			++playerStateMirror['win'];
			break;
		case opponent:
			++playerStateMirror['lose'];
			break;
		case 'nowinner':
			++playerStateMirror['tie'];
			break;
	}

	dataBase.ref('/gameRecord/' + player).update({
		'win': playerStateMirror['win'],
		'lose': playerStateMirror['lose'],
		'tie': playerStateMirror['tie']
	});

	dataBase.ref('/gameRecord/' + opponent).once('value').then((snap) => {
		opponentStateMirror['win'] = snap.child('win').val();
		opponentStateMirror['lose'] = snap.child('lose').val();
		opponentStateMirror['tie'] = snap.child('tie').val();

		readyToRestart(winner).then(() => {
			return new Promise(async(resolve) => {
				resetGame(player, dataBase.ref('/gameInstance'));
				await setTimeout(() => {
					$('#turn-outcome').children().fadeOut(500);
				}, 2500);

				resolve(true);
			});
		}).then((state) => {
			console.log(state);
			if (state) {
				gameOn(player, opponent, dataBase.ref('/gameInstance'));
			}
		});
	});
}

async function readyToRestart(winner) {
	const $playerScores = $('#game-info').children().eq(0).children('p'),
		$opponentScores = $('#game-info').children().eq(2).children('p');

	const attrList = ['win', 'lose', 'tie'];
	attrList.forEach((elem, index) => {
		console.log('yello');
		$playerScores.children().eq(index).children('em').text(playerStateMirror[elem]);
		$opponentScores.children().eq(index).children('em').text(opponentStateMirror[elem]);
	});

	$('#turn-outcome').html(
		$('<h2>').text('The Winner of this Round is ' + winner)
	);
	return;
}

function resetGame(player, gameInstance) {
	console.log('Well');
	initGameInstance(player, gameInstance);
	$('#player-1').children('.btn').removeClass('selected').prop('disabled', false);
	$('#player-2').children('.btn').removeClass('selected');
}



// unfortunately stupid as i am I made a grave mistake by calling everything in a then chain
// which is why before I can sort it out I'll just have to create a round 2 function

function gameOn(player, opponent, gameInstance) {
	choiceListener(player, opponent, gameInstance)
		.then((result) => {
			console.log('The winner is....' + result);
			processResult(result);
		})
}