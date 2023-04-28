$(window).on('load', function() {

    let f;
    let cap;
    var spinner = `<div class="spinner-border spinner-border-sm" role="status"></div>`
    let check = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="text-success errx h-5 w-5 mr-3" fill="none">
        <path fill="currentColor" d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"/>
      </svg>`
    var enableBtn = function() {
        cap = true;
    }

    function formSubmitted() {
        $("#btnsubmit").empty()
        $("#btnsubmit").append(spinner + " Processing").addClass("disabled")
        var myform = $('#form');
        var disabled = myform.find(':input:disabled').removeAttr('disable');
        let subdo = disabled.val()
        var serialized = myform.serialize();
        disabled.attr('disable', 'disable');
        $.post($(location).attr('protocol') + "//" + $(location).attr('host') + "/api/add", serialized, function(data) {
            $("#type").removeAttr('readonly');
            if (!data.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `${err.message}`
                })
                $("#btnsubmit").empty()
                $("#btnsubmit").append("Submit").removeClass("disabled")

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Domain Has Been Added!'
                })
                $("#btnsubmit").empty()
                $("#btnsubmit").append("Submit").removeClass("disabled")
            }
        })
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Domain Has Been Added!'
        })
        $("#btnsubmit").empty()
        $("#btnsubmit").append("Submit").removeClass("disabled")

        // alert($("#form").serialize())
        event.preventDefault();
    }

    $("#checkDomain").click(function() {
        $("#checkDomain").empty()
        $("#checkDomain").append(spinner + " Checking").addClass("disabled")
        let type = $("#basicSelect").find(":selected").val()
        $.getJSON($(location).attr('protocol') + "//" + $(location).attr('host') + "/api/isexists?type=" + type + "&q=" + $('#subdomain').val() + ".botwa.net").then(function(x) {
            if (!x.result) {
                $("#checkingExists").empty();
                $("#checkingExists").append(check);
                $("#subdomain").attr("disable", "disable");
                $("#subdomain").attr('readonly', 'readonly');
                $(".hidden").removeClass("hidden");
                $("#subdoNotAvailableDummy").addClass("hidden");
                $("#btnsubmit").removeClass("disabled")
                $("#checkDomain").addClass("hidden");
                $('#form').children().unwrap().wrapAll("<form id='form'></form>");
                $("#form").submit(function(event) {
                    formSubmitted();
                })
                $("#checkDomain").empty().removeClass("disabled").append("Check Availability");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Subdomain not available! Try another one.`
                })
                $("#checkDomain").empty().removeClass("disabled").append("Check Availability");
            }
        })
    })

    $("#subdomain").on("keyup", function() {
        var dInput = this.value;
        let len = dInput.length;
        if ("." === dInput.charAt(dInput.length - 1)) {
            $("#subdomain").addClass("border border-red-500")
            $("#errorMsg1").html(`Akhiran subdomain tidak dapat menggunakan karakter '.'`)
            f = "disabled";
        } else if (len === 0) {
            $("#subdomain").addClass("border border-red-500")
            $("#errorMsg1").html(`Karakter tidak boleh kosong.`)
            f = "disabled";
        } else if (len > 242) {
            $("#subdomain").addClass("border border-red-500")
            $("#errorMsg1").html("Domain terlalu panjang.")
            f = "disabled"
        } else if (len < 4) {
            $("#subdomain").addClass("border border-red-500")
            $("#errorMsg1").html("Domain harus lebih 4 karakter.")
            f = "disabled"
        } else {
            $("#subdomain").removeClass("border border-red-500")
            $("#content").removeClass("hidden")
            $("#type").attr("readonly", "readonly");
            $("#errorMsg1").html("")
            f = "";
        }
    })

    let konten;
    $("#content").on("keyup", function() {
        var dInput = this.value;
        let len = dInput.length;

        $("#content").removeClass("border border-red-500")
        $("#errorMsg2").html("")
        f = "";
        konten = true;

    })

    $('#form #subdomain, #form #content').on('keyup', function() {
        checkForm()
    });

    function checkForm(cap2) {
        if (cap) {
            cap = cap;
        } else {
            cap = cap2;
        }
        if (f) {
            $("#btnsubmit").addClass(f);
            $("#checkDomain").addClass(f);
        } else {
            if (cap && konten) {
                $("#btnsubmit").removeClass('disabled');
            }
            $("#checkDomain").removeClass('disabled');
        }
    }



    if (feather) {
        feather.replace({
            width: 14,
            height: 14
        });

    }

})