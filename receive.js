var adafruitUsername = 'Aishj';
var adafruitFeed = 'myfeed';
var adafruitAioKey = '041e1f8f40ae42a994e82e83b2e15983';
var start_time = '2019-12-05T00:00';
var end_time = '2019-12-07T00:00';

var myChart;
var waveQualityList = [];
var crowdQualityList = [];
var timeArray = [];
var graph = [];
var testArray = [];

setInterval(function(){
  getAdaIO(adafruitUsername, adafruitFeed, adafruitAioKey, getData);
}, 2000);

getAdaIORange(adafruitUsername, adafruitFeed, adafruitAioKey, start_time, end_time, getDataRange);
// ***** check when there's new data

function getData (data) {
    $("#time").text(data.created_at[0] + data.created_at[1] + data.created_at[2]
      + data.created_at[3] + data.created_at[4] + data.created_at[5] + data.created_at[6]
      + data.created_at[7] + data.created_at[8] + data.created_at[9]);

    // var lastData = data.value;
    // var listSecond = lastData.split(",");
    // var currentValue4 = 0;
    // var currentValue5 = 0;
    //
    // var waveQualityNew = parseInt(listSecond[0]);
    // if (currentValue4 != waveQualityNew && waveQualityList[waveQualityList.length-1] != waveQualityNew) {
    //   waveQualityList.push(waveQualityNew);
    //   currentValue4 = waveQualityNew;
    //
    //   console.log(waveQualityList);
    //   myChart.update();
    // }
    //
    // var crowdQualityNew = parseInt(listSecond[1]);
    // if (currentValue5 != crowdQualityNew && crowdQualityList[crowdQualityList.length-1] != crowdQualityNew) {
    //   crowdQualityList.push(crowdQualityNew);
    //   currentValue5 = crowdQualityNew;
    //
    //   console.log(crowdQualityList);
    //   myChart.update();
    // }
}

function getDataRange (data) {
    for (i in data) {
        var dataValue = data[i].value;
        var list = dataValue.split(",");
        var currentValue1 = 0;
        var currentValue2 = 0;
        var currentValue3 = 0;

        var waveQuality = parseInt(list[0]);
        if (currentValue1 != waveQuality) {
          waveQualityList.push(waveQuality);
          currentValue1 = waveQuality;
        }

        var crowdQuality = parseInt(list[1]);
        if (currentValue2 != crowdQuality) {
          crowdQualityList.push(crowdQuality);
          currentValue2 = crowdQuality;
        }

        var timeValue = data[i].created_at;
        var timeList = timeValue.split("T");
        var timeStamp = timeList[0];
        var timeFormatInt = parseInt(timeStamp[0] + timeStamp[1] + timeStamp[2] + timeStamp[3]
                          + timeStamp[5] + timeStamp[6] + timeStamp[8] + timeStamp[9]);
        if (currentValue3 != timeFormatInt) {
          timeArray.push(timeStamp);
          currentValue3 = timeFormatInt;
        }
    }

    for (var i=0; i<timeArray.length && i<waveQualityList.length && i<crowdQualityList.length; i++) {
        var arrayOne = {
          "Date": timeArray[i],
          "Wave Quality": waveQualityList[i],
          "Crowd Quality": crowdQualityList[i]
        }
        graph.push(arrayOne);
        testArray = arrayOne;
    }

    waveQualityList.reverse();
    crowdQualityList.reverse();
    timeArray.reverse();
    graph.reverse();

    // $("#dataStream").text(JSON.stringify(graph));
}
