//$(document).on('ready', function(){

	var playerName;
	var currPlayerCount;
	var gameChoice = "";
	var wins = 0;
	var losses = 0;
	var parent;
	var player;
	var p1Choice;
	var p2Choice;
	var connection = new Firebase("https://rps-multi.firebaseIO.com");

	connection.once("value", function(snapshot){

		var playersExist = snapshot.child("playerCount").exists();

		console.log("player exists: " + playersExist);

		if(playersExist){

			if(snapshot.child("playerCount").val() == 2){

				$('#playerDetails').css('display', 'none');

				var newPara = $('<h4>').html("This game is already full! Please wait...")
				.css({'font-weight': 'bold','color': '#FF0000','margin-top': '20px'});
				$('#intro').append(newPara);

			}

		} else {

			connection.child('playerCount').set(0);
			connection.child('turn').set(0);
		}
	});

	connection.off("value", function(snapshot){});

	
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

			console.log("child added " +snapshot.val());
			$('#playNum').html(currPlayerCount).attr('data-player', currPlayerCount);
			$('#currName').html(playerName);
			player = $('#playNum').attr('data-player');


			if(snapshot.key() == "1"){

				$('#p1Name').html(snapshot.val().Name);
				$('#p1Wins').html(snapshot.val().Wins);
				$('#p1Loss').html(snapshot.val().Losses);
				$('#p2Name').css('visibility', 'hidden');
				$('#p2Results').css('visibility', 'hidden');
				$('.gamePieces').css('visibility', 'hidden');
				$('#p1Waiting').css('visibility', 'hidden');
			}

			if(snapshot.key() == "2"){

				$('#p2Name').html(snapshot.val().Name);
				$('#p2Wins').html(snapshot.val().Wins);
				$('#p2Loss').html(snapshot.val().Losses);
				$('#p2Name').css('visibility', 'visible');

				connection.update({turn: 1});



				/*if(player == 1){

					$('#whosTurn').html("It's Your Turn!");
					$('#p1Wins').html(snapshot.val().Wins);
					$('#p1Loss').html(snapshot.val().Losses);
					$('#p1Pieces').css('visibility', 'visible');
					$('#p2Waiting').css('visibility', 'hidden');
					$('#p2Results').css('visibility', 'visible');


				} else if(player == 2){

					$('#whosTurn').html("Waiting for Player 1 to choose.");
					$('#p2Waiting').css('visibility', 'hidden');
					$('#p2Results').css('visibility', 'visible');
				}*/



				/*$('.gamePieces').css('visibility', 'visible');
				$('#p2Pieces').css('visibility', 'hidden');
				$('#waiting').hide();
				$('#p2Results').show();*/

				//connection.update({turn: 1});
			}


		});


				connection.on("value", function(snapshot){

					console.log("turn changed");
			
					if(snapshot.exists() && snapshot.val().turn == 1){

						if(player == 1){

							$('#whosTurn').html("It's Your Turn!");
							$('#p1Wins').html(snapshot.val().Wins);
							$('#p1Loss').html(snapshot.val().Losses);
							$('#p1Pieces').css('visibility', 'visible');
							$('#p2Waiting').css('visibility', 'hidden');
							$('#p2Results').css('visibility', 'visible');



						} else if(player == 2){

							$('#whosTurn').html("Waiting for Player 1 to choose.");
							$('#p2Waiting').css('visibility', 'hidden');
							$('#p2Results').css('visibility', 'visible');
							$('#p1Pieces').css('visibility', 'hidden');	
							$('#p2Pieces').css('visibility', 'hidden');							
						} 

					} else if(snapshot.exists() && snapshot.val().turn == 2){

						if(player == 1){

							$('#whosTurn').html("Waiting for Player 2 to choose.");
							$('#p1Pieces').css('visibility', 'hidden');

						} else if(player == 2){

							$('#whosTurn').html("It's Your Turn!");
							$('#p2Pieces').css('visibility', 'visible');

						}

					}


				});
/* // may need to uncomment
		connection.on("value", function(snapshot){

			console.log("something changed " + snapshot.val());

			player = $('#playNum').attr('data-player');
			
			if(snapshot.exists() && snapshot.val().turn == 0){

				if(player == 1){

					$('#whosTurn').html("It's Your Turn!");
					$('#p1Name').html(snapshot.val().Name);
					$('#p1Wins').html(snapshot.val().Wins);
					$('#p1Loss').html(snapshot.val().Losses);
					$('#p2Name').css('visibility', 'visible');
					$('#p2Results').css('visibility', 'visible');
					//$('.gamePieces').css('visibility', 'hidden');


				} else if(player == 2){

					$('#whosTurn').html("Waiting for Player " + player + "to choose.");
				} 

			} else if(snapshot.exists() && snapshot.val().turn == 2){

				if(player == 1){

					$('#whosTurn').html("Waiting for Player " + player + "to choose.");

				} else if(player == 2){

					$('#whosTurn').html("It's Your Turn!");
				}

			}	


		});*/

		$('#p1Pieces li').on('click', function(){

			p1Choice = $(this).attr('id');
			connection.update({turn: 2});
			console.log("p1Choice " + p1Choice);

			return p1Choice;
		});


		$('#p2Pieces li').on('click', function(){

			console.log("p1Choice " + p1Choice);

			p2Choice =$(this).attr('id');
			getWinner(p1Choice, p2Choice);
			connection.update({turn: 1});

		});

		$('#reset').on('click', function(){
			connection.remove();
			window.location.href = "http://whispering-thicket-72416.herokuapp.com/";

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




//}); // end of document.ready

function getWinner(playerOne, playerTwo){

	console.log("here");
	console.log("playerOne " + playerOne);
	console.log("playerTwo " + playerTwo);

	if(playerOne == 'rock' && playerTwo == 'scissors' ||
	   playerOne == 'scissors' && playerTwo == 'paper' ||
	   playerOne == 'paper' && playerTwo == 'rock'){

		//connection.update({1: {Wins: 1}}); //update playerOne wins
		connection.child('1').set({Wins: 1});
	    connection.update({2: {Losses: 1}}); //update playerTwo losses

	    console.log('here');

	} else if(playerTwo == 'rock' && playerOne == 'scissors' ||
	  		  playerTwo == 'scissors' && playerOne == 'paper' ||
	 		  playerTwo == 'paper' && playerOne == 'rock'){

		connection.update({2: {Wins: 1}}); //update playerTwo wins
	    connection.update({1: {Losses: 1}}); //update playerOne losses

	}

}