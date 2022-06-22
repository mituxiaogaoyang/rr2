
//获取轮播图
getBanners(1); //上部
getBanners(2);
function getBanners(type){
    $.ajax({ //公司介绍
        url: "/api/index/pic/list?type=" + type,
        dataType: "json",
        type: 'get',
        success: function (res) {
            var dataList = res.data;
            console.log("#tmplBanner" + type)
            var html = $("#tmplBanner" + type).render(res);
            console.log(dataList)
            $("#bannerBox"+type).html(html);
            var swiper = new Swiper('#swiper'+type, {
                pagination: '#pager'+type,
                paginationClickable: true,
                autoplay: 6000,
                loop: true,
            });
        }
    });
}

//news
$('#newsLists').on('mouseenter','.list',function(){ 
    if(!$(this).hasClass('in')){     
        $('#newsLists .list').removeClass('in');
        $('#newsImgs .list').removeClass('inside');
        const i = $(this).index();
        $(this).addClass('in');
        $('#newsImgs .list').eq(i).addClass('inside');
    }
});
//consult
const domInfo = $('#userInfo');
domInfo.animate({right:'1px'})
$('#iconConsult').on('mouseenter',function(){
    domInfo.animate({right:'1px'})
})
$('#xPop').on('click',function(){
    domInfo.animate({right:'-450px'})
})
$('#iconConsult').on('click',function(){
    domInfo.animate({right:'-450px'})
})
//start
$.ajax({ //新闻
    url:"/api/news/query?page=1&pageSize=6",
    dataType: "json",
    type: 'get',
    success: function(res){
        //var html = $("#tmplNews").render(res);
        res.items.forEach(item =>{
            item.createTime = formatDate(item.createTime);
        })
        var html2 = $("#tmplNews2").render(res);
        //$("#newsImgs").html(html);
        //$('#newsImgs .list').first().addClass('inside');
        
        $("#newsLists").html(html2);
    }
});
function formatDate(now) { 
    now = new Date(now);
    var year=now.getFullYear();  //取得4位数的年份
    var month=now.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
    var date=now.getDate();      //返回日期月份中的天数（1到31）
    // var hour=now.getHours();     //返回日期中的小时数（0到23）
    // var minute=now.getMinutes(); //返回日期中的分钟数（0到59）
    // var second=now.getSeconds(); //返回日期中的秒数（0到59）
    return year+"-"+month+"-"+date+" "; 
}
