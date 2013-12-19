module("common", { setup:setup8Inputs });

test("$.fn.lessThan(max)", function() {
    var expected, result;

    $('#qunit-fixture input:first').val(1);
    $.validity.start();
    $('#qunit-fixture input:first').lessThan(4);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "lessThan(4) does not fail on simple value (0).");
    
    $('#qunit-fixture input:first').val(-1);
    $.validity.start();
    $('#qunit-fixture input:first').lessThan(0);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "lessThan(0) does not fail on negative value (-1).");
    
    $('#qunit-fixture input:first').val(4);
    $.validity.start();
    $('#qunit-fixture input:first').lessThan(0);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "lessThan(0) fails on bad value (4).");
    
    $('#qunit-fixture input:first').val(0);
    $.validity.start();
    $('#qunit-fixture input:first').lessThan(0);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "lessThan(0) fails on equal value (0).");
    
    $('#qunit-fixture input:first').val(4);
    $.validity.start();
    $('#qunit-fixture input:first').lessThan(4);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "lessThan(4) fails on equal value (4).");
    
    $('#qunit-fixture input:first').val(4);
    $.validity.start();
    $('#qunit-fixture input:first').lessThan(4.00000001);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "lessThan(4.00000001) does not fail on proper value (4).");

    $('#qunit-fixture input:first').val("");
    $.validity.start();
    $('#qunit-fixture input:first').lessThan(4.00000001);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "lessThan(4.00000001) accepts empty string");
});
