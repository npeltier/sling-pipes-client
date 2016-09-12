describe("Commons test suite", function() {
    it("extractPathInfo should extract parent and name of current node correctly", function() {
        expect(Pipes.extractPathInfo("/foo/bar")).toEqual({
            "path": "/foo/bar",
            "parent": "/foo",
            "name": "bar"
        });
    });
    it("removeProtectedProperties should remove protected properties from a json structure", function(){
        expect(Pipes.removeProtectedProperties({
            "jcr:primaryType":"nt:unstructured",
            "jcr:created":"blah",
            "jcr:createdBy":"author",
            "blah":"blah"
        })).toEqual({
            "blah":"blah"
        })
        expect(Pipes.removeProtectedProperties({
            "jcr:primaryType":"nt:unstructured",
            "blah":"blah",
            "foo": {
                "jcr:primaryType":"nt:unstructured",
                "blah":"blah"
            }
        })).toEqual({
            "blah":"blah",
            "foo": {
                "blah":"blah"
            }
        })

    });
});