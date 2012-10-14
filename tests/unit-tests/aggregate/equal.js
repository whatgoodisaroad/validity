module("aggregate", { setup:setup8Inputs });

test("$.fn.equal()", 2, function() {
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

