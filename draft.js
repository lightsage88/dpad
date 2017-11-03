
const gBApiKey = '65afeff37ed837e24d6273ee389126d1df1a195c';
const gBSearch = 'http://www.giantbomb.com/api/search/';
let gameLibrary = [];
let primeTitle = '';
let superCount = null;

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
		gameLibrary = [];
		superCount = null;
		$('.soughtGame').empty();
		$('.games').empty();
		const searchBar = $(this).find('.js-search');
		const searchTerm = searchBar.val();
		searchBar.val('');
		selectGame(searchTerm);
	})
}	

function selectGame(searchTerm) {
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
	let gameToken = data.results[0].api_detail_url.slice(35).replace('/','');
	console.log(gameToken);
	console.log('We made a gameToken for ' + data.results[0].name);
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
	console.log('running getDetails...');
	console.log(data);
	let soughtGame = jQuery.makeArray(data.results);
	let title = soughtGame[0].name;
	primeTitle = soughtGame[0].name;
	let image = soughtGame[0].image.thumb_url;
	let year = soughtGame[0].original_release_date.slice(0,4);
			if(soughtGame[0].original_release_date == null) {
				soughtGame[0].original_release_date === '1990';
			} else {}
	let developer = soughtGame[0].developers[0].name;
	let gameConsole = [];
		for (let i=0; i< soughtGame[0].platforms.length; i++) {
						gameConsole.push(' '+ soughtGame[0].platforms[i].name);
				}
		$('.soughtGame').append(`
		<h2 class='sought'>You searched for<br><strong>${title}</strong>!</h2>
			<ul class='game'>
				<li class='image'><img src='${image}'></li>
				<li class='primeTitle'>${title}</li>
				<li class='year'>Year: ${year}</li>
				<li class='developer'>Developer: ${developer}</li>
				<li class='console'>Available on: ${gameConsole}</li>
			</ul>
		`);
	researchQueryGames(data);
}





	
function sonicSpeed(data) {
	console.log('running at Sonic Speed!');
	let ringBag = jQuery.makeArray(data.results);
	console.log(ringBag);
	let title = ringBag[0].name;
	let image = ringBag[0].image.thumb_url;
	//let year = ringBag[0].original_release_date.slice(0,4);				
	let year = '0';

			if(ringBag[0].original_release_date == null) {
				console.log('The year is null...crap');
				year = '2018';
				console.log('the year is now 1990, cargo pants are in!');
			} else {
				year = ringBag[0].original_release_date.slice(0,4);

			}
	let devTeam = ringBag[0].developers[0].name;
	let gameConsole = [];
					for (let i=0; i<ringBag[0].platforms.length; i++) {
						gameConsole.push(' ' + ringBag[0].platforms[i].name);
					}
	constructGameObject(title, image, year, devTeam, gameConsole);
}



function constructGameObject(title, image, year, devTeam, gameConsole) {
	let game = new videoGame(title, image, year, devTeam, gameConsole);
	console.log(game);
	gameLibrary.push(game);
	console.log(gameLibrary);
	console.log('behold the game library! It is ' + gameLibrary.length + ' parts long!');
	console.log(superCount + 'is the magic number');
		if(gameLibrary.length === superCount) {
				sortLibrary(gameLibrary);
			}



}

function sortLibrary(gameLibrary) {
	console.log(gameLibrary);
		gameLibrary.sort(function (a, b) {
			return a.year - b.year;
		});
		gameLibrary.sort(function (a,b){
			return a.year + b.year;
		});
		for(let i = 0; i < gameLibrary.length; i++) {
			if(gameLibrary[i].title == primeTitle){
				gameLibrary.splice(i, 1);
				superCount = gameLibrary.length;
			}
		}
	console.log('hopefully we are super sorted now...');
	console.log(gameLibrary);
	displayVideoGame(gameLibrary);
}

function displayVideoGame(array) {
	$('.games').prepend(`<h3 class= 'otros'>Here are other games 
		made by the same
		developer</h3>`);
	console.log(array);

	


	for(let i = 0; i <= gameLibrary.length; i++){

		$('.games').append(`
		<img src=${array[i].image}>
		<ul class='game'>
			<li class='title'>${array[i].title}</li>
			<li class='year'>Year: ${array[i].year}</li>
			<li class='developer'>Developer: ${array[i].developer}</li>
			<li class='console'>Available on: ${array[i].console}</li>
		</ul>`);
	}

	return;
}




function researchQueryGames(data){
	//need to get data from this parsed to a point where I can get to the developer api code
	let details = jQuery.makeArray(data.results);
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
			field_list: 'developed_games',
			scope: {
				limit: 5
			}
		},
		dataType: 'jsonp',
		scope: {
			limit: 5
		}
	});
}



function sortDevelopedGames(data) {
	console.log(data);
	console.log('see the token');
	let otherWorks = jQuery.makeArray(data.results.developed_games);
	console.log(otherWorks.length);
	if(otherWorks.length <=10 ) {
		superCount = otherWorks.length;
	} else {
		superCount = 10;
	}
	console.log(superCount);
	console.log('behold the other games, these nerds made!');
	let selectedWorks = [];
	function blip(otherWorks) {
		console.log(`otherWorks is ${otherWorks.length} long!`);
			for(let i=0; i <=superCount; i++) {
				
				let zipcode = otherWorks[i].api_detail_url.slice(35).replace('/','');
				
				$.ajax({
					type: 'get',
					url: `https://www.giantbomb.com/api/game/${zipcode}/`,
					data: {
						api_key: gBApiKey,
						format: 'jsonp',
						json_callback: 'sonicSpeed',
						field_list: 'name,original_release_date,image,developers,platforms'
					},
					dataType: 'jsonp'
				});

			}
		}
	blip(otherWorks);
	console.log(`selectedWorks is ${selectedWorks.length}`);
	console.log(selectedWorks);
}











$(submitFormGetSearchTerm);
