module("common", { setup:setup8Inputs });

test("$.fn.match('integer')", 1, function() {
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
