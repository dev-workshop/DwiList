/**
 * Created with JetBrains WebStorm.
 * User: teisaacs
 * Date: 10/15/13
 * Time: 6:21 PM
 * To change this template use File | Settings | File Templates.
 */

var Store = (function() {
// private variables and functions
    var API_KEY = "Sjv_BXxZ3hauH-fn5-SuKskigyo2OcqQ";
    var DB_NAME = "dwitasks";
    var COLLECTION_LIST =  "lists";
    var URL = "https://api.mongolab.com/api/1/databases/" + DB_NAME + "/collections/" + COLLECTION_LIST;
    var KEY_PARAM =  "?apiKey=" + API_KEY;


    /**
     * Pulls the entire collection of Lists
     *
     * @param onSuccess
     * @param onError
     * @private
     */
    var _loadLists = function(onSuccess, onError) {
        $.ajax({
            url: URL + KEY_PARAM,
            type: "GET",
            contentType: "application/json"
        }).done( function (result) {
            if (onSuccess) {
                onSuccess(result);
            }
        }).fail(function(jqXHR, textStatus){
            if (onError) {
                onError(jqXHR, textStatus);
            }
        });
    };


    /**
     * Saves a single list object/mongo document.  We can get more granular with the save and update parts of the
     * document, for now just save the whole document.
     *
     * NOTE: the REST url for this document .../DOCUMENT_ID?....  This allows us to update this individual item. If we
     * did not use this ID in the url we would have to specify a query param to limit the update 'q={}' .
     *
     * @param list
     * @param onSuccess
     * @param onError
     * @private
     */
    var _saveList = function(list, onSuccess, onError) {
        $.ajax({
            url: URL + "/" + list._id.$oid + KEY_PARAM,
            data: JSON.stringify(list),
            type: "PUT",
            contentType: "application/json"
        }).done(function (result) {
            if (onSuccess) {
                onSuccess(result);
            }
        }).fail(function(jqXHR, textStatus){
            if (onError) {
                onError(jqXHR, textStatus);
            }
        });
    };


    /**
     * Removes a single List document.
     * @param list
     * @private
     */
    var _removeList = function(list, onSuccess, onError) {
        $.mobile.loading('show');
        $.ajax({
            url: URL + "/" + list._id.$oid + KEY_PARAM,
            type: "DELETE",
            async: true,
            timeout: 300000}
        ).done(function () {
            if (onSuccess) {
                onSuccess();
            }
        }).fail(function(jqXHR, textStatus){
            if (onError) {
                onError(jqXHR, textStatus);
            }
        });
    };


    /**
     * Save a new List document.
     * Mongo will add the $oid in the returned object.
     *
     * @param itemName
     * @param onSuccess
     * @param OnError
     * @private
     */
    var _addListItem = function(itemName, onSuccess, onError) {
        $.ajax({
            url: URL + KEY_PARAM,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ "name": itemName })
        }).done(function (result) {
            if (onSuccess) {
                onSuccess(result);
            }
        }).fail(function(jqXHR, textStatus){
            if (onError) {
                onError(jqXHR, textStatus);
            }
         });
    };


// expose public API
    return {
        loadLists: _loadLists,
        addListItem: _addListItem,
        removeList: _removeList,
        saveList : _saveList
    };
})();