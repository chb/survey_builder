/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.LogicComponent',
/* @Static */
{
	onDocument: false
},
/* @Prototype */
{
	init: function(){
		steal.dev.log('loaded logic controller');
		// show possible branch targets
		var parentLine = Line.findOne({id:this.element.closest('.line').attr('id')});
		var currentLineitem = Lineitem.findOne({id:this.element.attr('id')});
		this.element.find('.branchTarget').html($.View('//surveybuilder/views/logicComponent/show_branchTargets', {lines:Line.findAll(), lineitem:currentLineitem, parentLine:parentLine}));
	},
	
	'line.destroyed subscribe': function(event, params) {
		steal.dev.log('line.destroyed received in LogicComponent controller');
		var currentLineitem = Lineitem.findOne({id:this.element.attr('id')});  

		if (currentLineitem) {
			if (params.about == currentLineitem.attr('branchTarget'))  {
				// remove branch target if it is no longer an option
				currentLineitem.attr("branchTarget", null);
			}
		}
		// update the drop-down list of branch targets
		this.element.find('option[value*="' + params.about + '"]').remove();

	},

	'line.updated subscribe': function(event, line) {
		steal.dev.log('line.updated received in LogicComponent controller');
		var currentLineitem = Lineitem.findOne({id:this.element.attr('id')});
		var parentLine = Line.findOne({id:this.element.closest('.parent').attr('id')});
		var branchTargetEl = this.element.find(".branchTarget");
		branchTargetEl.html($.View('//surveybuilder/views/logicComponent/show_branchTargets', {lines:Line.findAll(), lineitem:currentLineitem, parentLine:parentLine}));
	}
	
});
