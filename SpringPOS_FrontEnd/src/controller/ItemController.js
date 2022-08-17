
var baseUrl="http://localhost:8080/SpringPOS_BackEnd-1.0.0/pos/v1/item"

loadItemDetailsToTable();

//--------------------------------------------Save Item-------------------------------------------------------------
$('#button-save-item').click(function () {
    saveItem();
});

function saveItem() {
    $('#item-table tbody tr').off();

    if (confirm('Do you want to Save Item Details?')) {

        var itemForm = $("#itemForm").serialize();


        $.ajax({
            url: baseUrl,
            method: "POST",
            data: itemForm,
            success: function (res) {
                if (res.code == 200) {

                    alert(res.message);

                    //Load Item Details To Table
                    loadItemDetailsToTable();

                    //clear Input Fields
                    clearAllItemDetails();

                    //Load Table Details To Input Fields
                    loadItemDetailsToInputFields();

                    //Remove Table Details when double click the row
                    removeItemTableRows();

                    //populate item drop down list
                    // populateItemDropDown();

                }
            },
            error: function (ob) {
                alert(ob.responseJSON.message);

            }
        });

    } else {
        //clear Input Fields
        clearAllItemDetails();
    }
}

//-----------------------------------------Update Item Details------------------------------------------------------
$('#button-update-item').click(function () {
    updateItem();
});

function updateItem() {
    if (confirm('Do you want to Update Item Details?')) {

            var item={
                itemCode:$("#item-code").val(),
                itemName:$("#item-name").val(),
                quantity:$("#item-quantity").val(),
                unitPrice:$("#item-price").val()
            }

        $.ajax({
            url: baseUrl,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(item),
            success: function (res) {
                if (res.code == 200) {
                    alert(res.message);
                    //Load Item Details To Table
                    loadItemDetailsToTable();

                    //clear Input Fields
                    clearAllItemDetails();

                    //Load Table Details To Input Fields
                    loadItemDetailsToInputFields();

                    //Remove Table Details when double click the row
                    removeItemTableRows();

                }
            },
            error: function (ob) {
                alert(ob.responseJSON.message);
            }
        });
    } else {
        //Do Nothing
        clearAllItemDetails();
    }
}

//-------------------------------------------------Delete Item------------------------------------------------------
$('#button-delete-item').click(function () {
    deleteItem();
});

function deleteItem() {
    if (confirm('Do you want to Delete Item Details?')) {
           var code=$("#item-code").val();

        $.ajax({
            url: baseUrl+"?code="+code,
            method:"DELETE",
            success:function (res){
                if(res.code==200){
                    alert(res.message);

                    //Load Item Details To Table
                    loadItemDetailsToTable();

                    //clear Input Fields
                    clearAllItemDetails();

                    //Load Table Details To Input Fields
                    loadItemDetailsToInputFields();

                    //Remove Table Details when double click the row
                    removeItemTableRows();

                    //populate item drop down list
                   // populateItemDropDown();

                }
            },
            error:function (ob){
                alert(ob.responseJSON.message);
            }
        });

    } else {
        //Do Nothing
        clearAllItemDetails();
    }
}

//---------------------------------------------Search item----------------------------------------------------------
$('#item-search-button').on('click', function () {
    var itemCode = $('#item-search').val();
    searchItem(itemCode);
});

function searchItem(code) {
    $.ajax({
        url: baseUrl+"/"+code,
        method:"GET",
        success:function (resp){
            if (resp.code == 200) {
                var item=resp.data;
                    $('#item-code').val(item.itemCode);
                    $('#item-name').val(item.itemName);
                    $('#item-quantity').val(item.quantity);
                    $('#item-price').val(item.unitPrice);
                

                $('#item-search').val('');

                //Load Table Details To Input Fields
                loadItemDetailsToInputFields();

                //Remove Table Details when double click the row
                removeItemTableRows();

            }

        },
        error:function(ob){
            alert(ob.responseJSON.message);
        }
    });
}

//-----------------------------------------load item details to table-----------------------------------------------
function loadItemDetailsToTable() {
    $('#item-table tbody').empty();

    $.ajax({
        url:baseUrl,
        method:"GET",
        success:function (resp){
            for (var item of resp.data) {
                $('#item-table tbody').append(
                    `<tr><td>${item.itemCode}</td><td>${item.itemName}</td><td>${item.quantity}</td><td>${item.unitPrice}</td></tr>`
                );
            }
            loadItemDetailsToInputFields();
        },
        error:function(ob){
            alert(ob.responseJSON.message);
        }
    });
}


