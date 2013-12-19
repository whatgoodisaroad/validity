module("common", { setup:setup8Inputs });

test("$.fn.greaterThan(min)", function() {
    var expected, result;

    $('#qunit-fixture input:first').val(4);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThan(0);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThan(0) does not fail on simple value (4).");
    
    $('#qunit-fixture input:first').val(0);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThan(-1);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThan(-1) does not fail on negative min (0).");
    
    $('#qunit-fixture input:first').val(0);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThan(4);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "greaterThan(4) fails on bad value (0).");
    
    $('#qunit-fixture input:first').val(0);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThan(0);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "greaterThan(0) fails on equal value (0).");
    
    $('#qunit-fixture input:first').val(4);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThan(4);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "greaterThan(4) fails on equal value (4).");
    
    $('#qunit-fixture input:first').val(4.00000001);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThan(4);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThan(4) does not fail on proper value (4.00000001).");

    $('#qunit-fixture input:first').val("");
    $.validity.start();
    $('#qunit-fixture input:first').greaterThan(4);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThan(4) allows empty string.");
});
