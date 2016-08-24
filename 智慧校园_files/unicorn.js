// 左侧导航当前时间
function getCurrentTime(date, wrap_width_map) {
  var month = date.getMonth() + 1
    , d = date.getMinutes()
    , s = date.getSeconds();
  if (d < 10) {
    d = '0' + d;
  }
  if (s < 10) {
    s = '0' + s;
  }
  var dateString = wrap_width_map ? "" : '<p style="margin:0;">' + date.getFullYear() + '年' + month + '月' + date.getDate() + '日' + '</p>',
    html = dateString + '<p style="margin:0;">' + date.getHours() + ':' + d + ':' + s + '</p>';

  return html;
}
function current_time() {
  var wrap_width_map = false
    , root
    , $datetime = $('#menu_left_date')
    , html = ""
    , dt = $datetime.data("datetime");
  if ($datetime.length === 0) return;
  // ,date = new Date($datetime.data("datetime"))
  var date = new Date(), d = dt.split("T")[0], dd = d.split("-")
    , t = dt.split("T")[1].substring(0, dt.split("T")[1].length - 1)
    , tt = t.split(":");
  date.setUTCFullYear(dd[0], Math.max(0, parseInt(dd[1]) - 1), dd[2]);
  date.setUTCHours(tt[0], tt[1], tt[2]);

  if (typeof $datetime.get(0).createShadowRoot !== "undefined") {
    root = $datetime.get(0).createShadowRoot();
  } else {
    root = $datetime.get(0);
  }
  if ($("body").hasClass("wrap_width_map")) wrap_width_map = true;
  root.innerHTML = getCurrentTime(date, wrap_width_map);
  setInterval(function () {
    var time = date.getTime() + 1000;
    date.setTime(time);
    root.innerHTML = getCurrentTime(date, wrap_width_map);
  }, 1000);
}

