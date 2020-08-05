d3.json('/api/suicides_per_100k_by_year').then(function (data) {
    var gd = document.getElementById('lineDiv');
    var data = [{
        mode: 'lines',
        x:Object.keys(data),
        y:Object.values(data)
    }]
    
    var layout = {
        margin: {l: 150}, 
        width: 600, 
        height: 600,
        title: "Average number of suicides per 100K population<br> from 1997 to 2014",
        xaxis: { title: "Year" },
        yaxis: { title: "Avg number of suicides per year"}
    }
    var config = {responsive: true}

    Plotly.newPlot('line_yearly', data, layout, config);
});