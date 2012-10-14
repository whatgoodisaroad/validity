module("common", { setup:setup8Inputs });

test("$.fn.match('number')", 14, function() {
    var expected, result;

    var values = [
        '', '4', '4444444444', '-12', '3.14', '1.312e5', 'not a number', '123abc'
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').match('number');
    result = $.validity.end().errors;
    expected = 2;
    equal(result, expected, "match('number') has 2 failures when there are 2 non numbers in 8 inputs");
    
    $('#qunit-fixture input:first').val("1234");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on simple whole number (1234).");
    
    $('#qunit-fixture input:first').val("0.4321");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on simple fractional number with leading zero (0.4321).");
    
    $('#qunit-fixture input:first').val(".4321");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on simple fractional number without leading zero (.4321).");
    
    $('#qunit-fixture input:first').val("3.1425926");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on number with both whole part and fractional part (3.1415926).");
    
    $('#qunit-fixture input:first').val("3.");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on whole number with decimal point but no fractional part (3.).");
    
    $('#qunit-fixture input:first').val("-3987464239");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on negative whole number (-3987464239).");
    
    $('#qunit-fixture input:first').val("6.022e23");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on number in scientific notation with lowecase 'e' 6.022e23).");
    
    $('#qunit-fixture input:first').val("6.022E23");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on number in scientific notation with uppercase 'E' 6.022E23).");
    
    $('#qunit-fixture input:first').val("9.10938188e-31");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on number in scientific notation with negative radix (9.10938188e-31).");
    
    $('#qunit-fixture input:first').val("validity");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on nonsense text (validity).");
    
    $('#qunit-fixture input:first').val("0x34fa");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on hexadecimal number with 0x prefix (0x34fa).");
    
    $('#qunit-fixture input:first').val("34fa");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on hexadecimal number without 0x prefix (34fa).");
    
    $('#qunit-fixture input:first').val("1234abcd");
    $.validity.start();
    $('#qunit-fixture input:first').match('number');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails when number has trailing latin (1234abcd).");
});
