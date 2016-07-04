$(document).ready(function(){
    var self=this,
        path = document.location.pathname,
        pipe = path.substring(0, path.indexOf(".html")) + ".json",
        list = $(".results ul");
    $.getJSON(pipe).then(function(data){
        $(".results span.total").text(data.size);
        $.each(data.items, function(idx, item){
            $("<li/>").addClass("list-group-item").text(item).appendTo(list);
        });
    });
});