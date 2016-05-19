
	var playerName;
	var currPlayerCount;
	//var gameChoice = "";
	var p1Wins = 0;
	var p1Losses = 0;
	var p2Wins = 0;
	var p2Losses = 0;
	var player;
	var p1Choice;
	var p2Choice;

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

					connection.update({

						1:{

							Name: playerName,
							//Choice: gameChoice,
							Wins: p1Wins,
							Losses: p1Losses
						}
					});

				} else {

					connection.update({

						2:{

							Name: playerName,
							//Choice: gameChoice,
							Wins: p2Wins,
							Losses: p2Losses
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
				$('#p1Pick').hide();
				$('#p2Pick').hide();

			}

			if(snapshot.key() == "2"){

				$('#p2Name').html(snapshot.val().Name);
				$('#p2Wins').html(snapshot.val().Wins);
				$('#p2Loss').html(snapshot.val().Losses);
				$('#p2Name').css('visibility', 'visible');

				connection.update({turn: 1});

			}

		});

		connection.on("value", function(snapshot){

			console.log("turn changed");
			$('#p1Pick').hide();
			$('#p2Pick').hide();

			$('#p1Wins').html(snapshot.child("1").val().Wins);
			$('#p1Loss').html(snapshot.child("1").val().Losses);
			$('#p2Wins').html(snapshot.child("2").val().Wins);
			$('#p2Loss').html(snapshot.child("2").val().Losses);
	
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
					$('#p1Pick').show();


				} else if(player == 2){

					$('#whosTurn').html("It's Your Turn!");
					$('#p2Pieces').css('visibility', 'visible');

				}

			}

		});


		$('#p1Pieces li').on('click', function(){

			p1Choice = $(this).attr('id');
			$('#p1Pick').show().html(p1Choice);

			//connection.update({1: {Choice: p1Choice}});
			connection.child("1").update({Choice: p1Choice});

			if(player == 1){

				$('#p1Pick').html(p1Choice);
			}

			connection.update({turn: 2});
			console.log("p1Choice " + p1Choice);

		});


		$('#p2Pieces li').on('click', function(){

			p2Choice = $(this).attr('id');
			//$('#p2Pick').attr('data-pick', p2Choice);
			$('#p2Pick').show().html(p2Choice);

			connection.child("2").update({Choice: p2Choice});

			if(player == 2){

				$('#p2Pick').show().html(p2Choice);
				$('#p2Pieces').css('visibility', 'visible');
			}

			var one = $('#p1Pick').attr('data-pick');
			var two = $('#p2Pick').attr('data-pick');

			console.log("first pick is " +one);


			getWinner(/*one, two*/);
			connection.update({turn: 1});

		});

		$('#reset').on('click', function(){
			connection.remove();
			window.location.href = "http://whispering-thicket-72416.herokuapp.com/";

		});


function getWinner(playerOne, playerTwo){

	console.log("playerOne " + playerOne);
	console.log("playerTwo " + playerTwo);

	connection.on("value", function(snapshot){

		console.log(snapshot.val());
		playerOne = snapshot.child("1").val().Choice;
		console.log("Player 1 getwinner function " + playerOne);
		playerTwo = snapshot.child("2").val().Choice;
		console.log("Player 2 getwinner function " + playerTwo);
	})

	if(playerOne == 'rock' && playerTwo == 'scissors' ||
	   playerOne == 'scissors' && playerTwo == 'paper' ||
	   playerOne == 'paper' && playerTwo == 'rock'){

		
		p1Wins++;
		p2Losses++;
			

		$('#p1Pick').show().html($('#p1Pick').attr('data-pick'));
		$('#p2Pick').show().html($('#p2Pick').attr('data-pick'));
		$('#winner').show().text("Player 1 Wins!");

		connection.child('1').update({Wins: p1Wins});
		connection.child('2').update({Losses: p2Losses});

	} else if(playerTwo == 'rock' && playerOne == 'scissors' ||
	  		  playerTwo == 'scissors' && playerOne == 'paper' ||
	 		  playerTwo == 'paper' && playerOne == 'rock'){

		p2Wins++;
		
		p1Losses++;
		

		$('#p1Pick').show();
		$('#p2Pick').show();
		$('#winner').show().text("Player 2 Wins!");

	
		connection.child('1').update({Losses: p1Losses});
		connection.child('2').update({Wins: p2Wins});

	}
		console.log("p1Wins" + p1Wins);
		console.log("p2wins " + p2Wins);
		console.log("p2Losses " + p2Losses);
		console.log("p1Losses " + p1Losses);

		
	    //connection.update({2: {Losses: p2Losses}}); //update playerTwo losses

		//connection.update({2: {Wins: p2Wins}}); //update playerTwo wins
}