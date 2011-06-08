module("static");

test("$.validity.isValidating()", 3, function() {
    var expected, result;
    
    expected = false;
    result = $.validity.isValidating();
    equal(result, expected, "isValidating returns false when nothing has been started.");
    
    $.validity.start();
    
    expected = true;
    result = $.validity.isValidating();
    equal(result, expected, "isValidating returns true when validation has been started but not ended.");
    
    $.validity.end();
    
    expected = false;
    result = $.validity.isValidating();
    equal(result, expected, "isValidating returns false when validation has been ended.");
});

module("common");

test("$('...').require()", 3, function() {
    var expected, result;
    
    $('#qunit-fixture input:odd').val('a value');
    $('#qunit-fixture input:even').val('');
    $.validity.start();
    $('#qunit-fixture input').require();
    result = $.validity.end().errors;
    expected = $('#qunit-fixture input:even').length;
    equal(result, expected, "require validation fails on only empty inputs");
    
    $('#qunit-fixture input').val('');
    $.validity.start();
    $('#qunit-fixture input').require();
    result = $.validity.end().errors;
    expected = 8;
    equal(result, expected, "require validation fails on all inputs when all are empty");
    
    $('#qunit-fixture input').val('value');
    $.validity.start();
    $('#qunit-fixture input').require();
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "require validation does not fail when there are not empty inputs");
});

