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
      
        drawGraph(data);
        
      }).error(function jsError(jqXHR, textStatus, errorThrown){
        
        handleError(errorThrown);
        
      });
      
      cleanPage(function(){
        $("#loader").fadeIn("normal");
      });
      
    }
});