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
		this.updateName(this.options.model);
	},
    "{model} title" : function(updatedLine, ev, newTitle) {
    	//update branch object
		this.updateName(updatedLine);
	},
	updateName: function(updatedLine) {
		branchToUpdate = Lineitem.findOne({id:this.element.attr('id')});
		if (branchToUpdate && (branchToUpdate.displayName !== updatedLine.title || branchToUpdate.about !== updatedLine.about)) {
			branchToUpdate.attr("displayName", updatedLine.title);
			branchToUpdate.attr("about", updatedLine.about);
			branchToUpdate.save();
			this.element.find('.display-name').text(updatedLine.title);
			this.element.find('input[name="displayName"]').val(updatedLine.title);
		}
	}
});
