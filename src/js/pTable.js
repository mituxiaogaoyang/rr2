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
    }
    
});
const domMask = $('#window-mask');
const domPop = $('#upgrade-dlg');//购买弹框
const domInfo = $('#userInfo'); //用户信息弹框
let downloadId, orderCode;
function download(id){
    downloadId = id;
    domMask.fadeIn();
    domInfo.fadeIn();
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
    const userName = $('#userName').val();
    const userCompany = $('#userCompany').val();
    const userEmail = $('#userEmail').val();
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
const aliPaySite = "http://112.126.61.9:8077/tpay/index"; //http://112.126.61.9:8077/tpay/pay
$('#payBtn').click(function(){
    const domCurrent = $('.dlg-item').find('.ac'); //orderCode
    const payM = domCurrent.hasClass('alipay')?'ali':'wechat'; //支付选择
    const u = navigator.userAgent, app = navigator.appVersion;
    const isMobile = !!u.match(/AppleWebKit.*Mobile.*/);
    var payType;
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
                const div = document.createElement('divform');
                div.innerHTML = resp.data;
                document.body.appendChild(div);
                //document.forms[0].acceptCharset = 'GBK'; //保持与支付宝默认编码格式一致，如果不一致将会出现：调试错误，请回到请求来源地，重新发起请求，错误代码 invalid-signature 错误原因: 验签出错，建议检查签名字符串或签名私钥与应用公钥是否匹配
                document.forms[0].submit();
            }
            
        }
    });return
    if (domCurrent.hasClass('wechat')){
        $.ajax({
            url: "/api/element/query/get?elementCodes=",
            dataType: "json",
            type: 'get',
            success: function (res) {
                $("#qrBox").fadeIn();
                new QRCode($('#payimg')[0], {
                    text: 'https: //www.baidu.com/',
                    width: 170,
                    height: 170,
                })
                setInterval(() => {
                    queryOrderPay();
                }, 1000);
            }
        });
    } else if (domCurrent.hasClass('alipay')){
        //window.location.href = aliPaySite;
    }else{
        $('#forPubPop').fadeIn();
    }

})
$('.dialog-close').click(function () {
    $(this).parent().fadeOut();
})
function queryOrderPay(){
    $.ajax({
        url: "/api/element/query/get?elementCodes=",
        dataType: "json",
        type: 'post',
        success: function (res) {
            if(res.isPay){
                console.log('已支付')
            }
        }
    });
}


