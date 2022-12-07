function dataVisualization(data, matrix) {
    $("#chart").empty() //clears chart area before displaying the 
/* __________________________________________Set-Up_____________________________________________________________________________________--
*/
//variable ideas taken from: https://stackoverflow.com/questions/43259039/how-to-add-labels-into-the-arc-of-a-chord-diagram-in-d3-js
    
    const names = []
    const colors = []
    const interactions = matrix
    
    const opacityDefault = 0.8
    const margin = { left: 90, top: 90, right: 90, bottom: 90 },
     width = 1000 //removed margins to free up the space for diagram,
     height = 1000 //removed margins to free up the space for diagram,
     innerRadius = Math.min(width, height) * .30 //changed multiplier from .39 to .30 to make diagram smaller,
     outerRadius = innerRadius * 1.1;
    
    //making of lists of medication names and colors for every interactive medication
    for (var i = 0, l = data.length; i < l; i++)
    {
            names.push(data[i].medicationName)
            const randomColor = Math.floor(Math.random() * 16777215).toString(16)
            colors.push('#' + randomColor)
    }
    
/* __________________________________________Create scale and loyaut functions_____________________________________________________________________________________--
*/
//variable ideas taken from: https://stackoverflow.com/questions/43259039/how-to-add-labels-into-the-arc-of-a-chord-diagram-in-d3-js
//tooltip variable idea taken from: https://d3-graph-gallery.com/graph/chord_interactive.html
    const chord = d3.chord()
        .padAngle(0.15)
        .sortSubgroups(d3.descending)

    //moved color variable to all variables
    const color = d3.scaleOrdinal()
        .domain(d3.range(names.length))
        .range(colors);

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        
    const ribbon = d3.ribbon()
        .radius(innerRadius)

    const tooltip = d3.select("#chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

/* __________________________________________Create SVG_____________________________________________________________________________________--
*/
//visualization idea taken from: https://stackoverflow.com/questions/43259039/how-to-add-labels-into-the-arc-of-a-chord-diagram-in-d3-js
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")")
        .datum(chord(interactions));
/* __________________________________________Draw inner arcs_____________________________________________________________________________________--
*/  
//visualization idea taken from: https://stackoverflow.com/questions/43259039/how-to-add-labels-into-the-arc-of-a-chord-diagram-in-d3-js
    //Make a group for every "groups" dataset
    const innerArcs = svg.selectAll("g.group")
        .data(function(chords) { return chords.groups; })
        .enter().append("g")
        .attr("class", "group")

    //Visualize arcs using "path"
    innerArcs.append("path")
        .style("fill", function(d) { return color(d.index); })
        .attr("d", arc);// attribute of the svg element path

    //Append names
    innerArcs.append("text")
        .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("class", "titles")
        .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function (d) {
            return "rotate(" + (d.angle * (180 / Math.PI)-90) + ")"
                + "translate(" + (outerRadius + 10) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function (d, i) { return names[i]; })

/* __________________________________________Draw outer arcs_____________________________________________________________________________________--
*/ 
//visualization idea taken from: https://stackoverflow.com/questions/47877075/d3js-chord-diagram-multiple-groups
//idea for hidden arc taken from: https://www.visualcinnamon.com/2015/09/placing-text-on-arcs/
    
    //make a list of disease names and medication groups
    const groups = d3.groups(data, d => d.diseaseName) 
    const chordData = chord(interactions).groups
            
        console.log(chordData)
          
    for (var i = 0; i < groups.length; i++) {
    /*every star and end index represent the indexes of 
    first and last medication for every disease arc*/
      const sIndex = data.map(x => x.medicationName).indexOf((groups[i])[1][0].medicationName)
      const eIndex = data.map(x => x.medicationName).indexOf((groups[i])[1][(groups[i][1].length)-1].medicationName)
        
            //Parameters for an outer arc 
            var diseaseGroup = groups[i]
            var outerArc = d3.arc()
              .innerRadius(innerRadius + 160)
              .outerRadius(outerRadius + 100)
              .startAngle(chordData[sIndex].startAngle) 
            .endAngle(chordData[eIndex].endAngle)
          
            //Parameters for an invisible arc
            var invidibleArc = d3.arc()
            .innerRadius(innerRadius + 180)
            .outerRadius(outerRadius + 110)
            .startAngle(cD[__g.sIndex].startAngle) 
            .endAngle(cD[__g.eIndex].endAngle) 
          
            //Drawing outer arc
            svg.append("path")
            .style('fill', colors[i])
                .attr("class", "superGroup")
                .style("opacity", "50%")
            .attr("id", `outerGroup${i}`) //add id here ????????????
            .attr("d", outerArc);

            /*Drawing and invidible arc above the outer arc
            so the text is floating abouve it **/
            svg.append("path")
              .style("fill", "none")
              .attr("class", "hiddenDonutArcs")
              .attr("id", "hiddenArc" + i)
              .attr("d", invidibleArc);
        
            //Added text labels
            svg.append("text")
              .attr("class", "superGroupText")
              .append("textPath")
                .attr("href", "#outerGroup" + i)
            .text(groups[i][1][0].diseaseName)
            .attr("class", "text-2xl font-bold")
          } 
              
/* __________________________________________Draw inner chords_____________________________________________________________________________________--
*/ 
//visualization idea taken from: https://stackoverflow.com/questions/47877075/d3js-chord-diagram-multiple-groups
//tooltip animation idea taken from: https://medium.com/@kj_schmidt/show-data-on-mouse-over-with-d3-js-3bf598ff8fc2


            svg.append("g")
              .attr("class", "chord")
              .selectAll("path")
              .data(function(chords) { return chords; })
              .enter().append("path")
              .style("fill", function(d) { return color(d.source.index); })
              .style("opacity", opacityDefault)
              .attr("d", ribbon)
              
              //The Mouseover event
              .on('mouseover', function (event, d, i) {
                //Make a new tooltip appear on hover
                tooltip.transition()
                  .duration(50)
                  .style("opacity", 1);
            
                //Puting text into the tooltip
                tooltip
                  .html("Source: " + names[d.source.index] + "<br>Target: " + names[d.target.index])
                  
                  //removed the styles as they were not really needed
                  //added a nice transition that would "fade in" the text
                  
                  .transition()
                    .duration(400)
                    .style("font-size","16px");
          
                return svg.selectAll("g.chord path")
                  .filter(function(chordData) {                   
                    return chordData.source.index != d.source.index || chordData.target.index != d.target.index;
                  })
                  .transition()
                  .style("opacity", 0.1);
                
              })
          
              //The mouseout event
              .on('mouseout', function () {

                //added a nice transition that would "fade out" the text
                tooltip
                  .transition()
                  .duration(400)
                  .style("font-size","0px")

                return svg.selectAll("g.chord path")
                  .transition()
                  .style("opacity", opacityDefault);
                
              })
          
          //////////////////////////////////////////////////////Exxxxxxxtra Functions////////////////////////////////////////////////////
          

/* __________________________________________Elements_____________________________________________________________________________________--

    //Draw inner chords
    svg.selectAll("path.chord")
        .data(function (chords) { return chords; })
        .enter().append("path")
        .attr("class", "chord")
        .style("fill", function (d) { return color(d.source.index); })
        .style("opacity", opacityDefault)
        .attr("d", ribbon)
        

        //The Mouseover event
        .on('mouseover', function (event, d, i) {
            //Make a new tooltip appear on hover
            tooltip.transition()
                .duration(50)
                .style("opacity", 1);
  
            //Puting text into the tooltip
            tooltip
                .html("Source: " + names[d.source.index] + "<br>Target: " + names[d.target.index])
                .style("left", (event.x) / 2 + 300 + "px")
                .style("top", (event.y) / 2 + 500 + "px")
        })
*/
} 