/**
 * @tag models, home
 * Enables 
 * [QuestionType.static.findAll retrieving],
 * [QuestionType.static.update updating],
 * [QuestionType.static.destroy destroying], and
 * [QuestionType.static.create creating] questions.
 */
$.Model.extend('QuestionType',
/* @Static */
{
    /**
     * Retrieves QuestionTypes
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped QuestionType objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
    	questions = [new QuestionType({'type':'question','subType':'SimpleQuestion', 'displayName':'Simple'}), 
        		new QuestionType({'type':'question','subType':'SelectOneQuestion', 'displayName':'Multiple Choice'}), 
        		new QuestionType({'type':'question','subType':'SelectMultipleQuestion', 'displayName':'All that Apply'}),
        		new QuestionType({'type':'question','subType':'GridSelectOneQuestion', 'displayName':'Grid'})];
        if (success) {
        	success(questions);
        }
        return questions;
    },
    /**
     * Updates a QuestionType's data.
     * @param {String} id A unique id representing your QuestionType.
     * @param {Object} attrs Data to update your QuestionType with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        alert('implement update');
    },
    /**
     * Destroys a QuestionType's data.
     * @param {String} id A unique id representing your question.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        alert('implement destroy');
    },
    /**
     * Creates a QuestionType.
     * @param {Object} attrs A QuestionType's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert('implement create');
    }
},
/* @Prototype */
{})
