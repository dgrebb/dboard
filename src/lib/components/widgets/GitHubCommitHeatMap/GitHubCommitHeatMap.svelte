<script>
  var url = "https://api.github.com/repos/mbostock/d3/stats/punch_card"
  var color = d3.scale.linear().range(['white', 'blue']);
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var times = ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12a']
  var boxSize = 20;
  var boxPadding = 5;
  
  d3.json(url, function (data) {
      color.domain(d3.extent(data, function (d) { return d[2] }))
      
      var svg = d3.select('body')
          .append('svg')
          .attr("width", (boxSize * boxPadding) * data.length)
          .attr("height", (boxSize * boxPadding) * data.length)
      svg.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', function (d) { return (d[1] * (boxSize + boxPadding)) + (boxSize * 2) })
          .attr('y', function (d) { return d[0] * (boxSize + boxPadding) + boxSize })
          .attr('width', boxSize)
          .attr('height', boxSize)
          .style('fill', function (d) { return color(d[2]) });
  
      // Add day labels
      for (var i = 0; i < days.length; i++) {
        svg.append('text')
            .text(days[i])
            .attr('x', boxSize + boxPadding + 8)
            .attr('y', (i * (boxSize + boxPadding)) + boxSize + 13)
            .attr('text-anchor','end');
      }
    
      // Add day labels
      for (var i = 0; i < times.length; i++) {
        svg.append('text')
            .text(times[i])
            .attr('x', (i * (boxSize + boxPadding)) + (boxSize * 2) + 10)
            .attr('y', (boxSize - 8))
            .attr('text-anchor','middle');
      }
      
  
  })
  </script>
  
  <svelte:head>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
    <style>
      svg {
        margin-top: 30px;
      }
      text {
        font-family: 'Open Sans', sans-serif;
        font-size: 13px;
        fill: #999;
      }
    </style>
  <script type='text/javascript' src='http://d3js.org/d3.v3.min.js'></script>
</svelte:head>