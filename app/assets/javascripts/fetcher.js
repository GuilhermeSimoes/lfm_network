var audio = document.getElementsByTagName("audio")[0];

$('#search').submit(function(){
  $("#partialbox img").hide();
  $("#partialbox").animate({opacity:0});
  audio.play();
  
});