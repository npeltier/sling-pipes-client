Pipes = {
    handleResults : function(data) {
        var list = $(".results ul");
        $(".results span.total").text(data.size);
        $.each(data.items, function(idx, item){
            $("<li/>").addClass("list-group-item").text(item).appendTo(list);
        });
    },
    retrievePipePath : function() {
        path = document.location.pathname;
        return path.substring(0, path.indexOf(".html"));
    }
};

$(document).ready(function(){
    $.getJSON(Pipes.retrievePipePath() + ".json").then(Pipes.handleResults);
    $('.execute').click(function(){
      $.ajax({
         url: Pipes.retrievePipePath() + ".json",
         type:'post',
         dataType:'json',
         success: function (data) {
                      Pipes.handleResults(data);
                       console.log("end");
                  }
              });
        });
});