test("$('...').match('integer')", 1, function() {
    var values = [
        '', '4', '4444444444', '-12', '3.14', '1.312e5', 'not a number', '123abc'
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').match('integer');
    
    var 
        result = $.validity.end().errors,
        expected = 5;
    
    equal(result, expected, "match('integer') raises 5 errors when there are 5 non integers in 8 inputs");
});

test("$('...').match('date')", 4, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("09/23/2007");
    $.validity.start();
    $('#qunit-fixture input:first').match('date');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('date') does not fail on simple, correct mm/dd/yyyy format.");
    
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

// Used http://tools.ietf.org/html/rfc5322 for reference.
test("$('...').match('email')", 10, function() {
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

test("$('...').match('usd')", 12, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("$20.00");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail simple dollar amount ($20.00).");
    
    $('#qunit-fixture input:first').val("$20");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail when cents are excluded ($20).");
    
    $('#qunit-fixture input:first').val("20.00");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail when the dollar sign is excluded (20.00).");
    
    $('#qunit-fixture input:first').val("20");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail when the dollar sign and cents are excluded (20).");
    
    $('#qunit-fixture input:first').val("$200.32");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail on three whole digit amount ($200.32).");
    
    $('#qunit-fixture input:first').val("$2000.32");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail on four whole digit amount ($2000.32).");
    
    $('#qunit-fixture input:first').val("$2,000.32");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail on four whole digit amount with comma ($2,000.32).");
    
    $('#qunit-fixture input:first').val("$2,123,456,789.32");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('usd') does not fail on very large amount with several commas ($2,123,456,789.32).");
    
    $('#qunit-fixture input:first').val("$123.456");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('usd') fails with thousandths place ($123.456).");
    
    $('#qunit-fixture input:first').val("$1,2,3.45");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('usd') fails with nonsense commas ($1,2,3.45).");
    
    $('#qunit-fixture input:first').val("$1234,222,634.56");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('usd') fails with nonsense commas ($1234,222,634.56).");
    
    $('#qunit-fixture input:first').val("$.56");
    $.validity.start();
    $('#qunit-fixture input:first').match('usd');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('usd') fails with missing whole digit ($.56).");
});

test("$('...').match('number')", 14, function() {
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

test("$('...').match('zip')", 3, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("97231");
    $.validity.start();
    $('#qunit-fixture input:first').match('zip');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on 5-digit zip (97231).");
    
    $('#qunit-fixture input:first').val("97231-1234");
    $.validity.start();
    $('#qunit-fixture input:first').match('zip');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on zipcode in ZIP+4 format (97231-1234).");
    
    $('#qunit-fixture input:first').val("972311234");
    $.validity.start();
    $('#qunit-fixture input:first').match('zip');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on zipcode in ZIP+4 format with missing hyphen (972311234).");
});

test("$('...').match('phone')", 4, function() {
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
    expected = 0;
    equal(result, expected, "match('number') does not fail on 7-digit phone number with hyphens (321-4321).");
    
    $('#qunit-fixture input:first').val("1-800-321-4321");
    $.validity.start();
    $('#qunit-fixture input:first').match('phone');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('number') does not fail on 11-digit phone number with hyphens (1-800-321-4321).");
    
    $('#qunit-fixture input:first').val("100-321-4321");
    $.validity.start();
    $('#qunit-fixture input:first').match('phone');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('number') fails on 10-digit phone number with hyphens where the area code starts with 1 (100-321-4321).");
});

test("$('...').match('guid')", 2, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("{3F2504E0-4F89-11D3-9A0C-0305E82C3301}");
    $.validity.start();
    $('#qunit-fixture input:first').match('guid');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('guid') does not fail proper guid ({3F2504E0-4F89-11D3-9A0C-0305E82C3301}).");
    
    $('#qunit-fixture input:first').val("obviously not a guid.");
    $.validity.start();
    $('#qunit-fixture input:first').match('guid');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('guid') fails on non-guid (obviously not a guid.).");
});

test("$('...').match('time12')", 11, function() {
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

test("$('...').match('time24')", 8, function() {
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

test("$('...').match(/regex/)", 6, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("12-3456");
    $.validity.start();
    $('#qunit-fixture input:first').match(/^\d{2}[-]\d{4}$/);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/^\d{2}[-]\d{4}$/) does not fail proper value (12-3456).");
    
    $('#qunit-fixture input:first').val("123456");
    $.validity.start();
    $('#qunit-fixture input:first').match(/^\d{2}[-]\d{4}$/);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match(/^\d{2}[-]\d{4}$/) fails on improper value (123456).");
    
    // This next set is for 
    // http://blog.thatscaptaintoyou.com/strange-behavior-of-the-global-regex-flag/
    var reg = /duck/g;
    $('#qunit-fixture input:first').val("duck duck goose");
    $.validity.start();
    $('#qunit-fixture input:first').match(reg);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/duck/g) does not fail (duck duck goose).");
    $.validity.start();
    $('#qunit-fixture input:first').match(reg);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/duck/g) does not fail (duck duck goose).");
    $.validity.start();
    $('#qunit-fixture input:first').match(reg);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/duck/g) does not fail (duck duck goose).");
    $.validity.start();
    $('#qunit-fixture input:first').match(reg);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(/duck/g) does not fail (duck duck goose).");
});

test("$('...').match(fn)", 2    , function() {
    var expected, result;

    var fn = function(v) { return v.length == 16; };
    
    $('#qunit-fixture input:first').val("16-letter-phrase");
    $.validity.start();
    $('#qunit-fixture input:first').match(fn);
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match(function(v) { return v.length == 16; }) does not fail proper value (16-letter-phrase).");
    
    $('#qunit-fixture input:first').val("017-letter-phrase");
    $.validity.start();
    $('#qunit-fixture input:first').match(fn);
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match(function(v) { return v.length == 16; }) does not fail proper value (017-letter-phrase).");
});

test("$('...').range(min, max)", 1, function() {
    var values = [
        1, 4, 6, 11, 18, 20, 22, 103
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').range(10, 20);
    
    var 
        result = $.validity.end().errors,
        expected = 5;
    
    equal(result, expected, "range(10, 20) finds 5 failures when 5 of 8 inputs have values outside that range");
});

test("$('...').greaterThan(min)", 0, function() { throw "Not Implemented" });
test("$('...').greaterThanOrEqualTo(min)", 0, function() { throw "Not Implemented" });
test("$('...').lessThan(max)", 0, function() { throw "Not Implemented" });
test("$('...').lessThanOrEqualTo(max)", 0, function() { throw "Not Implemented" });

test("$('...').maxLength(max)", 1, function() {
    var values = [
        'yes', 'yesss', 'yessssssss', 'yesssssssssssss', 
        'yesssssssssssssssssssss', 'yeahhhhhhhhhhhhhhhhhh', 
        'ahhahahahahahahahahahahahh', 
        'grrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    $.validity.start();
    $('#qunit-fixture input').maxLength(10);
    
    var 
        result = $.validity.end().errors,
        expected = 5;
    
    equal(result, expected, "maxLength(10) finds 5 failures when 5 inputs amon 8 are too long.");
});

test("$('...').minLength(min)", 0, function() { throw "Not Implemented" });

test("$('...').alphabet(alpha)", 3, function() {
    var result, expected, values, alpha;
    
    alpha = "0123456789abcdefABCDEF";

    values = [
        "93afe2", "ABCD", "112121", "aFdA", "11aabb44", 
        "1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b", 
        "1", "F"
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    $.validity.start();
    $('#qunit-fixture input').alphabet(alpha);
    
    result = $.validity.end().errors;
    expected = 0;
    
    equal(result, expected, "alphabet for hexadecimal characters finds no failures among 8 valid inputs");
    
    values = [
        "93afe2", "*@*##@()FNCNI", "112121", "aFdA", "11aabb44", "kekeke", "~", "L"
    ];
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    $.validity.start();
    $('#qunit-fixture input').alphabet(alpha);
    
    result = $.validity.end().errors;
    expected = 4;
    
    equal(result, expected, "alphabet for hexadecimal characters finds 4 failures when 4 inputs among 8 have invalid values");
    
    alpha = "!@#$%^&*()_-+={[]}?/>|\\~`<,\'\":;";
    values = [
        "ahhah!", "!!!!!!", "$($*#*(@\\", "um", "these aren't symbols", " ", "&", "R"
    ];
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    $.validity.start();
    $('#qunit-fixture input').alphabet(alpha);
    result = $.validity.end().errors;
    expected = 5;
    
    equal(result, expected, "alphabet for symbols characters finds 5 failures when 5 inputs among 8 have invalid values");
});

test("$('...').minCharClass(cclass, min)", 2, function() {
    var result, expected, values;
    
    values = [
        "qwert12345", "a1b2c3d4e5", "x0xxxx0xxxx0xxxx0xxxx0x", "09876", "83838383838383883833838", "010aaa010", "12345", "00000"
    ];
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    $.validity.start();
    $('#qunit-fixture input').minCharClass("numeric", 5);
    
    result = $.validity.end().errors;
    expected = 0;
    
    equal(result, expected, "minCharClass('numeric', 5) finds no failures among 8 valid inputs");
    
    values = [
        "a@dre", "73737S@", "xxxxxxxxxxxx*xxxxxxx", "sssssss", "83838", "&", "d", "="
    ];
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    $.validity.start();
    $('#qunit-fixture input').minCharClass("symbol", 2);
    
    result = $.validity.end().errors;
    expected = 8;
    
    equal(result, expected, "minCharClass('numeric', 5) finds 8 failures among 8 invalid inputs");
});

test("$('...').password({ opts })", 0, function() { throw "Not Implemented" });

test("$('...').nonHtml()", 1, function() {
    var values = [
        "text", 2312, "<", "Safe text", "Un<safe Tex>t", 
        "Loooooooooooooooooooooooooooooooooooooooooooooong text", 
        "<<<<><<><", "ERM"
    ];
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    $.validity.start();
    $('#qunit-fixture input').nonHtml();
    
    var 
        result = $.validity.end().errors,
        expected = 3;
    
    equal(result, expected, "noHtml() finds 3 failures when 3 inputs among 8 have HTML charactes.");
});

module("aggregate");

test("$('...').equal()", 2, function() {
    var result, expected, values;
    
    values = [
        1, 1, 1, 1, 1, 1, 1, 1
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').equal();
    
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "equal() finds no failure among 8 equal inputs");
    
    values = [
        1,1,1,'Ugly Duckling',1,1,1,1
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').equal();
    
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "equal() finds a failure when 1 among 8 inputs is not equal to the other 7");
});

test("$('...').distinct()", 2, function() {
    var result, expected, values;
    
    values = [
        1, 2, 3, 4, 5, 6, 7, 8
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').distinct();
    
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "distinct() finds no failure when none among 8 inputs have equal values");
    
    values = [
        1, 2, 3, 4, 1, 6, 7, 8
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').distinct();
    
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "distinct() finds failure when 2 among 8 inputs have equal values");
});

test("$('...').sum(val)", 3, function() {
    var result, expected, values;
    
    values = [
        25, 25, 25, 25, 25, 25, 25, 25
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').sum(200);
    
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "sum(200) finds no failures when all 8 inputs sum exactly to 200.");
    
    values = [
        5, 12, 5, 7, 5, 6, 87, 5
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').sum(200);
    
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "sum(200) finds failure when sum of inputs is less than 200");
    
    values = [
        5, 12, 5, 7, 5, 6, 837, 5
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').sum(200);
    
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "sum(200) finds failure when sum of inputs is greater than 200");
});

test("$('...').sum(max)", 3, function() {
    var result, expected, values;
    
    values = [
        25, 25, 25, 25, 25, 25, 25, 25
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').sumMax(200);
    
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "sumMax(200) finds no failures when all 8 inputs sum exactly to 200.");
    
    values = [
        5, 12, 5, 7, 5, 6, 87, 5
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').sumMax(200);
    
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "sumMax(200) finds no failures when all 8 inputs sum to less than 200.");
    
    values = [
        5, 12, 5, 7, 5, 6, 837, 5
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').sumMax(200);
    
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "sumMax(200) finds failure when all 8 inputs sum to more than 200.");
});







