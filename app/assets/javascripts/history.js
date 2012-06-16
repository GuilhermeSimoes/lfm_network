$.ajaxSetup({
  type     : "POST",
  dataType : "xml",
  url      : "fetch_user",
  data     : {'X-CSRF-Token' : $('meta[name="csrf-token"]').attr('content')}
});


var popped = ('state' in window.history), initialURL = location.href;
$(window).bind('popstate', function(event){
    var initialPop = !popped && location.href == initialURL;
    popped = true;
    if ( initialPop ) return;
    var state = event.originalEvent.state;
    //console.log(state);
    if (state == null) {
  
      if (username == "") {

        $("#user-nav").fadeOut("normal", function() {
          $("#user-nav").empty();
        });
        $("#header-search").fadeOut("normal");
        $("#canvas").fadeOut("normal", function() {
          $("#canvas").empty();
          $("#body-search input").attr("placeholder", "Type the name of a user...");
          $("#body-search").fadeIn("normal");
          $("#body-search input").focus();
        });

      }
      else {

        $("#loader").show();
    
        $.ajax({
          data : { user : username }
        }).success(function jsSuccess(data, textStatus, jqXHR){
          drawGraph(data);
        }).error(function jsError(jqXHR, textStatus, errorThrown){
          handleError(errorThrown);
        });
        
        history.replaceState({user:username}, username+"'s Network");

      }
      
    }
    else {
        
      $.ajax({
        data : { user : state.user }
      }).success(function jsSuccess(data, textStatus, jqXHR){
      
        cleanPage(0, data, null);
        
      }).error(function jsError(jqXHR, textStatus, errorThrown){
        
        cleanPage(0, null, errorThrown);
        
      });
      
      cleanPage(1, null, null);
      
    }
});


function cleanPage(loader, data, errorThrown){
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
      
      if (loader == 1) {
        $("#loader").fadeIn("normal");
      }
      
      if (data != null){
        drawGraph(data);
      }
      
      else if (errorThrown != null){
        handleError(errorThrown);
      }
      
    });
  });
}