var audio = document.getElementsByTagName("audio")[0];

$('#search')
  .submit(function(){
    audio.play();
    $("#partialbox").fadeOut("normal");
    $("#partialimage").fadeOut("normal", function() {
        $("#loader").fadeIn("normal");
        $("#partialimage").empty();
    });
  })
  .bind("ajax:success", function(evt, xml, status, xhr){
  
    var status = $(xml).find('lfm').attr('status');
    
    if (status == 'failed')
      $("#q").val("").attr("placeholder", "User not found.");
    else {
      var img = "";
      var content;
      $(xml).find('image').each(function(){
        content = $(this).text();
        if (content != "")
          img = content;
      });
      
      if (!img == ""){
        $("#partialimage").append("<img alt='User image' src='"+img+"'>");
      }
    }
  
    $("#loader").fadeOut("normal", function() {
        $("#partialbox").fadeIn("normal");
        $("#partialimage").fadeIn("normal");
    });
  })
  .bind("ajax:error", function(evt, xhr, status, error){
    $("#q").val("").attr("placeholder", "User not found.");
    $("#loader").fadeOut("normal", function() {
        $("#partialbox").fadeIn("normal");
    });
  });