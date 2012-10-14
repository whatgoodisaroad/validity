module("common", { setup:setup8Inputs });

test("$.fn.match('time24')", 8, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("1:30");
    $.validity.start();
    $('#qunit-fixture input:first').match('time24');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time24') does not fail proper 24-hour time (1:30).");
    
    $('#qunit-fixture input:first').val("14:14");
    $.validity.start();
    $('#qunit-fixture input:first').match('time24');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time24') does not fail proper 24-hour time (14:14).");
    
    $('#qunit-fixture input:first').val("04:14");
    $.validity.start();
    $('#qunit-fixture input:first').match('time24');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time24') does not fail proper 24-hour time with leading zero in hour (04:14).");
    
    $('#qunit-fixture input:first').val("24:14");
    $.validity.start();
    $('#qunit-fixture input:first').match('time24');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time24') fails on invalid hour (24:14).");
    
    $('#qunit-fixture input:first').val("26:14");
    $.validity.start();
    $('#qunit-fixture input:first').match('time24');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time24') fails on invalid hour (26:14).");
    
    $('#qunit-fixture input:first').val("22:64");
    $.validity.start();
    $('#qunit-fixture input:first').match('time24');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time24') fails on invalid minute (22:64).");
    
    $('#qunit-fixture input:first').val("004:24");
    $.validity.start();
    $('#qunit-fixture input:first').match('time24');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time24') fails on too many hour digits (004:24).");
    
    $('#qunit-fixture input:first').val("4:024");
    $.validity.start();
    $('#qunit-fixture input:first').match('time24');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time24') fails on too many minute digits (4:024).");
});
