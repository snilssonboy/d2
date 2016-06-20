var players = [];

var gameArchive = [];

var Player = function(NAME, ACTIVE, SCORE, HITS){
	this.name = NAME;
	this.active = ACTIVE;
	this.score = SCORE;
	this.hits = HITS;
}

var Game = function(PLAYERS, MODE, ENDDOUBLE, ONGOING, HITS, VICTOR){
	this.players = PLAYERS;
	this.mode = MODE;
	this.enddouble = ENDDOUBLE;
	this.ongoing = ONGOING;
	this.hits = HITS;
	this.victor = VICTOR;
}

$(document).ready(function(){
	$("#dartboard #areas g").children().mousedown(function(){
		if(typeof game != 'undefined' && game.length != 0){
			if(game.hits.length < 3){
				game.hits.push($(this).context.id);
				$(this).css("fill", "#BDE7F5");
				updateHitsPanel();
			}
		}
		
	window.scrollTo(0,1);
	});

	$(document).click(function(event){
		if(typeof game != 'undefined' && game.length != 0){
			if(game.hits.length < 3 && event.target.id === "missButton"){
				game.hits.push("Miss");
				updateHitsPanel();
			}
		}
	});
});

window.onbeforeunload = function() {
  //return "Om du har ett pågående spel försvinner datan om du laddar om sidan!";
};

players.push(new Player("Simon", false, 0, []));
players.push(new Player("Kim", false, 0, []));
players.push(new Player("Jari", false, 0, []));
players.push(new Player("Erik", false, 0, []));


//Shuffle array function
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function calculateScore(){
	var score = 0;

	for(var i = 0; i < game.hits.length; i++){
		if(game.hits[i].substring(0,1) == "S"){
			score += parseInt(game.hits[i].substring(1, game.hits[i].length));
		}else if(game.hits[i].substring(0,1) == "D"){
			score += parseInt(game.hits[i].substring(1, game.hits[i].length)) * 2;
		}else if(game.hits[i].substring(0,1) == "T"){
			score += parseInt(game.hits[i].substring(1, game.hits[i].length)) * 3;
		}else if(game.hits[i] == "Bull"){
			score += 50;
		}else if(game.hits[i] == "Outer"){
			score += 25;
		}

	}

	if(score == 0){
		$("#scoreboard-panel table tbody tr.active td:nth-child(2)").html(game.players[0].score);
		$("#scoreboard-panel table tbody tr.active td:nth-child(3)").html(getOut(game.players[0].score));

		return score;
	}

	if(game.enddouble){
		if((game.players[0].score - score) == 0 && game.hits[game.hits.length - 1].substring(0,1) == "D"){
			$("#scoreboard-panel table tbody tr.active td:nth-child(2)").html((game.players[0].score - score))                   ;
			$("#scoreboard-panel table tbody tr.active td:nth-child(3)").html("-");

			return score;
		}else if((game.players[0].score - score) < 2){
			$("#scoreboard-panel table tbody tr.active td:nth-child(2)").html(game.players[0].score + " (" + (game.players[0].score - score) + ") FET");	
			$("#scoreboard-panel table tbody tr.active td:nth-child(3)").html("-");

			return score;
		}else{
			$("#scoreboard-panel table tbody tr.active td:nth-child(2)").html(game.players[0].score + " (" + (game.players[0].score - score) + ")");
			$("#scoreboard-panel table tbody tr.active td:nth-child(3)").html(getOut(game.players[0].score - score));

			return score;	
		}
	}else{
		if((game.players[0].score - score) == 0){
			$("#scoreboard-panel table tbody tr.active td:nth-child(2)").html((game.players[0].score - score))                   ;
			$("#scoreboard-panel table tbody tr.active td:nth-child(3)").html("-");

			return score;
		}else if((game.players[0].score - score) < 0){
			$("#scoreboard-panel table tbody tr.active td:nth-child(2)").html(game.players[0].score + " (" + (game.players[0].score - score) + ") FET");	
			$("#scoreboard-panel table tbody tr.active td:nth-child(3)").html("-");

			return score;
		}else{
			$("#scoreboard-panel table tbody tr.active td:nth-child(2)").html(game.players[0].score + " (" + (game.players[0].score - score) + ")");
			$("#scoreboard-panel table tbody tr.active td:nth-child(3)").html(getOut(game.players[0].score - score));

			return score;	
		}
	}
}

