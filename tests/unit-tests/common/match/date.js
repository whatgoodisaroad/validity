module("common", { setup:setup8Inputs });

test("$.fn.match('date')", 5, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("09/23/2007");
    $.validity.start();
    $('#qunit-fixture input:first').match('date');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('date') does not fail on simple, correct mm/dd/yyyy format.");

    $('#qunit-fixture input:first').val("09-23-2007");
    $.validity.start();
    $('#qunit-fixture input:first').match('date');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('date') does not fail on simple, correct mm-dd-yyyy format.");
    
    $('#qunit-fixture input:first').val("23/09/2007");
    $.validity.start();
    $('#qunit-fixture input:first').match('date');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('date') fails on dd/mm/yyyy format.");
    
    $('#qunit-fixture input:first').val("09/80/2007");
    $.validity.start();
    $('#qunit-fixture input:first').match('date');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('date') fails when day is too large.");
    
    $('#qunit-fixture input:first').val("45642/2673270/132563657");
    $.validity.start();
    $('#qunit-fixture input:first').match('date');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('date') fails when all date components are far too large.");
});
