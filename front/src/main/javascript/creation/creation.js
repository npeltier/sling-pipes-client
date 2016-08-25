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
            subpipe[subpipeName] = Pipes.Creation.parseSubCommand(subCommands[index],mapping,index===0);
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
    "parseSubCommand" : function (subCommands,mapping,firstCommand){
        var tokens = subCommands.split(/[\s]* /gi),
            sub = tokens[0],
            args = tokens.slice(1),
            mappedConf = mapping[sub];
        if (mappedConf) {
            var pipe = {
                "jcr:primaryType":"nt:unstructured",
                "sling:resourceType": mappedConf.pipeType
            };
            if (mappedConf.args) {
                if (mappedConf.args === "conf"){
                    //special case for configuration where we fill in key=value to a conf subnode
                    if (args.length > 0){
                        pipe.conf = {
                            "jcr:primaryType": "nt:unstructured"
                        };
                        $.each(args, function(index, arg) {
                            var keyValuePair = arg.split(/[=]/gi);
                            pipe.conf[keyValuePair[0].trim()] = keyValuePair[1].trim();
                        });
                    }
                } else {
                    var pathExpected = mappedConf.args.length > 0 && mappedConf.args[0] === "path",
                        oneArgMissing = mappedConf.args.length === args.length + 1,
                        //in case path is expected and the sub command is piped and path is implicit,
                        //we just care about the following args
                        expectedArgs = mappedConf.args.slice(!firstCommand && pathExpected && oneArgMissing ? 1 : 0);
                    $.each(expectedArgs, function(index, arg) {
                        if (index  < args.length) {
                            pipe[arg] = args[index];
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

