module("common", { setup:setup8Inputs });

test("$.fn.alphabet(alpha)", function() {
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

    $('#qunit-fixture input:first').val("");
    $.validity.start();
    $('#qunit-fixture input:first').alphabet("alpha");
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "alphabet allows empty string");
});
