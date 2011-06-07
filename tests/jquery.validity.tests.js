module("common");

test("$('...').require()", 1, function() {
    $('#qunit-fixture input:odd').val('a value');
    
    $.validity.start();
    $('#qunit-fixture input').require();
    
    var 
        result = $.validity.end().errors,
        expected = $('#qunit-fixture input:even').length
    
    equal(result, expected);
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
    
    equal(result, expected);
});

test("$('...').match('number')", 1, function() {
    var values = [
        '', '4', '4444444444', '-12', '3.14', '1.312e5', 'not a number', '123abc'
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').match('number');
    
    var 
        result = $.validity.end().errors,
        expected = 2;
    
    equal(result, expected);
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
    
    equal(result, expected);
});

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
    
    equal(result, expected);
});

test("$('...').nonHtml()", 1, function() {
    var values = [
        "text", 2312, "<", "Safe text", "Un<safe Tex>t", "Loooooooooooooooooooooooooooooooooooooooooooooong text", "<<<<><<><", "ERM"
    ];
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    $.validity.start();
    $('#qunit-fixture input').nonHtml();
    
    var 
        result = $.validity.end().errors,
        expected = 3;
    
    equal(result, expected);
});

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
    
    equal(result, expected);
    
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
    
    equal(result, expected);
    
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
    
    equal(result, expected);
});

test("$('...').minCharClass(cclass)", 2, function() {
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
    
    equal(result, expected);
    
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
    
    equal(result, expected);
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
    equal(result, expected);
    
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
    equal(result, expected);
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
    equal(result, expected);
    
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
    equal(result, expected);
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
    equal(result, expected);
    
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
    equal(result, expected);
    
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
    equal(result, expected);
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
    equal(result, expected);
    
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
    equal(result, expected);
    
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
    equal(result, expected);
});







