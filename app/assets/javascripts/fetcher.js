var audio = document.getElementsByTagName("audio")[0];

$('#search')
  .submit(function(){
    audio.play();
    $("#partialbox").fadeOut("normal", function() {
      $("#loader").fadeIn("normal");
    });
    $("#partialimage").fadeOut("normal", function() {
      $("#partialimage").empty();
    });
  })
  .bind("ajax:success", function(evt, xml, status, xhr){
    var xml = $(xml);
    var img = "";
    var content;
    
    //console.log(xml);
    
    $('userinfo image', xml).each(function(){
      //var size = $(this).attr('size');
      //console.log(size);
    
      content = $(this).text();
      if (content != "")
        img = content;
    });
    
    if (img != ""){
      $("#partialimage").append("<img alt='User image' src='"+img+"'>");
    }
  
    $("#loader").fadeOut("normal", function() {
      $("#partialbox").fadeIn("normal");
      $("#partialimage").fadeIn("normal");
    });
  })
  .bind("ajax:error", function(evt, xhr, status, error){    
    if (error == "Bad Request")
      $("#q").val("").attr("placeholder", "User not found.");
    else
      $("#q").val("").attr("placeholder", "Connection to Last.fm failed.");
      
    console.log(status+"\n"+error);
      
    $("#loader").fadeOut("normal", function() {
      $("#partialbox").fadeIn("normal");
    });
  });