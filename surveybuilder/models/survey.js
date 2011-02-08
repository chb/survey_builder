/**
 * @tag models, home
 * Represents a survey
 */
$.Model.extend('Survey',
/* @Static */
{
    /**
     * Retrieves a survey 
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped Survey objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findOne : function(params, success, error){
        return SURVEY;
    },
    /**
     * Updates a Survey's data.
     * @param {String} id A unique id representing your Survey.
     * @param {Object} attrs Data to update your Survey with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        // TODO: for now ends up getting called even if it should be a create, since the ID is set
        steal.dev.log("update on survey");
        var survey = this.findOne();
        if (survey){
            for(var attribute in attrs){
                survey.attr(attribute, attrs[attribute]);
            }
        }
        else{
            SURVEY = new Survey(attrs);
        }
        success();
    },
    /**
     * Creates a Survey.
     * @param {Object} attrs A Survey's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
       	steal.dev.log("create on survey");
        attrs.id = 1;
        SURVEY = new Survey(attrs);
        success();
    },
    saveRemote : function(){
        $.DOMCached.set('survey', SURVEY);
    },
    loadRemote : function(){
        //SURVEY = Survey.wrap($.DOMCached.get('survey'));  //TODO find out why this ends up putting errors() as an object and not a function
        SURVEY = new Survey($.DOMCached.get('survey'));
    }
},
/* @Prototype */
{
	
})
