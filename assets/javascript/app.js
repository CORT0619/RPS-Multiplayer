$(document).on('ready', function(){

	var playerName;
	var currPlayerCount;
	var gameChoice = "";
	var wins = 0;
	var losses = 0;
	var parent;
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
				playerCount: 0,
				turn: 0
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

					//connection.push({
					connection.update({

						1:{

							Name: playerName,
							Choice: gameChoice,
							Wins: wins,
							Losses: losses
						}
					});

				} else {

					//connection.push({
					connection.update({

						2:{

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

		}

	});

		connection.on("child_added", function(snapshot){

			console.log(snapshot.val());
			$('#playNum').html(currPlayerCount);
			$('#currName').html(playerName);


			if(snapshot.key() == "1"){

				$('#p1Name').html(snapshot.val().Name);
				$('#p1Wins').html(snapshot.val().Wins);
				$('#p1Loss').html(snapshot.val().Losses);
				$('#p2Name').hide();
				//$('#p2Pieces').hide();
				$('#p2Results').hide();
				//$('.gamePieces').hide();
				$('.gamePieces').css('visibility', 'hidden');
			}

			if(snapshot.key() == "2"){

				$('#p2Name').html(snapshot.val().Name);
				$('#p2Wins').html(snapshot.val().Wins);
				$('#p2Loss').html(snapshot.val().Losses);
				$('#p2Name').show();
				$('.gamePieces').css('visibility', 'visible');
				$('#p2Pieces').css('visibility', 'hidden');
				$('#waiting').hide();
				$('#p2Results').show();

				connection.update({turn: 1});
			}


		});

		connection.on("value", function(snapshot){
			//console.log("turn: " + snapshot.val().turn);

			console.log(snapshot.val());

			if(snapshot.exists() && snapshot.val().turn == 1){

				console.log("I'm here");
				$('#p1Status').html("It's Your Turn!");
				$('#p2Status').html("Waiting for to choose.");

				connection.update({turn: 2});

			} else if(snapshot.exists() && snapshot.val().turn == 2){


			}



		});

		$('.gamePieces li').on('click', function(){

			console.log("blah");
		});
/*
			connection.on("value", function(snapshot){

				//console.log("This is " + '#p' + currPlayerCount +'Name');

				//$('#p' + currPlayerCount +'Name').html(snapshot.child("Player"+currPlayerCount).child("Name").val());

				snapshot.forEach(function(object){

					console.log("snapshot " + snapshot.child("1").val());
					console.log("Object " + object.val());

					parent = object.key();

					$('#currName').html(playerName);


						//if(stuff.hasChild("Player1")){
					//if(stuff.val() == 1){
					//if(parent == 1){
					if(snapshot.child("1").exists()){	

						//$('#p1Name').html(stuff.child("1").child("Name").val());
						$('#p1Name').html(object.val().Name);
						//$('#p1Wins').html(stuff.child("1").child("Wins").val());
						$('#p1Wins').html(object.val().Wins);
						//$('#p1Loss').html(stuff.child("1").child("Losses").val());
						$('#p1Loss').html(object.val().Losses);
					}

					//if(stuff.hasChild("Player2")){
					if(snapshot.child("2").exists()){	
						//$('#p2Name').html(stuff.child("Player2").child("Name").val());
						$('#p2Name').html(object.val().Name);
						//$('#p2Wins').html(stuff.child("Player2").child("Wins").val());
						$('#p2Wins').html(object.val().Wins);
						//$('#p2Loss').html(stuff.child("Player2").child("Losses").val());	
						$('#p2Loss').html(object.val().Losses);					
					}

					$('#playNum').html(currPlayerCount);

				});


				//if(snapshot.hasChild("Player1")){

				//	$('#p1Name').html(snapshot.child("Player1").child("Name").val());

				//}

			//	if(snapshot.child("Player2").exists()){

				//	$('#p2Name').html(snapshot.child("Player2").child("Name").val());

				//}

			});

			console.log('#p' + currPlayerCount + "Pieces li");

				$('#p' + currPlayerCount + "Pieces li").on('click', function(){

					console.log("blah");

					gameChoice = $(this).attr('id');
					console.log(gameChoice);
					//connection.update();
				});*/




}); // end of document.ready