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
    },
    importContent : function(parent, name, json, handler){
        $.ajax({
            url : parent,
            type :'post',
            data : {
                ':operation':'import',
                ':contentType':'json',
                ':name':name,
                ':content':JSON.stringify(json)
            },
            success : handler
        });
    },
    /**
     * extract path info as a json object from a path
     * @param path
     * @returns {{path: *}}
     */
    extractPathInfo : function(path){
        var pathInfo = {
            path: path
        };
        pathInfo.parent = path.substring(0, path.lastIndexOf("/"));
        pathInfo.name = path.substring(pathInfo.parent.length + 1, path.length);
        return pathInfo;
    }
};

$(document).ready(function(){
    $.getJSON(Pipes.retrievePipePath() + ".json").then(Pipes.handleResults);
    $('#select').val('slingPipes/base');
    $('.typeSelect').hide();
    $( ".divselector" ).each(function() {
        var value=$(this).prev().text();
        $(this).children().val(value);
    });
    $.getJSON(Pipes.retrievePipePath() + ".json").then(Pipes.handleResults);
    $(".collapse").hide();
    $("#sideButton").click(function () {
       $(".collapse").toggle();
    });
});

