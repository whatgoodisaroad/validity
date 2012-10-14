module("private", { setup:setup8InputsAndDebugPrivates });

test("$.validity.__private.format(str, obj)", 5, function() {
    var str, obj, expected, result;
    
    str = "#{key}";
    obj = { key:"value" };
    expected = "Value";
    result = $.validity.__private.format(str, obj);
    equal(result, expected, "format works in simplest case");
    
    str = "#{key1} some text #{key2}";
    obj = { key1:"before", key2:"after" };
    expected = "Before some text after";
    result = $.validity.__private.format(str, obj);
    equal(result, expected, "format works with mixed keys and text");
    
    str = "#{key1}#{key2}";
    obj = { key1:"before", key2:"after" };
    expected = "Beforeafter";
    result = $.validity.__private.format(str, obj);
    equal(result, expected, "format works with adjacent keys");
    
    str = "#{key1} #{key1}";
    obj = { key1:"good", key2:"bad" };
    expected = "Good good";
    result = $.validity.__private.format(str, obj);
    equal(result, expected, "format works with repeated key");
    
    Object.prototype.inheritedKey = "bad";
    
    str = "#{localKey} #{inheritedKey}";
    obj = { localKey:"good" };
    expected = "Good #{inheritedKey}";
    result = $.validity.__private.format(str, obj);
    equal(result, expected, "format does not use keys from the object prototype");
    
    delete Object.prototype.inheritedKey;
});
