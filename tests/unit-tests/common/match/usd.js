module("common", { setup:setup8Inputs });

test("$.fn.match('usd')", 12, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("$20.00");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail simple dollar amount ($20.00).");
    
    $('#qunit-fixture input:first').val("$20");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail when cents are excluded ($20).");
    
    $('#qunit-fixture input:first').val("20.00");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail when the dollar sign is excluded (20.00).");
    
    $('#qunit-fixture input:first').val("20");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail when the dollar sign and cents are excluded (20).");
    
    $('#qunit-fixture input:first').val("$200.32");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail on three whole digit amount ($200.32).");
    
    $('#qunit-fixture input:first').val("$2000.32");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail on four whole digit amount ($2000.32).");
    
    $('#qunit-fixture input:first').val("$2,000.32");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail on four whole digit amount with comma ($2,000.32).");
    
    $('#qunit-fixture input:first').val("$2,123,456,789.32");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail on very large amount with several commas ($2,123,456,789.32).");
    
    $('#qunit-fixture input:first').val("$123.456");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('usd') fails with thousandths place ($123.456).");
    
    $('#qunit-fixture input:first').val("$1,2,3.45");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('usd') fails with nonsense commas ($1,2,3.45).");
    
    $('#qunit-fixture input:first').val("$1234,222,634.56");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('usd') fails with nonsense commas ($1234,222,634.56).");
    
    $('#qunit-fixture input:first').val("$.56");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('usd') fails with missing whole digit ($.56).");
});