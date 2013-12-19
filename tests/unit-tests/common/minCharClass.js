module("common", { setup:setup8Inputs });

test("$.fn.minCharClass(cclass, min)", function() {
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


    $('#qunit-fixture input:first').val("");
    $.validity.start();
    $('#qunit-fixture input:first').minCharClass("symbol", 2);
    var 
        result = $.validity.end().errors,
        expected = 0;
    equal(result, expected, "minCharClass() allows empty string");
});
