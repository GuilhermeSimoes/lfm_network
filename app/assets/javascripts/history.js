$.ajaxSetup({
  type    : "POST",
  dataType: "xml",
  url     : "fetch_user",
  data    : {'X-CSRF-Token' : $('meta[name="csrf-token"]').attr('content')}
});


var popped = ('state' in window.history), initialURL = location.href;
$(window).bind('popstate', function(event){
    var initialPop = !popped && location.href == initialURL;
    popped = true;
    if ( initialPop ) return;
    var state = event.originalEvent.state;

    console.log(state);
    
    if (state == null) {
      
      $("#user-nav").fadeOut("normal", function() {
        $("#user-nav").empty();
      });
      $("#header-search").fadeOut("normal");
      $("#canvas").fadeOut("normal", function() {
        $("#canvas").empty();
        $("#body-search").fadeIn("normal");
        $("#body-search input").focus();
      });
      
    }
    else {
        
      $.ajax({
        data : { user : state.user }
      }).success(function jsSuccess(data, textStatus, jqXHR){
        drawGraph(data);
      }).error(function jsError(jqXHR, textStatus, errorThrown){
        handleError(errorThrown);
      });
      
      $("#body-search").fadeOut("normal", function() {
        $(this).children('input').val("");
      });
      
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
      
    }
      
});


/*
(function(window,undefined){

    // Prepare
    var History = window.History;                             // Note: We are using a capital H instead of a lower h  
    if ( !History.enabled ) {
        // History.js is disabled for this browser.
        // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window, 'statechange', function() {  // Note: We are using statechange instead of popstate
      var State = History.getState();                         // Note: We are using History.getState() instead of event.state
      
      if (State.data.user == undefined) {
      
        $("#user-nav").fadeOut("normal", function() {
          $("#user-nav").empty();
        });
        $("#header-search").fadeOut("normal");
        $("#canvas").fadeOut("normal", function() {
          $("#canvas").empty();
          $("#body-search").fadeIn("normal");
          $("#body-search input").focus();
        });
        
      }
      else {
          
        $.ajax({
          data : { user : State.data.user }
        }).success(function jsSuccess(data, textStatus, jqXHR){
          drawGraph(data);
        }).error(function jsError(jqXHR, textStatus, errorThrown){
          handleError(errorThrown);
        });
        
        $("#body-search").fadeOut("normal", function() {
          $(this).children('input').val("");
        });
        
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
        
      }
    });
})(window);*/