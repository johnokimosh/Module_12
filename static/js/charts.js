function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filtered = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filtered[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = result.otu_ids;

    var otuLabels = result.otu_labels;

    var sampleValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
  
    var yticks = otuId.map(ticks => ticks).slice(0,10).reverse();

    var x_data = sampleValues.map(ticks => ticks).slice(0,10).reverse();

    var names = otuLabels.map(ticks => ticks).slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: x_data,
      y: yticks.toString(),
      text: names,
      type: "bar",
      orientation: "h"
    };

    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: otuId,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: sampleValues.map(color => color = 'rgb(93,164,214') 
      },

    };

    // 4. Create the trace for the gauge chart.
    var washFreq = data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;
    var title = "Belly Button Washing Frequency"
    var gaugeTrace = 
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: title},
        type: "indicator",
        mode: "gauge+number",
        gauge: { axis: {range:[null,10]}}
      };

          

    var barData = [barTrace]
    var bubbleData = [bubbleTrace]
    var gaugeData = [gaugeTrace]

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100,
      }
     
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample"      
    };

    var responsive = {responsive: true};

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, responsive);
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, responsive);
    Plotly.newPlot('gauge', gaugeData, gaugeLayout, responsive);

  });
};