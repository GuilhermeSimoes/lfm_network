var audio = document.getElementsByTagName("audio")[0];

function success(evt, xml, status, xhr){
  xml = $(xml);

  console.log(xml);
  
  // var img = "";
  // var content;
  // $('lfm > user image', xml).each(function(){
    // var size = $(this).attr('size');
    // console.log(size);
    // content = $(this).text();
    // if (content != "")
      // img = content;
  // });  
  // if (img != ""){
    // $("#partialimage").append("<img alt='User image' src='"+img+"'>");
  // }
  
  var width = 960, height = 400, radius = d3.scale.sqrt().domain([0, 20000]).range([0, 20]);
  var color = d3.scale.category20();
  var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

  var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
    
  //var xml_nodes = $('lfm friends user', xml)
  //console.log(xml_nodes.length);
    
  //selectAll("*")[0]
  var nodes = self.nodes = d3.select(xml),
    links = self.links = nodes.slice(1).map(function(d) {
      return {source: d, target: d.parentNode};
    });
    
  console.log(nodes);
  
  force
    .nodes(nodes)
    .links(links)
    .start();

  var link = svg.selectAll("line.link")
    .data(links)
    .enter().append("svg:line")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
  
  var node = svg.selectAll("circle.node")
    .data(nodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return radius(d.textContent) || 5; })
      .call(force.drag);
  
  force.on("tick", function() {
    nodes[0].x = width / 2;
    nodes[0].y = height / 2;

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  $("#loader").fadeOut("normal", function() {
    $("#header-search").fadeIn("normal");
    $("#partialimage").fadeIn("normal");
    $("#chart").fadeIn("normal");
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
    $("#partialimage").fadeOut("normal", function() {
      $("#partialimage").empty();
    });
    $("#chart").fadeOut("normal", function() {
      $("#chart").empty();
    });
  })
  .bind("ajax:success", success)
  .bind("ajax:error", error);