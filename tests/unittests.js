$.extend(tests, {
    
    "Require Test":function(){
        $('input:odd').val('a value');
        $.validity.start();
        $('input').require();
        var r = $.validity.end();
        
        expect($('input:even').length, r);
    },
    
    "Match Integer Test":function(){
        var values = [
            '', '4', '4444444444', '-12', '3.14', '1.312e5', 'not a number', '123abc'
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').match('integer');
        var r = $.validity.end();
        
        expect(5, r);
    },
    
    "Match Number Test":function(){
        var values = [
            '', '4', '4444444444', '-12', '3.14', '1.312e5', 'not a number', '123abc'
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').match('number');
        var r = $.validity.end();
        
        expect(2, r);
    },
    
    "Range Test":function(){
        var values = [
            1, 4, 6, 11, 18, 20, 22, 103
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').range(10, 20);
        var r = $.validity.end();
        
        expect(5, r);
    },
    
    "Max Length Test":function(){
        var values = [
            'yes', 'yesss', 'yessssssss', 'yesssssssssssss', 'yesssssssssssssssssssss', 'yeahhhhhhhhhhhhhhhhhh', 'ahhahahahahahahahahahahahh', 'grrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').maxLength(10);
        var r = $.validity.end();
        
        expect(5, r);
    },
    
    "Equal Test 1 (Should succeed)":function(){
        var values = [
            1,1,1,1,1,1,1,1
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').equal();
        var r = $.validity.end();
        
        expect(0, r);
    },
    
    "Equal Test 2 (Should fail)":function(){
        var values = [
            1,1,1,'Ugly Duckling',1,1,1,1
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').equal();
        var r = $.validity.end();
        
        expect(1, r)
    },
    
    "Distinct Test 1 (Should succeed)":function(){
        var values = [
            1,2,3,4,5,6,7,8
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').distinct();
        var r = $.validity.end();
        
        expect(0, r);
    },
    
    "Distinct Test 2 (Should fail)":function(){
        var values = [
            1,2,3,4,1,6,7,8
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').distinct();
        var r = $.validity.end();
        
        expect(1, r);
    },
    
    "Sum Test 1 (Should succeed)":function(){
        var values = [
            25,25,25,25,25,25,25,25
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').sum(200);
        var r = $.validity.end();
        
        expect(0, r);
    },
    
    "Sum Test 2 (Should fail)":function(){
        var values = [
            5,12,5,7,5,6,87,5
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').sum(200);
        var r = $.validity.end();
        
        expect(1, r);
    },
    
    "Sum Test 3 (Should fail)":function(){
        var values = [
            5,12,5,7,5,6,837,5
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').sum(200);
        var r = $.validity.end();
        
        expect(1, r);
    },
    
    "Sum Max Test 1 (Should succeed)":function(){
        var values = [
            25,25,25,25,25,25,25,25
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').sumMax(200);
        var r = $.validity.end();
        
        expect(0, r);
    },
    
    "Sum Max Test 2 (Should succeed)":function(){
        var values = [
            5,12,5,7,5,6,87,5
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').sumMax(200);
        var r = $.validity.end();
        
        expect(0, r);
    },
    
    "Sum Max Test 3 (Should fail)":function(){
        var values = [
            5,12,5,7,5,6,837,5
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').sumMax(200);
        var r = $.validity.end();
        
        expect(1, r);
    },
    
    "Non HTML Test (Should Fail)":function(){
        var values = [
            "text", 2312, "<", "Safe text", "Un<safe Tex>t", "Loooooooooooooooooooooooooooooooooooooooooooooong text", "<<<<><<><", "ERM"
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').nonHtml();
        var r = $.validity.end();
        
        expect(3, r);
    },
    
    "Basic Hexadecimal Alphabet Test (Should Succeed)":function(){
        var values = [
            "93afe2", "ABCD", "112121", "aFdA", "11aabb44", "1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b", "1", "F"
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').alphabet("0123456789abcdefABCDEF");
        var r = $.validity.end();
        
        expect(0, r);
    },
    
    "Basic Hexadecimal Alphabet Test (Should Partially Fail)":function(){
        var values = [
            "93afe2", "*@*##@()FNCNI", "112121", "aFdA", "11aabb44", "kekeke", "~", "L"
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').alphabet("0123456789abcdefABCDEF");
        var r = $.validity.end();
        
        expect(4, r);
    },
    
    "Symbol Alphabet Test (Should Partially Fail)":function(){ 
        var values = [
            "ahhah!", "!!!!!!", "$($*#*(@\\", "um", "these aren't symbols", " ", "&", "R"
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').alphabet("!@#$%^&*()_-+={[]}?/>|\\~`<,\'\":;");
        var r = $.validity.end();
        
        expect(5, r);
    },
    
    "Min Char Class (Should Succeed)":function(){ 
        var values = [
            "qwert12345", "a1b2c3d4e5", "x0xxxx0xxxx0xxxx0xxxx0x", "09876", "83838383838383883833838", "010aaa010", "12345", "00000"
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').minCharClass("numeric", 5);
        var r = $.validity.end();
        
        expect(0, r);
    },
    
    "Min Char Class (Should Fail)":function(){ 
        var values = [
            "a@dre", "73737S@", "xxxxxxxxxxxx*xxxxxxx", "sssssss", "83838", "&", "d", "="
        ];
        $('input').each(function(i){
            this.value = values[i];
        });
        $.validity.start();
        $('input').minCharClass("symbol", 2);
        var r = $.validity.end();
        
        expect(8, r);
    }
});
