module("aggregate", { setup:setup8Inputs });

test("$.fn.sumMmax(max)", 3, function() {
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
    equal(
        result, 
        expected, 
        "sumMax(200) finds no failures when all 8 inputs sum exactly to 200."
    );
    
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
    equal(
        result, 
        expected, 
        "sumMax(200) finds no failures when all 8 inputs sum to less than 200."
    );
    
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
    equal(
        result, 
        expected, 
        "sumMax(200) finds failure when all 8 inputs sum to more than 200."
    );
});
