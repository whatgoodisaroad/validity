module("common", { setup:setup8Inputs });

test("$.fn.greaterThanOrEqualTo(min)", function() {
    var expected, result;

    $('#qunit-fixture input:first').val(4);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThanOrEqualTo(0);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThanOrEqualTo(0) does not fail on simple value (4).");
    
    $('#qunit-fixture input:first').val(0);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThanOrEqualTo(-1);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThanOrEqualTo(-1) does not fail on negative min (0).");
    
    $('#qunit-fixture input:first').val(0);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThanOrEqualTo(4);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "greaterThanOrEqualTo(4) fails on bad value (0).");
    
    $('#qunit-fixture input:first').val(0);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThanOrEqualTo(0);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThanOrEqualTo(0) does not fail on value (0).");
    
    $('#qunit-fixture input:first').val(4);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThanOrEqualTo(4);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThanOrEqualTo(4) does not fail on equal value (4).");
    
    $('#qunit-fixture input:first').val(4.00000001);
    $.validity.start();
    $('#qunit-fixture input:first').greaterThanOrEqualTo(4);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThanOrEqualTo(4) does not fail on proper value (4.00000001).");

    $('#qunit-fixture input:first').val("");
    $.validity.start();
    $('#qunit-fixture input:first').greaterThanOrEqualTo(4);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "greaterThanOrEqualTo(4) accepts empty string");
});
