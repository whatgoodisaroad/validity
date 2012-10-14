module("common", { setup:setup8Inputs });

test("$.fn.match('zip')", 3, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("97231");
    $.validity.start();
    $('#qunit-fixture input:first').match('zip');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on 5-digit zip (97231).");
    
    $('#qunit-fixture input:first').val("97231-1234");
    $.validity.start();
    $('#qunit-fixture input:first').match('zip');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on zipcode in ZIP+4 format (97231-1234).");
    
    $('#qunit-fixture input:first').val("972311234");
    $.validity.start();
    $('#qunit-fixture input:first').match('zip');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on zipcode in ZIP+4 format with missing hyphen (972311234).");
});
