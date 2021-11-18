function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
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
  d3.json("static/data/samples.json").then((data) => {
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
  d3.json("static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampless = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArraysa = sampless.filter(sampleObjs => sampleObjs.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var resultsample = resultArraysa[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids =  resultsample.otu_ids ; 
    var labels =  resultsample.otu_labels.slice(0,10).reverse();
    var values = resultsample.sample_values.slice(0,10).reverse();

    var bubblelabels = resultsample.otu_labels ;
    var bubblevalues = resultsample.sample_values ;
    var freq = resultsample.wfreq ;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    console.log(resultArraysa );
    
    var yticks = ids.map(id => "OTU "+ id ).slice(0,10).reverse();
    
    
    // 8. Create the trace for the bar chart. 
    var barData = [  {
      x: values ,
      y: yticks ,
      type: "bar" ,
      orientation : "h",
      text: labels 
    } ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10  Bacteria Cultures Found " 
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    
    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x: ids ,
      y: bubblevalues,
      text : bubblelabels ,
      mode: 'markers',
      marker: {
        size: bubblevalues ,
        color: bubblevalues ,
        //['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)' ,'rgb(244,164,96)' ,'rgb(188,143,143)'],
        colorscale:ids  
      }
     } ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        hovermode: bubblelabels
       
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    var freq =parseFloat( result.wfreq) ;
    console.log(freq)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: freq,
        title: { text:"<b> Belly Button Washing Frequency </b><br></br> Scrubs Per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null,10], dtick: "2"},

          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [ 4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen " },
            { range: [8, 10], color: " green" }
          ] ,
          dtick: 2
      } }
      

    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData , gaugeLayout);

  });
}
