/**
 * @tag models, home
 * Enables 
 * [AnswerType.static.findAll retrieving],
 * [AnswerType.static.update updating],
 * [AnswerType.static.destroy destroying], and
 * [AnswerType.static.create creating] answers.
 */
$.Model.extend('AnswerType',
/* @Static */
{
    /**
     * Retrieves all answerTypes
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped answerType objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
    	answers = [new AnswerType({'type':'answer','subType':'LabelAnswer', 'displayName':'Fixed Choice'}), 
    			   new AnswerType({'type':'answer','subType':'TextAnswer', 'displayName':'Free Text'})];
        if (success) {
        	success(answers);
        }
        return answers;
    },
    /**
     * Updates an answerType's data.
     * @param {String} id A unique id representing your answerType.
     * @param {Object} attrs Data to update your answerType with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        alert('implement update');
    },
    /**
     * Destroys an answerType's data.
     * @param {String} id A unique id representing your answer.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        alert('implement destroy');
    },
    /**
     * Creates an answerType.
     * @param {Object} attrs A answer's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert('implement create');
    }
},
/* @Prototype */
{})
