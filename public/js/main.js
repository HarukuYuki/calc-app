"use strict";

const swal = require('sweetalert');
const $ = require('jquery');
require('bootstrap/dist/css/bootstrap.min.css');

$(function () {
    $("#cur-load").fadeIn('fast');

    $(".numb-only").keypress(function (e) {
        if (!RegExp(/([0-9.])\d*/g).test(e.key)) {
            return false;
        }
    })

    function getCurrency() {
        $.get('/get?data=currency')
            .always(() => {
                $("#cur-load").fadeOut('fast');
            })
            .done((res) => {
                $.each(res, function (i, data) {
                    var el = "<option value='" + data + "'>" + data + "</option>";
                    $("#currency").append(el);
                })
            })
            .fail((res) => {
                swal("Oooopss!", "Ada kesalahan sistem! (err:#003)", "error");
            })
    }
    getCurrency();
    $("#currency").on('change', function () {
        $("#pip-load").fadeIn('fast');
        $.get('/get?data=pip&cur=' + $(this).val())
            .done((res) => {
                $("#pip-load").fadeOut('fast');
                $("#pip-value").val(res.pipValue);
            })
    })
    $("#calculate").submit(function (e) {
        e.preventDefault();
        var $sendData = $(this).serialize();
        $.ajax({
                url: "/calc",
                data: $sendData,
                method: $(this).attr("method"),
                type: "JSON"
            })
            .done((res) => {
                if (typeof res.lot !== "undefined") {
                    $("#lot").text(res.lot);
                } else {
                    swal("Oooopss!", "Ada kesalahan sistem! (err:#002)", "error");
                }
            })
            .fail((res) => {
                var resJson = res.responseJSON;
                if (resJson.error == "pos_sl_same_val")
                    swal("Oooopss!", "Posisi Entri dan Stop Loss tidak boleh sama!", "error");
                else
                    swal("Oooopss!", "Ada kesalahan sistem! (err:#001)", "error");
            });
    });
});