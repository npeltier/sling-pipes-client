Pipes.Creation = {
    /**
    *build a Json object relative to the input,using the mapping, Pipes.Creation.parseCommand and Pipes.Creation.parseSubCommand
    **/
    "buildJson" : function(input,mapping) {
            var subCommands=Pipes.Creation.parseCommand(input),
            add={},
            subpipe={},
            subpipesName,
            container={
              "jcr:primaryType":"nt:unstructured",
              "sling:resourceType":"slingPipes/container",
              "conf":{"jcr:primaryType":"sling:OrderedFolder"}
              };
              $.each(subCommands,function(index){
                  subpipeName=subCommands[index].split(/[\s]* /gi)[0];
                  subpipe[subpipeName]=Pipes.Creation.parseSubCommand(subCommands[index],mapping);
                  $.extend(add,subpipe);
                    });
              $.extend(container.conf,add);
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
              mappedConf = mapping[sub];
        if (mappedConf) {
            var conf = {
                "jcr:primaryType":"nt:unstructured",
                "sling:resourceType": mappedConf.pipeType
            };
            if (mappedConf.args) {
              $.each(mappedConf.args, function(index, arg) {
                if (index  < tokens.length-1)
                         conf[arg] = tokens[index+1];
              });
            }
            return conf;
          }
     }
};

$('.create').click(function(){
     var date= new Date(),
     mapping=$(".inputFieldCrea").data("mapping"),
     today= ('0'+date.getDate()).slice(-2)+'-' +('0'+(date.getMonth()+1)).slice(-2)+'-'+date.getFullYear(),
     current=location.pathname,
     pathRepertory = current.substring(0,current.lastIndexOf("/"))+('/'),
     input = $('.inputFieldCrea').val(),
     data = Pipes.Creation.buildJson(input,mapping),
     dataString=JSON.stringify(data);
     $.ajax({
        url : pathRepertory,
        type :'post',
        data :{":operation":"import",
               ":contentType":"json",
               ":name":today,
               ":content":dataString},
        success : function() {
        }
    });
});

