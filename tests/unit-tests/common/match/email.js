module("common", { setup:setup8Inputs });

// Used http://tools.ietf.org/html/rfc5322 for reference.
test("$.fn.match('email')", 10, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("wyatt@example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('email') does not fail on simple email.");
    
    $('#qunit-fixture input:first').val("wyatt.wyatt@email.server.located.at.example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('email') does not fail on email with several dots.");
    
    $('#qunit-fixture input:first').val("wyatt+wyatt+wyatt+validity@example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('email') does not fail on email with '+' signs in the local part.");
    
    $('#qunit-fixture input:first').val("wyatt-wyatt-wyatt-validity@example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('email') does not fail on email with '-' signs in the local part.");
    
    $('#qunit-fixture input:first').val("132563657@example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('email') does not fail on email with digits in the local part.");
    
    $('#qunit-fixture input:first').val("wyatt_wyatt@example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('email') does not fail on email with underscores in the local part.");
    
    $('#qunit-fixture input:first').val("!#$%&'*+-/=?^_`{|}~@example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('email') does not fail when local part is composed entirely of legal symbols.");
    
    $('#qunit-fixture input:first').val("spaces spaces@example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('email') fails on email with spaces in the local part.");
    
    $('#qunit-fixture input:first').val("()[]\;:,<>@example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('email') fails on email with illegal characters in the local part.");
    
    $('#qunit-fixture input:first').val("wyatt.example.com");
    $.validity.start();
    $('#qunit-fixture input:first').match('email');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('email') fails on email without @ sign.");
});