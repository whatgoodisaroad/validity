module("common", { setup:setup8Inputs });

test("$.fn.match(/regex/)", 6, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("12-3456");
    $.validity.start();
    $('#qunit-fixture input:first').match(/^\d{2}[-]\d{4}$/);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/^\d{2}[-]\d{4}$/) does not fail proper value (12-3456).");
    
    $('#qunit-fixture input:first').val("123456");
    $.validity.start();
    $('#qunit-fixture input:first').match(/^\d{2}[-]\d{4}$/);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match(/^\d{2}[-]\d{4}$/) fails on improper value (123456).");
    
    // This next set is for 
    // http://blog.thatscaptaintoyou.com/strange-behavior-of-the-global-regex-flag/
    var reg = /duck/g;
    $('#qunit-fixture input:first').val("duck duck goose");
    $.validity.start();
    $('#qunit-fixture input:first').match(reg);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/duck/g) does not fail (duck duck goose).");
    $.validity.start();
    $('#qunit-fixture input:first').match(reg);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/duck/g) does not fail (duck duck goose).");
    $.validity.start();
    $('#qunit-fixture input:first').match(reg);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/duck/g) does not fail (duck duck goose).");
    $.validity.start();
    $('#qunit-fixture input:first').match(reg);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/duck/g) does not fail (duck duck goose).");
});
