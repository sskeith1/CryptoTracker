
// variables to reference the API.
var queryURL;
var query2URL;
var altCoin;
var CCval;
var percentChange24hr;
var percentChange1hr;
var percentChange7d;
var CCname;
var altCoinPrices = [];
var datapoints = [];
var tickerInfo;
var currency;
var buyPrice;
var sellPrice;
var currencyType = "USD";
var amount;
var convertedToBTC;
var time = 0;
var trackTilNow;
var peekBack
var stopLogging = false;


//Formula
var userInputPercentChangeBuy;
var userInputPercentChangeSell;
var trackTilNowNew;
var chartContainerNew;
var datapointsNew = [];
var txt;
var buy;
var chartNew;
var updateTimer;
var newTime;



function hide()
{

	$('#sell-box').hide();
	
}

function showBuy()
{
	
	$('#buy-box').show();

}
function showSell()
{

	$('#sell-box').show();
	
}


// function ajaxCall() {
var ajaxCall = function(){
$.ajax({

	url: queryURL,
	method: "GET"

}).done(function(response) {
		//cryptocurrency values, percentage changes, and names
	 	
	 	percentChange24hr = response[0].percent_change_24h;
	 	percentChange1hr = response[0].percent_change_1h;
	 	percentChange7d = response[0].percent_change_7d

	 	$('#day7').html(percentChange7d+"%");
	 	$('#hr24').html(percentChange24hr+"%");
	 	$('#hr1').html(percentChange1hr+"%");

	 	CCval = response[0].price_btc;
	 	CCname = response[0].name;
	 	CCsymbol = response[0].symbol;
	 	altCoinPrices.unshift(CCval);
	 	time+=6;
	 	datapoints.push({
	 		y: parseFloat(CCval),
	 		x : time-6,
	 	})
	 	if (stopLogging == false)
	 	{
		 	datapointsNew.push({
		 		y: parseFloat(CCval),
		 		x : newTime+=6,
		 	})
		 }
		 })


		if(buy){
			trackTilNowNew = (((altCoinPrices[0] - datapointsNew[0].y)/altCoinPrices[0])*100);
		 	$('#percent-change-new').html("Percentage change of " + altCoin +" since buy: " + parseFloat(trackTilNowNew) + "% (currently at: " + CCval + ")");
		}
		if(datapoints[0]){
			trackTilNow = (((altCoinPrices[0] - altCoinPrices[altCoinPrices.length-1])/altCoinPrices[altCoinPrices.length-1])*100);
			$('#percent-change').html("Percentage change of " + altCoin +" since initiation: " + parseFloat(trackTilNow) + "% (currently at: " + altCoinPrices[0] + ")")
		}

//creates chart and logs data from API
var chart = new CanvasJS.Chart("chartContainer",{
			title :{
				text:   "Current " + altCoin+ " prices"			},			
			data: [{
				type: "line",
				lineColor: "#ff4d4d",
				color: "black",
				dataPoints: datapoints,
				markerType: "square", 
			}],
			axisY:{
				lineColor: "black",
				minimum: 0,
				labelFontColor: "black",
				// maximum:  datapoints[0].y + datapoints[0].y * .6
			},
			axisX:{
				lineColor: "black",
				minimum: 0,
				labelFontColor: "black",
			}
		});

		
		var updateInterval = 100;
		var dataLength = 300; // number of dataPoints visible at any point

		var updateChart = function () {
			if (datapoints.length > dataLength)
			{
				datapoints.shift();				
			}
			
			chart.render();	
			};	

	

		// generates first set of dataPoints
		updateChart(); 

		// update chart after specified time. 
		setInterval(function(){updateChart()}, updateInterval)
};

//function for displaying ticker information
function ajaxCall2()  {
		query2URL = "https://blockchain.info/ticker";
$.ajax({

		url: query2URL,
		method: "GET"

		}).done(function(response, ticker) {
		
		tickerInfo = response[currencyType].last;
		currency = response[currencyType].symbol;
		sellPrice = response[currencyType].sell;
		buyPrice = response[currencyType].buy;

		// console.log(response);
		 $('#ticker1').html("<div id='currency-tag1'>"+currencyType+"</div>" +"<br>"  + "<div id='currency-tag2'>" + currency + tickerInfo + "</div><br>"  + "<div id='currency-tag3'> Bitcoin value </div>");
		 $('#ticker2').html("<br>" + "<div id='currency-tag2'>" + currency + sellPrice +"</div> <br>"  + "<div id='currency-tag3'>Last sell price</div>");
		 $('#ticker3').html("<br>"+ "<div id='currency-tag2'>" + currency + buyPrice + "</div> <br>"  + "<div id='currency-tag3'>Last buy price</div>");

});

}

