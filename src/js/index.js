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
//job
$('#jobLists').on('click','li .list_head',function(){ 
    
    if($(this).hasClass('down')){
        $(this).removeClass('down');
        $(this).next().slideUp();
    }else{
        $('#jobLists li .list_head').next().slideUp();
        $('#jobLists li .list_head').removeClass('down');
        $(this).addClass('down');
        $(this).next().slideDown();
    }
    
    
});
$.ajax({//招聘
    url:"/api/recruitment/query?page=1&pageSize=99",
    dataType: "json",
    type: 'get',
    success: function(res){
        var html = $("#tmplJobs").render(res);
        $("#jobLists").html(html);
    }
});
$.ajax({ //新闻
    url:"/api/news/query?page=1&pageSize=5",
    dataType: "json",
    type: 'get',
    success: function(res){
        var html = $("#tmplNews").render(res);
        var html2 = $("#tmplNews2").render(res);
        $("#newsImgs").html(html);
        $('#newsImgs .list').first().addClass('inside');
        
        $("#newsLists").html(html2);
    }
});
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
