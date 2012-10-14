module("common", { setup:setup8Inputs });

test("$.fn.match('phone')", 4, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("321-321-4321");
    $.validity.start();
    $('#qunit-fixture input:first').match('phone');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on 10-digit phone number with hyphens (321-321-4321).");
    
    $('#qunit-fixture input:first').val("321-4321");
    $.validity.start();
    $('#qunit-fixture input:first').match('phone');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on 7-digit phone number with hyphens (321-4321).");
    
    $('#qunit-fixture input:first').val("1-800-321-4321");
    $.validity.start();
    $('#qunit-fixture input:first').match('phone');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on 11-digit phone number with hyphens (1-800-321-4321).");
    
    $('#qunit-fixture input:first').val("100-321-4321");
    $.validity.start();
    $('#qunit-fixture input:first').match('phone');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on 10-digit phone number with hyphens where the area code starts with 1 (100-321-4321).");
});