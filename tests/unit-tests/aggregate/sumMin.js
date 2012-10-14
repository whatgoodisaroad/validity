module("aggregate", { setup:setup8Inputs });

test("$.fn.sumMin(min)", 3, function() {
    var result, expected, values;
    
    values = [
        25, 25, 25, 25, 25, 25, 25, 25
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').sumMin(200);
    
    result = $.validity.end().errors;
    expected = 0;
    equal(
        result, 
        expected, 
        "sumMin finds no failures when all 8 inputs sum exactly to 200."
    );


    values = [
        25, 25, 25, 25, 25, 25, 25, 24
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').sumMin(200);
    
    result = $.validity.end().errors;
    expected = 1;
    equal(
        result, 
        expected, 
        "sumMin finds no fails when inputs sum to 199."
    );





    values = [
        25, 25, 25, 25, 25, 25, 25, 26
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').sumMin(200);
    
    result = $.validity.end().errors;
    expected = 0;
    equal(
        result, 
        expected, 
        "sumMin does not fail when inputs sum to 201."
    );
});
