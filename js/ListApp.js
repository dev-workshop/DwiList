/**
 * Created with JetBrains WebStorm.
 * User: teisaacs
 * Date: 10/15/13
 * Time: 6:01 PM
 * To change this template use File | Settings | File Templates.
 */

// The module pattern, self executing function
var ListApp =(function() {
// private variables and functions

    var listArray = [];
    var listID = -1;
    var initialized = false;


    /**
     * Initializes the application. Initiates the initial load and binds listeners.
     *
     * @private
     */
    var _init = function() {
        //guard against binding listeners twice
        if (!initialized) {
            //load data
            Store.loadLists(_onGetData, _onGetDataError);

            //continue init and bind UI events
            _bindEvents();
            initialized = true;
        }
    };

    /**
     * Callback function for initial data load
     *
     * @param data  Array of list objects returned from request
     * @private
     */
    var _onGetData = function(data) {
       listArray = data;
       _buildListPage();
    }

    var _onGetDataError = function(jqXHR, textStatus) {
        Alert("Isn't doesn't seem you have a connection. Please try again later");
    };

    /**
     * Builds a list item for the given LIST object <li> ..</li>
     *
     * @param index         position in array
     * @param listData      list data object
     * @returns {string}    HTML markup
     * @private
     */
    var _buildListRenderer = function(index, listData) {
        return "<li id='" + index + "'><a href='#'>" + listData.name + "</a></li>";
    };


    /**
     * Builds a list item for the given LIST ITEM object <li> ..</li>
     *
     * @param index
     * @param itemName
     * @returns {string}
     * @private
     */
    var  _buildListItemRenderer = function(index, item) {

        var styleStr = '';
        var checkedStr = "";

        if (item.completed) {
            styleStr = ' style="text-decoration: line-through;"';
            checkedStr = ' checked ';
        }

        //Example: <li><label><input type="checkbox" checked name="checkbox-0" /> I agree </label></li>
        var templateStr = [
            '<li id="' + index + '"' + styleStr + '>'
            ,  '<label data-role="none">'
            ,    '<input type="checkbox" ' + checkedStr + ' name="completedCheckBox" id="completedCheckBox" />'
            ,    '  ' + item.name + '</label>'
            ,'</li>'
        ].join( '' );

        return templateStr;
    };


    /**
     * Builds the list page based on the data in our model
     *
     * @private
     */
    var _buildListPage = function() {
        console.log("Building List Page");

        $("#userLists").empty();
        if (listArray.length > 0) {

            $.each(listArray, function (idx, data) {
                console.log("Index " + idx);
                console.log(data);

                    $("#userLists").append(_buildListRenderer(idx, data));
            });

            $("#userLists").listview('refresh');

            //setup click handler on each item
            $("#userLists li").bind("click", function (e) {
                //update our model with selected list
                 listID = $(this).attr('id');
                $.mobile.changePage("#detailView", {transition: "flip"});
                addListHeaderName($('a', this).html());
            });
        }  else {
            //handle no items here
        }
    };

    /**
     *  Builds the List Items page based on selected List.  Updates the model with the selected ID
     *
     * @param idx
     * @param data
     * @private
     */
    var _buildListItemsPage = function() {
       console.log("Building List Items Page");

        $("#userListItems").empty();
        if (listID > -1 ) {

             var selectedList = listArray[listID];

            //make sure we have an array
            if (!selectedList.hasOwnProperty('listItems'))  {
                selectedList.listItems = [];
            }

            $.each(selectedList.listItems, function (idx, data) {
                var itemRender = _buildListItemRenderer( idx, data);
                $("#userListItems").append(itemRender );
            });

            //$('#userListItems').listview('refresh');
            $("#userListItems").listview("refresh").find('input').checkboxradio();

            //this is to strike through to set completed
            $("li .ui-checkbox").bind( "change", function(event, ui) {
                //var itemID = $(this.parentElement).attr('id');
                var itemID = this.parentElement.id;
                var selectedList = listArray[listID];
                var item = selectedList.listItems[itemID];


                if (item) {
                    //need to look for class = ui-checkbox-off    or data-icon = checkbox-off
                    if($(this).find('label').attr("data-icon") == 'checkbox-on') {
                        $(this).parent().css("text-decoration", "none");
                        item.completed = false;
                    }else{
                        $(this).parent().css("text-decoration", "line-through");
                        item.completed = true;
                    }
                    $("#userListItems").find('input').checkboxradio();

                }
            });

        }  else {
            //show no items ?
        }
    };


    /**
     * Updates the name of the header in the list items detail view.
     *
     * @param listName
     */
    var addListHeaderName = function (listName) {
        $("#detailView #listName").html(listName);
    };

    /**
     *  Reset and close the add LIST dialog.
     *
     *  NOTE: this should be called after data has been added to the list (onSuccess) since it will load the page it was
     *  on prior to being show.  When the pages load they hit the JQM lifecycle events we have setup and the page will
     *  rebuild based on what is in the model
     */
    var _closeAddListDialog = function() {
        $("#listNameDialog #listName").val("");
        $("#listNameDialog").dialog("close", {transition: "none"});
    }


    /**
     * Reset and close the add LIST ITEM dialog
     *
     * @private
     */
    var _closeAddListItemDialog = function() {
        $("#addListItemDialog #itemName").val("");
        $("#addListItemDialog").dialog("close", {transition: "none"});
    }


    /**
     * Bind all the application events here
     *
     * @private
     */
    var _bindEvents = function () {

         //Pop up the add new LIST dialog
        $('#addListBtn').click(function (e) {
            $.mobile.changePage("#listNameDialog", { role: "dialog", transition: "none" });
        });

        //Pop up the add new LIST ITEM dialog
        $('#addItemBtn').click(function (e) {
            $.mobile.changePage("#addListItemDialog", { role: "dialog", transition: "none"});
        });

        //Back button listener NOTE: used two jQuery selectors to apply to the details page only
        $('#detailView #logo').click(function (e) {
           //todo need a dirty check but for now just save
            $.mobile.loading('show');
            var selectedList = listArray[listID];
            Store.saveList(selectedList, function() {
                //onSuccess
                $.mobile.changePage("#pageone", {transition: "flip", reverse:true});
                $.mobile.loading('hide');
            }, function() {
                //onError, stay silent for now and go to page.
                $.mobile.changePage("#pageone", {transition: "none"});
                $.mobile.loading('hide');
            });

        });

        //Delete LIST
        $("#deleteListBtn").bind("click", function(e){
            $.mobile.loading('show');
            Store.removeList(listArray[listID], function(){
                //onSuccess
                listArray.splice(listID, 1);
                $.mobile.changePage("#pageone", {transition: "none"});

                $.mobile.loading('hide');
            }, function(jqXHR, textStatus) {
                //onError
                console.log(textStatus);
                $.mobile.loading('hide');
            });

        });

        //Add new LIST
        $('#namedListBtn').click(function (e) {
            $.mobile.loading('show');
            var listName = $("#listNameDialog #listName").val();

            listName = $.trim(listName);

            if (listName.length > 0) {
                //add the new item to DB
                Store.addListItem(listName, function(result){
                    //anonymous onSuccess function
                    listArray.push(result);
                    _closeAddListDialog();
                    $.mobile.loading('hide');
                }, function(jqXHR, textStatus) {
                    //anonymous onError function
                    console.log(textStatus);
                    _closeAddListDialog();
                    $.mobile.loading('hide');
                });
            }  else {
                _closeAddListDialog();
                $.mobile.loading('hide');
            }



        });

        //Add new LIST ITEM
        $('#addItemSubmitBtn').click(function (e) {
            $.mobile.loading('show');
            //grab the new name
            var itemName = $("#addListItemDialog #itemName").val();

            itemName = $.trim(itemName);

            if (itemName.length > 0) {
                var item = {"name": itemName}
                var selectedList = listArray[listID];

                //update model
                selectedList.listItems.push(item);

                //update DB
                Store.saveList(listArray[listID], function(result) {
                    //onSuccess handler
                    _closeAddListItemDialog();
                    $.mobile.loading('hide');
                }, function(error){
                    //onError
                    //todo whoops data is in the model but failed to save.
                    _closeAddListItemDialog();
                    $.mobile.loading('hide');
                });
            } else {
                _closeAddListItemDialog();
                $.mobile.loading('hide');
            }
        });
    };


// public API
    return {
        init : _init,
        curretListID :listID,
        //adding these for the lifecycle events when a page is being shoen
        buildListPage: _buildListPage,
        buildListItemsPage : _buildListItemsPage
    };
})();