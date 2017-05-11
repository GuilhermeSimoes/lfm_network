var audio = document.getElementsByTagName("audio")[0];

$.ajaxSetup({
  type     : 'POST',
  headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
  dataType : 'xml',
  url      : 'fetch_user'
});

// console.log('innerHeight: ' + window.innerHeight + '\n' +
//             'availHeight: ' + screen.availHeight + '\n' +
//             'height: '      + screen.height      + '\n' +
//             'innerWidth: '  + window.innerWidth  + '\n' +
//             'availWidth: '  + screen.availWidth  + '\n' +
//             'width: '       + screen.width
//             );

$(document).ready(function() {
  if (username == "") {
    $("#body-search").show();
  }
  else {
    $("#loader").show();
  }
});


$('#body-search')
  .submit(function() {
    audio.play();
    var username = $("#body-search").children('input').val();
    history.pushState({user:username}, username+"'s Network", "fetch?user="+username);
    $("#body-search").fadeOut("normal", function() {
      $("#loader").fadeIn("normal");
      $(this).children("input").val("");
    });
  })
  .bind("ajax:success", clickSuccess)
  .bind("ajax:error", clickError);


$('#header-search')
  .submit(function(){
    audio.play();
    var username = $("#header-search").children('input').val();
    history.pushState({user:username}, username+"'s Network", "fetch?user="+username);
    cleanPage(function(){
      $("#loader").fadeIn("normal");
    });
  })
  .bind("ajax:success", clickSuccess)
  .bind("ajax:error", clickError);


function clickSuccess(evt, data, status, xhr){
  drawGraph($(data));
}


function clickError(evt, xhr, status, error){
  handleError(xhr);
}


function handleError(error){
  var error_message = $('error', error.responseText).text();
  $("#body-search input").attr("placeholder", error_message);

  $("#loader").fadeOut("normal", function() {
    $("#body-search").fadeIn("normal");
    $("#body-search input").focus();
  });
}


function drawGraph(xml){
  var username = $('lfm > user name', xml).text(),
      url = $('lfm > user url', xml).text(),
      img = $('lfm > user image[size="small"]', xml).text();

  $("#user-nav").append('<a href="'+url+'" title="User\'s Last.fm profile"><img alt="User photo" src="'+img+'">'+username+'</a>');

  var w = window.innerWidth-18,
      h = window.innerHeight,
      l = d3.scale.pow().exponent(3).domain([0,1]).range([250,40]),
      r = d3.scale.linear().domain([0,1]).range([8,26]),
      c = d3.scale.linear().domain([0,1]).range(["hsl(250, 50%, 50%)", "hsl(350, 100%, 50%)"]).interpolate(d3.interpolateHsl);

  var force = d3.layout.force()
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
  var user;

  var nodes = [];
  for (i=0; i < n; i++) {
    user = $("user", xml).eq(i);
    nodes.push({
                "taste": $("score", user).text(),
                "name": $("name", user).text(),
                "url": $("url", user).text(),
                "small_image": $("image", user).eq(0).text(),
                "medium_image": $("image", user).eq(1).text(),
                "large_image": $("image", user).eq(2).text(),
                "extralarge_image": $("image", user).eq(3).text()
              });
  }

  var links = [];
  for (i=1; i < n; i++) {
    links.push({"source": nodes[i], "target": nodes[0]});
  }

  force
    .nodes(nodes)
    .links(links)
    .on("tick", tick)
    .start();

  var link = canvas.append("svg:g").selectAll("line")
    .data(links)
    .enter().append("svg:line")
    .attr("class", "link");

  var node = canvas.append("svg:g").selectAll("circle")
    .data(nodes)
    .enter().append("svg:circle")
    .attr("class", "node")
    .attr("r", function(d) { return r(d.taste); })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()); })
    .attr("fill-opacity", 0.5)
    .on('mouseover', function() { d3.select(this).attr("fill-opacity", 0.7); })
    .on("mouseout", function() { d3.select(this).attr("fill-opacity", 0.5); })
    .call(force.drag)
    .on("click", showNode)    //dblclick

  var text = canvas.append("svg:g").selectAll("g")
    .data(nodes)
    .enter().append("svg:g");

  text.append("svg:text")
    .attr("x", function(d) {
            return -2.3 * d.name.length;
          })
    .attr("y", ".40em")
    .text(function(d) { return d.name; });

  function showNode(d, i) {
    var username = d.name;
    history.pushState({user:username}, username+"'s Network", "fetch?user="+username);

    $.ajax({
      data : { user : username }
    }).success(function jsSuccess(data, textStatus, jqXHR){

      drawGraph(data);

    }).error(function jsError(jqXHR, textStatus, errorThrown){

      handleError(jqXHR);

    });

    cleanPage(function(){
      $("#loader").fadeIn("normal");
    });

  }


  function tick() {
    nodes[0].x = w / 2;
    nodes[0].y = h / 2  * 0.88;

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }

  $("#loader").fadeOut("normal", function() {
    $("#user-nav").fadeIn("normal");
    $("#header-search").fadeIn("normal");
    $("#header-search > input").blur();
    $("#canvas").fadeIn("slow");
  });
}


function cleanPage(callback){
  $("#user-nav").fadeOut("normal", function() {
    $("#user-nav").empty();
  });
  $("#header-search").fadeOut("normal", function() {
    $(this).children('input').val("");
  });
  $("#body-search").fadeOut("normal", function() {
    $(this).children('input').val("");
    $("#canvas").fadeOut("normal", function() {
      $("#canvas").empty();

      if(typeof callback == 'function') {
        callback();
      }

    });
  });
}
