Pipes.Creation = {
    "buildJson" : function() {
    },
    /**
     * parse a piped command and return a list of subpipes
     **/
    "parseCommand" : function (command) {
        var subCommands = command.trim().split(/[\r\s]*\|[\r\s]*/gi);
        if (subCommands.indexOf("")!=-1){ return null;}
        return subCommands;
    }
};