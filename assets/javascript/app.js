$(document).on('ready', function(){

	var playerName;
	var currPlayerCount;
	var gameChoice = "";
	var wins = 0;
	var losses = 0;
	var connection = new Firebase("https://rps-multi.firebaseIO.com");


	connection.once("value", function(snapshot){

		var playersExist = snapshot.child("playerCount").exists();

		if(playersExist){

			if(snapshot.child("playerCount").val() == 2){

				$('#playerDetails').css('display', 'none');

				var newPara = $('<h4>').html("This game is already full! Please wait...")
				.css({'font-weight': 'bold','color': '#FF0000','margin-top': '20px'});
				$('#intro').append(newPara);

			}

		} else {

			connection.set({
				playerCount: 0
			});

		}
	});

	
	$('#btnBegin').on('click', function(){

		if($('.gamePlay input[type=text]').val().trim() != ""){

			playerName = $('.gamePlay input[type=text]').val().trim();

			connection.once("value", function(snapshot){

				currPlayerCount = snapshot.child("playerCount").val();
				console.log("before " + currPlayerCount);
				currPlayerCount++;
				console.log("after " + currPlayerCount);
				connection.update({playerCount: currPlayerCount});

/*
				connection.push({

						Player: currPlayerCount+1,
						Name: playerName,
						Choice: gameChoice,
						Wins: wins,
						Losses: losses

				});*/



				if(currPlayerCount == 1) {

					connection.push({

						Player1:{

							Name: playerName,
							Choice: gameChoice,
							Wins: wins,
							Losses: losses
						}

					});

				} else {

					connection.push({

						Player2:{

							Name: playerName,
							Choice: gameChoice,
							Wins: wins,
							Losses: losses

						}

					});


				}	
				$('#intro').hide();
				$('#game').show();


			});


			connection.on("child_added", function(snapshot){

				//console.log("This is " + '#p' + currPlayerCount +'Name');

				//$('#p' + currPlayerCount +'Name').html(snapshot.child("Player"+currPlayerCount).child("Name").val());

				console.log(connection);
				
/*
				if(connection.child("player1").exists()){

					$('#p1Name').html(connection.child("Player1").child("Name").val());

				} else if(connection.child("player2").exists()){

					$('#p2Name').html(connection.child("Player2").child("Name").val());

				}*/







				$('#currName').html(snapshot.child("Player"+currPlayerCount).child("Name").val());

				$('#playNum').html(currPlayerCount);
				console.log(currPlayerCount);
				console.log(snapshot.val());





			});

		}

	});




});