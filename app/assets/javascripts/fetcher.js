var audio = document.getElementsByTagName("audio")[0];

function success(evt, xml, status, xhr){
  xml = $(xml);

  console.log(xml);
  
  var username = $('lfm > user name', xml).text(),
      url = $('lfm > user url', xml).text(),
      img = $('lfm > user image[size="small"]', xml).text();
  
  $("#user-nav").append('<a href="'+url+'" title="User\'s Last.fm profile"><img alt="User photo" src="'+img+'">'+username+'</a>')
  
  var pjs = Processing.getInstanceById('canvas');
  if (pjs != null){
    pjs.drawGraph($('lfm > friends name', xml));
    
    console.log($('lfm > friends name', xml).text());
  }

  $("#loader").fadeOut("normal", function() {
    $("#header-search").fadeIn("normal");
    $("#user-nav").fadeIn("normal");
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
    $("#user-nav").fadeOut("normal", function() {
      $("#user-nav").empty();
    });
    $("#chart").fadeOut("normal", function() {
      $("#chart").empty();
    });
  })
  .bind("ajax:success", success)
  .bind("ajax:error", error);