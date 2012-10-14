module("common", { setup:setup8Inputs });

test("$.fn.range(min, max)", 1, function() {
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
