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
        width: 600,
        height: 600,
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

d3.json('/api/yearly_suicides_and_hdi').then(function(data){
    console.log(data)

    var year = []
    var hdi = []
    var suicides = []
    Object.entries(data).forEach(([key,value])=>{
        year.push(key)
        hdi.push(value.hdi)
        suicides.push(value.suicide_rates)
    })

    var trace1 = {
        x: year,
        y: suicides,
        name: 'Suicide Rates',
        type: 'scatter'
      };
      
      var trace2 = {
        x: year,
        y: hdi,
        name: 'Human Development Index',
        yaxis: 'y2',
        type: 'scatter'
      };
      
      var data = [trace1, trace2];
      
      var layout = {
        title: 'HDI and Suicide Rates Over Years',
        yaxis: {title: 'Suicide Per 100k'},
        yaxis2: {
          title: 'Human Development Index',
          titlefont: {color: 'rgb(148, 103, 189)'},
          tickfont: {color: 'rgb(148, 103, 189)'},
          overlaying: 'y',
          side: 'right'
        }
      };
      
      Plotly.newPlot('hdi_and_suicides_multiaxes', data, layout);
})