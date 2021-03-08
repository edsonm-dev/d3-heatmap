let padding = 100;
let width=1020;
let height=400;
let dataset
//let parseDate = d3.time.format("%Y-%m").parse;
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response=>response.json())
  .then(data=>{

    let months =["January","February","March","April","May","June","July","August","September","October","November","December"];
    let years=[...new Set(data.monthlyVariance.map((x)=>x.year))]
    let variance=data.monthlyVariance.map((x)=>x.variance)
    let baseTemp=data.baseTemperature;
    
    //console.log(variance);

    let svg=d3.select("#chart1")
              .append("svg")
              .attr("width",width+(padding*2))
              .attr("height",height+(padding*2))
    
    //Xaxis
    let xScale = d3.scaleLinear()
                    .domain([d3.min(years),d3.max(years)])
                    .range([0,width])
                    
    let xAxis=d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
                
                    
    svg.append("g")
        .attr("id","x-axis")
        .attr("transform","translate("+padding+"," + (height+padding) + ")")
        .call(xAxis)
   //Yaxis
    let yScale = d3.scaleBand()
                .domain(months)
                .range([0,height])
                //.padding(0.01)
                
    
    let yAxis=d3.axisLeft(yScale) 
   
    svg.append("g")
        .attr("id","y-axis")
        .attr("transform","translate("+padding+"," + padding + ")")
        .call(yAxis)

  //colorscale
    let colorScale =d3.scaleQuantize()
                  .domain([d3.min(variance), d3.max(variance)])
                  .range(d3.quantize(d3.interpolateHcl( "#362142","#f4e153"), 10))

/*     colorScale.range().forEach(function(d){
                   // console.log(colorScale.invertExtent(d))
                  }) */

 //tooltip  
      let tooltip= d3.select("#chart1")
                    .append("div")
                    .attr("class","d3-tip")
                    .attr("id","tooltip")
                    .style("opacity","0")
    //rects
    svg.selectAll("cell")
        .data(data.monthlyVariance)
        .enter()
          .append("rect")
          .attr("x",(d)=>padding+xScale(d.year))
          .attr("y", function(d){
                              return padding+ yScale(months[d.month-1])
                            })
          .attr("width","5")
          .attr("height",yScale.bandwidth())
          .attr("class","cell")
          .attr("data-month", function(d){
                  return d.month-1
          })
          .attr("data-year", function(d){
                  //console.log(d);
                  return d.year
          })
          .attr("data-temp",function(d){
                  return d.variance+baseTemp
          })
          .style("fill",(d)=>colorScale(d.variance))
          .on("mouseover",function(d,i){
              //console.log(i);
              tooltip.style("opacity","1")
              
              tooltip.style("top",(d.clientY+10)+"px")
                      .style("left",(d.clientX+20)+"px")
                      .attr("data-year",i.year)
                      .html(i.year+", "+months[i.month-1]+"<hr>"+"Temperature: "+(baseTemp+i.variance).toFixed(2))
          })
          .on("mousemove",function(d,i){
                    
              tooltip.style("top",(d.clientY+10)+"px")
                      .style("left",(d.clientX+20)+"px")

                
                            
          })
          .on("mouseout",function(d,i){
            
            tooltip.style("opacity","0")


      
                  
})
//legend

      
  let pallete= svg.append("g")
            .attr("id","legend")

   pallete.selectAll('rect')
              .data(d3.quantize(d3.interpolateHcl( "#362142","#f4e153"), 10))
              .enter()
              .append('rect')
              .attr('fill', function(d) {
                //console.log(d);
                return d;
              })
              .attr('x', function(d, i) {
                return width/1.7+(i * 50);
              })
              .attr('y', height+padding+30)
              .attr('width', 50)
              .attr('height', 10);         

    pallete.selectAll("foo")
            .data(colorScale.range())
            .enter()
            .append("text")
            .attr('x', function(d, i) {
              return width/1.69+(i * 50);
            })
            .attr('y', height+padding+50)
            .text(function(d){
              return (baseTemp+colorScale.invertExtent(d)[0]).toFixed(2)
            }) 
            
            .append("tspan")
            .attr("dy", "1.3em")
            .attr('x', function(d, i) {
                return width/1.68+(i * 50);
              })
            .text("to")
            .append("tspan")
            .attr("dy", "1.3em")
            .attr('x', function(d, i) {
                return width/1.69+(i * 50);
            })
            .text(function(d) {
              return (baseTemp+colorScale.invertExtent(d)[1]).toFixed(2) 
            })

    
    
//title + desc
            svg.append("g")
                .append("text")
                .attr("x",(width+2*padding)/2)
                .attr("y",padding/2)
                .style("text-anchor", "middle")
                .attr("id","title")
                .text("Monthly Global Land-Surface Temperature")
                .append("tspan")
                .attr("x",(width+2*padding)/2)
                .style("text-anchor", "middle")
                .attr("dy","2em")
                .attr("id","description")
                .text("1753 - 2015: base temperature 8.66℃")
              







});



