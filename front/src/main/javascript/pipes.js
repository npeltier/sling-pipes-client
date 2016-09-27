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
    importContent : function(parent, name, json, handler, replaces){
        $.ajax({
            url : parent + "/" + name,
            type :'post',
            data : {
                ':operation':'import',
                ':contentType':'json',
                //':name':name,
                ':replace':replaces,
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
    },
    /**
     * filters out protected JCR properties
     * @param data
     * @returns {*}
     */
    removeProtectedProperties: function(data){
        $.each(data, function(key, value){
            if ($.inArray(key, ["jcr:primaryType","jcr:created","jcr:createdBy"]) !== -1) {
                delete data[key];
            } else {
                if (typeof(value) == "object"){
                    data[key] = Pipes.removeProtectedProperties(value);
                }
            }
        });
        return data;
    },
    /**
     * return jcr path of a given subpipe elt
     * @param pipe
     */
    getSubpipePath : function(subpipe){
        return $(subpipe).children(".details").data("path");
    },
    /**
     * get name from path
     * @param path
     * @returns {string}
     */
    getNameFromPath : function(path){
        return path.substring(path.lastIndexOf("/")+1);
    }
};

$(document).ready(function(){
    Pipes.execute(false);
    $('[data-toggle="popover"]').popover();
});

