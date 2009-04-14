/*
 * jQuery.validity beta v0.9.4
 * http://code.google.com/p/validity/
 * 
 * Copyright (c) 2009 Wyatt Allen
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-04-13 (Mon, 13 April 2009)
 * Revision: 13
 */
(function(jQuery) {
    //// Private Static Properties /////////////////
    
    var outputModes = {
        modal:"MODAL",
        summary:"SUMMARY",
        label:"LABEL",
        custom:"CUSTOM",
        none:"NONE"
    };

    // Defaults definition.
    var defaults =  {
        outputMode:outputModes.modal,
        
        // Methods for custom output modes.
        raiseCustomOutputModeError:function($obj, msg) { },
        raiseCustomOutputModeAggregateError:function($obj, msg) { },
        customOutputModeClear:function() { },
        firstCustomOutputErrorId:function() { },
        
        scrollTo:false,
        summaryOutputWrapper:"<li/>",
        modalErrorsClickable:true
    };
    
    // A jQuery empty set. Used as return value by validators 
    // to terminate execution of a chain.
    var $phi = jQuery([]);
        
    var selectors = {
        summaryContainer:"#validity-summary-container",
        summaryOutput:"#validity-summary-output",
        modalOutput:"#validity-modal-output",
        modalErrors:".validity-modal-msg",
        erroneousInputs:".validity-erroneous",
        errorLabels:"label.error"
    };
    
    var classes = {
        modalError:"validity-modal-msg",
        erroneousInput:"validity-erroneous",
        labelError:"error"
    };
    
    var prefixes = {
        modalErrorId:"validity-modal-msg-"
    };
    
    var patterns = {
        integer:/^\d$/
    };
    
    //// Public Static Functions and Properties /////////////////
    jQuery.validity = {
        // Settings location
        settings:jQuery.extend(defaults, { }),
        
        // Remove all errors on the page.
        clear:function() {
            if(jQuery.validity.settings.outputMode == outputModes.modal)
                jQuery(selectors.modalErrors).remove();
                
            else if(jQuery.validity.settings.outputMode == outputModes.summary) {
                jQuery(selectors.summaryContainer).hide();
                jQuery(selectors.summaryOutput).html('');
                jQuery(selectors.erroneousInputs).removeClass(classes.erroneousInput);
            }
            
            else if(jQuery.validity.settings.outputMode == outputModes.label)
                jQuery(selectors.errorLabels).remove();
            
            else if(jQuery.validity.settings.outputMode == outputModes.custom)
                jQuery.validity.settings.customOutputModeClear();
        },
        
        // Output an general validation error (withut associated controls)
        // in whatever manner has been configured.
        generalError:function(msg) { raiseError(null, msg); },
        
        // Initialize validity with custom settings.
        setup:function(options) {
            jQuery.validity.settings = jQuery.extend(defaults, options);
            
            // The actual output mode should always be upper cased.
            jQuery.validity.settings.outputMode = jQuery.validity.settings.outputMode.toUpperCase();
        },
        
        // If the expression is false, raise the specified general error.
        // A specific version of this exists for jQuery objects.
        // This is not a debug assertion. It is a validator that is called
        // like a debug assertion.
        assertThat:function(expression, msg) { if(!expression) GeneralError(msg); },
        
        report:null,
        
        isTransactionOpen:function() { return jQuery.validity.report != null; },
        
        start:function() { 
            jQuery.validity.clear();
            jQuery.validity.report = { errors:0, valid:true }; 
        },
        
        end:function() { 
            var report = jQuery.validity.report; 
            jQuery.validity.report = null; 
            
            if (jQuery.validity.settings.scrollTo)
                location.hash = firstErrorId();
            
            return report;
        }
    };
    
    //// Public Methods /////////////////
    
    // Validate whether the field has a value.
    jQuery.fn.require = function(msg) {
        return validate(this, function(elem) { return elem.value.length > 0; }, msg);
    };
    
    // Validate whether the field matches a regex.
    jQuery.fn.match = function(msg, regex) {
        if(typeof(regex) == "string") 
            regex = patterns[regex];
        
        return validate(this, function(elem) { return elem.value.length == 0 || regex.test(elem.value); }, msg);
    };
    
    jQuery.fn.range = function(msg, min, max) {
        return validate(this, function(elem) { var f = parseFloat(elem.value); return f >= min && f <= max; }, msg);
    };
    
    jQuery.fn.greaterThan = function(msg, min) {
        return validate(this, function(elem) { return parseFloat(elem.value) > min; }, msg);
    }
    
    jQuery.fn.greaterThanOrEqualTo = function(msg, min) {
        return validate(this, function(elem) { return parseFloat(elem.value) >= min; }, msg);
    }
    
    jQuery.fn.lessThan = function(msg, max) {
        return validate(this, function(elem) { return parseFloat(elem.value) < max; }, msg);
    }
    
    jQuery.fn.lessThanOrEqualTo = function(msg, min) {
        return validate(this, function(elem) { return parseFloat(elem.value) <= min; }, msg);
    }
    
    // Validate that all matched elements bear the same values.
    // Accepts a function to transform the values for testing.
    jQuery.fn.equal = function(msg, transform) {
        if(transform == null)
            transform = function(val) { return val; };
        
        if(this.length > 0) {
            var temp = transform(this.get(0).value);
            var valid = true;
            
            this.each(
                function() {
                    if(transform(this.value) != temp)
                        valid = false;
                }
            );
            
            if(valid)
                return this;
            else
                raiseAggregateError(this, msg);
        }     
        return $phi;
    };
    
    // Validate that all matched elements bear distinct values.
    // Accepts an optional function to transform the values for testing.
    jQuery.fn.distinct = function(msg, transform) {
        if(transform == null)
            transform = function(val) { return val; };

        if(this.length > 0){
            var values = new Array();
            var valid = true;
            
            this.each(
                function(idx){
                    var transformedValue = transform(this.value);
                    for(i in values){
                        if(transformedValue.length > 0 && values[i] == transformedValue)
                            valid = false;
                    }
                    values[idx] = transformedValue;
                }
            );
            
            if(valid)
                return this;
            else
                raiseAggregateError(this, msg);
        }
        return $phi;
    };
    
    // Validate that the numeric sum of all values is equal to a given value.
    jQuery.fn.sum = function(msg, sum){
        if(this.length > 0){            
            if(sum == numericSum(this))
                return this;
            else
                return $phi;
        }
        return $phi;
    };
    
    // Validates an inclusive upper-bound on the numeric sum of the values of all matched elements.
    jQuery.fn.sumMax = function(msg, max){
        if(this.length > 0){            
            if(max >= numericSum(this))
                return this;
            else
                raiseAggregateError(this, msg);
        }
        return $phi;
    };
    
    // If the expression is false, raise the specified error.
    // This is not a debug assertion. It's a validator
    // that is called like a debug assertion.
    jQuery.fn.assert = function(expression, msg) { if(!expression) raiseError(this, msg); };
    
    //// Private Functions /////////////////
    
    function validate($elem, regimen, message) {
        var elements = new Array();
        $elem.each(
            function() {
                if(regimen(this))
                    elements.push(this);
                else
                    raiseError(this, message);            
            }
        );
        return $(elements);
    }
    
    function addToReport(){
        if(jQuery.validity.isTransactionOpen()){
            jQuery.validity.report.errors++;
            jQuery.validity.report.valid = false;
        }
    }
    
    // Raise an error appropriately for the element with the message.
    function raiseError(elem, msg){
        addToReport();
        
        if(jQuery.validity.settings.outputMode == outputModes.modal)
            raiseModalError(elem, msg);
            
        else if(jQuery.validity.settings.outputMode == outputModes.summary)
            raiseSummaryError(elem, msg);
            
        else if(jQuery.validity.settings.outputMode == outputModes.label)
            raiseLabelError(elem, msg);
            
        else if(jQuery.validity.settings.outputMode == outputModes.custom)
            jQuery.validity.settings.raiseCustomOutputModeError(elem, msg);
    }
    
    function raiseLabelError(obj, msg){
        var $obj = jQuery(obj);
        
        var errorId = $obj.attr("id");
        var errorSelector = "#" + errorId;
        var labelSelector = "label[for='" + errorId + "']";
        
        if(jQuery(labelSelector).length == 0)
            jQuery("<label/>")
                .attr("for", errorId)
                .addClass("error")
                .text(msg)
                .insertAfter(errorSelector);
        else
            jQuery(labelSelector)
                .text(msg);
    }
    
    // Raise an error with a modal message.
    function raiseModalError(obj, msg){
        var $obj = jQuery(obj);
        
        var off = $obj.offset();        
        var errorStyle = { 
            left:parseInt(off.left + $obj.width() + 4) + "px", 
            top:parseInt(off.top - 10) + "px" 
        };
        
        var errorId = prefixes.modalErrorId + $obj.attr("id");
        var errorSelector = "#" + errorId;
        
        if (jQuery(errorSelector).length == 0)
            jQuery("<div/>")
                .attr("id", errorId)
                .addClass(classes.modalError)
                .css(errorStyle)
                .text(msg)
                .click(jQuery.validity.settings.modalErrorsClickable ?
                    function() { jQuery(this).remove(); } : null 
                )
                .appendTo(selectors.modalOutput);
        else
            jQuery(errorSelector)
                .css(errorStyle)
                .text(msg);
    }
    
    // Display error in a summary output.
    function raiseSummaryError(obj, msg){
        pumpToSummary(msg);
        
        jQuery(obj).addClass(classes.erroneousInput);
    }
    
    // Merely outputs text to the summary.
    function pumpToSummary(msg) {
        jQuery(jQuery.validity.settings.summaryOutputWrapper)
            .text(msg)
            .appendTo(selectors.summaryOutput);
        jQuery(selectors.summaryContainer)
            .show();
    }
    
    // Raise a single error for several elements.
    function raiseAggregateError(obj, msg){
        addToReport();
        
        if(jQuery.validity.settings.outputMode == outputModes.modal)
            raiseAggregateModalError(obj, msg);
            
        else if(jQuery.validity.settings.outputMode == outputModes.summary)
            raiseSummaryError(obj, msg);
            
        else if(jQuery.validity.settings.outputMode == outputModes.custom)
            jQuery.validity.settings.raiseCustomOutputModeAggregateError(obj, msg);
    }
    
    // Raise a modal error on the first matched element.
    function raiseAggregateModalError(obj, msg){
        if(obj.length > 0)
            raiseModalError(jQuery(obj.get(0)), msg);
    }
    
    function raiseAggregateLabelError(obj, msg){
        if(obj.length > 0)
            raiseLabelError(jQuery(obj.get(0)), msg);
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
    
    function firstErrorId() {
        if(jQuery.validity.settings.outputMode == outputModes.modal)
            return jQuery(selectors.modalErrors + ":first").attr("id");
               
        else if(jQuery.validity.settings.outputMode == outputModes.summary)
            return jQuery(selectors.erroneousInputs + ":first").attr("id");
            
        else if(jQuery.validity.settings.outputMode == outputModes.label)
            return jQuery(selectors.errorLabels + ":first").attr("id");
            
        else if(jQuery.validity.settings.outputMode == outputModes.custom)
            return jQuery.validity.settings.firstCustomOutputErrorId();
            
        else
            return "_";
    }
})(jQuery);
