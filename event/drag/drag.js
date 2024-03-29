
steal.plugins('jquery/event','jquery/lang/vector','jquery/event/livehack').then(function($){
	//modify live
	//steal the live handler ....
	
	
	
	var bind = function(object, method){  
			var args = Array.prototype.slice.call(arguments, 2);  
			return function() {  
				var args2 = [this].concat(args, $.makeArray( arguments ));  
				return method.apply(object, args2);  
			};  
		},
		event = $.event, handle  = event.handle;
		
	/**
	 * @constructor jQuery.Drag
	 * @parent specialevents
	 * @plugin jquery/event/drag
	 * @download jquery/dist/jquery.event.drag.js
	 * @test jquery/event/drag/qunit.html
	 * Provides drag events as a special events to jQuery.  
	 * A jQuery.Drag instance is created on a drag and passed
	 * as a parameter to the drag event callbacks.  By calling
	 * methods on the drag event, you can alter the drag's
	 * behavior.
	 * <h2>Drag Events</h2>
	 * The drag plugin allows you to listen to the following events:
	 * <ul>
	 * 	<li><code>dragdown</code> - the mouse cursor is pressed down</li>
	 *  <li><code>draginit</code> - the drag motion is started</li>
	 *  <li><code>dragmove</code> - the drag is moved</li>
	 *  <li><code>dragend</code> - the drag has ended</li>
	 *  <li><code>dragover</code> - the drag is over a drop point</li>
	 *  <li><code>dragout</code> - the drag moved out of a drop point</li>
	 * </ul>
	 * <p>Just by binding or delegating on one of these events, you make
	 * the element dragable.  You can change the behavior of the drag
	 * by calling methods on the drag object passed to the callback.
	 * <h3>Example</h3>
	 * Here's a quick example:
	 * @codestart
	 * //makes the drag vertical
	 * $(".drags").live("draginit", function(event, drag){
	 *   drag.vertical();
	 * })
	 * //gets the position of the drag and uses that to set the width
	 * //of an element
	 * $(".resize").live("dragmove",function(event, drag){
	 *   $(this).width(drag.position.left() - $(this).offset().left   )
	 * })
	 * @codeend
	 * <h2>Drag Object</h2>
	 * <p>The drag object is passed after the event to drag 
	 * event callback functions.  By calling methods
	 * and changing the properties of the drag object,
	 * you can alter how the drag behaves.
	 * </p>
	 * <p>The drag properties and methods:</p>
	 * <ul>
	 * 	<li><code>[jQuery.Drag.prototype.cancel cancel]</code> - stops the drag motion from happening</li>
	 *  <li><code>[jQuery.Drag.prototype.ghost ghost]</code> - copys the draggable and drags the cloned element</li>
	 *  <li><code>[jQuery.Drag.prototype.horizontal horizontal]</code> - limits the scroll to horizontal movement</li>
	 *  <li><code>[jQuery.Drag.prototype.location location]</code> - where the drag should be on the screen</li>
	 *  <li><code>[jQuery.Drag.prototype.mouseElementPosition mouseElementPosition]</code> - where the mouse should be on the drag</li>
	 *  <li><code>[jQuery.Drag.prototype.only only]</code> - only have drags, no drops</li>
	 *  <li><code>[jQuery.Drag.prototype.representative representative]</code> - move another element in place of this element</li>
	 *  <li><code>[jQuery.Drag.prototype.revert revert]</code> - animate the drag back to its position</li>
	 *  <li><code>[jQuery.Drag.prototype.vertical vertical]</code> - limit the drag to vertical movement</li>
	 *  <li><code>[jQuery.Drag.prototype.limit limit]</code> - limit the drag within an element (*limit plugin)</li>
	 *  <li><code>[jQuery.Drag.prototype.scrolls scrolls]</code> - scroll scrollable areas when dragging near their boundries (*scroll plugin)</li>
	 * </ul>
	 * <h2>Demo</h2>
	 * Now lets see some examples:
	 * @demo jquery/event/drag/drag.html 1000
	 * @init
	 * The constructor is never called directly.
	 */
	$.Drag = function(){}
	
	/**
	 * @Static
	 */
	$.extend($.Drag,
	{
		lowerName: "drag",
		current : null,
		/**
		 * Called when someone mouses down on a draggable object.
		 * Gathers all callback functions and creates a new Draggable.
		 * @hide
		 */
		mousedown : function(ev, element){
			var isLeftButton = ev.button == 0 || ev.button == 1;
			if( !isLeftButton || this.current) return; //only allows 1 drag at a time, but in future could allow more
			
			ev.preventDefault();
			//create Drag
			var drag = new $.Drag(), 
			delegate = ev.liveFired || element,
			selector = ev.handleObj.selector,
			self = this;
			this.current = drag;
			drag.setup({
				element: element,
				delegate: ev.liveFired || element,
				selector: ev.handleObj.selector,
				moved: false,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector)[0],
					draginit: event.find(delegate, ["draginit"], selector)[0],
					dragover: event.find(delegate, ["dragover"], selector)[0],
					dragmove: event.find(delegate, ["dragmove"], selector)[0],
					dragout: event.find(delegate, ["dragout"], selector)[0],
					dragend: event.find(delegate, ["dragend"], selector)[0]
				},
				destroyed : function(){
					self.current = null;
				}
			}, ev)
		   		   
		}
	})
	
	
	
	
	
	/**
	 * @Prototype
	 */
	$.extend($.Drag.prototype , {
		setup : function(options, ev){
			this.noSelection();
			$.extend(this,options);
			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove);
			var mouseup =   bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			$(document).bind('mousemove' ,mousemove);
			$(document).bind('mouseup',mouseup);
			this.callDown(this.element, ev)
		},
		/**
		 * Unbinds listeners and allows other drags ...
		 * @hide
		 */
		destroy  : function(){
			$(document).unbind('mousemove', this._mousemove);
			$(document).unbind('mouseup', this._mouseup);
			if(!this.moved){
				this.event = this.element = null;
			}
			this.selection();
			this.destroyed();
		},
		mousemove : function(docEl, ev){
			if(!this.moved){
				this.init(this.element, ev)
				this.moved= true;
			}
			
			var pointer = ev.vector();
			if (this._start_position && this._start_position.equals(pointer)) {
				return;
			}
			//e.preventDefault();
			
			this.draw(pointer, ev);
		},
		mouseup : function(docEl,event){
			//if there is a current, we should call its dragstop
			if(this.moved){
				this.end(event);
			}
			this.destroy();
		},
		noSelection : function(){
			document.documentElement.onselectstart = function() { return false; }; 
			document.documentElement.unselectable = "on"; 
			$(document.documentElement).css('-moz-user-select', 'none'); 
		},
		selection : function(){
			document.documentElement.onselectstart = function() { }; 
			document.documentElement.unselectable = "off"; 
			$(document.documentElement).css('-moz-user-select', ''); 
		},
		init :  function( element, event){
			element = $(element);
			var startElement = (this.movingElement = (this.element = $(element)));         //the element that has been clicked on
													//if a mousemove has come after the click
			this._cancelled = false;                //if the drag has been cancelled
			this.event = event;
			this.mouseStartPosition = event.vector(); //where the mouse is located
			/**
			 * @attribute mouseElementPosition
			 * The position of start of the cursor on the element
			 */
			this.mouseElementPosition = this.mouseStartPosition.minus( this.element.offsetv() ); //where the mouse is on the Element
	
			this.callStart(element, event);
	
			//Check what they have set and respond accordingly
			//  if they canceled
			if(this._cancelled == true) return;
			//if they set something else as the element
			
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();
	
			this.movingElement.makePositioned();
			this.movingElement.css('zIndex',1000);
			if(!this._only && this.constructor.responder)
				this.constructor.responder.compile(event, this);
		},
		callDown : function(element, event){
			if(this.callbacks[this.constructor.lowerName+"down"]) 
				this.callbacks[this.constructor.lowerName+"down"].call(element, event, this  );
		},
		callStart : function(element, event){
			if(this.callbacks[this.constructor.lowerName+"init"]) 
				this.callbacks[this.constructor.lowerName+"init"].call(element, event, this  );
		},
		/**
		 * Returns the position of the movingElement by taking its top and left.
		 * @hide
		 * @return {Vector}
		 */
		currentDelta: function() {
			return new $.Vector( parseInt( this.movingElement.css('left') ) || 0 , 
								parseInt( this.movingElement.css('top') )  || 0 )  ;
		},
		//draws the position of the dragmove object
		draw: function(pointer, event){
			// only drag if we haven't been cancelled;
			if(this._cancelled) return;
			/**
			 * @attribute location
			 * The location of where the element should be in the page.  This 
			 * takes into account the start position of the cursor on the element.
			 */
			this.location =  pointer.minus(this.mouseElementPosition);                              // the offset between the mouse pointer and the representative that the user asked for
			// position = mouse - (dragOffset - dragTopLeft) - mousePosition
			this.move( event );
			if(this._cancelled) return;
			if(!event.isDefaultPrevented())
				this.position(this.location);

			//fill in
			if(!this._only && this.constructor.responder)
				this.constructor.responder.show(pointer, this, event);  
		},
		/**
		 * @hide
		 * Set the drag to only allow horizontal dragging
		 */
		position : function(offsetPositionv){  //should draw it on the page
			var dragged_element_page_offset = this.movingElement.offsetv();          // the drag element's current page location
			
			var dragged_element_css_offset = this.currentDelta();                   //  the drag element's current left + top css attributes
			
			var dragged_element_position_vector =                                   // the vector between the movingElement's page and css positions
				dragged_element_page_offset.minus(dragged_element_css_offset);      // this can be thought of as the original offset
			
			this.required_css_position = offsetPositionv.minus(dragged_element_position_vector)
			
			

			var style = this.movingElement[0].style;
			if(!this._cancelled && !this._horizontal) {
				style.top =  this.required_css_position.top() + "px"
			}
			if(!this._cancelled && !this._vertical){
				style.left = this.required_css_position.left() + "px"
			}
		},
		move : function(event){
			if(this.callbacks[this.constructor.lowerName+"move"]) this.callbacks[this.constructor.lowerName+"move"].call(this.element, event, this  );
		},
		over : function(event, drop){
			if(this.callbacks[this.constructor.lowerName+"over"]) {
				this.callbacks[this.constructor.lowerName+"over"].call(this.element, event, this, drop  );
			}
		},
		out : function(event, drop){
			if(this.callbacks[this.constructor.lowerName+"out"]) {
				this.callbacks[this.constructor.lowerName+"out"].call(this.element, event, this, drop  );
			}
		},
		/**
		 * Called on drag up
		 * @hide
		 * @param {Event} event a mouseup event signalling drag/drop has completed
		 */
		end : function(event){
			if(this._cancelled) return;
			if(!this._only && this.constructor.responder)
				this.constructor.responder.end(event, this);
	
			if(this.callbacks[this.constructor.lowerName+"end"])
				this.callbacks[this.constructor.lowerName+"end"].call(this.element, event, this  );
	
			if(this._revert){
				var self= this;
				this.movingElement.animate(
					{
						top: this.startPosition.top()+"px",
						left: this.startPosition.left()+"px"},
						function(){
							self.cleanup.apply(self, arguments)
						}
				)
			}
			else
				this.cleanup();
			this.event = null;
		},
		/**
		 * Cleans up drag element after drag drop.
		 * @hide
		 */
		cleanup : function(){
			this.movingElement.css({zIndex: ""})
			if (this.movingElement[0] !== this.element[0])
				this.movingElement.css({ display: 'none' });
			if(this._removeMovingElement)
				this.movingElement.remove();
				
			this.movingElement = this.element = this.event = null;
		},
		/**
		 * Stops drag drop from running.
		 */
		cancel: function() {
			this._cancelled = true;
			//this.end(this.event);
			if(!this._only && this.constructor.responder)
				this.constructor.responder.clear(this.event.vector(), this, this.event);  
			this.destroy();
			
		},
		/**
		 * Clones the element and uses it as the moving element.
		 * @return {jQuery.fn} the ghost
		 */
		ghost: function(loc) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position','absolute');
			(loc ? $(loc) : this.movingElement ).after(ghost);
			ghost.width(this.movingElement.width())
				.height(this.movingElement.height())
				
			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this._removeMovingElement = true;
			return ghost;
		},
		/**
		 * Use a representative element, instead of the movingElement.
		 * @param {HTMLElement} element the element you want to actually drag
		 * @param {Number} offsetX the x position where you want your mouse on the object
		 * @param {Number} offsetY the y position where you want your mouse on the object
		 */
		representative : function( element, offsetX, offsetY ){
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;
	
			var p = this.mouseStartPosition;
	
			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();
	
			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY)
		},
		/**
		 * Makes the movingElement go back to its original position after drop.
		 * @codestart
		 * ".handle dragend" : function(el, ev, drag){
		 *    drag.revert()
		 * }
		 * @codeend
		 * @param {optional:Boolean} val optional, set to false if you don't want to revert.
		 */
		revert : function(val){
			this._revert = val == null ? true : val;
		},
		/**
		 * Isolates the drag to vertical movement.
		 */
		vertical : function(){
			this._vertical = true;
		},
		/**
		 * Isolates the drag to horizontal movement.
		 */
		horizontal : function(){
			this._horizontal = true;
		},
		
		
		/**
		 * Respondables will not be alerted to this drag.
		 */
		only :function(only){
			return (this._only = (only === undefined ? true : only));
		}
	});
	
	/**
	 * @add jQuery.event.special static
	 */
	event.setupHelper( [
		/**
		 * @attribute dragdown
		 * Listens for when a drag movement has started on a mousedown.
		 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
		 * @codestart
		 * $(".handles").live("dragdown", function(ev, drag){})
		 * @codeend
		 */
		'dragdown',
		/**
		 * @attribute draginit
		 * Called when the drag starts.
		 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
		 */
		'draginit',
		/**
		 * @attribute dragover
		 * Called when the drag is over a drop.
		 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
		 */
		'dragover',
		/**
		 * @attribute dragmove
		 * Called when the drag is moved.
		 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
		 */
		'dragmove',
		/**
		 * @attribute dragout
		 * When the drag leaves a drop point.
		 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
		 */
		'dragout', 
		/**
		 * @attribute dragend
		 * Called when the drag is done.
		 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
		 */
		'dragend'
		], "mousedown", function(e){
		$.Drag.mousedown.call($.Drag, e, this)
		
	} )
	
	


});


