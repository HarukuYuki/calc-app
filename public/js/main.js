"use strict";

const swal = require('sweetalert');
const $ = require('jquery');
require('bootstrap/dist/css/bootstrap.min.css');

$(function () {
    $("#cur-load").fadeIn('fast');
    $.get('/get?data=currency')
        .done((res) => {
            $("#cur-load").fadeOut('fast');
            $.each(res, function (i, data) {
                var el = "<option value='" + data + "'>" + data + "</option>";
                $("#currency").append(el);
            })
        })
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
                    swal
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