//------------------------------------------Clear Input Fields----------------------------------------------------------
$('#button-clear-item').click(function () {
    clearAllItemDetails();
});

function clearAllItemDetails() {
    $('#item-code,#item-name,#item-quantity,#item-price').val('');
    $('#item-code,#item-name,#item-quantity,#item-price').css(
        'border',
        'solid 2px #ced4da'
    );
    $('#item-code').focus();
    $('#button-save-item').attr('disabled', true);
    $('#code-error,#item-name-error,#item-quantity-error,#item-price-error').text('');

    //Load Table Details To Input Fields
    loadItemDetailsToInputFields();

    //Remove Table Details when double click the row
    removeItemTableRows();
}

//------------------------------Load Table Details To Input Fields------------------------------------------------------
function loadItemDetailsToInputFields() {
    $('#item-table tbody tr').click(function () {
        $('#item-code').val($(this).children(':nth-child(1)').text());
        $('#item-name').val($(this).children(':nth-child(2)').text());
        $('#item-quantity').val($(this).children(':nth-child(3)').text());
        $('#item-price').val($(this).children(':nth-child(4)').text());
    });
}

//--------------------------Remove Table Details when double click the row----------------------------------------------
function removeItemTableRows() {
    $('#item-table tbody tr').dblclick(function () {
        $(this).remove();
    });
}

//------------------------------------Validate Item Input Fields----------------------------------------------------
const regExItemCode = /^(I00-)[0-9]{3,4}$/;
const regExItemName = /^([A-z]+([\ A-z]+)*){3,50}$/;
const regExItemQuantity = /^[1-9]([0-9]{0,4})$/;
const regExItemPrice = /^(0(?!\.00)|[1-9]\d{0,6})\.\d{2}$/;


$('#item-code,#item-name,#item-quantity,#item-price').on('keyup', function () {
    validateItem();
});

function validateItem() {
    let code = $('#item-code').val();
    if (regExItemCode.test(code)) {
        $('#item-code').css('border', '3px solid green');
        $('#code-error').text('');
        let name = $('#item-name').val();
        if (regExItemName.test(name)) {
            $('#item-name').css('border', '3px solid green');
            $('#item-name-error').text('');
            let quantity = $('#item-quantity').val();
            if (regExItemQuantity.test(quantity)) {
                $('#item-quantity').css('border', '3px solid green');
                $('#item-quantity-error').text('');
                let price = $('#item-price').val();
                if (regExItemPrice.test(price)) {
                    $('#item-price').css('border', '3px solid green');
                    $('#item-price-error').text('');
                    itemValidation(true);
                } else {
                    $('#item-price').css('border', '3px solid red');
                    $('#item-price-error').text('Wrong... format : 0.00');
                    itemValidation(false);
                }
            } else {
                $('#item-quantity').css('border', '3px solid red');
                $('#item-quantity-error').text('Wrong... format : Only Numbers');
                itemValidation(false);
            }
        } else {
            $('#item-name').css('border', '3px solid red');
            $('#item-name-error').text(
                'Wrong... format :Minimum 3,Max 50 Space Allowed'
            );
            itemValidation(false);
        }
    } else {
        $('#item-code').css('border', '3px solid red');
        $('#code-error').text('Wrong... format :I00-000');
        itemValidation(false);
    }
}


//-----------------------------------Enable or Disable save button------------------------------------------------------
$('#button-save-item').attr('disabled', true);

function itemValidation(value) {
    if (value) {
        $('#button-save-item').attr('disabled', false);
    } else {
        $('#button-save-item').attr('disabled', true);
    }
}


//--------------------------------------- Prevent focusing by Tab-------------------------------------------------------
$('#item-code,#item-name,#item-quantity,#item-price').on(
    'keydown',
    function (event) {
        if (event.key == 'Tab') {
            event.preventDefault();
        }
    }
);

//-----------------------------------------Focus next input fields------------------------------------------------------
$('#item-code').keydown(function (event) {
    if (event.key == 'Enter') {
        $('#item-name').focus();
    }

    if (event.key == 'Control') {
        var code = $('#item-code').val();
        searchItem(code);
    }
});

$('#item-name').keydown(function (event) {
    if (event.key == 'Enter') {
        $('#item-quantity').focus();
    }
});

$('#item-quantity').keydown(function (event) {
    if (event.key == 'Enter') {
        $('#item-price').focus();
    }
});

//----------------------Load Item Details To Table when press the Enter Key-----------------------------------------
$('#item-price').keydown(function (event) {
    $('#item-table tbody tr').off();
    if (event.key == 'Enter') {
        saveItem();
    }
});
