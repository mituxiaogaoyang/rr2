import {indexNews} from './mock.js';
//大图轮播
var swiper = new Swiper('#swiper1', {
    pagination: '#pager1',
    paginationClickable: true,
    autoplay: 6000,
    loop: true,
});
//小轮播
var swiper2 = new Swiper('#swiper2', {
    pagination: '#pager2',
    paginationClickable: true,
    autoplay: 4000,
    loop: true,
});
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

//start
var html2 = $("#tmplNews2").render(indexNews);
console.log(html2);
$("#newsLists").html(html2);
// $.ajax({ //新闻
//     url:"/api/news/query?page=1&pageSize=5",
//     dataType: "json",
//     type: 'get',
//     success: function(res){
//         var html = $("#tmplNews").render(res);
//         var html2 = $("#tmplNews2").render(res);
//         $("#newsImgs").html(html);
//         $('#newsImgs .list').first().addClass('inside');
        
//         $("#newsLists").html(html2);
//     }
// });

$.ajax({//公司介绍
    url:"/api/company/info",
    dataType: "json",
    type: 'get',
    success: function(res){
        var data =res.data;
        $("#oneWord").text(data.introduce);
        $("#productWord").text(data.product);
        $("#serviceWord").text(data.service);
        $("#bannerImg").attr('src',data.guidePic);
    }
});
