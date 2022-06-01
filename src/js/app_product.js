
var tab_title = $('#tabTitle .list');
var content = $('#content .list');
tab_title.click(function(){    
    if(!$(this).hasClass('active')){
        tab_title.removeClass('active');
        content.removeClass('active');
        const i = $(this).index();
        $(this).addClass('active');
        content.eq(i).addClass('active');
    }
});
const queryStr = location.search;
const id = queryStr.split('=')[1];
console.log(id);
if(id == 'calTpp'){
    getData("/api/product/caltpp/get");
}else if (id == 'phaseField') {
    getData("/api/product/xc/get");
}else{
    getData("/api/product/get",id);
}
//type-4 国外软件  5-其他产品
function getData(url,ids){
    var url2 ;
    if(ids){
        url2 = url + '?id=' + ids;
    }else{
        url2 = url;
    }
    $.ajax({
        url: url2,
        dataType: "json",
        type: 'get',
        success: function(res){
            $("#productName").text(res.data.name);
            $('#intro2').html(res.data.introduction);
            $('#function').html(res.data.coreFunction);
            $('#adv').html(res.data.advantage);
            $('#purchase').html(res.data.purchase);
            if (res.data.type == 5) {
                
                $("#introWord").text('产品简介');
            }
        }
    });
}
