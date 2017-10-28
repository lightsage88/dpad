
const gBApiKey = '65afeff37ed837e24d6273ee389126d1df1a195c';
// const gBSearch = 'http://www.giantbomb.com/api/search/?query='+ searchTerm +
// 				'api_key='+ gBApiKey +'&format=json&query=&resource=games';
const gBSearch = 'http://www.giantbomb.com/api/search/';

// const gBQuery = 'http://www.giantbomb.com/api/[RESOURCE-TYPE]/'+
// 				'[RESOURCE-ID]/?api_key=[YOUR-KEY]&format=[RESPONSE-DATA-FORMAT]'+
// 				'&field_list=[COMMA-SEPARATED-LIST-OF-RESOURCE-FIELDS]';

//!!!!! gameToken is the giantBomb digit for each game you search for successfully

// const gBQuery = 'http://www.giantbomb.com/api/game/'+
// 				gameToken+'/?api_key='+gBApiKey+'&format=json'+
// 				'&field_list='+queryString;

const queryString = ['name', 'game', 'original_release_date',
					'image','developers', 'reviews', 'platforms'];

function submitFormGetSearchTerm(){
	$('.js-search-form').submit(function(event) {
		console.log('running submitFormGetSearchTerm...');
		event.preventDefault();
		const searchBar = $(this).find('.js-search');
		const searchTerm = searchBar.val();
		searchBar.val('');
		selectGame(searchTerm, collectToken);
	})
//listens for 'submit' and reads the textual form input  
//it holds onto this and calls it [searchTerm] 
//it calls for the getDataFromApi function next and passes it to
//[searchTerm] and a callback function that will displayGBData
}	
							//this callback will be passed to get Json
function selectGame(searchTerm, json_callback) {
	console.log('running selectGame...');
		const search = {
			query: `${searchTerm}`,
			api_key: gBApiKey,
			resource: 'games',
			};
	console.log(search);
		// $.ajax ({
		// url: `https://www.giantbomb.com/api/search/?api_key=${search.api_key}&query=${search.query}&resource=${search.resource}`,
	 //    type: 'GET',
	 //    dataType: 'jsonp',
	 //    json_callback: collectToken,
	 //    crossDomain: true,
	 //  });
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
	// let gameToken = firstTake.slice(0, 9);
	// console.log(gameToken);
	
	
}



$(submitFormGetSearchTerm);