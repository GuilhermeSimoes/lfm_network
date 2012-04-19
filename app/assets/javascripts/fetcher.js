var audio = document.getElementsByTagName("audio")[0];

function success(evt, xml, status, xhr){
  xml = $(xml);

  console.log(xml);
  
  var username = $('lfm > user name', xml).text(),
      url = $('lfm > user url', xml).text(),
      img = $('lfm > user image[size="small"]', xml).text();
  
  $("#user-nav").append('<a href="'+url+'" title="User\'s Last.fm profile"><img alt="User photo" src="'+img+'">'+username+'</a>');
  
  var w = screen.width-80,
      h = screen.height-240;
  
  var x = d3.scale.linear().domain([0,1]).range([0,w]),
      y = d3.scale.linear().domain([0,1]).range([0,h]),
      r = d3.scale.linear().domain([0,1]).range([5,10]),
      c = d3.scale.linear().domain([0,1]).range(["hsl(250, 50%, 50%)", "hsl(350, 100%, 50%)"]).interpolate(d3.interpolateHsl);
  
  var n = $('user', xml).length;
  
  var nodes = [];
  for (i=0; i < n; i++) {
      nodes.push({"x": x(Math.random()), "y": y(Math.random())});
  }
  
  var links = [];
  for (i=1; i < n; i++) {
      links.push({"source": nodes[i], "target": nodes[0]});
  }
  
  console.log(links);

  var canvas = d3.select("#canvas").append("svg:svg")
      .attr("width", w)
      .attr("height", h);
      
  canvas.selectAll("circle")
    .data(nodes)
    .enter().append("svg:circle")
    .attr("cx", function(d) { return d.x })
    .attr("cy", function(d) { return d.y })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
    .attr("r", function() { return r(Math.random()) })
    
  canvas.selectAll("line.link")
    .data(links)
    .enter().append("svg:line")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
 
  $("#wrapper").toggleClass("idier ider");
  $("#loader").fadeOut("normal", function() {
    $("#header-search").fadeIn("normal");
    $("#user-nav").fadeIn("normal");
    $("#canvas").fadeIn("normal");
  });
}

function error(evt, xhr, status, error){
  if (error == "Bad Request")
    $("#body-search input").attr("placeholder", "User not found.");
  else
    $("#body-search input").attr("placeholder", "Connection to Last.fm failed.");
    
  $("#loader").fadeOut("normal", function() {
    $("#body-search").fadeIn("normal");
    $("#body-search input").focus();
  });
}

$('#body-search')
  .submit(function(){
    audio.play();
    $("#body-search").fadeOut("normal", function() {
      $(this).children('input').val("");
      $("#loader").fadeIn("normal");
    });
  })
  .bind("ajax:success", success)
  .bind("ajax:error", error);

$('#header-search')
  .submit(function(){
    audio.play();
    
    $("#header-search").fadeOut("normal", function() {
      $(this).children('input').val("");
      $("#loader").fadeIn("normal");
    });
    $("#user-nav").fadeOut("normal", function() {
      $("#user-nav").empty();
    });
    $("#canvas").fadeOut("normal", function() {
      $("#canvas").empty();
      $("#wrapper").toggleClass("idier ider");
    });
  })
  .bind("ajax:success", success)
  .bind("ajax:error", error);