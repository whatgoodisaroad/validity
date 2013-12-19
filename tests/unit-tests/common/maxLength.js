module("common", { setup:setup8Inputs });

test("$.fn.maxLength(max)", function() {
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

    $('#qunit-fixture input:first').val("");
    $.validity.start();
    $('#qunit-fixture input:first').maxLength(10);
    var 
        result = $.validity.end().errors,
        expected = 0;
    
    equal(result, expected, "maxLength() allows empty string");
});
