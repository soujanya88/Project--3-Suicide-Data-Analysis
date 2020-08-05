// Load the data and plot the default pie chart
d3.json('/api/suicides_by_gender').then(function(data){
    // console.log(data) 
    var labels = Object.keys(data)
    var values = Object.values(data)
    var trace = {
        type: 'pie',
        labels: labels,
        values: values
    }   
    var layout = {
        width: 450,
        height: 450,
        title:'Suicides by Gender'
    }
    var config = {responsive: true}
    Plotly.newPlot('pie_gender', [trace], layout, config);
});

d3.json('/api/suicides_and_gdp').then(function(data){
   
    var countries = []
    var suicides = []
    var gdp = []

    Object.entries(data).forEach(function([key,value]){
        countries.push(key);
        suicides.push(value.suicides);
        gdp.push(value.gdp)
    })
    
    var trace1 = {
        x: gdp,
        y: suicides,
        mode: 'markers',
        type: 'scatter',
        name: 'Suicides vs GDP',
        text: countries,
        marker: { size: 12 }
      };
    
    var data = [trace1];
    
    var layout = {
        width: 450,
        height: 450,
        xaxis: {
            title: 'gdp per capita'
        },
        yaxis: {
            title: 'suicides rates per 100k'
        },
        title:'Suicides vs GDP'
    };
    
    var config = {responsive: true}

    Plotly.newPlot('scatter_gdp', data, layout, config);
});

 // Suicides by Country
 d3.json('/api/suicides_by_TopTenCountry').then(function(data){
    
    // Sort the objects in ascending order
    let sortedlist = Object.entries(data).sort((a, b) => a[1] - b[1]);
    console.log(sortedlist)
  
    var keys = []
    var values = []
  
    sortedlist.forEach(country=>{
      keys.push(country[0]);
      values.push(country[1])
    })
    
    var data = [
      {
        type: 'bar',
        x: values,
        y: keys,
        orientation: "h"
      },
    ];
    var layout = {
        title: "Countries with the highest suicide rates",
        autosize: false,
        width: 450,
        height: 450,
        margin: {
          l: 150,
          r: 50,
          b: 50,
          t: 50,
          pad: 4
        }
    }
    var config = {responsive: true}
    Plotly.newPlot('bar_by_country', data, layout, config);
  });

d3.json('/api/suicides_per_100k_by_year').then(function (data) {
    var gd = document.getElementById('lineDiv');
    var data = [{
        mode: 'lines',
        x:Object.keys(data),
        y:Object.values(data)
    }]
    
    var layout = {
        margin: {l: 150}, 
        width: 450, 
        height: 450,
        title: "Average number of suicides per 100K population<br> from 1997 to 2014",
        xaxis: { title: "Year" },
        yaxis: { title: "Avg number of suicides per year"}
    }
    var config = {responsive: true}

    Plotly.newPlot('line_yearly', data, layout, config);
});


// Suicides by Age
d3.json('/api/suicides_by_age').then(function(data){
    var bubbleLabels = Object.keys(data)
    var bubbleValues = Object.values(data)
    var trace1 = {
      x: bubbleLabels,
      y: bubbleValues,
      mode: 'markers',
      marker: {
        size: [40, 50, 60, 30, 55, 35],
        color: bubbleValues,
        colorscale: [
              ['0.0', 'rgb(165,0,38)'],
              ['0.111111111111', 'rgb(215,48,39)'],
              ['0.222222222222', 'rgb(244,109,67)'],
              ['0.333333333333', 'rgb(253,174,97)'],
              ['0.444444444444', 'rgb(254,224,144)'],
              ['0.555555555556', 'rgb(224,243,248)'],
              ['0.666666666667', 'rgb(171,217,233)'],
              ['0.777777777778', 'rgb(116,173,209)'],
              ['0.888888888889', 'rgb(69,117,180)'],
              ['1.0', 'rgb(49,54,149)']
            ],
      }  
    }
    var data = [trace1];
    var layout = {
        width: 450,
        height: 450,
        xaxis: {
            title: 'Age Group'
        },
        yaxis: {
            title: 'Suicides'
        },
        title: 'Suicides by Age'
    }
    var config = {responsive: true}

    Plotly.newPlot("bubble_age", data, layout, config);
});

d3.json('/api/suicides_and_hdi').then(function(data){
    // console.log(data)
    
    var countries = []
    var suicides = []
    var hdi = []

    Object.entries(data).forEach(function([key,value]){
        countries.push(key);
        suicides.push(value.suicides);
        hdi.push(value.hdi)
    })

    var trace1 = {
        type: "scatter",
        mode: "markers",
        x: hdi,
        y: suicides,
        text: countries,
        marker: {
            size: 8,
            color:'orange'
        }
      }
      
    var layout = {
        width: 450,
        height: 450,
        xaxis: {
            title: 'Human Development Index'
        },
        yaxis: {
            title: 'Suicides Per 100k'
        },
        title: 'Suicides vs HDI'
    }
    
    var config = {responsive: true}

    Plotly.newPlot("scatter_hdi", [trace1], layout, config);
})

$.ajax({
    dataType: "json",
    url: '/api/suicides_by_generation',
    data: {},
    success: function(data){
      console.log(data);
      var labels = Object.keys(data)
      var values = Object.values(data)
      var trace = {
        width: 450,
        height: 450,
        type: 'pie',
        labels: labels,
        values: values
      }   
      var layout = {
        title:'Suicide Rates by Generation'
      }
      Plotly.newPlot('pie_generation', [trace], layout);
    }
});

 