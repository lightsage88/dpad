
const gBApiKey = '65afeff37ed837e24d6273ee389126d1df1a195c';
const gBSearch = 'http://www.giantbomb.com/api/search/';
const gameLibrary = [];
//OUR videoGame OBJECT CONSTRUCTOR
function videoGame(title, image, year, developer, console){
	this.title = title;
	this.image = image;
	this.year = year;
	this.developer = developer;
	this.console = [console];
//	this.reviewScore = reviewScore;
}

function submitFormGetSearchTerm(){
	$('.js-search-form').submit(function(event) {
		console.log('running submitFormGetSearchTerm...');
		event.preventDefault();
		$('.js-search-result').empty();
		const searchBar = $(this).find('.js-search');
		const searchTerm = searchBar.val();
		searchBar.val('');
		selectGame(searchTerm, collectToken);
	})
}	

function selectGame(searchTerm, json_callback) {
	console.log('running selectGame...');
		const search = {
			query: `${searchTerm}`,
			api_key: gBApiKey,
			resource: 'games',
			};
	console.log(search);
		
	 $.ajax({
	 	type: 'get',
	 	url: 'https://www.giantbomb.com/api/search/',
	 	data: 
	 		{api_key: `${gBApiKey}`, 
	 		 query: `${searchTerm}`,
	 		 resource: `games`,
	 		 format: 'jsonp',
	 		 json_callback: 'collectToken'
	 		},
	 	dataType: 'jsonp',
	 });

}


function collectToken(data) {

	console.log('running collectToken...');
	console.log(data);
	let firstTitle = data.results[0];
	console.log(firstTitle);
	let urlString = firstTitle.api_detail_url;
	console.log('This is the thing we will cut the code from: ' + urlString);
	console.log(urlString.length);
	let gameToken = urlString.slice(35).replace('/', '');

	console.log(gameToken);
	useToken(gameToken);	
}

function useToken(gameToken) {
	console.log(`running useToken...`);
	$.ajax({
		type: 'get',
		url: `https://www.giantbomb.com/api/game/${gameToken}/`,
		data: {
			api_key: gBApiKey,
			format: 'jsonp',
			json_callback: 'getDetails',
			field_list: 'name,original_release_date,image,developers,platforms'
		},
		dataType: 'jsonp'
	});
	
}
//fuck dry, after cooking up search details
function getDetails(data) {
	console.log(`running getDetails...`);
	console.log(data);
	cookSearchGame(data);
	let details = jQuery.makeArray(data.results);
	console.log('These are the details:' + details);
	researchQueryGames(details);

}

function cookSearchGame(data){
	console.log('cooking up the game you searched for...');
	let details = jQuery.makeArray(data.results);
	console.log(details);
	let title = details[0].name;
		let image = details[0].image.thumb_url;
				let fullReleaseDate = details[0].original_release_date;
		let releaseYear = fullReleaseDate.slice(0,4);
		let devTeam = details[0].developers[0].name;
		let gameConsole = [];
				for (let i=0; i< details[0].platforms.length; i++) {
						gameConsole.push(' '+ details[0].platforms[i].name);
				}
	constructGameObject(title, image, releaseYear, devTeam, gameConsole);
}

function constructGameObject(title, image, releaseYear, devTeam, gameConsole) {
	let game = new videoGame(title, image, releaseYear, devTeam, gameConsole);
	console.log(game);
	gameLibrary.push(game);
	gameLibrary.sort(function(a,b){
		return a.year + b.year;
	});
	//displayVideoGame(game);
	console.log(gameLibrary);
}
// t
// function sortLibrary(gameLibrary)
// ///arrays don'

function displayVideoGame(game) {
	$('.games').append(`
		<img src=${game.image}>
		<ul class='game'>
			<li class='title'>${game.title}</li>
			<li class='year'>${game.year}</li>
			<li class='developer'>${game.developer}</li>
			<li class='console'>${game.console}</li>
		</ul>`);
}




function researchQueryGames(details){
	console.log('cooking up games made by the same developer...');
	let devTag = details[0].developers[0].api_detail_url;
	console.log('this is the devTag from which we will do the cutting: ' + devTag);
	let devCode = devTag.slice(38).replace('/','');
	console.log('This is what we will use to find the developers profile: ' + devCode);
 	
	$.ajax({
		type: 'get',
		url: `https://www.giantbomb.com/api/company/${devCode}/`,
		data: {
			api_key: gBApiKey,
			format: 'jsonp',
			json_callback: 'sortDevelopedGames',
			field_list: 'developed_games'
		},
		dataType: 'jsonp'
	});
}



function sortDevelopedGames(data, gameToken) {
	console.log(data);
	console.log(gameToken);
	console.log('see the token');
	let otherWorks = jQuery.makeArray(data.results.developed_games);
	console.log('behold the other games, these nerds made!');
		//consider passing in the gametoken so we don't repeat the same game in the DOM
	console.log(otherWorks);

	getTokensFromDevelopedGames(otherWorks);
	
}
//otherworks is an array
function getTokensFromDevelopedGames(otherWorks) {
console.log(otherWorks[0].api_detail_url + ' just a taste of what we need');
let coinPurse = [];
for(let i = 0; i<=otherWorks.length -1 ; i++) {
	coinPurse.push(otherWorks[i].api_detail_url.slice(35).replace('/',''));
}
console.log(coinPurse);
gatherInfoOnOtherGames(coinPurse);
}

function gatherInfoOnOtherGames(coinPurse) {
console.log(coinPurse);
	for(let i = 0; i<=coinPurse.length -1; i++){
		let idCard = coinPurse[i]
				$.ajax({
					type:'get',
					url: `https://www.giantbomb.com/api/game/${idCard}/`,
					data: {
						api_key: gBApiKey,
						format: 'jsonp',
						json_callback: 'cookSearchGame',
						field_list: 'name,original_release_date,image,developers,platforms'
					},
					dataType: 'jsonp'
				});
	}
	console.log('This is our grand collection!: ' + gameLibrary);
	console.log(gameLibrary);

}





$(submitFormGetSearchTerm);
