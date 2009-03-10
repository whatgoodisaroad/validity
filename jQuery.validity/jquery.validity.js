/*
 * jQuery.validity beta v0.9.2
 * http://code.google.com/p/validity/
 * 
 * Copyright (c) 2009 Wyatt Allen
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-03-08 (Sun, 8 March 2009)
 * Revision: 8
 */
(function() {
    // Private defaults definition.
    var defaults =  {
        outputMode:             "MODAL", // [Modal|Summary|None|Custom]
        
        // Methods for custom output modes.
        // One pumps new errors, the other should clear them all.
        RaiseCustomOutputModeError:             function($obj, msg) { },
        RaiseCustomOutputModeAggregateError:    function($obj, msg) { },
        CustomOutputModeClear:                  function() { }
    };
    
    //// Static Functions and Properties /////////////////
    jQuery.validity = {
        // Settings file.
        settings: jQuery.extend(defaults, { }),
        
        // Remove all errors on the page.
        Clear: function(){
            if(jQuery.validity.settings.outputMode == "MODAL")
                jQuery('.validity-modal-msg').remove();
                
            else if(jQuery.validity.settings.outputMode == "SUMMARY"){
                jQuery('#validity-summary-output').hide().html('');
                jQuery('.validity-erroneous').removeClass('validity-erroneous');
            }
            
            else if(jQuery.validity.settings.outputMode == "CUSTOM")
                jQuery.validity.settings.CustomOutputModeClear();
        },
        
        // Output an general validation error (withut associated controls)
        // in whatever manner has been configured.
        GeneralError: function(msg){
            raiseError(null, msg);
        },
        
        // Initialize validity with custom settings.
        Setup: function(options){
            jQuery.validity.settings = jQuery.extend(defaults, options);
            
            // The actual output mode should always be upper cased.
            jQuery.validity.settings.outputMode = jQuery.validity.settings.outputMode.toUpperCase();
        },
        
        // If the expression is false, raise the specified general error.
        // A specific version of this exists for jQuery objects.
        // This is not a debug assertion. It is a validator that is called
        // like a debug assertion.
        Assert: function(expression, msg){
            if(!expression)
                GeneralError(msg);
        }
    };
    
    //// Public Methods /////////////////
    
    // Validate whether the field has a value.
    jQuery.fn.Require = function(msg){
        var regimen = new Array();
        
        regimen['this.value.length > 0'] = msg;
        
        return validate(this, regimen);
    };
    
    // Validate whether the field matches a regex.
    jQuery.fn.Match = function(msg, regex){
        var regimen = new Array();
        
        regimen['/' + regex + '/.test(this.value)'] = msg;
        
        return validate(this, regimen);
    }
    
    // Validate that a field has a value, then, if that fails,
    // validate that it matches a regex.
    jQuery.fn.RequireThenMatch = function(rmsg, mmsg, regex){
        var regimen = new Array();
        
        regimen['this.value.length > 0']            = rmsg;
        regimen['/' + regex + '/.test(this.value)'] = mmsg;
        
        return validate(this, regimen);
    }
    
    // Validate that all matched elements bear the same values.
    jQuery.fn.AreEqual = function(msg){
        return this.AreEqual(msg, function(val) { 
                return val; 
            }
        );
    };
    
    // Validate that all matched elements bear the same values.
    // Accepts a function to transform the values for testing.
    jQuery.fn.AreEqualTransform = function(msg, transform){
        if(this.length > 0){
            var temp = transform(this.get(0).value);
            var valid = true;
            var $obj = this;
            
            this.each(
                function(){
                    if(transform(this.value) != temp)
                        valid = false;
                }
            );
            
            if(!valid)
                raiseAggregateError($obj, msg);
            
            return valid;
        }
        
        else 
            return true;
    };
    
    // Validate that all matched elements bear distinct values.
    jQuery.fn.AreNotEqual = function(msg) {
        return this.AreNotEqualTransform(msg, function(val) { 
                return val; 
            }
        );
    };
    
    // Validate that all matched elements bear distinct values.
    // Accepts a function to transform the values for testing.
    jQuery.fn.AreNotEqualTransform = function(msg, transform){
        if(this.length > 0){
            var values = new Array();
            var $obj = this;
            var valid = true;
            
            this.each(
                function(idx){
                    var transformedValue = transform(this.value);
                
                    for(i in values){
                        if(transformedValue != '' && values[i] == transformedValue)
                            valid = false;
                    }
                    
                    values[idx] = transformedValue;
                }
            );
            
            if(!valid)
                raiseAggregateError($obj, msg);
            
            return valid;
        }
        
        else return true;
    };
    
    // Validate that the numeric sum of all values is equal to a given value.
    jQuery.fn.Sum = function(msg, sum){
        if(this.length > 0){            
            var actual = numericSum(this);
            
            var valid = sum == actual;
            
            if(!valid)
                raiseAggregateError(this, msg);
            
            return valid;
        }
        
        else 
            return true;
    };
    
    // Validates an inclusive upper-bound on the numeric sum of the values of all matched elements.
    jQuery.fn.SumMax = function(msg, max){
        if(this.length > 0){            
            var actual = numericSum(this);
            var valid = max >= actual;
            
            if(!valid)
                raiseAggregateError(this, msg);
            
            return valid;
        }
        
        else 
            return true;
    };
    
    // Validate matched elements based on a user-defined regimen.
    jQuery.fn.ValidateRegimen = function(regimen){ 
        return validate(this, regimen); 
    };
    
    // Validate the control based on the Json result from the specified
    // URL, with the specified data sent by the specified post.
    // In order for the validator to work, the Json result must have 
    // A boolean property 'valid' representing whether the validator passed,
    // and, in the case that valid is false, a string 'msg' representing
    // the error message.
    jQuery.fn.JsonValidate = function(url, method, data) {
        return this.AjaxValidate(
            url, 
            method,
            data, 
            function(response) { 
                return eval('(' + response + ')'); 
            }
        );
    };
    
    // Validate the control based on the result of an ajax call to the 
    // specified url with the specified data sent by the specified method.
    // The interpreter argument should be a function capable of taking the
    // response and returning an object with a 'valid' boolean representing
    // whether the validation passed, and, if valid is false, a 'msg' string 
    // reprsenting the error message.
    jQuery.fn.AjaxValidate = function(url, method, data, interpreter) {
        var sync = true;
        var elem = this.get(0);
        jQuery.ajax({
                url:url,
                data:data,
                method:method,
                async:false,
                
                success: function(response){
                    var data = interpreter(response);
                    if(!data.valid){
                        raiseError(elem, data.msg);
                        sync = false;
                    }
                }
            }
        );
        return sync;
    };
    
    // If the expression is false, raise the specified error.
    // This is not a debug assertion. It's a validator
    // that is called like a debug assertion.
    jQuery.fn.Assert = function(expression, msg){
        if(!expression)
            raiseError(this, msg);
    }
    
    //// Private Functions /////////////////
    
    // Private function to validate an element based on a 
    // linear set of conditions.
    function validate($elem, regimen){
        var valid = true;
        
        $elem.each(
            function() {
                for(key in regimen){
                    if(!eval(key)){
                        raiseError(this, regimen[key]);
                        valid = false;
                        break;
                    }
                }
            }
        );
        
        return valid;
    }
    
    // Raise an error appropriately for the element with the message.
    function raiseError(elem, msg){
        if(jQuery.validity.settings.outputMode == "MODAL")
            raiseModalError(jQuery(elem), msg);
            
        else if(jQuery.validity.settings.outputMode == "SUMMARY")
            raiseSummaryError(jQuery(elem), msg);
            
        else if(jQuery.validity.settings.outputMode == "CUSTOM")
            jQuery.validity.settings.RaiseCustomOutputModeError(jQuery(elem), msg);
    };
    
    // Raise an error with a modal message.
    function raiseModalError($obj, msg){
        var off = $obj.offset();
        
        var computedLeft = off.left + $obj.width() + 4;
        var computedTop = off.top - 10;
        
        if(jQuery('#validity-msg-' + $obj.attr('id')).length == 0)
            jQuery('#validity-modal-output').append(
                "<div id='validity-msg-" + $obj.attr('id') + "' " + 
                "class='validity-modal-msg' " + 
                "style='left: " + computedLeft + "px;top: " + computedTop + "px;'" + 
                "onclick='jQuery(this).remove()'>" + 
                msg + "</div>"
            );
        else
            jQuery('#validity-msg-' + $obj.attr('id'))
                .css({ 
                    left: computedLeft + 'px', 
                    top: computedTop + 'px' 
                })
                .html(msg);
    };
    
    // Display error in a summary output.
    function raiseSummaryError($obj, msg){
        pumpToSummary(msg);
        
        $obj.addClass('validity-erroneous');
    };
    
    // Merely outputs text to the summary.
    function pumpToSummary(msg){
        jQuery('#validity-summary-output').show().append('* ' + msg + '<br />');
    }
    
    // Raise a single error for several elements.
    function raiseAggregateError(obj, msg){
        if(jQuery.validity.settings.outputMode == "MODAL")
            raiseAggregateModalError(obj, msg);
            
        else if(jQuery.validity.settings.outputMode == "SUMMARY")
            raiseSummaryError(obj, msg);
            
        else if(jQuery.validity.settings.outputMode == "CUSTOM")
            jQuery.validity.settings.RaiseCustomOutputModeAggregateError(obj, msg);
    }
    
    // Raise a modal error on the first matched element.
    function raiseAggregateModalError(obj, msg){
        if(obj.length > 0)
            raiseModalError(jQuery(obj.get(0)), msg);
    }
    
    // Yield the sum of the values of all fields matched in obj that can be parsed.
    function numericSum(obj){
        var accumulator = 0;
        obj.each(
            function(){
                var n = parseFloat(this.value);
                if(!isNaN(n))
                    accumulator += n;
            }
        );
        return accumulator;
    }
})();
