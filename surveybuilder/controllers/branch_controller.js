/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Branch',
/* @Static */
{
	defaults : {
		model: null,
		template: "//surveybuilder/views/branch/show_branch"
	},
    onDocument: false
},
/* @Prototype */
{
	init: function(){
		steal.dev.log('new branch controller instance created');
		this.updateName(this.options.model.internalName);
	},
    "{model} internalName" : function(updatedLine, ev, newInternalName) {
    	//update branch object
		this.updateName(newInternalName);
	},
	updateName: function(newInternalName) {
		this.element.find('.line-name').text(newInternalName);
		this.element.find('input[name="lineName"]').val(newInternalName);
	},
	".line-name click": function(el, ev) {
		var lineAbout = el.closest('.branch').model().attr("lineAbout");
		var line = Line.findOne({about:lineAbout});
		OpenAjax.hub.publish('tabs.openLine', {id:line.attr("id")});
	}
});
