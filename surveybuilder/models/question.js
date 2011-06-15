/**
 * @tag models, home
 * Wraps backend question services.  Enables 
 * [Question.static.findAll retrieving],
 * [Question.static.update updating],
 * [Question.static.destroy destroying], and
 * [Question.static.create creating] questions.
 */
$.Model.extend('Question',
/* @Static */
{
    /**
     * Retrieves questions data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped question objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
    	questions = [new Question({'type':'question','subType':'simple', 'displayName':'Simple'}), 
        		new Question({'type':'question','subType':'selectOne', 'displayName':'Multiple Choice'}), 
        		new Question({'type':'question','subType':'selectMultiple', 'displayName':'All that Apply'}),
        		new Question({'type':'question','subType':'gridSelectOne', 'displayName':'Grid'})];
        if (success) {
        	success(questions);
        }
        return questions;
    },
    /**
     * Updates a question's data.
     * @param {String} id A unique id representing your question.
     * @param {Object} attrs Data to update your question with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        alert('implement update');
    },
    /**
     * Destroys a question's data.
     * @param {String} id A unique id representing your question.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        alert('implement destroy');
    },
    /**
     * Creates a question.
     * @param {Object} attrs A question's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert('implement create');
    }
},
/* @Prototype */
{})
