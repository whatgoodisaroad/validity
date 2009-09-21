///////////////////////////////////////////////////////////////////
// Lovingly modified by Wyatt for validity.thatscaptaintoyou.com //
//                                                               //
// The header comment of the original script is below.           //
///////////////////////////////////////////////////////////////////
 
/*
 * jQuery infinitecarousel plugin
 * @author admin@catchmyfame.com - http://www.catchmyfame.com
 * @version 1.0.1
 * @date July 31, 2009
 * @category jQuery plugin
 * @copyright (c) 2009 admin@catchmyfame.com (www.catchmyfame.com)
 * @license CC Attribution-No Derivative Works 3.0 - http://creativecommons.org/licenses/by-nd/3.0/
 */
(function($){
	$.fn.extend({ 
		infiniteCarousel: function(options) {
			var 
                defaults = {
                    transitionSpeed:1500,
                    displayTime:30000,
                    textholderHeight:.2,
                    displayProgressBar:1
                },
                
                options = $.extend(defaults, options);
	
    		return this.each(
                function() {
                    var 
                        randID = Math.round(Math.random() * 100000000),
                        o=options,
                        obj = $(this),

                        numImages = $('img', obj).length, // Number of images
                        imgHeight = $('img:first', obj).height(),
                        imgWidth = $('img:first', obj).width(),
                        autopilot = 1;
                
                    $(obj)
                        .width(imgWidth)
                        .height(imgHeight);
                
                    // Build progress bar
                    if (o.displayProgressBar) {
                        $("<div/>")
                            .attr('id', 'progress' + randID)
                            .css({ 
                                position:'absolute', 
                                bottom:0, 
                                background:'#bbb', 
                                left:$(obj).css('paddingLeft') 
                            })
                            .appendTo(obj);
                        
                        $('#progress' + randID)
                            .width(imgWidth)
                            .height(5)
                            .addClass('progress')
                            .css('opacity', '.5');
                    }
                
                    // Move last image and stick it on the front
                    $(obj)
                        .css({
                            overflow:'hidden',
                            position:'relative'
                        });
                        
                    $('li:last', obj)
                        .prependTo($('ul', obj));
                        
                    $('ul', obj)
                        .css('left',-imgWidth + 'px');
                
                    // Build textholder div thats as wide as the carousel and 20%-25% of the height
                    $("<div/>")
                        .attr('id', 'textholder' + randID)
                        .addClass('textholder')
                        .css({ 
                            position:'absolute', 
                            bottom:0, 
                            marginBottom:-imgHeight * o.textholderHeight + 'px',
                            left:$(obj).css('paddingLeft')
                        })
                        .appendTo(obj);
                    
                    var 
                        correctTHWidth = parseInt($('#textholder' + randID).css('paddingTop')),
                        correctTHHeight = parseInt($('#textholder' + randID).css('paddingRight'));
                        
                    $('#textholder' + randID)
                        .width(imgWidth - (correctTHWidth * 2))
                        .height((imgHeight * o.textholderHeight) - (correctTHHeight * 2))
                        .css({
                            backgroundColor:'#FFF',
                            opacity:'0.5'
                        });
                        
                    //showtext($('li:eq(1) p', obj).html());
                
                    function fadeOutText(li) {
                        
                    }
                    
                    function fadeInText(li) {
                        
                    }
                
                    function showtext(t) {
                        // the text will always be the text of the second list item (if it exists)
                        if(t) {
                            $('#textholder' + randID)
                                .html(t)
                                .animate(
                                    { marginBottom:'0px' },
                                    500
                                ); // Raise textholder
                        }
                    }
                    
                    function anim(direction) {
                        // animate textholder out of frame
                        $('#textholder' + randID)
                            .animate(
                                { marginBottom:(-imgHeight * o.textholderHeight) - (correctTHHeight * 2) + 'px' },
                                500
                            );

                        if(direction == "next") {
                            
                            // Copy leftmost (first) li and insert it after the last li
                            $('li:first', obj)
                                .clone()
                                .insertAfter($('li:last', obj));
                            
                            // Update width and left position of ul and animate ul to the left
                            $('ul', obj)
                                .width(imgWidth * (numImages + 1))
                                .animate(
                                    { left:-imgWidth * 2 },
                                    o.transitionSpeed,
                                    function(){
                                        $('li:first', obj).remove();
                                        
                                        $('ul', obj)
                                            .css('left', -imgWidth + 'px')
                                            .width(imgWidth * numImages);
                                            
                                        $('#btn_rt'+randID).fadeIn(500);
                                        $('#btn_lt'+randID).fadeIn(500);
                                        
                                        if (autopilot) {
                                            $('#pause_btn'+randID).fadeIn(250);
                                        }
                                        
                                        //showtext($('li:eq(1) p', obj).html());
                                        
                                        if (autopilot) {
                                            $('#progress' + randID)
                                                .width(imgWidth)
                                                .height(5);
                                                
                                            $('#progress'+randID).animate(
                                                { width:0 },
                                                o.displayTime,
                                                function(){
                                                    $('#pause_btn'+randID).fadeOut(50);
                                                    setTimeout(
                                                        function(){
                                                            $('#pause_btn'+randID)
                                                                .fadeIn(250);
                                                        },
                                                        o.transitionSpeed
                                                    );
                                                }
                                            );
                                        }
                                    }
                                );
                        }
                    }
                    
                    var clearInt = setInterval(
                        function(){
                            anim('next');
                        },
                        o.displayTime + o.transitionSpeed
                    );
                    
                    //clearInterval(clearInt);
                    
                    $('#progress' + randID)
                        .animate(
                            { width:0 },
                            o.displayTime + o.transitionSpeed
                        );
                }
            );
    	}
	});
})(jQuery);


