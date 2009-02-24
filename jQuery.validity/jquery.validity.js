/*!
 * jQuery.validity alpha 2 (v. 0.9.1)
 * http://code.google.com/p/validity
 *
 * Copyright (c) 2009, Wyatt Allen
 * All rights reserved.
 *
 * Revision 3. Feb. 15 2009
 *
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this 
 * list of conditions and the following disclaimer.
 * 
 * Redistributions in binary form must reproduce the above copyright notice, 
 * this list of conditions and the following disclaimer in the documentation 
 * and/or other materials provided with the distribution.
 * 
 * The name of the Wyatt Allen may not be used to endorse or promote products 
 * derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE 
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
*/
(function() {
    // Private defaults definition.
    defaults =  {
        outputMode: "Modal", // [Modal|Summary|None|Custom]
        outputMethod: null
    };
    
    //// Static Functions and Properties /////////////////
    jQuery.validity = {
        // Settings file.
        settings: jQuery.extend(defaults, { }),
        
        // Remove all errors on the page.
        Clear: function(){
            if(jQuery.validity.settings.outputMode.toUpperCase() == "MODAL")
                jQuery('.validity-modal-msg').remove();
                
            else if(jQuery.validity.settings.outputMode.toUpperCase() == "SUMMARY"){
                jQuery('#validity-summary-output').hide().html('');
                jQuery('.validity-erroneous').removeClass('validity-erroneous');
            }
        },
        
        // Output an general validation error (withut associated controls)
        // in whatever manner has been configured.
        GeneralError: function(msg){
            raiseError(null, msg);
        },
        
        // Initialize validity with custom settings.
        Setup: function(options){
            jQuery.validity.settings = jQuery.extend(defaults, options);
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
    
    jQuery.fn.AreEqual = function(msg, transform){
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
    }
    
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
    }
    
    // Validate matched elements based on a user-defined regimen.
    jQuery.fn.ValidateRegimen = function(regimen){ 
        return validate(this, regimen); 
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
        if(jQuery.validity.settings.outputMode.toUpperCase() == "MODAL")
            raiseModalError(jQuery(elem), msg);
            
        else if(jQuery.validity.settings.outputMode.toUpperCase() == "SUMMARY")
            raiseSummaryError(jQuery(elem), msg);
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
                "onclick='$(this).remove()'>" + 
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
        if(jQuery.validity.settings.outputMode.toUpperCase() == "MODAL")
            raiseAggregateModalError(obj, msg);
            
        else if(jQuery.validity.settings.outputMode.toUpperCase() == "SUMMARY")
            raiseSummaryError(obj, msg);
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

