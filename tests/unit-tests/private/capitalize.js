module("private", { setup:setup8InputsAndDebugPrivates });

test("$.validity.__private.capitalize(sz)", 1, function() {
    var sz, expected, result;
    
    sz = "lower";
    expected = "Lower";
    result = $.validity.__private.capitalize(sz);
    equal(result, expected, "capitalize works on simple word.");
});
