$(document).ready(function(){
    $(window).scroll(function() {
        if ($(window).scrollTop()>60){
            
            $('#logo').addClass('logo_tiny');
        }else{
            $('#logo').removeClass('logo_tiny');
        }
    })
});
var href = location.href;
$('.navs a').each(function(){
    const aLinks = $(this).attr('href').split('/')[1];
    if(aLinks && href.indexOf(aLinks)>0){
        $(this).addClass('active');
    }
});
$("#show_nav").click(function(){
    $('#headerRr').slideDown();
})
$('#x_nav').click(function(){
    $('#headerRr').slideUp();
})
$.ajax({
    url:"/api/contact/us/get",
    dataType: "json",
    type: 'get',
    success: function(res){
        var data = res.data;
        //$("#qq").attr('href','tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin='+data.qq).text(data.qq);
        $("#erweimaFooter").attr('src',data.officiaAccountQrCode);
    }
});
