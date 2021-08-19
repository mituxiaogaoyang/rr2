
var tab_title = $('#tabTitle .list');
var content = $('#content .list');
var tab1, tab2, tab3, tab4;
tab_title.click(function(){    
    if(!$(this).hasClass('active')){
        tab_title.removeClass('active');
        content.removeClass('active');
        const i = $(this).index();
        $(this).addClass('active');
        content.eq(i).addClass('active');
    }
});

function getData(url,id){
    $.ajax({//知识产权
        url:url,
        dataType: "json",
        type: 'get',
        success: function(res){
            $(id).html(res.data.content);
        }
    });
}
$.ajax({//公司介绍
    url:"/api/company/info",
    dataType: "json",
    type: 'get',
    success: function(res){
        var data =res.data;
        $("#bannerImg").attr('src',data.guidePic);
    }
});