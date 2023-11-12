
export function drawTheta( globalData, graphLen, divID, type, size ) {

  // Declare the chart dimensions and margins.
  const margin = { top: size/35, right: 30, bottom: size/(35/3), left: 60 };
  const width = size - margin.left - margin.right;
  const height = size - margin.top - margin.bottom;
  const minY = d3.min(globalData.data, (d) => d.theta * 180/Math.PI)
  const maxY = d3.max(globalData.data, (d) => d.theta * 180/Math.PI)
  // Declare the x (horizontal position) scale.
  const x = d3.scaleLinear()
    .domain( [0,graphLen] )
    .range( [ margin.left, width+margin.left] );

// Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
  .domain([minY, maxY])
  .range([ height-margin.bottom, margin.bottom ]);

  // append the svg object to the body of the page
  const svg = window.d3.select( `#${divID}` )
    .append( 'svg' )
    .attr( 'width', width + margin.left + margin.right )
    .attr( 'height', height + margin.top + margin.bottom );

  // Instead of these, you can position the scenery Node containing the graph.
  // .append( 'g' )
  // .attr( 'transform', `translate(${margin.left},${margin.top})` );

// Add the x-axis.
  svg.append( 'g' )
    .attr( 'transform', `translate(0,${height - margin.bottom})` )
    .call( d3.axisBottom( x ) );

// Add the y-axis.
  svg.append( 'g' )
    .attr( 'transform', `translate(${margin.left},0)` )
    .call( d3.axisLeft( y ) );
    svg
            .append("path")
            .datum(globalData.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .x(function(d) { return x(d.time) })
              .y(function(d) { return y(d.theta * 180/Math.PI) })
              )
          svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -(height/2))
          .attr("y", 30)
          .style("text-anchor", "middle")
          .style("font-size", "20px")
          .text("θ (degrees)")
      
          svg.append("text")
          .attr("transform", "translate(" + ((width+margin.left+margin.right)/2) + "," + (height) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "20px")
          .text("t (s)")
      
          // svg.append("text")
          // .attr("x", (height/2.5))
          // .attr("y", 20)
          // .style("text-anchor", "middle")
          // .style("font-size", "15px")
          // .text(`θ over time: ${type} eqn`)

          svg.selectAll("dot")
              .data([50,50])
              .enter().append("circle")
                .attr("r", 3.5)
                .attr("cx", x(50)+margin.left)
                .attr("cy", y(50))
                .attr("fill", "red")
                .attr("stroke", "red")
        //   if (!Number.isNaN(globalData.data[1].theta)){
        //     d3.interval( () => {
        //       // console.log(ball)
        //       svg.selectAll("circle").remove();
        //       svg.selectAll("dot")
        //       .data([50,50])
        //       .enter().append("circle")
        //         .attr("r", 3.5)
        //         .attr("cx", x(ball.time)+margin.left)
        //         .attr("cy", y(ball.theta))
        //         .attr("fill", "red")
        //         .attr("stroke", "red")
        //     }, 5)
        // }
  return svg.node();
}
export function drawVelocity( globalData, graphLen, divID, type, size ) {

  // Declare the chart dimensions and margins.
  const margin = { top: size/35, right: 30, bottom: size/(35/3), left: 60 };
  const width = size - margin.left - margin.right;
  const height = size - margin.top - margin.bottom;
  const minY = d3.min(globalData.data, (d) => d.velocity)
  const maxY = d3.max(globalData.data, (d) => d.velocity)
  // Declare the x (horizontal position) scale.
  const x = d3.scaleLinear()
    .domain( [0,graphLen] )
    .range( [ margin.left, width+margin.left] );

// Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
  .domain([minY, maxY])
  .range([ height-margin.bottom, margin.bottom ]);

  // append the svg object to the body of the page
  const svg = window.d3.select( `#${divID}` )
    .append( 'svg' )
    .attr( 'width', width + margin.left + margin.right )
    .attr( 'height', height + margin.top + margin.bottom );

  // Instead of these, you can position the scenery Node containing the graph.
  // .append( 'g' )
  // .attr( 'transform', `translate(${margin.left},${margin.top})` );

// Add the x-axis.
  svg.append( 'g' )
    .attr( 'transform', `translate(0,${height - margin.bottom})` )
    .call( d3.axisBottom( x ) );

// Add the y-axis.
  svg.append( 'g' )
    .attr( 'transform', `translate(${margin.left},0)` )
    .call( d3.axisLeft( y ) );
    svg
        .append("path")
        .datum(globalData.data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.time) })
          .y(function(d) { return y(d.velocity) })
          )
          svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -(height/2))
          .attr("y", 30)
          .style("text-anchor", "middle")
          .style("font-size", "20px")
          .text("v (m/s)")
      
          svg.append("text")
          .attr("transform", "translate(" + ((width+margin.left+margin.right)/2) + "," + (height) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "20px")
          .text("t (s)")
      
          // svg.append("text")
          // .attr("x", (height/2.5))
          // .attr("y", 20)
          // .style("text-anchor", "middle")
          // .style("font-size", "15px")
          // .text(`Velocity over time: ${type} eqn`)

          svg.selectAll("dot")
              .data([50,50])
              .enter().append("circle")
                .attr("r", 3.5)
                .attr("cx", x(50)+margin.left)
                .attr("cy", y(50))
                .attr("fill", "red")
                .attr("stroke", "red")

  return svg.node();
}
  // export function drawVelocity(globalData,graphLen,divID,type){
    
  //   const margin = {top: 10, right: 30, bottom: 30, left: 60},
  //     width = 400 - margin.left - margin.right,
  //     height = 400 - margin.top - margin.bottom;
  
  // // append the svg object to the body of the page
  // const svg = d3.select(`#${divID}`)
  //   .append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //     .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // //Read the data
  // const minY = d3.min(globalData.data, (d) => d.velocity)
  // const maxY = d3.max(globalData.data, (d) => d.velocity)
  //     // Add X axis --> it is a date format
  //     const x = d3.scaleLinear()
  //       .domain([0,graphLen])
  //       .range([ 0, width]);
  //     svg.append("g")
  //       .attr("transform", `translate(0, ${height})`)
  //       .call(d3.axisBottom(x));
  
  //     // Add Y axis
  //     const y = d3.scaleLinear()
  //       .domain([minY, maxY])
  //       .range([ height, 0 ]);
  //     svg.append("g")
  //       .call(d3.axisLeft(y));
  
      
  
  //     // Add the line
  //     svg
  //       .append("path")
  //       .datum(globalData.data)
  //       .attr("fill", "none")
  //       .attr("stroke", "steelblue")
  //       .attr("stroke-width", 1.5)
  //       .attr("d", d3.line()
  //         .x(function(d) { return x(d.time) })
  //         .y(function(d) { return y(d.velocity) })
  //         )
  
  //         svg.append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("x", -(height/2))
  //     .attr("y", -30)
  //     .style("text-anchor", "middle")
  //     .style("font-size", "19px")
  //     .text("Velocity")
  
  //     svg.append("text")
  //     .attr("transform", "translate(" + (width/2) + "," + (height + 30) + ")")
  //     .style("text-anchor", "middle")
  //     .text("Time (s)")
  
  //     svg.append("text")
  //     .attr("x", (height/2.5))
  //     .attr("y", 2)
  //     .style("text-anchor", "middle")
  //     .style("font-size", "15px")
  //     .text(`v over time: ${type} eqn`)

  //     return svg.node();
  // }