/**
 *  @add jQuery.fn
 */
steal.plugins("jquery/dom").then(function($) {
var radioCheck = /radio|checkbox/i,
	keyBreaker = /[^\[\]]+/g,
	numberMatcher = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/
	
	isNumber = function(value) {
	   if(typeof value == 'number') return true;
	   if(typeof value != 'string') return false;
	   return value.match(numberMatcher);
	};

$.fn.extend({
	/**
	 * @parent dom
	 * @download jquery/dist/jquery.formparams.js
	 * @plugin jquery/dom/form_params
	 * @test jquery/dom/form_params/qunit.html
	 * <p>Returns an object of name-value pairs that represents values in a form.  
	 * It is able to nest values whose element's name has square brackets. </p>
	 * Example html:
	 * @codestart html
	 * &lt;form>
	 *   &lt;input name="foo[bar]" value='2'/>
	 *   &lt;input name="foo[ced]" value='4'/>
	 * &lt;form/>
	 * @codeend
	 * Example code:
	 * @codestart
	 * $('form').formParams() //-> { foo:{bar:2, ced: 4} }
	 * @codeend
	 * 
	 * @demo jquery/dom/form_params/form_params.html
	 * 
	 * @param {Boolean} [convert] True if strings that look like numbers and booleans should be converted.  Defaults to true.
	 * @return {Object} An object of name-value pairs.
	 */
	formParams: function(convert) {
	   var data = {};
	   if(this[0].nodeName.toLowerCase() == 'form' && this[0].elements){

		   return jQuery( jQuery.makeArray(this[0].elements) ).getParams(convert);
	   }
	   return jQuery("input, textarea, select", this[0]).getParams(convert);
	},
	getParams : function(convert){
		var data = {},
			current,
			convert = convert === undefined ? true : convert;
		
		this.each(function(){
			var el = this;
			//if we are submit, ignore
			if (el.type && el.type.toLowerCase() == 'submit') {
				return;
			}
			
			var key = el.name, 
				value = $.fn.val.call([el]) || $.data(el,"value"), 
				isRadioCheck = radioCheck.test(el.type),
				parts = key.match(keyBreaker),
				write = !isRadioCheck || !!el.checked, //overwrite the value
				append = false, //make an array of values
				lastPart;   
			
			if( convert ) { 
				if(isNumber(value)){
					value = parseFloat(value);
				}else if(value === 'true' || value === 'false'){
					value = Boolean(value);
				}
				
			}
			
			// go through and create nested objects
			current = data;
			for(var i=0; i < parts.length - 1; i++){
				if(!current[parts[i]]){
					current[parts[i]] = {}
				}
				current = current[parts[i]];
			}
			lastPart = parts[parts.length - 1];
			
			//now we are on the last part, set the value
			if( lastPart in current && el.type.toLowerCase() === "checkbox"){
				if( !$.isArray(current[lastPart]) ){
					current[lastPart] = current[lastPart] === undefined ? [] : [ current[lastPart] ];
				}
				if(write){
					current[lastPart].push(value);
				}
			}else if(write || !current[lastPart]){
				current[lastPart] = write ? value : undefined;
			}
			
		})
		return data;
	}
});

});