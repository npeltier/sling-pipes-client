describe("Creation test suite", function() {
  it("parseCommand should parse a command and return a list of subpipes", function() {
    expect(Pipes.Creation.parseCommand("find blah|rm blah")).toEqual(["find blah","rm blah"]);
    expect(Pipes.Creation.parseCommand(" find blah | rm blah ")).toEqual(["find blah","rm blah"]);
    expect(Pipes.Creation.parseCommand("find blah")).toEqual(["find blah"]);
    expect(Pipes.Creation.parseCommand("")).toBe(null);
    expect(Pipes.Creation.parseCommand("| blah")).toBe(null);
    expect(Pipes.Creation.parseCommand("blah |")).toBe(null);
  });
});

