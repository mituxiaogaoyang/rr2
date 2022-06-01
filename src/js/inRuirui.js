
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
function getList(url,domTmp, domList, page, pageSize,callback,isFirst) {
    $.ajax({ //知识产权
        url: url + "?page="+page+"&pageSize="+pageSize,
        dataType: "json",
        type: 'get',
        success: function (res) {
            if (res.page === 1 && res.totalCount && isFirst) {
                callback(res.totalCount);
            }
            if (res.totalCount){
                var html = $(domTmp).render(res);
                $(domList).html(html);
            }
            
        }
    });
}
function initPager(totalCount,dom, pageSize, callback) {
    dom.pagination({
        totalData: totalCount,
        showData: pageSize,
        coping: true,
        callback: callback,
    })
}
function pageselectCallback(obj, url, domTmp, domList, pageSize) {
    var page = obj.getCurrent();
    getList(url, domTmp, domList, page, pageSize);
}
