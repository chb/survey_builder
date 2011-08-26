/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Line',
/* @Static */
{
    onDocument: false,
    
    /**
     * Discard changes made to a given Line
     * @param {Number} id line to discard unsaved changes from
     */
    discardChanges: function(id){
        Surveybuilder.Controllers.Line.loadPreviousVersion(id);
    },
    
    /**
     * Load the previous version of a Line
     * @param {Number} id line to reload
     */
    loadPreviousVersion: function(id){
        line = Line.loadFromCache(id);
        if (line.childId) {
        	// restore children
        	Surveybuilder.Controllers.Lineitem.lineitemRestoreRecursive(Line.findOne(line.childId));
        }
    }
},
/* @Prototype */
{
	init : function(el, message){
	    steal.dev.log('new line controller instance created');
	    // add in content controller
        $(el).find('.line-items').surveybuilder_lineitem_content({connectWith: '.line-items'});
    },
    ".line-form input change": function(el, ev){
        var currentLine = Line.findOne({id:el.closest('.line').attr('id')});
        var name = el.attr("name");
        currentLine.attr(name, 
						SURVEY_UTILS.htmlEncode(el.val()), 
						function(){
							// success
							el.closest('.attribute').removeClass("error");
							el.siblings(".help-inline").remove();
							this.save();
						}, 
						function(errors){
							// error
							el.closest('.attribute').addClass("error");
							// remove any old errors and display new
							el.siblings(".help-inline").remove();
							el.after($.View('//surveybuilder/views/error/validation', {message:errors[name][0]}));
		});
        
        // show "content changed" indicator
        $('.ui-tabs-selected .ui-icon-gear').show();
        $('#saveAll').removeClass('disabled').attr("disabled", false);
        ev.stopPropagation();
		//TODO: is this not in jvmc3?        ev.stopDelegation();
    }
    
});
