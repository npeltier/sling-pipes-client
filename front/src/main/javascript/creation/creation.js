Pipes.Creation = {
    /**
     * build a Json structure relative to the input, using the mapping. If append is true, an array of commands will
     * be returned, otherwise, the full container object containing subpipes is returned.
     * @param input
     * @param mapping
     * @param append
     * @returns {container} or {pipes to append} depending on append flag
     */
    "buildJson" : function(input, mapping, append) {
        var subCommands = Pipes.Creation.parseCommand(input);
            conf = {};
        $.each(subCommands,function(index){
            conf[subCommands[index].split(/[\s]* /gi)[0]] = Pipes.Creation.parseSubCommand(subCommands[index], mapping, index === 0);
        });
        return append ? conf : {
            "jcr:primaryType":"nt:unstructured",
            "sling:resourceType":"slingPipes/container",
            "conf": $.extend({"jcr:primaryType":"sling:OrderedFolder"}, conf)
        };
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
    "parseSubCommand" : function (subCommands, mapping, firstCommand){
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

$('.postpipes').click(function(){
    var input = $('#pipedExpression').val(),
        append = $(this).data("append"),
        data = Pipes.Creation.buildJson(input, Pipes.getMapping(), append);
    if (append){
        var confFolder = getCurrentPipePath() + "/conf";
        $.each(data, function(name, conf){
            Pipes.importContent(confFolder, key, conf);
        });
    } else {
        var date = new Date(),
            today = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2)+'_'+('0'+date.getHours()).slice(-2)+'-'+('0'+date.getMinutes()).slice(-2),
            parent = "/etc/sling/pipes/history/" + date.getFullYear() + '/' + ('0'+(date.getMonth()+1)).slice(-2);
        Pipes.importContent(parent, today, data, function(){
            document.location.href = parent + "/" + today + ".html";
        });
    }
});

