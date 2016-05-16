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
			//if(playerCount > 2){ // needs to be changed

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
			console.log("player name " + playerName);

			connection.once("value", function(snapshot){
			//connection.on("value", function(snapshot){	

				currPlayerCount = snapshot.child("playerCount").val();

				console.log(currPlayerCount);
				connection.update({playerCount: currPlayerCount+1});
				console.log(snapshot.child("playerCount").val());

				connection.push({

					Player: currPlayerCount+1,
					Name: playerName,
					Choice: gameChoice,
					Wins: wins,
					Losses: losses

				});

				$('#intro').hide();
				$('#game').show();

				console.log(currPlayerCount);

			});


			connection.on("child_added", function(snapshot){

				//$('#p' + currPlayerCount +'Name').html(snapshot.child("").val());

			});

		}

	});

	connection.on("child_added", function(snapshot){


	}, function(errorObject){

		console.log("The read failed: " + errorObject.code);


	});





});