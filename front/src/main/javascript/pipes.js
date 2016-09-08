Pipes = {
    execute: function(forReal){
        $.ajax({
            url: Pipes.retrievePipePath() + ".json",
            type:'post',
            data:{
                dryRun:!forReal
            },
            dataType:'json',
            success: function (data) {
                Pipes.handleResults(data);
            }
        });
    },
    handleResults : function(data, dryrun) {
        var table = $(".results table");
        $(".results span.total").text(data.size);
        table.children("*").remove();
        if (data.size > 0 &&  data.items){
            var head = $("<thead><tr class='columns'><td>#</td></tr></thead>"),
                body = $("<tbody class='table-striped'></tbody>"),
                headrow = head.find("tr.columns"),
                keys = [];
            if (data.items[0] instanceof Object){
                $.each(data.items[0], function (key, value) {
                    keys.push(key);
                });
            } else {
                keys.push("path");
            }
            $.each(keys, function (i, key) {
                headrow.append("<td>" + key + "</td>");
            });
            table.append(headrow);
            $.each(data.items, function(idx, item){
                var row = $("<tr></tr>");
                row.append("<td>" + idx + "</td>");
                $.each(keys, function(k, key){
                    row.append("<td>"+ (item instanceof Object ? item[key] : item ) +"</td>");
                });
                body.append(row);
            });
            table.append(body);
        }
    },
    retrievePipePath : function() {
        path = document.location.pathname;
        return path.substring(0, path.indexOf(".html"));
    },
    importContent : function(parent, name, json, handler){
        $.ajax({
            url : parent,
            type :'post',
            data : {
                ':operation':'import',
                ':contentType':'json',
                ':name':name,
                ':replace':true,
                ':replaceProperties':true,
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
    var sidebar=0;
    Pipes.execute(false);
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

