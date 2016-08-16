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
          "args":["conf"]
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

    expect(Pipes.Creation.parseSubCommand("rm   /content/foo", mapping)).toEqual({
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"slingPipes/rm",
        "path":"/content/foo"
    });
    expect(Pipes.Creation.parseSubCommand("rm", mapping)).toEqual({
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"slingPipes/rm"
    });
    expect(Pipes.Creation.parseSubCommand("$  /content/foo  cq:Page", mapping)).toEqual({
        "jcr:primaryType":"nt:unstructured",
        "sling:resourceType":"slingPipes/slingQuery",
        "path":"/content/foo",
        "expr":"cq:Page"
    });
    expect(Pipes.Creation.parseSubCommand("base",mapping)).toEqual({
        "jcr:primaryType":"nt:unstructured",
         "sling:resourceType":"slingPipes/base"
    });
    expect(Pipes.Creation.parseSubCommand("write sling:resourceType=blah",mapping)).toEqual({
          "jcr:primaryType":"nt:unstructured",
                           "sling:resourceType":"slingPipes/write",
                           "conf":{
                                "jcr:primaryType":"nt:unstructured",
                                "sling:resourceType":"blah"
                           }
    });
  });

  it("buildJson should convert a command into corresponding container pipe configuration",function(){
    expect(Pipes.Creation.buildJson("$  /content/foo  cq:Page | rm",mapping)).toEqual({
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
    expect(Pipes.Creation.buildJson("$  /content/foo" ,mapping)).toEqual({
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

   it("buildJson should convert a simple write command into corresponding writer configuration",function(){

        expect(Pipes.Creation.buildJson("$ /content/foo cq:Page | write sling:resourceType=blah",mapping)).toEqual({
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
      expect(Pipes.Creation.buildJson(" $ /content/test cq:Page | write sling:resourceType=test2",mapping)).toEqual({
         "jcr:primaryType":"nt:unstructured",
                  "sling:resourceType":"slingPipes/container",
                  "conf":{
                      "jcr:primaryType":"sling:OrderedFolder",
                      "$":{
                           "jcr:primaryType":"nt:unstructured",
                           "sling:resourceType":"slingPipes/slingQuery",
                           "path":"/content/test",
                           "expr":"cq:Page"
                      },
                      "write":{
                           "jcr:primaryType":"nt:unstructured",
                           "sling:resourceType":"slingPipes/write",
                           "conf":{
                                "jcr:primaryType":"nt:unstructured",
                                "sling:resourceType":"test2"
                           }
                      }
                  }
      });
   });

});
