describe("Creation test suite", function() {
var mapping = {
      "$":{
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"sling/pipes-client/mapping",
        "pipeType":"slingPipes/slingQuery",
        "name":"$",
        "args":["path","expr"]
      },
      "rm":{
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"sling/pipes-client/mapping",
        "pipeType":"slingPipes/rm",
        "name":"rm",
        "args":["path"]
      },
      "base":{
          "jcr:primaryType":"nt:unstructured",
          "sling:resourceType":"sling/pipes-client/mapping",
          "pipeType":"slingPipes/base",
          "name":"base"
      },
      "write":{
          "jcr:primaryType":"nt:unstructured",
          "sling:resourceType":"sling/pipes-client/mapping",
          "pipeType":"slingPipes/write",
          "name":"Write",
          "args":"conf"
        }
    };

  it("parseCommand should parse a command and return a list of subpipes", function() {
    expect(Pipes.Creation.parseCommand("find blah|rm blah")).toEqual(["find blah","rm blah"]);
    expect(Pipes.Creation.parseCommand(" find blah | rm blah ")).toEqual(["find blah","rm blah"]);
    expect(Pipes.Creation.parseCommand("find blah")).toEqual(["find blah"]);
    expect(Pipes.Creation.parseCommand("")).toBe(null);
    expect(Pipes.Creation.parseCommand("| blah")).toBe(null);
    expect(Pipes.Creation.parseCommand("blah |")).toBe(null);
  });

  it("parseSubCommand should parse a subcommand and return a JSONObject", function() {

    expect(Pipes.Creation.parseSubCommand("rm   /content/foo", mapping,true)).toEqual({
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"slingPipes/rm",
        "path":"/content/foo"
    });
    expect(Pipes.Creation.parseSubCommand("rm", mapping,true)).toEqual({
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"slingPipes/rm"
    });
    expect(Pipes.Creation.parseSubCommand("$  /content/foo  cq:Page", mapping,true)).toEqual({
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"slingPipes/slingQuery",
        "path":"/content/foo",
        "expr":"cq:Page"
    });
    expect(Pipes.Creation.parseSubCommand("base",mapping,true)).toEqual({
        "jcr:primaryType":"nt:unstructured",
         "sling:resourceType":"slingPipes/base"
    });
    expect(Pipes.Creation.parseSubCommand("write sling:resourceType=blah",mapping,true)).toEqual({
          "jcr:primaryType":"nt:unstructured",
                           "sling:resourceType":"slingPipes/write",
                           "conf":{
                                "jcr:primaryType":"nt:unstructured",
                                "sling:resourceType":"blah"
                           }
    });
  });

  it("buildJson should convert a command into corresponding container pipe configuration",function(){
    expect(Pipes.Creation.buildJson("$    /content/foo  cq:Page | rm",mapping)).toEqual({
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"slingPipes/container",
        "conf":{
            "jcr:primaryType":"sling:OrderedFolder",
            "$":{
                 "jcr:primaryType":"nt:unstructured",
                 "sling:resourceType":"slingPipes/slingQuery",
                 "path":"/content/foo",
                 "expr":"cq:Page"
            },
            "rm":{
                 "jcr:primaryType":"nt:unstructured",
                 "sling:resourceType":"slingPipes/rm"
            }
        }
    });
    expect(Pipes.Creation.buildJson("$ /content/foo" ,mapping)).toEqual({
            "jcr:primaryType":"nt:unstructured",
            "sling:resourceType":"slingPipes/container",
            "conf":{
                "jcr:primaryType":"sling:OrderedFolder",
                "$":{
                     "jcr:primaryType":"nt:unstructured",
                     "sling:resourceType":"slingPipes/slingQuery",
                     "path":"/content/foo"
                }
            }
        });
  });
    it("buildJson should only generate an object with created subpipe in case append flag is set",function(){
        expect(Pipes.Creation.buildJson("$    /content/foo  cq:Page | rm",mapping, true)).toEqual({
            "$":{
                "jcr:primaryType":"nt:unstructured",
                "sling:resourceType":"slingPipes/slingQuery",
                "path":"/content/foo",
                "expr":"cq:Page"
            },
            "rm":{
                "jcr:primaryType":"nt:unstructured",
                "sling:resourceType":"slingPipes/rm"
            }
        });
        expect(Pipes.Creation.buildJson("$ /content/foo" ,mapping)).toEqual({
            "jcr:primaryType":"nt:unstructured",
            "sling:resourceType":"slingPipes/container",
            "conf":{
                "jcr:primaryType":"sling:OrderedFolder",
                "$":{
                    "jcr:primaryType":"nt:unstructured",
                    "sling:resourceType":"slingPipes/slingQuery",
                    "path":"/content/foo"
                }
            }
        });
    });

   it("buildJson should correctly handled 'conf' based subpipes, with N key=value pairs",function(){
        expect(Pipes.Creation.buildJson("write sling:resourceType=blah foo=bar",mapping)).toEqual({
          "jcr:primaryType":"nt:unstructured",
          "sling:resourceType":"slingPipes/container",
          "conf":{
              "jcr:primaryType":"sling:OrderedFolder",
              "write":{
                   "jcr:primaryType":"nt:unstructured",
                   "sling:resourceType":"slingPipes/write",
                   "conf":{
                        "jcr:primaryType":"nt:unstructured",
                        "sling:resourceType":"blah",
                        "foo":"bar"
                   }
              }
          }
      });
       expect(Pipes.Creation.buildJson("write sling:resourceType=blah",mapping)).toEqual({
           "jcr:primaryType":"nt:unstructured",
           "sling:resourceType":"slingPipes/container",
           "conf":{
               "jcr:primaryType":"sling:OrderedFolder",
               "write":{
                   "jcr:primaryType":"nt:unstructured",
                   "sling:resourceType":"slingPipes/write",
                   "conf":{
                       "jcr:primaryType":"nt:unstructured",
                       "sling:resourceType":"blah"
                   }
               }
           }
       });
   });

   it("path argument should be handled depending on the pipe context",function(){
        expect(Pipes.Creation.buildJson("$ /content",mapping).conf.$).toEqual({
                    "jcr:primaryType":"nt:unstructured",
                    "sling:resourceType":"slingPipes/slingQuery",
                    "path":"/content"
                });
        expect(Pipes.Creation.buildJson("find /content | $ sling:Folder",mapping).conf.$).toEqual({
                    "jcr:primaryType":"nt:unstructured",
                    "sling:resourceType":"slingPipes/slingQuery",
                    "expr":"sling:Folder"
                });
        expect(Pipes.Creation.buildJson("find /content | $ /etc sling:Folder",mapping).conf.$).toEqual({
                    "jcr:primaryType":"nt:unstructured",
                    "sling:resourceType":"slingPipes/slingQuery",
                    "path":"/etc",
                    "expr":"sling:Folder"
                });
   });

});
