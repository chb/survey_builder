$(function(){

   $('.info-icon').live('click', function(){
      var infoDiv = $($(this).attr("data-infoId"));
      jQuery.facebox(infoDiv.html());
      return false;
   });

  	// Hide drop-down menus when user clicks elsewhere  
    $('html').click(function() {
    	// close all active drop-down menus
    	$('.drop-down.active').each(function(i) {
			$(this).removeClass('active ui-corner-tl').addClass("ui-corner-left");
			$(this).siblings('.drop-down-list').hide();
		});
    });

	// Hide/Show details on lines/questions/answers/etc
	//TODO: move into controller
	$(".toggle").live("click", function() {
		$(this).siblings(".hideable").toggle("fast");
		$(this).siblings(".lineitem-form").find(".hideable").toggle("fast");
		var indicator = $(this).find(".toggle-indicator");
		if (indicator.hasClass("ui-icon-triangle-1-s")) {
			indicator.removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
		}
		else {
			indicator.removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
		}
	});

	// combobox widget from the jQueryUI site
	(function( $ ) {
		$.widget( "ui.combobox", {
			_create: function() {
				var self = this,
					select = this.element.hide(),
					selected = select.children( ":selected" ),
					value = selected.val() ? selected.text() : "";
				var input = this.input = $( "<input>" )
					.insertAfter( select )
					.val( value )
					.autocomplete({
						appendTo: "#tabs-container",  //TODO: edited to append to tabs-container so it will pick up the same styles, but this limits this to a specific location
						delay: 0,
						minLength: 0,
						source: function( request, response ) {
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
							response( select.children( "option" ).map(function() {
								var text = $( this ).text();
								if ( this.value && ( !request.term || matcher.test(text) ) )
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
							}) );
						},
						select: function( event, ui ) {
							ui.item.option.selected = true;
							self._trigger( "selected", event, {
								item: ui.item.option
							});
							// a form change event is not triggered on selection, so we manually do it 
							$(select).change();
						},
						change: function( event, ui ) {
							if ( !ui.item ) {
								var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
									valid = false;
								select.children( "option" ).each(function() {
									if ( $( this ).text().match( matcher ) ) {
										this.selected = valid = true;
										return false;
									}
								});
								// a form change event is not triggered on selection, so we manually do it 
								$(select).change();
								if ( !valid ) {
									// remove invalid value, as it didn't match anything
									$( this ).val( "" );
									select.val( "" );
									input.data( "autocomplete" ).term = "";
									return false;
								}
							}
						}
					})
					.addClass( "ui-widget ui-widget-content ui-corner-left" );

				input.data( "autocomplete" )._renderItem = function( ul, item ) {
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( "<a>" + item.label + "</a>" )
						.appendTo( ul );
				};

				this.button = $( "<button type='button'>&nbsp;</button>" )
					.attr( "tabIndex", -1 )
					.attr( "title", "Show All Items" )
					.insertAfter( input )
					.button({
						icons: {
							primary: "ui-icon-triangle-1-s"
						},
						text: false
					})
					.removeClass( "ui-corner-all" )
					.addClass( "ui-corner-right ui-button-icon" )
					.click(function() {
						// close if already visible
						if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
							input.autocomplete( "close" );
							return;
						}

						// work around a bug (likely same cause as #5265)
						$( this ).blur();

						// pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "" );
						input.focus();
					});
			},

			destroy: function() {
				this.input.remove();
				this.button.remove();
				this.element.show();
				$.Widget.prototype.destroy.call( this );
			}
		});
	})( jQuery );

});
