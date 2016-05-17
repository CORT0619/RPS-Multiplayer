$(document).on('ready', function(){

	var playerName;
	var currPlayerCount;
	var gameChoice = "";
	var wins = 0;
	var losses = 0;
	var connection = new Firebase("https://rps-multi.firebaseIO.com");

	var p1id;
	var p2id;
	var key;


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

					var key = stuff.key().toString();

					console.log(stuff.val());

					var concat = "Player" + currPlayerCount;
					console.log(concat);

					console.log(stuff.child(concat).child("Name").val());


					if(currPlayerCount == 1){

						$('#currName').html(stuff.child("Player1").child("Name").val());


					} else {

						$('#currName').html(stuff.child("Player2").child("Name").val());

					}


					if(stuff.hasChild("Player1")){

						$('#p1Name').html(stuff.child("Player1").child("Name").val());
					}

					if(stuff.hasChild("Player2")){

						$('#p2Name').html(stuff.child("Player2").child("Name").val());
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