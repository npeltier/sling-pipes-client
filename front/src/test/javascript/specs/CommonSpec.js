describe("Commons test suite", function() {
    it("extractPathInfo should extract parent and name of current node correctly", function() {
        expect(Pipes.extractPathInfo("/foo/bar")).toEqual({
            "path": "/foo/bar",
            "parent": "/foo",
            "name": "bar"
        });
    });
});