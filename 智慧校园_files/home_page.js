var $bg_img_set = $('.bg_img_set')
    , $new_bg_img = $('.new_bg_img')
    , $new_bg_top = $('.new_bg_top').height()
    , $new_bg_con = $('.new_bg_con').height()
    , $new_h = $new_bg_top + $new_bg_con
    , $bg_img_close = $('.bg_img_close')
    , $bg_img_upload = $('.bg_img_upload')
    , $img_upload_modal = $('#img_upload_modal')
    , $icon_triangle = $('.icon_triangle')
    , $bg_img_home = $(".bg_img_home")
    ;

$bg_img_set.click(function (e) {
    var $this = $(this);
    e.preventDefault();
    $new_bg_img.animate({height: $new_h}, 500);
    $this.addClass('set_active');
    $icon_triangle.show();
});

$bg_img_close.click(function (e) {
    e.preventDefault();
    $new_bg_img.animate({height: 0}, 500);
    $bg_img_set.removeClass('set_active');
    $icon_triangle.hide();
    var img_url = $("#current_bg").find('img').attr('src')
    $.backstretch(img_url);
});

	$bg_img_upload.click(function(e){
		e.preventDefault();
		$img_upload_modal.modal();
	});
	$bg_img_home.on("click",function(){
		$("#apps").prop("src","/home_page/home");
	});
draggable($(".wheel-button").get(0));

$(".wheel-button").wheelmenu({
    trigger: "click",
    animation: "fly",
    animationSpeed: "fast"
});

$("#back_bg_pic").on('click', "li", function () {
    var $this = $(this);
    $("#back_bg_pic li").removeClass('active');
    $this.addClass('active');
//   var img = $("#back_bg_pic li.active").
    var img_url = $this.find('img').data('path');
    $.backstretch(img_url);
});

$(".bg_img_submit").on('click', function () {
    var img = $("#back_bg_pic li.active").find('img'), img_url = img.data('path');
    $.backstretch(img_url);
    $.ajax({
        url: '/home_page/change_user_bg_img',
        data: {img_url: img_url}
    }).done(function () {
    });
    $new_bg_img.animate({height: 0}, 500);
    $bg_img_set.removeClass('set_active');
    $icon_triangle.hide();
});
function body_scroll() {
    return $('body').scrollTop();
}


/*function posFooter( hHeader, hFooter, adjustValue) {
    /!**
     *method:
     * 用于解决<iframe>框架被render之后，footer的位置不能保持在页面底部
     *use:
     * 将这个代码在每个被render的页面进行执行，配合iframeResizer.js使用
     *
     *param:
     * @selector[String]:最外层的元素的选择器---必选参数
     * @hHeader[Number]:头部的高
     * @hFooter[Number]:底部的高
     * @adjustValue[Number]:微调数值
     *return:
     * [Boolean]
     *!/
    //检测有没有传入选择器，如果没有传入，则方法不执行直接跳出

    //if (selector == undefined) return false;
    var hAll = document.documentElement.clientHeight || document.body.clientHeight,
    //hAll:页面高度
        hHeader = parseFloat(hHeader) || 50,
        hFooter = parseFloat(hFooter) || 65,
        adjustValue = parseFloat(adjustValue) || 5,
    //h:保证footer在最底部的iframe的最小高度
        h = hAll - hHeader - hFooter - adjustValue;
    //动态设置给iframe最外层的元素,用这样的方式设置，改变的元素是唯一的，因为通过jq获取到的是一组元素
    var _h=_h?_h:h;
    var _h2=_h;
    var iframe0=document.getElementsByTagName('iframe')[0];

    var ifrDoc=iframe0.contentWindow.document||iframe0.document;

    var s=$(ifrDoc).children().children('body').children(":first").children(".pos-footer");

    if (s){
        if(s.prev()){
           _h2-=s.prev().height();
        }
        s.css('minHeight', _h2 );
        iframe0.style.height=_h+"px";
        return true;
    } else {
        console.error("没有render页面");
        return false;
    }
}*/

var hAll = document.documentElement.clientHeight || document.body.clientHeight;

var h=hAll-$(".head_wrap").height()-$(".foot_wrap")[0].offsetHeight-5;

//console.log(h); 

var messageH='[xjgreat]{"minHeight":'+h+'}';
$(window.frames["post_iframe"]).on("load change",function(){
window.frames["post_iframe"].postMessage(messageH,'*');
});

// $(document).ready(function(){
iFrameResize({checkOrigin:false,log:true,initCallback:function(){
    window.frames["post_iframe"].postMessage(messageH,'*');
}});
// });