$(document).ready(function () {
  $(window).on("message", function (e) {
    var event = e.originalEvent;

    var reg = /^\[xjgreat\](\{(([\w\W])+)\})/;
    //如果是设置xjgreat的message，再进行处理
    if (reg.test(event.data)) {
      //event.data的格式为"[xjgreat]{"minHeight":647}"
      var xjgreatData = JSON.parse(event.data.match(reg)[1]);

      var h = xjgreatData.minHeight, origin = event.origin;
      var bodyFirstChild = $("div:first");
      console.log(h);
      console.log(event.data);
      // console.log(origin);
      console.log(bodyFirstChild.height());
      if (bodyFirstChild.height() < h) {
        //console.log(bodyFirstChild.height());
        //console.log(bodyFirstChild.children(".app_list_wrap").css("min-height"));
        //处理主页,10是padding的值
        var h2 = h - 10;
        bodyFirstChild.children(".app_list_wrap").css('min-height', h2);
        //处理无三级菜单页面(电子资源分析|图书馆)
        var h3 = h2 - 10;
        bodyFirstChild.children(".box-con.home_page_bg").css('min-height', h3);
        bodyFirstChild.children(".home_page_content.posFooter").css('min-height', h3);
        //处理有.analy-com.home_page_bg导航条的页面(图书馆-图书收藏--图书分类与专业统计(人均收藏统计|藏书类型统计))等页面
        var h4 = h3 - bodyFirstChild.children(".analy-comm.home_page_bg").height();
        bodyFirstChild.children(".share-box.share-border").css('min-height', h4);
        //处理失联预警--历史预警
        var h5 = h3 - bodyFirstChild.children(".home_page_menu.home_page_bg").height();
        bodyFirstChild.children(".content_right").children(".home_page_con.home_page_bg").css('min-height', h5);
        //舆情分析--我的检测--舆论主题
        var h6 = h5 - 10;
        bodyFirstChild.children(".content.posFooter").children(".posFooter2").css('min-height', h6);
      }
    } else {
      return;
    }

  });


  /*这种方法是在主页面处理的子页面，不合理，故放弃掉，改为上面的实现方式
   $(window).on('message', function (e) {
   //父页面传回来的iframe区域的最小值
   var h = e.currentTarget.h;
   console.log($(".app_list_wrap")[0]);
   //console.log(e);
   //设置iframe的min-height，其实不需要，就注释了
   //$("div.app-wraper").children().css('min-height', h);
   // try {

   var ifr = document.getElementsByTagName('iframe')[0];
   // console.log(ifr);
   if (!ifr)return;
   console.log($(".app_list_wrap")[0]);
   var ifrDoc = ifr.contentWindow.document || ifr.document;
   // console.log(ifrDoc);
   var iFrameBody = ifrDoc.getElementsByTagName('body')[0];
   /!*      console.log($(iFrameBody).height());
   console.info(h);*!/
   if ($(iFrameBody).height() < h) {
   // console.log("执行了1");
   // $(iFrameBody).css('height', h);
   var iFrameBodyFirstChild = $(iFrameBody).children("div").first();
   if (iFrameBodyFirstChild.height() < h) {

   //处理主页,10是padding的值
   var h2 = h - 10;
   iFrameBodyFirstChild.children(".app_list_wrap").css('min-height', h2);
   //处理无三级菜单页面(电子资源分析|图书馆)
   var h3 = h2 - 10;
   iFrameBodyFirstChild.children(".box-con.home_page_bg").css('min-height', h3);
   iFrameBodyFirstChild.children(".home_page_content.posFooter").css('min-height', h3);
   //处理有.analy-com.home_page_bg导航条的页面(图书馆-图书收藏--图书分类与专业统计(人均收藏统计|藏书类型统计))等页面
   var h4 = h3 - iFrameBodyFirstChild.children(".analy-comm.home_page_bg").height();
   iFrameBodyFirstChild.children(".share-box.share-border").css('min-height', h4);
   //处理失联预警--历史预警
   var h5 = h3 - iFrameBodyFirstChild.children(".home_page_menu.home_page_bg").height();
   iFrameBodyFirstChild.children(".content_right").children(".home_page_con.home_page_bg").css('min-height', h5);
   //舆情分析--我的检测--舆论主题
   var h6 = h5 - 10;
   iFrameBodyFirstChild.children(".content.posFooter").children(".posFooter2").css('min-height', h6);
   }
   // console.log("执行了2");
   }
   /!*} catch (e) {
   //console.log(e);
   }*!/


   });*/

  // current_time();
  // var $content_all = $("#content_all");
  //    $content_all.height($content_all.height());
  /* user name dropdown menu */
  $nameDropdown = $(".zicd");
  $(".top_name").on("click", function (e) {

    e.preventDefault();
    if ($nameDropdown.is(":hidden")) {
      $nameDropdown.show();
    } else {
      $nameDropdown.hide();
    }
    $(document).one("click", function () {

      $nameDropdown.hide();
    });
    e.stopPropagation();
  });
  // $nameDropdown.on("click", function(e){
  // 	e.stopPropagation();
  // });

  // === Sidebar navigation === //

  $('.submenu > a').click(function (e) {
    e.preventDefault();
    var submenu = $(this).siblings('ul');
    var li = $(this).parents('li');
    var submenus = $('#sidebar li.submenu ul');
    var submenus_parents = $('#sidebar li.submenu');
    if (li.hasClass('open')) {
      if (($(window).width() > 768) || ($(window).width() < 479)) {
        submenu.slideUp();
      } else {
        submenu.fadeOut(250);
      }
      li.removeClass('open');
    } else {
      if (($(window).width() > 768) || ($(window).width() < 479)) {
        submenus.slideUp();
        submenu.slideDown();
      } else {
        submenus.fadeOut(250);
        submenu.fadeIn(250);
      }
      submenus_parents.removeClass('open');
      li.addClass('open');
    }
  });

  var ul = $('#sidebar > ul');

  $('#sidebar > a').click(function (e) {
    e.preventDefault();
    var sidebar = $('#sidebar');
    if (sidebar.hasClass('open')) {
      sidebar.removeClass('open');
      ul.slideUp(250);
    } else {
      sidebar.addClass('open');
      ul.slideDown(250);
    }
  });

  // === Resize window related === //
  $(window).resize(function () {
    if ($(window).width() > 479) {
      ul.css({'display': 'block'});
      $('#content-header .btn-group').css({width: 'auto'});
    }
    if ($(window).width() < 479) {
      ul.css({'display': 'none'});
      fix_position();
    }
    if ($(window).width() > 768) {
      $('#user-nav > ul').css({width: 'auto', margin: '0'});
      $('#content-header .btn-group').css({width: 'auto'});
    }
  });

  if ($(window).width() < 468) {
    ul.css({'display': 'none'});
    fix_position();
  }
  if ($(window).width() > 479) {
    $('#content-header .btn-group').css({width: 'auto'});
    ul.css({'display': 'block'});
  }

  // === Tooltips === //
  $('.tip').tooltip();
  $('.tip-left').tooltip({placement: 'left'});
  $('.tip-right').tooltip({placement: 'right'});
  $('.tip-top').tooltip({placement: 'top'});
  $('.tip-bottom').tooltip({placement: 'bottom'});

  // === Search input typeahead === //
  $('#search input[type=text]').typeahead({
    source: ['Dashboard', 'Form elements', 'Common Elements', 'Validation', 'Wizard', 'Buttons', 'Icons', 'Interface elements', 'Support', 'Calendar', 'Gallery', 'Reports', 'Charts', 'Graphs', 'Widgets'],
    items: 4
  });

  // === Fixes the position of buttons group in content header and top user navigation === //
  function fix_position() {
    var uwidth = $('#user-nav > ul').width();
    $('#user-nav > ul').css({width: uwidth, 'margin-left': '-' + uwidth / 2 + 'px'});

    var cwidth = $('#content-header .btn-group').width();
    $('#content-header .btn-group').css({width: cwidth, 'margin-left': '-' + uwidth / 2 + 'px'});
  }

  // === Style switcher === //
  $('#style-switcher i').click(function () {
    if ($(this).hasClass('open')) {
      $(this).parent().animate({marginRight: '-=190'});
      $(this).removeClass('open');
    } else {
      $(this).parent().animate({marginRight: '+=190'});
      $(this).addClass('open');
    }
    $(this).toggleClass('icon-arrow-left');
    $(this).toggleClass('icon-arrow-right');
  });

  $('#style-switcher a').click(function () {
    var style = $(this).attr('href').replace('#', '');
    $('.skin-color').attr('href', 'css/unicorn.' + style + '.css');
    $(this).siblings('a').css({'border-color': 'transparent'});
    $(this).css({'border-color': '#aaaaaa'});
  });

});
