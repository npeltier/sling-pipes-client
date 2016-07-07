Pipes = {
    handleResults : function(data) {
        var list = $(".results ul");
        $(".results span.total").text(data.size);
        if(data.size>3){
        }
        $.each(data.items, function(idx, item){
            $("<li/>").addClass("list-group-item").text(item).appendTo(list);
        });
    },
    retrievePipePath : function() {
        path = document.location.pathname;
        return path.substring(0, path.indexOf(".html"));
    },
    emptyResultsList : function(data) {
            $( ".list-group-item" ).remove();
    }
};

$(document).ready(function(){
    $.getJSON(Pipes.retrievePipePath() + ".json").then(Pipes.handleResults);

    $('.execute').click(function(){
    Pipes.emptyResultsList();
    document.styleSheets[0].addRule('.subpipe:before')({
         "border-left-color":"#b2d526"
    });
      $.ajax({
         url: Pipes.retrievePipePath() + ".json",
         type:'post',
         dataType:'json',
         success: function (data) {
                    Pipes.handleResults(data);
                  }
              });
       });
    $('.edit').on('focusout',function(){
        var path =$(this).parents(".subpipe").data("path"),
            property = $(this).data("property"),
            value = $(this).text(),
            data = {};
        data[property] = value;
        $.ajax({
             url: path,
             type:'post',
             data: data,
             success: function () {
                         console.log("ok");
               }
         });
    });
});


