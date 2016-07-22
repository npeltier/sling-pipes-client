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
    },
    emptyResultsList : function(data) {
            $( ".list-group-item" ).remove();
    }
};

$(document).ready(function() {
    $.getJSON(Pipes.retrievePipePath() + ".json").then(Pipes.handleResults);
    $('#select').val('slingPipes/base');
    $('.typeSelect').hide();
    $("#sideButton").click(function () {
       $(".collapse").toggle();
    });
});

