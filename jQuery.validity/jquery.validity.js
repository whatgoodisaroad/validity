/*
 * jQuery.validity beta v0.9.4.6
 * http://code.google.com/p/validity/
 * 
 * Copyright (c) 2009 Wyatt Allen
 * Dual licensed under the MIT and GPL licenses.
 *
 * Date: 2009-6-27 (Saturday, 27 June 2009)
 * Revision: 70
 */
;(function($) {
    // Default settings.
    var defaults =  {
        // The default output mode is label because it requires no dependencies.
        outputMode:"label",
        
        // The if this property is set to true, validity will scroll the browser viewport
        // so that the first error is visible when validation fails.
        scrollTo:false,
        
        // If this setting is true, modal errors will disappear when they are clicked on.
        modalErrorsClickable:true
    };

    // Setup 'static' functions and properties for the validity plugin.
    $.validity = {
        // Clone the defaults. They can be overridden with the setup function.
        settings:$.extend(defaults, { }),
        
        // Built-in library of format-checking tools for use with the match validator.
        patterns: {
            integer:/^\d+$/,
            date:function(val) { return !isNaN(Date.parse(val)); },
            email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            usd:/^\$?(\d{1,3},?(\d{3},?)*\d{3}(\.\d{0,2})?|\d{1,3}(\.\d{0,2})?|\.\d{1,2}?)$/,
            url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
            number:function(val) { return !isNaN(parseFloat(val)); },
            zip:/^\d{5}(-\d{4})?$/,
            phone:/^([\(]{1}[0-9]{3}[\)]{1}[\.| |\-]{0,1}|^[0-9]{3}[\.|\-| ]?)?[0-9]{3}(\.|\-| )?[0-9]{4}$/
        },
        
        // Built-in set of default error messages (for use when message isn't specified).
        messages:{
            require:"Field required.",
            match:"Invalid format.",
            integer:"Must be a positive, whole number.",
            date:"Must be formatted as a date.",
            email:"Must be formatted as an email.",
            usd:"Must be formatted as a US Dollar amount.",
            url:"Must be formatted as a URL.",
            number:"Must be formatted as a number.",
            zip:"Must be formatted as a zipcode.",
            phone:"Must be formatted as a phone number.",
            tooBig:"Value is too large.",
            tooSmall:"Valus is too small.",
            tooLong:"Value is too long.",
            equal:"Values didn't match.",
            distinct:"A value was repeated.",
            sum:"Values don't add up right.",
            generic:"Invalid."
        },
        
        // Object to contain the output modes. The three built-in output modes are installed
        // later on in this script.
        outputs:{},
        
        // Override the default settings with user-specified ones.
        setup:function(options) { this.settings = $.extend(this.settings, options); },
        
        // Object to store information about ongoing validation.
        // When validation starts, this will be set to a report object.
        // When validators fail, they will inform this object.
        // When validation is completed, this object will contain the 
        // information of whether it succeeded.
        report:null,
        
        // Determine whether validity is in the middle of validation.
        isValidating:function() { return this.report !== null; },
        
        // Function to prepare validity to start validating.
        start:function() { 
            // The output mode should be notified that validation is starting.
            // This usually means that the output mode will erase errors from the 
            // document in whatever way the mode needs to.
            if (this.outputs[this.settings.outputMode] && 
                this.outputs[this.settings.outputMode].start)
                this.outputs[this.settings.outputMode].start();
            
            // Initialize the report object.
            this.report = { errors:0, valid:true }; 
        },
        
        // Function called when validation is over to examine the results and clean-up.
        end:function() { 
            // Notify the current output mode that validation is over.
            if (this.outputs[this.settings.outputMode] && 
                this.outputs[this.settings.outputMode].end)
                this.outputs[this.settings.outputMode].end();
            
            var results = this.report || { errors:0, valid:true };
            
            this.report = null; 
            
            // If there was at least one error, scrollTo is enabled, an output mode is specified,
            // and if that output mode has a scrollToFirstError method, then scroll to that error.
            if (!results.valid && 
                this.settings.scrollTo && 
                this.outputs[this.settings.outputMode] &&
                this.outputs[this.settings.outputMode].scrollToFirstError)
                this.outputs[this.settings.outputMode].scrollToFirstError();
            
            return results;
        },
        
        // Remove validiatione errors:
        clear:function(){
            this.start();
            this.end();
        }
    };
    
    // Add functionality to jQuery objects:
    $.fn.extend({
        // The validity function is how validation can be bound to forms.
        // The user may pass in a validation function as described in the docs,
        // or, as a shortcut, pass in a string of a CSS selector that grabs all 
        // the inputs to require.
        validity:function(arg) {
            this.each(
                function() {
                    // Only operate on forms:
                    if (this.tagName.toLowerCase() == "form") {
                        switch (typeof(arg)) {
                            
                            // If the user entered a string of the inputs to require,
                            // then make the validation logic ad hoc right here.
                            case "string":
                                $(this).bind(
                                    "submit",
                                    function() {
                                        $.validity.start();
                                        $(arg).require();
                                        return $.validity.end().valid;
                                    }
                                );
                                break;
                                
                            // If the user entered a validation function then just call
                            // that at the appropriate time.
                            case "function":
                                $(this).bind(
                                    "submit",
                                    function() {
                                        $.validity.start();
                                        arg();
                                        return $.validity.end().valid;
                                    }
                                );
                                break;
                        }
                    }
                }
            );
            
            return this;
        },
        
        // Start defining validators //
        ///////////////////////////////
    
        // Validate whether the field has a value.
        // http://code.google.com/p/validity/wiki/Validators#Require
        require:function(msg) {
            return validate(this, function(obj) { return obj.value.length; }, msg || $.validity.messages.require);
        },
        
        // Validate whether the field matches a regex.
        // http://code.google.com/p/validity/wiki/Validators#Match
        match:function(rule, msg) {
            // If a default message is to be used:
            if (!msg) {
                // First grab the generic one:
                msg = $.validity.messages.match;
                
                // If there's a more specific one, use that.
                if (typeof(rule) == "string" && $.validity.messages[rule])
                    msg = $.validity.messages[rule];
            }
        
            // If the rule is named, rather than specified:
            if (typeof(rule) == "string") 
                rule = $.validity.patterns[rule]; 
            
            // Some of the named rules can be functions, such as 'date'.
            // If the discovered rule is a function use it as such.
            if (typeof(rule) == "function")
                return validate(this, function(obj) { return !obj.value.length || rule(obj.value); }, msg);
            
            // Otherwise, assume it's a RegExp.
            return validate(this, function(obj) { return !obj.value.length || rule.test(obj.value); }, msg);
        },
        
        // http://code.google.com/p/validity/wiki/Validators#Range
        range:function(min, max, msg) {
            // If a message is not specified, instead of using a default
            // range message, use the default inequality messages. 
            // They're more helpful.
            if (!msg)
                return this
                    .greaterThanOrEqualTo(min)
                    .lessThanOrEqualTo(max);
        
            return validate(this, function(obj) { var f = parseFloat(obj.value); return f >= min && f <= max; }, msg);
        },
        
        // http://code.google.com/p/validity/wiki/Validators#GreaterThan
        greaterThan:function(min, msg) {
            return validate(this, function(obj) { return parseFloat(obj.value) > min; }, msg || $.validity.messages.tooSmall);
        },
        
        // http://code.google.com/p/validity/wiki/Validators#GreaterThanOrEqualTo
        greaterThanOrEqualTo:function(min, msg) {
            return validate(this, function(obj) { return parseFloat(obj.value) >= min; }, msg || $.validity.messages.tooSmall);
        },
        
        // http://code.google.com/p/validity/wiki/Validators#LessThan
        lessThan:function(max, msg) {
            return validate(this, function(obj) { return parseFloat(obj.value) < max; }, msg || $.validity.messages.tooBig);
        },
        
        // http://code.google.com/p/validity/wiki/Validators#LessThanOrEqualTo
        lessThanOrEqualTo:function(min, msg) {
            return validate(this, function(obj) { return parseFloat(obj.value) <= min; }, msg || $.validity.messages.tooBig);
        },
        
        // http://code.google.com/p/validity/wiki/Validators#MaxLength
        maxLength:function(max, msg) {
            return validate(this, function(obj) { return obj.value.length <= max; }, msg || $.validity.messages.tooLong);
        },
        
        // Validate that all matched elements bear the same values.
        // Accepts a function to transform the values for testing.
        // http://code.google.com/p/validity/wiki/Validators#Equal
        equal:function(arg0, arg1) {
            // If a reduced set is attached, use it.
            var $reduction = this.reduction || this;
            
            if ($reduction.length) {
                // Figure out what arguments were specified.
                var transform = function(val) { return val; };
                var msg = $.validity.messages.equal;
                
                if (typeof(arg0) == "function") {
                    transform = arg0;
                    
                    if (typeof(arg1) == "string")
                        msg = arg1;
                }
                
                else if (typeof(arg0) == "string")
                    msg = arg0;
                
                var map = $.map($reduction, function(obj) { return transform(obj.value); });
            
                // Get the first value.
                var first = map[0];
                var valid = true;
                
                // If any value is not equal to the first value,
                // then they aren't all equal, and it's not valid.
                for (var i in map)
                    if (map[i] != first)
                        valid = false;
                
                if (!valid) {
                    raiseAggregateError($reduction, msg); 
                    
                    // The set reduces to zero valid elements.
                    this.reduction = $([]);
                }
            }
            
            return this;
        },
        
        // Validate that all matched elements bear distinct values.
        // Accepts an optional function to transform the values for testing.
        // http://code.google.com/p/validity/wiki/Validators#Distinct
        distinct:function(arg0, arg1) {
            // If a reduced set is attached, use it.
            var $reduction = this.reduction || this;
        
            if ($reduction.length) {
                // Figure out what arguments were specified.
                var transform = function(val) { return val; };
                var msg = $.validity.messages.distinct;
                
                if (typeof(arg0) == "function") {
                    transform = arg0;
                    
                    if (typeof(arg1) == "string")
                        msg = arg1;
                }
                
                else if (typeof(arg0) == "string")
                    msg = arg0;
            
                // Map all the matched values into an array.    
                var map = $.map($reduction, function(obj) { return transform(obj.value); });
                
                // An empty array to store already examined values
                var subMap = [];
                
                var valid = true;
                
                // For each transformed value:
                for (var i1 = 0; i1 < map.length; i1++) {
                    // Unless it's an empty string:
                    if (map[i1].length) {
                        // For each value we've already looked at:
                        for (var i2 = 0; i2 < subMap.length; i2++) {
                            // If we've already seen the transformed value:
                            if (subMap[i2] == map[i1])
                                valid = false;
                        }
                        
                        // We looked at the value.
                        subMap.push(map[i1]);
                    }
                }
                
                if (!valid) {
                    raiseAggregateError($reduction, msg);
                
                    // The set reduces to zero valid elements.
                    this.reduction = $([]);
                }
            }
            
            return this;
        },
        
        // Validate that the numeric sum of all values is equal to a given value.
        // http://code.google.com/p/validity/wiki/Validators#Sum
        sum:function(sum, msg) {
            // If a reduced set is attached, use it.
            var $reduction = this.reduction || this;
            
            if ($reduction.length && sum != numericSum(this)) {
                raiseAggregateError($reduction, msg || $.validity.messages.sum); 
                
                // The set reduces to zero valid elements.
                this.reduction = $([]);
            }
            
            return this;
        },
        
        // Validates an inclusive upper-bound on the numeric sum of the values of all matched elements.
        // http://code.google.com/p/validity/wiki/Validators#SumMax
        sumMax:function(max, msg) {
            // If a reduced set is attached, use it.
            var $reduction = this.reduction || this;
            
            if ($reduction.length && max < numericSum(this)) {
                raiseAggregateError($reduction, msg || $.validity.messages.sum); 
                
                // The set reduces to zero valid elements.
                this.reduction = $([]);
            }
            
            return this;
        },
        
        // If the expression is false, raise the specified error.
        // This is not a debug assertion:
        // it's a validator that is called sort of like a debug assertion.
        // http://code.google.com/p/validity/wiki/Validators#Assert
        assert:function(expression, msg) { 
            // If a reduced set is attached, use it.
            var $reduction = this.reduction || this;
            
            if ($reduction.length && !expression) {
                raiseAggregateError($reduction, msg || $.validity.messages.generic); 
                
                // The set reduces to zero valid elements.
                this.reduction = $([]);
            }
            
            return this;
        }
        
        // End defining validators //
        /////////////////////////////
    });
    
    // Start defining internal utilities //
    ///////////////////////////////////////
    
    // Do non-aggregate validation.
    // Subject each element in $obj to the regimen.
    // Raise the specified error on failures.
    // This function is the heart of validity.
    function validate ($obj, regimen, message) {
        // If a reduced set is attached, use it.
        var $reduction = $obj.reduction || $obj;
        
        // Array to store only elements that pass the regimen.
        var elements = [];
        
        // For each in the reduction.
        $reduction.each(
            function() {
                // If the element passes the regimen, include it in the reduction.
                if (regimen(this))
                    elements.push(this);
                
                // Else give the element an error message.
                else
                    raiseError(this, message);
            }
        );
        
        // Attach a (potentially) reduced set of only elements that passed.
        $obj.reduction = $(elements);
        
        // Return the full set with attached reduction.
        return $obj;
    }
    
    // Inform the report object that there was a failure.
    function addToReport() {
        if($.validity.isValidating()) {
            $.validity.report.errors++;
            $.validity.report.valid = false;
        }
    }
    
    // Inform the report of a failure and display an error according to the 
    // idiom of the current ouutput mode.
    function raiseError(obj, msg) {
        with ($.validity) {
            addToReport();
            
            if (outputs[settings.outputMode] && 
                outputs[settings.outputMode].raise)
                outputs[settings.outputMode].raise($(obj), msg);
        }
    }
    
    // Inform the report of a failure and display an aggregate error according to the 
    // idiom of the current output mode.
    function raiseAggregateError($obj, msg) {
        with ($.validity) {
            addToReport();
            
            if (outputs[settings.outputMode] && 
                outputs[settings.outputMode].raiseAggregate)
                outputs[settings.outputMode].raiseAggregate($obj, msg);
        }
    }
    
    // Yield the sum of the values of all fields matched in obj that can be parsed.
    function numericSum(obj) {
        var accumulator = 0;
        obj.each(
            function() {
                var n = parseFloat(this.value);
                if(!isNaN(n))
                    accumulator += n;
            }
        );
        return accumulator;
    }
    
    function formatError(text, argument, name) {
        if (arguments.length < 2)
            return text;
            
        return text
            .replace(/{argument}/gi, argument)
            .replace(/{name}/gi, name);
    }
    
    // End defining internal utilities //
    /////////////////////////////////////
    
    // Start installing output modes //
    ///////////////////////////////////
    
    // Output modes can be authored with the following template.
    // Each function is optional.
    /*
    
    // By convention, an output mode is placed in a closure.
    (function(){
        // Since this is a closure, local variables can be created here and they will not conflict with the rest of the code.
        // For instance, a buffer can be safely created here.
    
        // The output mode is installed by assigning an object to a sub-property of $.validity.outputs.
        // In this case the 'example' output mode is created by assigning the 'example' property.
        // After this assignment, the mode can be activated with the code: $.validity.setup({ outputMode:'example' });
        $.validity.outputs.example = {
    
    
            // The start function is called whenever validation begins.
            // Usually, it should clear out any error messages that are on the page.
            start:function(){ 
    
            },
              
            // The end function is called when validation concludes.
            // This may be used to flush any buffers that were built up during validation.
            end:function(){ 
    
            },
            
            // The raise function is called for raising an error message on a single input.
            // '$obj' is a jQuery object representing the input for which the error should be raised.
            // 'msg' is a string of the message to raise.
            raise:function($obj, msg){
                
            },
            
            // The raise function is called for raising an error message on a multiple inputs.
            // '$obj' is a jQuery array representing the inputs for which the error should be raised.
            // 'msg' is a string of the message to raise.
            raiseAggregate:function($obj, msg){ 
                
            },
            
            // The scrollToFirstError function is called to cause the page to move to the first error message.
            // This function is only called at the end of validation and only if the 'scrollTo' option is set to true.
            scrollToFirstError:function(){ 
    
            }
       };
    })();
    */
    
    // Install the label output.
    (function(){
        $.validity.outputs.label = {
            
            start:function(){ 
                // Remove all the existing error labels.
                $("label.error").remove(); 
            },
            
            raise:function($obj, msg){
                var errorId = $obj.attr('id');
                var errorSelector = "#" + errorId;
                var labelSelector = "label.error[for='" + errorId + "']";
                
                // If an error label already exists for the bad input just update its text:
                if ($(labelSelector).length)
                    $(labelSelector).text(msg);
                
                // Otherwize create a new one and stick it after the input:
                else
                    $("<label/>")
                        .attr("for", errorId)
                        .addClass("error")
                        .text(msg)
                        .insertAfter(errorSelector);
            },
            
            raiseAggregate:function($obj, msg){ 
                // Just raise the error on the last input.
                if ($obj.length)
                    this.raise($($obj.get($obj.length - 1)), msg);
            },
            
            scrollToFirstError:function(){ 
                if ($("label.error").length)
                    location.hash = $("label.error:eq(0)").attr('for');
            }
        };
    })();
    
    // Install the modal output.
    (function(){
        var errorClass = "validity-modal-msg";
        var allErrors = "." + errorClass;
        var container = "body";
        var idPrefix = "validity-modal-msg-";
    
        $.validity.outputs.modal = { 
            start:function(){ 
                // Remove all the existing errors.
                $(allErrors).remove(); 
            },
            
            raise:function($obj, msg){                
                // Design a style object based off of the input's location.
                var off = $obj.offset();
                var errorStyle = { 
                    left:parseInt(off.left + $obj.width() + 4) + "px", 
                    top:parseInt(off.top - 10) + "px" 
                };
                
                var errorId = idPrefix + $obj.attr("id");
                var errorSelector = "#" + errorId;
                
                // If one already exists, update the text.
                if ($(errorSelector).length)
                    $(errorSelector)
                        .css(errorStyle)
                        .text(msg);
                
                else
                    // Create one and position it next to the input.
                    $("<div/>")
                        .attr("id", errorId)
                        .addClass(errorClass)
                        .css(errorStyle)
                        .text(msg)
                        .click($.validity.settings.modalErrorsClickable ?
                            function() { $(this).remove(); } : null 
                        )
                        .appendTo(container);
            },
            
            raiseAggregate:function($obj, msg){ 
                // Just raise the error on the last input.
                if ($obj.length)
                    this.raise($($obj.get($obj.length - 1)), msg);
            },
            
            scrollToFirstError:function(){ 
                if ($(allErrors).length)
                    location.hash = $(allErrors + ":eq(0)").attr('id')
            }
        };
    })();
    
    // Install the summary output
    (function(){
        var container = "#validity-summary-container";
        var summary = "#validity-summary-output";
        var erroneous = "validity-erroneous";
        var errors = ".validity-erroneous";
        var wrapper = "<li/>";
        
        // Buffer to contain all the error messages that build up during validation.
        // When validation ends, it'll be flushed into the summary.
        // This way, the summary doesn't flicker empty then full.
        var buffer = [];
        
        $.validity.outputs.summary = {
            start:function() { 
                $(errors).removeClass(erroneous);  
                buffer = []; 
            },
            
            end:function() {
                $(container).hide().find(summary).html('');
                
                if (buffer.length) {
                    for (var i in buffer)
                        $(wrapper)
                            .text(buffer[i])
                            .appendTo(summary);
                            
                    $(container).show();
                }
            },
            
            raise:function($obj, msg) { 
                buffer.push(msg);
                $obj.addClass(erroneous);
            },
            
            raiseAggregate:function($obj, msg) { 
                this.raise($obj, msg); 
            },
            
            scrollToFirstError:function(){ 
                location.hash = $(errors + ":eq(0)").attr("id"); 
            }
        };
    })();
    
    // End installing output modes //
    /////////////////////////////////
})(jQuery);
