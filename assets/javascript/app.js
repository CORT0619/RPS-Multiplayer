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
				currPlayerCount++;
				connection.update({playerCount: currPlayerCount});


				if(currPlayerCount == 1) {

					p1id = connection.push({

						Player1:{

							Name: playerName,
							Choice: gameChoice,
							Wins: wins,
							Losses: losses
						}

					});



				} else {

					p2id = connection.push({

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


			connection.on("value", function(snapshot){

				//console.log("This is " + '#p' + currPlayerCount +'Name');

				//$('#p' + currPlayerCount +'Name').html(snapshot.child("Player"+currPlayerCount).child("Name").val());

				snapshot.forEach(function(stuff){

					console.log(stuff.val());

					$('#currName').html(playerName);


					if(stuff.hasChild("Player1")){

						$('#p1Name').html(stuff.child("Player1").child("Name").val());
						$('#p1Wins').html(stuff.child("Player1").child("Wins").val());
						$('#p1Loss').html(stuff.child("Player1").child("Losses").val());
					}

					if(stuff.hasChild("Player2")){

						$('#p2Name').html(stuff.child("Player2").child("Name").val());
						$('#p2Wins').html(stuff.child("Player2").child("Wins").val());
						$('#p2Loss').html(stuff.child("Player2").child("Losses").val());						
					}


					$('#playNum').html(currPlayerCount);



				});

/*
				if(/snapshot.hasChild("Player1")){

					$('#p1Name').html(snapshot.child("Player1").child("Name").val());

				}

				if(snapshot.child("Player2").exists()){

					$('#p2Name').html(snapshot.child("Player2").child("Name").val());

				}*/




			});

		}

	});




});