var selectedGroup = '';
var selectedElements = [];
var objRender = {selectedElements:[]}
// generate element block
function genEl(e, container) {

    var c = e.group.toLowerCase().split(' ');

    var html = $('<a class="element"></a>').addClass(c[0]);

    if (c[1] && c[1] != 'innerborder') html.addClass(c[1]);
    if (e.number == 1) html.addClass('nonmetal');
    if (e.molar) html.attr('href', 'javascript:void(0)');

    if (e.molar) {
        html.attr('id', 'el' + e.number)
            .attr('title', e.name)
            .append('<span class="id">' + e.number + '</span>')
            .append('<span class="symbol">' + e.small + '</span>')
            // .append('<span class="mass">' + parseFloat(e.molar).toFixed(3) + '</span>');
    } else {
        html.attr('id', 'el' + e.small)
            .append('<span class="id">' + e.small + '</span>');
    }

    container.append(html);
}

// add clearfix
function clearfix(container) {
    container.append('<div class="clearfix"></div>');
}

// on mouseenter > hide other groups
// $('body').on('mouseenter', '.element', function() {

//     var c = $(this).attr('class');

//     if (c != selectedGroup) {
//         selectedGroup = c;

//         $('body').find('.element').each(function() {
//             if ($(this).attr('class') != c) {
//                 $(this).addClass('transp');
//             } else {
//                 console.log($(this).attr('class'), c);
//             }
//         });
//     }
// });

// // on mouseleave > clear transparency
// $('body').on('mouseleave', '.element', function(e) {

//     var c = $(this).attr('class');

//     if (c != $(e.toElement).attr('class') || !$(e.toElement).hasClass('element')) {

//         selectedGroup = '';

//         $('.element')
//             .removeClass('focus')
//             .removeClass('transp');
//     }
// });

// get JSON data
$.getJSON('js/periodicTable.json', function(data) {
    //https://wow.techbrood.com/uploads/150601/periodicTable.json
    console.log($('#table'));

    // build main table
    for (var i = 0; i < data.table.length; i++) {
        for (var j = 0; j < data.table[i].elements.length; j++) {
            genEl(data.table[i].elements[j], $('#table'));
        }
        clearfix($('#table'));
    }

    // build lanthanoids table
    for (var i = 0; i < data.lanthanoids.length; i++) {
        genEl(data.lanthanoids[i], $('#table-lanthanoids'));
    }
    clearfix($('#table-lanthanoids'));

    // build actinoids table
    for (var i = 0; i < data.actinoids.length; i++) {
        genEl(data.actinoids[i], $('#table-actinoids'));
    }
    clearfix($('#table-actinoids'));
});

