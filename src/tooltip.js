/**
 * Boost JS Tooltip
 * A style-free tooltip plugin for jQuery and Boost JS
 * @author Mark McCann (www.markmccann.me)
 * @license MIT
 * @version 0.0.1
 * @requires jQuery, boost-js
 */

(function(){

    /**
     * generates a random 4 character string
     * @return {string} random
     */
    function uniqueId() {
        return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
    }

    var Tooltip = function() {
        // local instance
        var inst = this;
        // get and save title value then remove from element
        inst.title = inst.source.attr('title');
        inst.source[0].removeAttribute('title');
        // create tooltip element
        inst.tip = $( document.createElement('div') )
            .html( inst.title )
            .addClass( inst.settings.tipClass )
            .addClass( inst.settings.tipClass +'-'+ inst.settings.placement )
            .attr( 'id', 'tooltip-'+ (inst.id !== null ? inst.id : uniqueId()) )
            .css( 'position', 'absolute' )
            .attr('aria-hidden','true');
        // update labelledby attribute on source element
        // and add event handlers
        inst.source
            .attr( 'aria-labelledby', inst.tip[0].id )
            .on('focus',function(){ inst.show(); })
            .on('blur',function(){ inst.hide(); })
            .on('mouseover',function(){ inst.show(); })
            .on('mouseout',function(){
                if( document.activeElement !== inst.source[0] ) {
                    inst.hide();
                }
            });
        // add the tip to document
        document.body.appendChild( inst.tip[0] );
        // run the onInit callback
        if( $.isFunction(inst.settings.onInit) ) inst.settings.onInit.call(inst);
    }

    Tooltip.prototype = {
        /**
         * show the tooltip
         * @param  {function} callback
         * @return {object} instance
         */
        show: function( callback ) {
            // local instance
            var inst = this;
            // make sure tip is closed before opening
            if( !inst.isVisible() ) {
                // position tip relative to source
                inst.setPosition();
                // add the active class and more to tip
                inst.tip
                    .attr('aria-hidden','false')
                    .addClass( inst.settings.activeClass );
                // run the callbacks
                if( $.isFunction(callback) ) callback.call(inst);
                if( $.isFunction(inst.settings.onShow) ) inst.settings.onShow.call(inst);
            }
            // return instance
            return inst;
        },
        /**
         * hide the tooltip
         * @param  {function} callback
         * @return {object} instance
         */
        hide: function( callback ) {
            // local instance
            var inst = this;
            // make sure tip is open before closing
            if( inst.isVisible() ) {
                // remove the active class to elems
                inst.tip
                    .attr('aria-hidden','true')
                    .removeClass( inst.settings.activeClass );
                // run the callbacks
                if( $.isFunction(callback) ) callback.call(inst);
                if( $.isFunction(inst.settings.onHide) ) inst.settings.onHide.call(inst);
            }
            // return instance
            return inst;
        },
        /**
         * determines if tooltip is visible or not
         * @return {boolean}
         */
        isVisible: function() {
            return document.body.contains(this.tip[0]) && this.tip.hasClass( this.settings.activeClass );
        },
        /**
         * calculates the sets the top/left position for the tip element
         * @param  {function} callback
         * @return {object} instance
         */
        setPosition: function() {
            // local instance
            var inst = this;
            // get the rects for source and tip elems
            var srcRect = inst.source[0].getBoundingClientRect();
            var tipRect = inst.tip[0].getBoundingClientRect();
            // calculate and set position based on placement
            if( inst.settings.placement == 'right' ) {
                inst.tip.css( 'top', (srcRect.height/2) - (tipRect.height/2) + srcRect.top );
                inst.tip.css( 'left', srcRect.right + inst.settings.margin );
            }
            if( inst.settings.placement == 'left' ) {
                inst.tip.css( 'top', (srcRect.height/2) - (tipRect.height/2) + srcRect.top );
                inst.tip.css( 'left', srcRect.left - inst.settings.margin - tipRect.width );
            }
            if( inst.settings.placement == 'top' ) {
                inst.tip.css( 'top', srcRect.top - tipRect.height - inst.settings.margin );
                inst.tip.css( 'left', srcRect.left + (srcRect.width/2) - (tipRect.width/2) );
            }
            if( inst.settings.placement == 'bottom' ) {
                inst.tip.css( 'top', srcRect.bottom + inst.settings.margin );
                inst.tip.css( 'left', srcRect.left + (srcRect.width/2) - (tipRect.width/2) );
            }
            // return instance
            return inst;
        }
    }

    var plugin = {
        plugin: Tooltip,
        defaults: {
            tipClass: 'tooltip',
            activeClass: 'is-visible',
            placement: 'top',
            margin: 10,
            onInit: null,
            onShow: null,
            onHide: null
        }
    }

    // if node, return via module.exports
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = plugin;
    // otherwise, save object to jquery globally
    } else if( typeof window !== 'undefined' && typeof window.$ !== 'undefined' && typeof window.$.fn.boost !== 'undefined' ) {
        window.$.fn.boost.tooltip = plugin;
    }

})();
