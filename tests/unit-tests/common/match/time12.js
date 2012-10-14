module("common", { setup:setup8Inputs });

test("$.fn.match('time12')", 11, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("12:30 AM");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time12') does not fail proper 12-hour time (12:30 AM).");
    
    $('#qunit-fixture input:first').val("4:00 PM");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time12') does not fail proper 12-hour time (4:00 PM).");
    
    $('#qunit-fixture input:first').val("4:00PM");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time12') does not fail proper 12-hour time without space (4:00PM).");
    
    $('#qunit-fixture input:first').val("4:00 pM");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time12') does not fail proper 12-hour time with mixed-case meridian (4:00 pM).");
    
    $('#qunit-fixture input:first').val("4:00 P.M.");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time12') does not fail proper 12-hour time with dots in meridian (4:00 P.M.).");
    
    $('#qunit-fixture input:first').val("04:00 PM");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('time12') does not fail with leading zero in hour (04:00 PM).");
    
    $('#qunit-fixture input:first').val("13:00 P.M.");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time12') fails on invalid hour (13:00 P.M.).");
    
    $('#qunit-fixture input:first').val("11:90 P.M.");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time12') fails on invalid minute (11:90 P.M.).");
    
    $('#qunit-fixture input:first').val("11:60 P.M.");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time12') fails on invalid minute (11:60 P.M.).");
    
    $('#qunit-fixture input:first').val("11:00 AP");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time12') fails on invalid meridian (11:00 AP).");
    
    $('#qunit-fixture input:first').val("11:000 PM");
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('time12') fails with too many minute digits (11:000 PM).");
});

test("$.fn.match('time12')", 1, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("10:30 AM");
    
    $.validity.start();
    $('#qunit-fixture input:first').match('time12');
    result = $.validity.end().errors;
    
    expected = 0;

    equal(
        result, 
        expected, 
        "match('time12') allows 10 in the hour part (10:30 AM)."
    );
});
