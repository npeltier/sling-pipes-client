Pipes.Creation = {
    /**
     *build a Json object relative to the input,using the mapping, Pipes.Creation.parseCommand and Pipes.Creation.parseSubCommand
     **/
    "buildJson" : function(input,mapping) {
        var subCommands=Pipes.Creation.parseCommand(input),
            add = {},
            subpipe = {},
            container = {
                "jcr:primaryType":"nt:unstructured",
                "sling:resourceType":"slingPipes/container",
                "conf":{"jcr:primaryType":"sling:OrderedFolder"}
            };
        $.each(subCommands,function(index){
            subpipeName = subCommands[index].split(/[\s]* /gi)[0];
            subpipe[subpipeName] = Pipes.Creation.parseSubCommand(subCommands[index],mapping);
            $.extend(add, subpipe);
        });
        $.extend(container.conf, add);
        return container;
    },
    /**
     * parse a piped command and return a list of subpipes
     **/
    "parseCommand" : function (command) {
        var subCommands = command.trim().split(/[\r\s]*\|[\r\s]*/gi);
        if (subCommands.indexOf("")!=-1){ return null;}
        return subCommands;
    },
    /**
     * parse a subCommands previously parsed with Pipes.Creation.parseCommand and return a Json Object relative to
     **/
    "parseSubCommand" : function (subCommands,mapping){
        var tokens = subCommands.split(/[\s]* /gi),
            sub = tokens[0],
            argsOfTokens,
            mappedConf = mapping[sub];
        if (mappedConf) {
            var pipe = {
                "jcr:primaryType":"nt:unstructured",
                "sling:resourceType": mappedConf.pipeType
            };
            if (mappedConf.args) {
                if (mappedConf.args === "conf") {
                    if (tokens.length > 1){
                        pipe.conf = {
                            "jcr:primaryType": "nt:unstructured"
                        };
                        argsOfTokens = tokens[1].split(/[=]/gi);
                        pipe.conf[argsOfTokens[0].trim()] = argsOfTokens[1].trim();
                    }
                } else {
                    $.each(mappedConf.args, function(index, arg) {
                        if (index  < tokens.length - 1) {
                            pipe[arg] = tokens[index + 1];
                        }
                    });
                }
            }
            return pipe;
        }
    }
};

$('.create').click(function(){
    var date = new Date(),
        mapping = $("#inputFieldCreation").data("mapping"),
        today = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2)+'_'+('0'+date.getHours()).slice(-2)+'-'+('0'+date.getMinutes()).slice(-2),
        input = $('#inputFieldCreation').val(),
        data = Pipes.Creation.buildJson(input,mapping),
        parent = "/etc/sling/pipes/history/"+date.getFullYear()+'/'+('0'+(date.getMonth()+1)).slice(-2);
    Pipes.importContent(parent, today, data, function(){
        document.location.href = parent + "/" + today + ".html";
    });
});

