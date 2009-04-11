/*
 * jQuery.validity beta v0.9.3
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
        outputMode:"MODAL", // [Modal|Summary|None|Custom]
        
        // Methods for custom output modes.
        // One pumps new errors, the other should clear them all.
        raiseCustomOutputModeError:function($obj, msg) { },
        raiseCustomOutputModeAggregateError:function($obj, msg) { },
        customOutputModeClear:function() { },
        
        scrollTo:false,
        summaryHeader:"Could not submit because of the following errors:",
        modalErrorsClickable:true
    };
    
    var $phi = jQuery([]);
    
    //// Static Functions and Properties /////////////////
    jQuery.validity = {
        // Settings file.
        settings: jQuery.extend(defaults, { }),
        
        // Remove all errors on the page.
        clear:function(){
            if(jQuery.validity.settings.outputMode == "MODAL")
                jQuery('.validity-modal-msg').remove();
                
            else if(jQuery.validity.settings.outputMode == "SUMMARY"){
                jQuery('#validity-summary-output').hide().html('');
                jQuery('.validity-erroneous').removeClass('validity-erroneous');
            }
            
            else if(jQuery.validity.settings.outputMode == "CUSTOM")
                jQuery.validity.settings.customOutputModeClear();
        },
        
        // Output an general validation error (withut associated controls)
        // in whatever manner has been configured.
        generalError:function(msg){ raiseError(null, msg); },
        
        // Initialize validity with custom settings.
        setup:function(options){
            jQuery.validity.settings = jQuery.extend(defaults, options);
            
            // The actual output mode should always be upper cased.
            jQuery.validity.settings.outputMode = jQuery.validity.settings.outputMode.toUpperCase();
        },
        
        // If the expression is false, raise the specified general error.
        // A specific version of this exists for jQuery objects.
        // This is not a debug assertion. It is a validator that is called
        // like a debug assertion.
        assertThat:function(expression, msg){ if(!expression) GeneralError(msg); },
        
        report:null,
        
        isTransactionOpen:function() { return jQuery.validity.report != null; },
        
        start:function() { 
            jQuery.validity.clear();
            jQuery.validity.report = { errors:0, valid:true }; 
        },
        
        end:function() { 
            var report = jQuery.validity.report; 
            jQuery.validity.report = null; 
            return report;
        }
    };
    
    //// Public Methods /////////////////
    
    // Validate whether the field has a value.
    jQuery.fn.require = function(msg){
        return validate(this, function(elem) { return elem.value.length > 0; }, msg) ? 
            this : 
            $phi;
    };
    
    // Validate whether the field matches a regex.
    jQuery.fn.match = function(msg, regex){
        return validate(this, function(elem) { return elem.value.length == 0 || regex.test(elem.value); }, msg) ? 
            this : 
            $phi;
    }
        
    // Validate that all matched elements bear the same values.
    // Wrapper for the transform.
    jQuery.fn.areEqual = function(msg){
        return this.areEqualTransform(msg, function(val) { return val; } );
    };
    
    // Validate that all matched elements bear the same values.
    // Accepts a function to transform the values for testing.
    jQuery.fn.areEqualTransform = function(msg, transform){
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
            
            if(valid)
                return this;
            else
                raiseAggregateError($obj, msg);
        }     
        return $phi;
    };
    
    // Validate that all matched elements bear distinct values.
    jQuery.fn.areNotEqual = function(msg) {
        return this.areNotEqualTransform(msg, function(val) { return val; } );
    };
    
    // Validate that all matched elements bear distinct values.
    // Accepts a function to transform the values for testing.
    jQuery.fn.areNotEqualTransform = function(msg, transform){
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
            
            if(valid)
                return this;
            else
                raiseAggregateError($obj, msg);
        }
        return $phi;
    };
    
    // Validate that the numeric sum of all values is equal to a given value.
    jQuery.fn.sum = function(msg, sum){
        if(this.length > 0){            
            var actual = numericSum(this);
            
            var valid = sum == actual;
            
            if(valid)
                return this;
            else
                return $phi;
        }
        return $phi;
    };
    
    // Validates an inclusive upper-bound on the numeric sum of the values of all matched elements.
    jQuery.fn.sumMax = function(msg, max){
        if(this.length > 0){            
            var actual = numericSum(this);
            var valid = max >= actual;
            
            if(valid)
                return this;
            else
                raiseAggregateError($obj, msg);
        }
        return $phi;
    };
    
    // If the expression is false, raise the specified error.
    // This is not a debug assertion. It's a validator
    // that is called like a debug assertion.
    jQuery.fn.assert = function(expression, msg){ if(!expression) raiseError(this, msg); }
    
    //// Private Functions /////////////////
    
    function addToReport(){
        if(jQuery.validity.isTransactionOpen()){
            jQuery.validity.report.errors++;
            jQuery.validity.report.valid = false;
        }
    }
    
    function validate($elem, regimen, message){
        var valid = true;        
        $elem.each(
            function() {
                if(!regimen(this)){
                    raiseError(this, message);
                    valid = false;                    
                }
            }
        );
        return valid;
    }
    
    // Raise an error appropriately for the element with the message.
    function raiseError(elem, msg){
        addToReport();
        
        if(jQuery.validity.settings.outputMode == "MODAL")
            raiseModalError(jQuery(elem), msg);
            
        else if(jQuery.validity.settings.outputMode == "SUMMARY")
            raiseSummaryError(jQuery(elem), msg);
            
        else if(jQuery.validity.settings.outputMode == "CUSTOM")
            jQuery.validity.settings.raiseCustomOutputModeError(jQuery(elem), msg);
    };
    
    // Raise an error with a modal message.
    function raiseModalError($obj, msg){
        var off = $obj.offset();        
        var computedLeft = off.left + $obj.width() + 4;
        var computedTop = off.top - 10;
        var errorId = '#validity-msg-' + $obj.attr('id');
        
        if(jQuery(errorId).length == 0)
            jQuery('#validity-modal-output').append(
                "<div id='" + errorId + "' " + 
                "class='validity-modal-msg' " + 
                "style='left: " + computedLeft + "px;top: " + computedTop + "px;'" + 
                (jQuery.validity.settings.modalErrorsClickable ? " onclick='jQuery(this).remove()'>" : ">") + 
                msg + "</div>"
            );
        else
            jQuery(errorId)
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
        jQuery('#validity-summary-output')
            .show()
            .append('* ' + msg + '<br />');
    }
    
    // Raise a single error for several elements.
    function raiseAggregateError(obj, msg){
        addToReport();
        
        if(jQuery.validity.settings.outputMode == "MODAL")
            raiseAggregateModalError(obj, msg);
            
        else if(jQuery.validity.settings.outputMode == "SUMMARY")
            raiseSummaryError(obj, msg);
            
        else if(jQuery.validity.settings.outputMode == "CUSTOM")
            jQuery.validity.settings.raiseCustomOutputModeAggregateError(obj, msg);
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
