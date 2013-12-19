module("common", { setup:setup8Inputs });

test("$.fn.minLength(min)", function() {
    var expected, result;

    $('#qunit-fixture input:first').val("short");
    $.validity.start();
    $('#qunit-fixture input:first').minLength(5);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "minLength(5) does not fail on length-5 value (short).");
    
    $('#qunit-fixture input:first').val("short");
    $.validity.start();
    $('#qunit-fixture input:first').minLength(4);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "minLength(4) does not fail on length-5 value (short).");
    
    $('#qunit-fixture input:first').val("short");
    $.validity.start();
    $('#qunit-fixture input:first').minLength(1);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "minLength(1) does not fail on length-5 value (short).");
    
    $('#qunit-fixture input:first').val("short");
    $.validity.start();
    $('#qunit-fixture input:first').minLength(0);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "minLength(0) does not fail on length-5 value (short).");
    
    $('#qunit-fixture input:first').val("short");
    $.validity.start();
    $('#qunit-fixture input:first').minLength(-2);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "minLength(-2) does not fail on length-5 value (short).");
    
    $('#qunit-fixture input:first').val("short");
    $.validity.start();
    $('#qunit-fixture input:first').minLength(6);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "minLength(6) fails length-5 value (short).");
    
    $('#qunit-fixture input:first').val("extremely long wordy nonsense");
    $.validity.start();
    $('#qunit-fixture input:first').minLength(6);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "minLength(6) does not on long value (extremely long wordy nonsense).");

    $('#qunit-fixture input:first').val("");
    $.validity.start();
    $('#qunit-fixture input:first').minLength(2);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "minLength(6) allows empty string");
});
