var baseUrlCustomer="http://localhost:8080/SpringPOS_BackEnd-1.0.0/pos/v1/customer"
var baseUrlItem="http://localhost:8080/SpringPOS_BackEnd-1.0.0/pos/v1/item"
var baseUrlOrder="http://localhost:8080/SpringPOS_BackEnd-1.0.0/pos/v1/placeOrder"

populateItemDropDown();
populateCustomerDropDown();
//set the today date
document.getElementById('date').valueAsDate = new Date();

//populate customer drop down list
function populateCustomerDropDown() {
    var select = document.getElementById('cusID');
    $('#cusID').empty();
    var customerOptions = [];
    customerOptions[0] = 'Choose...';

    $.ajax({
        url:baseUrlCustomer+"/cusID",
        method:"GET",
        success:function (resp){
            for (var i=0;i<resp.data.length;i++) {
                customerOptions[i + 1] = resp.data[i];
            }
            for (var i = 0; i < customerOptions.length; i++) {
                var opt = customerOptions[i];
                var el = document.createElement('option');
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
        },
        error:function(ob){
            console.log(ob);
        }
    });
}


//populate item drop down list
function populateItemDropDown() {
    var select = document.getElementById('ItemCode');
    $('#ItemCode').empty();
    var itemOptions = [];
    itemOptions[0] = 'Choose...';

    $.ajax({
        url:baseUrlItem+"/itemCode",
        method:"GET",
        success:function (resp){
            for (var i=0;i<resp.data.length;i++) {
                itemOptions[i + 1] = resp.data[i];
            }
            for (var i = 0; i < itemOptions.length; i++) {
                var opt = itemOptions[i];
                var el = document.createElement('option');
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
        },
        error:function(ob){
            console.log(ob);
        }
    });
}

//load selected customer details
$('#cusID').on('change', function () {
    getSelectedCustomer();
});

function getSelectedCustomer() {
    customerSearch($('#cusID').val());
}

function customerSearch(id){
    $.ajax({
        url:baseUrlCustomer+"/"+id,
        method:"GET",
        success:function (resp) {
            if (resp.code == 200) {
                    $('#customer').val(resp.data.customerID);
                    $('#name').val(resp.data.customerName);
                    $('#address').val(resp.data.customerAddress);
                    $('#telNum').val(resp.data.customerTeleNumber);
                }
        },
            error:function(ob){
                console.log(ob);
            }
        });
}

//load selected item details
$('#ItemCode').on('change', function () {
    getSelectedItem();
    checkSufficientQuantity();
});


function getSelectedItem() {
    itemSearch($('#ItemCode').val());
}

function itemSearch(id){
    $.ajax({
        url: baseUrlItem+"/"+id,
        method:"GET",
        success:function (resp) {
            if (resp.code == 200) {
                    $('#item').val(resp.data.itemCode);
                    $('#itemName').val(resp.data.itemName);
                    $('#price').val(resp.data.unitPrice);
                    $('#quantityOnHand').val(resp.data.quantity);
            }
        },
        error:function(ob){
            console.log(ob);
        }
    });
}

//set order ID automatically

$.ajax({
    url: baseUrlOrder,
    method: "GET",
    success: function (res) {
        if (res.code == 200) {
            $("#orderID").val(res.data);
        }
    },
    error: function (ob) {
        alert(ob.responseJSON.message);
    }
});

//check if the quantity is sufficient
function checkSufficientQuantity() {
    $("#quantity").on('keyup', function () {
        if (+$("#quantityOnHand").val() >= +$("#quantity").val() && regExItemQuantity.test($("#quantity").val())) {
            $('#quantity').css('border', '3px solid green');
            $("#orderQuantity-error").text('');
            $("#btnAddItem").attr('disabled', false);
        } else {
            $('#quantity').css('border', '3px solid red');
            $("#orderQuantity-error").text("Please enter quantity lower than " + $("#quantityOnHand").val() + " or check Qunatity On Hand is sufficient");
            $("#btnAddItem").attr('disabled', true);
        }
    });
}

var cartArray =new Array();
var detailArray =new Array();

//add items to cart
$("#btnAddItem").on("click", function () {
     var oId=$("#orderID").val();
     var code = $("#item").val();
     var name = $("#itemName").val();
     var unitPrice = $("#price").val();
     var qty = $("#quantity").val();
     var totalPrice = (qty * unitPrice).toFixed(2);

     var item={
        code:code,
        name:name,
        unitPrice:unitPrice,
        qty :qty,
        tot:totalPrice
     }


   var detail={
       orderId:oId,
       itemCode:code,
       qty:qty,
       unitPrice:unitPrice,
       cost:totalPrice
   }

    if(cartArray.length!=0) {
         var resp= searchCart(code);
         var res= searchDetail(code);
         if(resp) {
                    let totalQty = +(resp.qty) + +qty;
                    let total = (totalQty * unitPrice).toFixed(2);

                    resp.code = code;
                    resp.name = name;
                    resp.unitPrice = unitPrice;
                    resp.qty = totalQty;
                    resp.tot = total;


                    res.itemCode = code;
                    res.orderId = oId;
                    res.unitPrice = unitPrice;
                    res.qty = totalQty;
                    res.cost = total;

                    loadCartDetailsToTable();

                    $("#quantity").val("");
                    removeItems();

                    setTotal();
                }else {
            cartArray.push(item);
            detailArray.push(detail);
            loadCartDetailsToTable();

            $("#quantity").val("");

            setTotal();

            removeItems();

        }
        }else{
         cartArray.push(item);
         detailArray.push(detail);
         loadCartDetailsToTable();

         $("#quantity").val("");

         setTotal();

        removeItems();
     }

});

//load cart details to the table
function loadCartDetailsToTable() {
    $('#cart tbody').empty();
    for (var i of cartArray) {
        $('#cart tbody').append(
            `<tr><td>${i.code}</td><td>${i.name}</td><td>${i.unitPrice}</td><td>${i.qty}</td><td>${i.tot}</td></tr>`
        );
    }
    removeItems();
}

//search cart
function searchCart(id) {
    for (var i = 0; i < cartArray.length; i++) {
        if (cartArray[i].code == id) {
            return cartArray[i];
        }
    }
}

function searchDetail(id) {
    for (var i = 0; i < detailArray.length; i++) {
        if (detailArray[i].itemCode == id) {
            return detailArray[i];
        }
    }
}

//calculate total
function setTotal() {
    var sumOfTotal = 0;
    for (var i = 0; i < cartArray.length; i++) {
        sumOfTotal = (+sumOfTotal + +cartArray[i].tot).toFixed(2);
    }
    $("#total").text(sumOfTotal);
    $("#sub-total").text(sumOfTotal);
}

//remove items from the cart
function removeItems() {
    $('#cart tbody tr').dblclick(function () {
        let code=($(this).children(":nth-child(1)").text());
        for (var i = 0; i < cartArray.length; i++) {
            if (cartArray[i].code == code) {
                cartArray.splice(i, 1);
                loadCartDetailsToTable();
                setTotal();
            }
        }
    });
}

//set the balance
$("#cash").on('keyup', function () {
    $("#balance").val(($("#cash").val()) - ($("#sub-total").text()));
    $('#cash').css(
        'border',
        'solid 2px #ced4da'
    );
    $("#credit-error").text('');
});

//calculate discount
$("#discount").on('keyup', function () {
    let discount = $("#discount").val();
    if (regExDiscount.test(discount)) {
        let price = +$("#sub-total").text() - +$("#sub-total").text() * (discount / 100);
        $("#sub-total").text(price);
        $("#balance").val(($("#cash").val()) - ($("#sub-total").text()));
        $('#discount').css('border', '3px solid green');
        $('#discount-error').text('');
    } else {
        $('#discount').css('border', '3px solid red');
        $('#discount-error').text('Wrong value entered as discount');
        $("#balance").val('');
        setTotal();
    }
});

//place order
$("#btn-purchase").on("click", function () {
    let sub = $("#sub-total").text();
    let cash = $("#cash").val();
    if (+sub > +cash) {
        $('#cash').css('border', '3px solid red');
        $("#credit-error").text('Insufficient Cerdit');
        swal("Insufficient Credit....Check the cash", "warning");
    } else {
        $('#cash').css(
            'border',
            'solid 2px #ced4da'
        );
        $("#credit-error").text('');


        var oId=$("#orderID").val();
        var cusId = $("#customer").val();
        var cusName=$("#name").val();
        var cusAddress=$("#address").val();
        var TeleNumber=$("#telNum").val();
        var date = $("#date").val();
        var discount = $("#discount").val();
        var total = $("#total").text();

        var customer={
            customerID:cusId,
            customerName:cusName,
            customerAddress:cusAddress,
            customerTeleNumber:TeleNumber
        }

        var order={
            orderId:oId,
            customerDTO:customer,
            orderDate:date,
            cost:total,
            discount:discount,
            detailList:detailArray
        }

        $.ajax({
            url: baseUrlOrder,
            method: "POST",
            contentType:"application/json",
            data: JSON.stringify(order),
            success: function (res) {
                if (res.code == 200) {

                    alert(res.message);

                    clearOrderDetail();

                    $("#orderID").val(res.data);

                    loadItemDetailsToTable();
                }
            },
            error: function (ob) {
                alert(ob.responseJSON.message);
            }
        });
    }
});

//clear data
function clearOrderDetail() {
    $('#orderID,#customer,#name,#address,#telNum,#item,#itemName,#quantityOnHand,#price,#cash,#discount,#balance').val('');
    $('#total,#sub-total').text('');
    $('#orderID,#customer,#name,#address,#telNum,#item,#itemName,#quantityOnHand,#price,#discount,#quantity').css(
        'border',
        'solid 2px #ced4da'
    );
    cartArray = [];
    loadCartDetailsToTable();
    $('#customer-error,#customer-name-error,#customer-address-error,#number-error,#item-error,#itemName-error,#qty-error,#price-error').text('');
}


//validate customer details
$('#customer,#name,#address,#telNum').on('keyup', function () {
    validateCustomerFeild();
});

function validateCustomerFeild() {
    let id = $('#customer').val();
    if (regExCusID.test(id)) {
        $('#customer').css('border', '3px solid green');
        $('#customer-error').text('');
        let name = $('#name').val();
        if (regExCusName.test(name)) {
            $('#name').css('border', '3px solid green');
            $('#customer-name-error').text('');
            let address = $('#address').val();
            if (regExCusAddress.test(address)) {
                $('#address').css('border', '3px solid green');
                $('#cus-address-error').text('');
                let teleNum = $('#telNum').val();
                if (regExTeleNumber.test(teleNum)) {
                    $('#telNum').css('border', '3px solid green');
                    $('#number-error').text('');
                } else {
                    $('#telNum').css('border', '3px solid red');
                    $('#number-error').text('Wrong... format : 000-0000000');
                }
            } else {
                $('#address').css('border', '3px solid red');
                $('#cus-address-error').text('Wrong... format : Minimum 7');
            }
        } else {
            $('#name').css('border', '3px solid red');
            $('#customer-name-error').text(
                'Wrong... format :Minimum 3,Max 50 Space Allowed'
            );
        }
    } else {
        $('#customer').css('border', '3px solid red');
        $('#customer-error').text('Wrong... format :C00-000');
    }
}

//validate item details
$('#item,#itemName,#price,#quantityOnHand').on('keyup', function () {
    validateItemField();
});

function validateItemField() {
    let code = $('#item').val();
    if (regExItemCode.test(code)) {
        $('#item').css('border', '3px solid green');
        $('#item-error').text('');
        let name = $('#itemName').val();
        if (regExItemName.test(name)) {
            $('#itemName').css('border', '3px solid green');
            $('#itemName-error').text('');
            let quantity = $('#quantityOnHand').val();
            if (regExItemQuantity.test(quantity)) {
                $('#quantityOnHand').css('border', '3px solid green');
                $('#qty-error').text('');
                let price = $('#price').val();
                if (regExItemPrice.test(price)) {
                    $('#price').css('border', '3px solid green');
                    $('#price-error').text('');
                } else {
                    $('#price').css('border', '3px solid red');
                    $('#price-error').text('Wrong... format : 0.00');
                }
            } else {
                $('#quantityOnHand').css('border', '3px solid red');
                $('#qty-error').text('Wrong... format : Only Numbers');
            }
        } else {
            $('#itemName').css('border', '3px solid red');
            $('#itemName-error').text(
                'Wrong... format :Minimum 3,Max 50 Space Allowed'
            );
        }
    } else {
        $('#item').css('border', '3px solid red');
        $('#item-error').text('Wrong... format :I00-000');
    }
}

//validate order id and order search field
const regExDiscount = /^[1-9][.]?[0-9]?[.]?([0-9]{0,2})?$/;
const regExOrderID = /^(O00-)[0-9]{3,4}$/;

$("#orderID").on('keyup', function () {
    validateOrderID();
});


$("#order-search").on('keyup', function () {
    validateOrderSearch();
});

function validateOrderID() {
    if (regExOrderID.test($("#orderID").val())) {
        $('#orderID').css('border', '3px solid green');
        $('#order-error').text('');
    } else {
        $('#orderID').css('border', '3px solid red');
        $('#order-error').text("Wrong... format :O00-000");
    }
}

function validateOrderSearch() {
    if (regExOrderID.test($("#order-search").val())) {
        $('#order-search').css('border', '3px solid green');
        $('#order-search-error').text('');
    } else {
        $('#order-search').css('border', '3px solid red');
        $('#order-search-error').text("Wrong... format :I00-000");
    }
}