//converts any currency type to bitcoin
function ajaxCall3(){

	$.ajax({
		url: query3URL,
		method: "GET"

		}).done(function(response){

		convertedToBTC = response;
		$('.form-answer-container').html(currency+amount+" = "+convertedToBTC + " BTC");
		 });

}




//performs rate of change calculation every 6 seconds
$('#submit').on("click",function(event){
		event.preventDefault();
		datapoints=[];
		altCoinPrices=[];
		altCoin = $('#user-input').val()
		altCoin = altCoin.replace(/\s+/g, '-').toLowerCase();
		// console.log(altCoin);
		queryURL = "https://api.coinmarketcap.com/v1/ticker/" + altCoin + "/";
		ajaxCall();
		setInterval(function(){ ajaxCall();}, 6000);

});

 //updates ticker every 6 seconds
		ajaxCall2();
		setInterval(function(){ ajaxCall2(); }, 6000);

$('#convert').on("click",function(event){
		event.preventDefault();
		ajaxCall2();
		currencyType = $('#currency-input').val();
		currencyType = currencyType.toUpperCase();
		amount = $('#amount-input').val();
		// console.log(currencyType);
		query3URL = "https://blockchain.info/tobtc?currency=" + currencyType + "&value=" + amount;
		ajaxCall3();
});	

hide();
$('#buy').on("click",function(event){
	event.preventDefault()
	$('#buy-box').hide()
	showSell();

	
	if ($("#buy-input").val() <= trackTilNow) {
		buyNow();
	}
});
	$('#sell').on("click",function(event){
			event.preventDefault()
if ($("#sell-input").val() <= trackTilNowNew) {
		buy = false
		stopLogging = true;
		$('#percent-change-new').html("The total percentage change of " + altCoin +" since you bought it has been " + parseFloat(trackTilNowNew) +
		 "%. Upon your trade, you made roughly " + ((datapointsNew[datapointsNew.length-1].y) * (parseFloat(trackTilNowNew))) + " bitcoins!");

		// chartNew.destroy();
		chartNew = null;
		datapointsNew = [];
		clearInterval(updateTimer)
		console.log(datapointsNew)
	
	}
});

$(".reset").on("click",function(event){
	location.reload();
});	


//Formula LOGIC

var buyNow = function() {
 		txt;
 		buy = true
 				newTime = 0
 //				var citrus = fruits.slice(3);
 					dataPointsNew = [];
 					console.log("initial " + datapointsNew);

 					datapointsNew = []
 					datapointsNew.push({
 						x: 0,
 						y: datapoints[datapoints.length-1].y,
 					})

 					console.log("after: " + datapointsNew);
 					
 					chartNew = new CanvasJS.Chart("chartContainerNew",{
						title :{
							text:   "After Buy " + altCoin+ " prices"
						},			
						data: [{
							type: "line",
							lineColor: "#ff4d4d",
							color: "black",
							markerType: "square",
							dataPoints: datapointsNew 
						}],
						axisY:{
							lineColor: "black",
							labelFontColor: "black",
							minimum: 0,
							maximum:  datapointsNew[datapointsNew.length-1].y + datapointsNew[datapointsNew.length-1].y * .6
						},
						axisX:{
							lineColor: "black",
							labelFontColor: "black",
							minimum: 0
						}
					});

				
				var updateInterval = 100;
				var dataLengthNew = 300; // number of dataPointsNew visible at any point

				var updateChartNew = function () {
					if (datapointsNew.length > dataLengthNew)
					{
						datapointsNew.shift();				
					}
					
					chartNew.render();
	
					};	

		
				// generates first set of dataPoints
				updateChartNew(); 

				// update chart after specified time. 
				updateTimer = setInterval(function(){updateChartNew()}, updateInterval)

	};
