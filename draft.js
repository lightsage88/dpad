
const gBApiKey = '65afeff37ed837e24d6273ee389126d1df1a195c';
const gBSearch = 'http://www.giantbomb.com/api/search/';


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
	let gameToken = urlString.slice(35,45);
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
	constructSearchGameObject(title, image, releaseYear, devTeam, gameConsole);
	//for zeroing in on Developers
}

function constructSearchGameObject(title, image, releaseYear, devTeam, gameConsole) {
	let game0 = new videoGame(title, image, releaseYear, devTeam, gameConsole);
	console.log(game0);
	displaySearchGame(game0);
}

function displaySearchGame(gameObject) {
	console.log('filling shit in');
	$('main').html("<section class='js-search-result'>"+
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
	let devCode = devTag.slice(38,46);
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
	let details = jQuery.makeArray(data.results);
	console.log(details);
	console.log('behold: ' + details[0].developed_games);
	
}



$(submitFormGetSearchTerm);