function updateHitsPanel(){
	$("#hits-panel div").html("");
	$("#dartboard #areas g").children().css("fill", "");

	if(typeof game != 'undefined' && game.length != 0){
		for(var i = 0; i < game.hits.length; i++){
			$("#hits-panel div").append("<button type='button' class='btn btn-default' onclick='removeHit(" + i + ")'>" + game.hits[i] + "</button>")
			$("#" + game.hits[i]).css("fill", "#BDE7F5");
		}

		calculateScore();	
	}
	
}

function removeHit(i){
	game.hits.splice(i, 1);
	updateHitsPanel();
}

function updatePlayerList(){
	$("#new-game-players").html("");

	for(var i = 0; i < players.length; i++){
		if(players[i].active){
			$("#new-game-players").append("<tr class='active'><th>" + players[i].name + "</th><td><div id='custom-button-red' onclick='toggleActive(" + i + ")'><i class='fa fa-minus' aria-hidden='true'></i></div></td><td style='text-align: right'><div class='pull-right' id='custom-button-red' onclick='removePlayer(" + i + ")'><i class='fa fa-times' aria-hidden='true'></i></div></td></tr>");	
		}
		
	}

	for(var x = 0; x < players.length; x++){
		if(!players[x].active){
			$("#new-game-players").append("<tr><th>" + players[x].name + "</th><td><div id='custom-button-green' onclick='toggleActive(" + x + ")'><i class='fa fa-plus' aria-hidden='true'></i></div></td><td style='text-align: right'><div class='pull-right' id='custom-button-red' onclick='removePlayer(" + x + ")'><i class='fa fa-times' aria-hidden='true'></i></div></td></tr>");	
		}
	}
	
}

function updateJoinList(){
	$("#join-players").html("");

	for(var i = 0; i < game.players.length; i++){
		$("#join-players").append("<tr class='active'><th>" + game.players[i].name + "</th><td><div style='text-align: right' id='custom-button-red' onclick='joinLeaveGame(" + i + "," + true + ")'><i class='fa fa-minus' aria-hidden='true'></i></div></td></tr>");
	}

	for(var x = 0; x < players.length; x++){
		if(!players[x].active){
			$("#join-players").append("<tr><th>" + players[x].name + "</th><td><div style='text-align: right' id='custom-button-green' onclick='joinLeaveGame(" + x + "," + false + ")'><i class='fa fa-plus' aria-hidden='true'></i></div></td></tr>");
		}
	}
}

function joinLeaveGame(id, ingame){
	var confirm;

	if(ingame){
		confirm = window.confirm("Är du säker att du vill ta bort " + game.players[id].name + " från pågående spel?");
		if(confirm){
			for(var i = 0; i < players.length; i++){
				if(players[i].name === game.players[id].name){
					players[i].active = false;
				}
			}
			game.players.splice(id, 1);
		}
	}else{
		confirm = window.confirm("Du är på väg att lägga till " + players[id].name + " i spelet, stämmer detta?");
		if(confirm){
			players[id].active = true;
			players[id].score = game.mode;
			game.players.push(players[id]);
		}
	}

	updateJoinList();
	gameManager();
}

function toggleActive(i){
	players[i].active = !players[i].active;

	updatePlayerList();
}

function getOut(score){
	var out = outs[score];

	if(score > 182){
		return "T20, T20, T20";
	}else if(score > 170 && score < 182){
		if(score % 2 == 0){
			return "T20, T20, D20";
		}else{
			return "T20, T20, T15";
		}
	}else if(typeof out != 'undefined'){
		return out;
	}else{
		return "";
	}
}

