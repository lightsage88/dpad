
const gBApiKey = '65afeff37ed837e24d6273ee389126d1df1a195c';
const gBSearch = 'http://www.giantbomb.com/api/search/';
const IGBDKEY = '4a6d0c5e69a9b371f76295af4af727a3';
const IGDBENDPOINT = 'https://api-2445582011268.apicast.io/';

//OUR OBJECT CONSTRUCTOR
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

		$('.js-search-result').prop('hidden', false);

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
	 		{api_key: `${search.api_key}`, 
	 		 query: `${search.query}`,
	 		 resource: `${search.resource}`,
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

//title, image, year, developer, console, reviewScore

function getDetails(data) {
	console.log(`running getDetails...`);
	let details = jQuery.makeArray(data.results);
	console.log('These are the details:' + details);
	cookSearchGame(details);
	researchQueryGames(details);

}

function cookSearchGame(details){
	console.log('cooking up the game you searched for...');
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
	//for zeroing in on Developers
}

function constructGameObject(title, image, releaseYear, devTeam, gameConsole) {
	let game = new videoGame(title, image, releaseYear, devTeam, gameConsole);
	console.log(game);
	displaySearchGame(game);
}

function displaySearchGame(gameObject) {
	console.log('filling shit in');
	$('main').append("<section class='js-search-result'>"+
			"<img src= ''>"+
			"<ul class='searchGameDetails'>"+
			"	<li class='gameName'></li>" +
			"	<li class='releaseYear'></li>"+
			"	<li class='developer'></li>"+
			"	<li class='gameConsole'></li>"+
			"</ul>"+
		"</section>");
	$('.js-search-result').find('img').attr('src', gameObject.image);
	$('.searchGameDetails').find('.gameName').html('Title: '+ gameObject.title);
	$('.searchGameDetails').find('.releaseYear').html('Release Year: ' + gameObject.year);
 	$('.searchGameDetails').find('.developer').html('Developer: ' + gameObject.developer);
	$('.searchGameDetails').find('.gameConsole').html('Console: ' + gameObject.console);
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



function sortDevelopedGames(data) {
	console.log(data);
	let otherWorks = jQuery.makeArray(data.results.developed_games);
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
					url: `https://www.giantbomb.com/api/game/${idCard}`,
					data: {
						api_key: gBApiKey,
						format: 'jsonp',
						json_callback: 'constructGameObject',
						field_list: 'name, original_release_date, image, developers, platforms'
					},
					dataType: 'jsonp'
				});
	}
}


// function useToken(gameToken) {
// 	console.log(`running useToken...`);
// 	$.ajax({
// 		type: 'get',
// 		url: `https://www.giantbomb.com/api/game/${gameToken}/`,
// 		data: {
// 			api_key: gBApiKey,
// 			format: 'jsonp',
// 			json_callback: 'getDetails',
// 			field_list: 'name,original_release_date,image,developers,platforms'
// 		},
// 		dataType: 'jsonp'
// 	});
	
// }

$(submitFormGetSearchTerm);
