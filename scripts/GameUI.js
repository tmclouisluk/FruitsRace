/**
 * This file specifies the ui control of fruit race monopoly
 * JQuery dialog is used in this game prototype.
 */
function initPromptDialog() {
    $("#dialog-confirm").dialog({
        position: {
            of: "#game"
        },
        autoOpen: false,
        resizable: false,
        modal: true,
        buttons: {
            "Confirm": function() {
                var paymentType = $(this).data('type');
                confirmPayment(paymentType);
                $(this).dialog("close");
                isDialogOpen = 0;
                Round();
            },
            Cancel: function() {
                $(this).dialog("close");
                isDialogOpen = 0;
                Round();
            }
        }
    });

    $("#dialog-message").dialog({
        position: {
            of: "#game"
        },
        autoOpen: false,
        modal: true,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
                isDialogOpen = 0;
                Round();
            }
        }
    });
}

function sendMessage(str, timeout, callback) {
    $("#dialog-message").text(str);
    $("#dialog-message").dialog("open");
    isDialogOpen = 1;

    if (timeout) {
        setTimeout(function() {
            $("#dialog-message").dialog("close");
            isDialogOpen = 0;
            Round();
            if (typeof callback === 'function') {
                callback();
            }
        }, timeout);
    }
}

function displayPlayersMoneyAndName() {
    var x = 120;
    var y = 60;
    var framewidth = 325;
    var frameheight = 70;
    var boardheight = 650;
    var namey = 25;

    systemData.ctx.font = "20px Arial";
    systemData.ctx.fillText(playersMoney[0], x, y);
    systemData.ctx.fillText(playersMoney[1], x + framewidth, y);
    systemData.ctx.fillText(playersMoney[2], x, y + frameheight + boardheight);
    systemData.ctx.fillText(playersMoney[3], x + framewidth, y + frameheight + boardheight);

    systemData.ctx.fillText(gameSpritesName[0], frameheight + 10, namey);
    systemData.ctx.fillText(gameSpritesName[1], frameheight + 10 + framewidth, namey);
    systemData.ctx.fillText(gameSpritesName[2], frameheight + 10, namey + frameheight + boardheight);
    systemData.ctx.fillText(gameSpritesName[3], frameheight + 10 + framewidth, namey + frameheight + boardheight);

}