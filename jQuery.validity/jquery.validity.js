/* _ _____                                  _ _     _ _ _         
  (_)  _  |                                | (_)   | (_) |        
   _| | | |_   _  ___ _ __ _   ___   ____ _| |_  __| |_| |_ _   _ 
  | | | | | | | |/ _ \ '__| | | \ \ / / _` | | |/ _` | | __| | | |
  | \ \/' / |_| |  __/ |  | |_| |\ V / (_| | | | (_| | | |_| |_| |
  | |\_/\_\\__,_|\___|_|   \__, (_)_/ \__,_|_|_|\__,_|_|\__|\__, |
 _/ |                       __/ |                            __/ |
|__/                       |___/                            |___/ 
*/
(function($) {
    //// Static Functions and Properties /////////////////
    jQuery.validity = {
        // Central location for validity configuration properties.
        config: {
            outputMode: "Modal", // [Modal|Summary|None|Custom]
            outputMethod: null
        },
        
        // Remove all errors on the page.
        Clear: function(){
            if($.validity.config.outputMode.toUpperCase() == "MODAL")
                $('.validity-modal-msg').remove();
                
            else if($.validity.config.outputMode.toUpperCase() == "SUMMARY"){
                $('#validity-summary-output').hide().html('');
                $('.validity-erroneous').removeClass('validity-erroneous');
            }
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
        if(this.length > 0){
            var temp = this.get(0).value;
            var valid = true;
            var obj = this;
            
            this.each(
                function(){
                    if(this.value != temp)
                        valid = false;
                }
            );
            
            if(!valid)
                raiseAggregateError(obj, msg);
            
            return valid;
        }
        
        else return true;
    };
    
    // Validate that all matched elements bear distinct values.
    jQuery.fn.AreNotEqual = function(msg){
        if(this.length > 0){
            var values = new Array();
            var obj = this;
            var valid = true;
            
            this.each(
                function(idx){
                    for(i in values){
                        if(this.value != '' && values[i] == this.value)
                            valid = false;
                    }
                    
                    values[idx] = this.value;
                }
            );
            
            if(!valid)
                raiseAggregateError(obj, msg);
            
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
    function validate(elem, regimen){
        var valid = true;
        
        elem.each(
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
        if($.validity.config.outputMode.toUpperCase() == "MODAL")
            raiseModalError($(elem), msg);
            
        else if($.validity.config.outputMode.toUpperCase() == "SUMMARY")
            raiseSummaryError($(elem), msg);
    };
    
    // Raise an error with a modal message.
    function raiseModalError(obj, msg){
        var off = obj.offset();
        
        var computedLeft = off.left + obj.width() + 4;
        var computedTop = off.top - 10;
        
        if($('#validity-msg-' + obj.attr('id')).length == 0)
            $('#validity-modal-output').append(
                "<div id='validity-msg-" + obj.attr('id') + "' " + 
                "class='validity-modal-msg' " + 
                "style='left: " + computedLeft + "px;top: " + computedTop + "px;'" + 
                "onclick='$(this).remove()'>" + 
                msg + "</div>"
            );
        else
            $('#validity-msg-' + obj.attr('id'))
                .css({ 
                    left: computedLeft + 'px', 
                    top: computedTop + 'px' 
                })
                .html(msg);
    };
    
    // Display error in a summary output.
    function raiseSummaryError(obj, msg){
        pumpToSummary(msg);
        
        obj.addClass('validity-erroneous');
    };
    
    // Merely outputs text to the summary.
    function pumpToSummary(msg){
        $('#validity-summary-output').show().append('* ' + msg + '<br />');
    }
    
    // Raise a single error for several elements.
    function raiseAggregateError(obj, msg){
        if($.validity.config.outputMode.toUpperCase() == "MODAL")
            raiseAggregateModalError(obj, msg);
            
        else if($.validity.config.outputMode.toUpperCase() == "SUMMARY")
            raiseSummaryError(obj, msg);
    }
    
    // Raise a modal error on the first matched element.
    function raiseAggregateModalError(obj, msg){
        if(obj.length > 0)
            raiseModalError($(obj.get(0)), msg);
    }
    
    function numericSum(obj){
        var accumulator = 0;
        
        this.each(
            function(idx){
                var n = parseFloat(this.value);
                
                if(!isNaN(n))
                    accumulator += n;
            }
        );
        
        return accumulator;
    }
})(jQuery);

