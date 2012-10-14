module("private", { setup:setup8InputsAndDebugPrivates });

test("$.validity.setup({ debugPrivates:true })", 1, function() {
    notEqual(
        $.validity.__private, 
        undefined, 
        "Private functions are properly exposed."
    );
});