function gameManager(){
	updateHitsPanel();
	$("#player-table").html("");


	if(typeof game != 'undefined' && game.length != 0){
		for(var i = 0; i < game.players.length; i++){
			var lastHits;

			if(game.players[i].hits.length != 0){
				lastHits = game.players[i].hits[game.players[i].hits.length - 1];	
			}else{
				lastHits = "-";
			}
			

			if(i == 0){
				$("#player-table").append("<tr class='active'><th>" + game.players[i].name + "</th><td>" + game.players[i].score + "</td><td>" + getOut(game.players[i].score) + "</td><td>" + lastHits + "</td></tr>");	
			}else{
				$("#player-table").append("<tr><th>" + game.players[i].name + "</th><td>" + game.players[i].score + "</td><td>" + getOut(game.players[i].score) + "</td><td>" + lastHits + "</td></tr>");
			}
		}
	}
	
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

function clearInput(){
	$("#new-player-name").val("");
	$("#join-new-player-name").val("");
}

function createNewPlayer(){
	var name = $("#new-player-name").val();

	players.push(new Player(name, false, 0, []));

	clearInput();
	updatePlayerList();
}

function joinCreateNewPlayer(){
	var name = $("#join-new-player-name").val();

	players.push(new Player(name, false, 0, []));

	clearInput();
	updateJoinList();
}

function addScore(){

	game.players[0].hits.push(game.hits);

	if(game.enddouble){
		console.log("If enddouble");
		if((game.players[0].score - calculateScore()) == 0 && game.hits[game.hits.length - 1].substring(0,1) == "D"){
			game.players[0].score -= calculateScore();

			game.victor.push(game.players[0]);
			game.ongoing = false;
			gameArchive.push(game);

			$("#abort-button").addClass("hidden");
			$("#join-button").addClass("hidden");

			$("#undoButton").addClass("hidden");
			$("#missButton").addClass("hidden");
			$("#doneButton").addClass("hidden");

			$("#openStats").removeClass("hidden");
			$("#openSettings").removeClass("hidden");
			$("#openStart").removeClass("hidden");

			return window.alert(game.players[0].name + " är segraren!");
		}else if((game.players[0].score - calculateScore()) < 2){
			console.log("enddouble fet");
		}else{
			console.log("enddouble inte fet");

			console.log(game.players[0].score - calculateScore());

			game.players[0].score -= calculateScore();
		}
	}else{
		if(game.players[0].score - calculateScore() == 0){
			game.players[0].score -= calculateScore();

			game.victor.push(game.players[0]);
			game.ongoing = false;
			gameArchive.push(game);

			$("#abort-button").addClass("hidden");
			$("#join-button").addClass("hidden");

			$("#undoButton").addClass("hidden");
			$("#missButton").addClass("hidden");
			$("#doneButton").addClass("hidden");

			$("#openStats").removeClass("hidden");
			$("#openSettings").removeClass("hidden");
			$("#openStart").removeClass("hidden");

			return window.alert(game.players[0].name + " är segraren!");
		}else if((game.players[0].score - calculateScore()) < 0){
			console.log("no enddouble fet");
		}else{
			game.players[0].score -= calculateScore();

			console.log("no enddouble inte fet");
		}
	}
	
	game.players.move(0, game.players.length - 1);

	game.hits = [];
	gameManager();
}

function undoLast(){
	if(game.players[game.players.length - 1].hits.length != 0){
		game.players.move(game.players.length - 1, 0);

		game.hits = [];

		game.hits = game.players[0].hits[game.players[0].hits.length - 1];

		game.players[0].score += calculateScore(game.hits);

		game.players[0].hits.splice(game.players[0].hits.length - 1, 1);

		gameManager();	
	}else{
		window.alert("Går inte att backa mer");
	}
	
}

function startNewGame(){
	console.log("Startar spel"); 

	var gamemode;

	if($("#mode_101").prop("checked")){
		gamemode = 101;
	}else if($("#mode_301").prop("checked")){
		gamemode = 301;
	}else if($("#mode_501").prop("checked")){
		gamemode = 501;
	}else if($("#mode_clock").prop("checked")){
		gamemode = 999;
	}

	var activePlayers = [];

	for(var i = 0; i < players.length; i++){
		if(players[i].active){
			activePlayers.push(players[i]);
		}
	}

	if(activePlayers.length < 1){
		return window.alert("Inte nog med spelare");
	}else{
		shuffle(activePlayers);

		//Create game with variables: Players[], mode(int), end_dobule(bool), ongoing(bool), hits[], victor[]
		game = new Game(activePlayers, gamemode, $(".switch-input").prop("checked"), true, [], []);
		for(var i = 0; i < game.players.length; i++){
			game.players[i].score = gamemode;
			game.players[i].hits = [];
		}
		console.log("Spel startat, game mode: " + gamemode);
	}

	$("#abort-button").removeClass("hidden");
	$("#join-button").removeClass("hidden");

	$("#openStats").addClass("hidden");
	$("#openSettings").addClass("hidden");
	$("#openStart").addClass("hidden");

	$("#undoButton").removeClass("hidden");
	$("#missButton").removeClass("hidden");
	$("#doneButton").removeClass("hidden");

	gameManager();
	clearInput();
}

function abortCurrentGame(){
	var confirm = window.confirm("Är du säker på att du vill avsulta pågående spel?");

	if(confirm){
		game = [];
		updateHitsPanel();
		gameManager();

		$("#abort-button").addClass("hidden");
		$("#join-button").addClass("hidden");

		$("#undoButton").addClass("hidden");
		$("#missButton").addClass("hidden");
		$("#doneButton").addClass("hidden");

		$("#openStats").removeClass("hidden");
		$("#openSettings").removeClass("hidden");
		$("#openStart").removeClass("hidden");
	}else{
		return;
	}
}