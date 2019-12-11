var timeArray;
var waveQualityList;
var crowdQualityList;

// console.log(timeArray);
// console.log(waveQualityList);
// console.log(crowdQualityList);


var ctx = document.getElementById('dataViz');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeArray,
        datasets: [{
            label: 'Wave',
            data: waveQualityList,
            backgroundColor: ['rgba(0, 102, 204, 0.2)'],
            borderColor: ['rgba(0, 102, 204, 1)'],
            borderWidth: 1
        }, {
            label: 'Crowd',
            data: crowdQualityList,
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1
        }]
    }
});


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
