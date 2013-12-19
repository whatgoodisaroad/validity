module("common", { setup:setup8Inputs });

test("$.fn.nonHtml()", function() {
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

test("$.fn.nonHtml()", function() {
    $('#qunit-fixture input:first').val("");
    $.validity.start();
    $('#qunit-fixture input:first').nonHtml();
    var 
        result = $.validity.end().errors,
        expected = 0;
    
    equal(result, expected, "noHtml() allows empty string");
});

