module("common", { setup:setup8Inputs });

test("$.fn.match(fn)", 2    , function() {
    var expected, result;

    var fn = function(v) { return v.length == 16; };
    
    $('#qunit-fixture input:first').val("16-letter-phrase");
    $.validity.start();
    $('#qunit-fixture input:first').match(fn);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(function(v) { return v.length == 16; }) does not fail proper value (16-letter-phrase).");
    
    $('#qunit-fixture input:first').val("017-letter-phrase");
    $.validity.start();
    $('#qunit-fixture input:first').match(fn);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match(function(v) { return v.length == 16; }) does not fail proper value (017-letter-phrase).");
});