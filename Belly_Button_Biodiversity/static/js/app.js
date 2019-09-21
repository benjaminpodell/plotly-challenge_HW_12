//Create function that passes the sample parameter 
function buildMetadata(sample) {
  
  // creating the metadata sample route and storing in a url variable
  var url = `/metadata/${sample}`;
  
  // Selecting the panel with id of `#sample-metadata` and console logging the error
  d3.json(url).then(function(response){
    var belly_data = response;
    var PANEL = d3.select("#sample-metadata");
    
    // Referencing .html("") to clear existing metadata that may interfere with rendering site
    PANEL.html("");
    
    // Using Object.entries to add each key and value pair to the panel by appending "p" tag for each key-value in metadata
     Object.entries(belly_data).forEach(([key, value]) => {
      PANEL.append("p")
      .text(`${key}:${value}`);
  });

    // Builds the Gauge Chart as part of the bonus in the "bonus.js" script
    buildGauge(belly_data.wfreq);
  });
}

// Function that passes sample parameter to begin constructing the charts
function buildCharts(sample) {

  // Using d3.json to fetch the sample data for the plots from json formats
  var url2 = `/samples/${sample}`;
  d3.json(url2).then(function (response){
    var x_value = response["otu_ids"];
    var y_value = response["sample_values"];
    var size_value = response["sample_values"];
    var label = response["otu_labels"];
    
    // Constructs a Bubble Chart using the sample data given from the sqlite file and adds attributes such as color, labels, and opacity
    var trace = {
      x: x_value,
      y: y_value,
      mode:"markers", 
      marker:{
        size: size_value,
        //color: x_value,
        colorscale: "RdBu",
        labels: label,
        type: 'scatter',
        opacity: 0.3
      }
    };

    // Storing the first trace in belly_data1
    var belly_data1 = [trace];

    // Creating the layout and giving it a title, xaxis title, showing legend, and plotting the graph as a bubble graph
    var bubble_layout = {
      title: 'Approximate Marker Size',
      xaxis: { title: 'OTU id' },
      showlegend: true
    };
    Plotly.newPlot("bubble", belly_data1, bubble_layout); 

    // Building the pie chart and collecting the top 10 samples by splicing for each axis and then plotting the pie graph
    var pie_layout = [{
      title: 'Top 10 Samples',
      values: size_value.splice(0, 10),
      labels: x_value.splice(0, 10),
      text: y_value.splice(0,10),
      type: 'pie'
    }];
    Plotly.newPlot('pie', pie_layout);
  });
}

// Creates function to begin initializing and populating the plots
function init() {
  
  // Selecting a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Selecting first sample from the list to build initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetching new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();