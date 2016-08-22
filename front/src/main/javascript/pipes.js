Pipes = {
    handleResults : function(data) {
        var list = $(".results ul");
        $(".results span.total").text(data.size);
        if (data.items){
            $.each(data.items, function(idx, item){
                $("<li/>").addClass("list-group-item").text(item).appendTo(list);
            });
        }
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
    var sidebar=0;
    $.getJSON(Pipes.retrievePipePath() + ".json").then(Pipes.handleResults);
    $('#select').val('slingPipes/base');
    $('.typeSelect').hide();
    $( ".divselector" ).each(function() {
        var value=$(this).prev().text();
        $(this).children().val(value);
    });
    $.getJSON(Pipes.retrievePipePath() + ".json").then(Pipes.handleResults);
    $(".collapse").hide();
    $(".glyphicon-time").click(function () {
            if (sidebar===0 || sidebar===1){$(".collapse").toggle();}
            if (sidebar===0){
                sidebar=1;
                $('.results').animate({'width': '54.3%'},0);
             }else if(sidebar===1){
                sidebar-=1;
                $('.results').animate({'width': '71%'},100);
             }else{sidebar=1;}
        });
    $(".glyphicon-book").click(function () {
            if (sidebar===0 || sidebar===2){$(".collapse").toggle();}
            if (sidebar===0){
                sidebar=2;
                $('.results').animate({'width': '54.3%'},0);
            }else if(sidebar===2){
                sidebar-=2;
                $('.results').animate({'width': '71%'},100);
            }else{sidebar=2;}
        });

});

