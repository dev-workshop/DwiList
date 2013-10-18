/**
 * Created with JetBrains PhpStorm.
 * User: toddshelton
 * Date: 10/12/13
 * Time: 8:23 PM
 * To change this template use File | Settings | File Templates.
 */


$(document).bind( "mobileinit", function(event) {
    $.extend($.mobile.zoom, {locked:true,enabled:false});
});

jQuery(function ($) {
    'use strict';

    $("document").ready(function () {
        $.support.cors = true;


        $(document).bind("mobileinit", function () {
            // Make your jQuery Mobile framework configuration changes here!

            $.mobile.allowCrossDomainPages = true;
        });
        ListApp.init();
        document.addEventListener("deviceready", onDeviceReady, true);
    });

    function onDeviceReady() {
       ListApp.init();
    }


});