$('body').on('click', '.element', function(e) {
    var _this = $(this);
    var wordsBox = $("#selected"), words;
    var element = _this.children('.symbol').text();
    if(_this.hasClass('selected')){
        for(var i= 0,len= selectedElements.length;i<len;i++){
            if(selectedElements[i] === element){
                selectedElements.splice(i,1);
                _this.removeClass('selected');
                words = selectedElements.join(',');
                wordsBox.text(words);
            }
        }
        
    }else{
        
        _this.addClass('selected');
        selectedElements.push(element);
        words = selectedElements.join(',');
        wordsBox.text(words);
    }
    if(words){
        $.ajax({ 
            url:"/api/element/query/get?elementCodes="+words,
            dataType: "json",
            type: 'get',
            success: function(res){
                
                $("#fileNum").text(res.data.length);
                var html = $("#tmplFiles").render(res);
                $("#fileList").html(html);
            }
        });
    }else{
        $("#fileList").html('');
    }
    
});
var domMask = $('#window-mask');
var domPop = $('#upgrade-dlg');//购买弹框
var domInfo = $('#userInfo'); //用户信息弹框
var downloadId, orderCode, timer, priceOrder=0;
var listsId = [];
function download(id,price){
    if(id){
        downloadId = id;
        priceOrder = price;
    }else{
        downloadId = listsId.join(',');
    }
    domMask.fadeIn();
    domInfo.fadeIn();
    $(".priceBox").text('￥' + priceOrder);
}
$('#xPop').click(() =>{
    domMask.fadeOut();
    domPop.fadeOut();
    domInfo.fadeOut();
})
$('.price-paytype').click(function(){
    $('.price-paytype').removeClass('ac');
    $(this).addClass('ac');
})
$('#infoSubBtn').click(submitInfo);
function submitInfo(){
    var userName = $('#userName').val();
    var userCompany = $('#userCompany').val();
    var userEmail = $('#userEmail').val();
    if (userName && userCompany && userEmail ){
        var params = {
            userName: userName,
            companyAddress: userCompany,
            email: userEmail,
            fileResourceIds: downloadId,
        };
        $.ajax({
            url: "/api/order/pre",
            dataType: "json",
            data: params,
            type: 'post',
            success: function (res) {
                orderCode = res.data;
                localStorage.setItem('orderCode',orderCode);
                $('.orderCode').text(orderCode);
                domPop.fadeIn();
                domInfo.fadeOut();
                domPop.fadeIn();
            }
        });
    }else{
        alert('请填完所有内容')
    }
}
//去支付
var payType;
$('#payBtn').click(function(){
    var domCurrent = $('.dlg-item').find('.ac');
    var payM = domCurrent.hasClass('alipay')?'ali':'wechat'; //支付选择
    var u = navigator.userAgent, app = navigator.appVersion;
    var isMobile = !!u.match(/AppleWebKit.*Mobile.*/);
    
    if (domCurrent.hasClass('alipay')){
        if (isMobile) payType = 2;
        else payType = 1;
    } else if (domCurrent.hasClass('wechat')) {
        if (isMobile) payType = 4;
        else payType = 3;
    }else{
       $('#forPubPop').fadeIn();
       return;
    }
    console.log('支付'+orderCode)
    var params = {
        orderCode: orderCode,
        payType: payType, //1-ali-pc  2-ali-moblie  3-wechat-pc 4-wechat-mobile
    };
    $.ajax({
        url: "/api/order/pay",
        dataType: "json",
        data: params,
        type: 'post',
        success: function (resp) {
            if (payType===1){
                var div = document.createElement('divform');
                div.innerHTML = resp.data;
                document.body.appendChild(div);
                //document.forms[0].acceptCharset = 'GBK'; //保持与支付宝默认编码格式一致，如果不一致将会出现：调试错误，请回到请求来源地，重新发起请求，错误代码 invalid-signature 错误原因: 验签出错，建议检查签名字符串或签名私钥与应用公钥是否匹配
                document.forms[0].submit();
            }else if (payType===3){
                $("#payimg").html('');
                $("#qrBox").fadeIn();
                new QRCode($('#payimg')[0], {
                    text: resp.data,
                    width: 170,
                    height: 170,
                })
                timer = setInterval(function() {
                    queryOrderPay();
                }, 1000);
            }else if (payType===2){
                var div = document.createElement('formdiv');
                div.innerHTML = resp.data;
                document.body.appendChild(div);
                document.forms[0].setAttribute('target', '_self');
                document.forms[0].submit();
                div.remove();
            }else if (payType===4){
                window.open(resp.data,'_self')
            }
            
        }
    });return

})
$('.dialog-close').click(function () {
    $(this).parent().fadeOut();
    domMask.fadeOut();
    if($(this).hasClass('wx')){
        clearInterval(timer);
    }
})
function queryOrderPay(){
    $.ajax({
        url: "/api/order/get?orderCode="+orderCode,
        dataType: "json",
        type: 'get',
        success: function (res) {
            
            if(res.data.status){
                clearInterval(timer);
                if (payType===3){//wx-pc
                    var origin = window.location.origin;
                    window.location.href=origin +"/orderResult.html";
                }
                //alert('已支付')
            }
        }
    });
}

function checkList(eve,id,price){ 
    var bool = $(eve).is(':checked');
    if(bool){
        listsId.push(id);
        priceOrder = priceOrder +price;
    }else{
        listsId = listsId.filter(item => item !== id);
        priceOrder = priceOrder - price;
    }
    if(listsId.length){
        $('#downBtn').fadeIn();
    }else{
        $('#downBtn').fadeOut();
    }
    
}


