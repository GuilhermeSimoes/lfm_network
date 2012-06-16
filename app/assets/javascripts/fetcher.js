var audio = document.getElementsByTagName("audio")[0];


$(document).ready(function() {
  if (username == "") {
    $("#body-search").show();
  }
  else {
    $("#loader").show();
  }
});


$('#body-search')
  .submit(function(e){
    audio.play();
    var username = $("#body-search").children('input').val();
    history.pushState({user:username}, username+"'s Network", "fetch?user="+username);
    $("#body-search").fadeOut("normal", function() {
      $(this).children('input').val("");
      $("#loader").fadeIn("normal");
    });
  })
  .bind("ajax:success", clickSuccess)
  .bind("ajax:error", clickError);

  
$('#header-search')
  .submit(function(e){
    audio.play();
    var username = $("#header-search").children('input').val();
    history.pushState({user:username}, username+"'s Network", "fetch?user="+username);
    $("#header-search").fadeOut("normal", function() {
      $(this).children('input').val("");
    });
    $("#user-nav").fadeOut("normal", function() {
      $("#user-nav").empty();
    });
    $("#canvas").fadeOut("normal", function() {
      $("#canvas").empty();
      $("#loader").fadeIn("normal");
    });
  })
  .bind("ajax:success", clickSuccess)
  .bind("ajax:error", clickError);


function clickSuccess(evt, data, status, xhr){
  drawGraph($(data));
}


function clickError(evt, xhr, status, error){
  handleError(error);
}


function handleError(error_message){
  if (error_message == "Bad Request")
    $("#body-search input").attr("placeholder", "User not found.");
  else
    $("#body-search input").attr("placeholder", "Connection to Last.fm failed.");
  
  $("#loader").fadeOut("normal", function() {
    $("#body-search").fadeIn("normal");
    $("#body-search input").focus();
  });
}


function drawGraph(xml){
  //console.log(xml);
  
  var username = $('lfm > user name', xml).text(),
      url = $('lfm > user url', xml).text(),
      img = $('lfm > user image[size="small"]', xml).text();
  
  $("#user-nav").append('<a href="'+url+'" title="User\'s Last.fm profile"><img alt="User photo" src="'+img+'">'+username+'</a>');
  
  var w = screen.width-20,
      h = screen.height-200,
      l = d3.scale.pow().exponent(3).domain([0,1]).range([250,40]),
      r = d3.scale.linear().domain([0,1]).range([8,26]),
      c = d3.scale.linear().domain([0,1]).range(["hsl(250, 50%, 50%)", "hsl(350, 100%, 50%)"]).interpolate(d3.interpolateHsl),
      force = d3.layout.force()
              .gravity(.01)
              .charge(-120)
              .size([w, h])
              .linkDistance(function(link){
                return l(link.source.taste);
              });
              
  var canvas = d3.select("#canvas").append("svg:svg")
    .attr("width", w)
    .attr("height", h);
  
  var i, n = $('user', xml).length;
  
  var nodes = [];
  for (i=0; i < n; i++) {
    nodes.push({"taste": $("score", xml).eq(i).text(), "name": $("name", xml).eq(i).text()});
  }
  
  var links = [];
  for (i=1; i < n; i++) {
    links.push({"source": nodes[i], "target": nodes[0]});
  }
  
  force
    .nodes(nodes)
    .links(links)
    .start();
      
  var link = canvas.selectAll("line")
    .data(links)
    .enter().append("svg:line")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
      
  var node = canvas.selectAll("circle")
    .data(nodes)
    .enter()/*.append("svg:a")
            .attr("xlink:href", function(d) { return "http://localhost:3000"; })*/
    .append("svg:circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x })
    .attr("cy", function(d) { return d.y })
    .attr("r", function(d) { return r(d.taste) })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
    .on('mouseover', function() {
                      var circle = d3.select(this);
                      circle.attr("fill-opacity", 0.7);
                    })
    .on("mouseout", function() {
                      var circle = d3.select(this);
                      circle.attr("fill-opacity", 0.5);
                    })
    .call(force.drag);
    
  /*canvas.append("text")
    .attr("class", "title")
    .attr("dy", ".71em")
    .attr("cx", 1)
    .attr("cy", 1)
    .text(2000);
    
  node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "1em")
    .text(function(d) { return d.name.substring(0, d.r / 3); });
    
  node.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text("asd"); */
    
  node.append("title")
    .text(function(d) { return d.name; });

  force.on("tick", function() {
    nodes[0].x = w / 2;
    nodes[0].y = h / 2;

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
 
  $("#loader").fadeOut("normal", function() {
    $("#user-nav").fadeIn("normal");
    $("#header-search").fadeIn("normal");
    $("#canvas").fadeIn("slow");
  });
}