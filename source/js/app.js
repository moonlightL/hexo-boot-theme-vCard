;(function($) {

    let APP = {
        plugins: {
            highlight: {
                js: baseLink + "/source/js/highlightjs/highlight.pack.js"
            },
            lazyLoad: {
                js: baseLink + "/source/js/jquery.lazyload.min.js"
            },
            share: {
                js: baseLink + "/source/js/overshare/js/social-share.min.js"
            }
        }
    };

    console.log("%c Theme." + themeName + " v" + version + " %c https://www.extlight.com/ ", "color: white; background: #e9546b; padding:5px 0;", "padding:4px;border:1px solid #e9546b;");

    $.ajaxSetup({
        cache: true
    });

    const optionEvent = function() {
        let $body = $("body");
        let $options = $('<div class="options animated fadeInRight" id="option"></div>');
        $body.append($options);

        let elements = [
            {"class": "search", "icon": "fa fa-search", "title": "搜索"}
        ];

        let htmArr = [];
        for (let i = 0; i < elements.length; i++) {
            let ele = elements[i];
            htmArr.push('<div class="option-item '+ ele.class +'" title="'+ele.title+'"> <i class="' + ele.icon+'"></i> </div> ');
        }

        $options.append(htmArr.join(""));

        let $iframe = $('<div id="modal-iframe" class="iziModal light"></div>');
        $body.append($iframe);

        $("#modal-iframe").iziModal({
            iframe: true,
            headerColor: "rgb(92,115,236)",
            title: '<i class="fa fa-search"></i> 站内搜索' ,
            width: 620,
            iframeHeight: 360,
            iframeURL: "/search/"
        });

        $(".options .search").off("click").on("click", function() {
            $('#modal-iframe').iziModal('open');
        });

    };

    const loadLazy = function() {
        $.getScript(APP.plugins.lazyLoad.js, function(e) {
            $("img.lazyload").lazyload({
                placeholder : baseLink + "/source/images/loading.jpg",
                effect: "fadeIn"
            });
        })
    };

    const postEvent = function() {
        let $detail = $("#post-content");
        if ($detail.length > 0) {
            $.getScript(APP.plugins.highlight.js, function () {
                document.querySelectorAll('figure span').forEach((block) => {
                    hljs.highlightBlock(block);
                });
            });

            // 点赞
            $("#priseBtn").on("click",function () {
                let postId = $(this).data("id");
                let key = "post-hasPrize" + postId;
                if (sessionStorage.getItem(key)) {
                    layer.msg("已点赞");
                    return;
                }

                $.post("/praisePost/" + postId, null, function (resp) {
                    if (resp.success) {
                        $("#prizeCount").text(resp.data);
                        sessionStorage.setItem(key, "y");
                        layer.msg("谢谢点赞");
                    }
                },"json");

            });

            // 打赏
            $("#showRewardImg").on("click", function () {
                let rewardImgArea = $("#rewardImgArea");
                if (rewardImgArea.hasClass("hide")) {
                    rewardImgArea.removeClass("hide");
                    rewardImgArea.slideDown("slow");
                } else {
                    rewardImgArea.addClass("hide");
                    rewardImgArea.slideUp("slow");
                }
            });

            // 分享
            $.getScript(APP.plugins.share.js);
        }
    };

    const dynamicEvent = function() {
        let $dynamic = $("#dynamic-content");
        if ($dynamic.length > 0) {
            $(".praise").off("click").on("click",function () {
                let that = this;
                let id = $(this).data("id");
                let key = "dynamic-hasPrize" + id;
                if (sessionStorage.getItem(key)) {
                    layer.msg("已点赞");
                    return;
                }

                $.post("/praiseDynamic/" + id, null, function (resp) {
                    if (resp.success) {
                        $(that).find(".praise-num").text(resp.data);
                        $(that).find(".fa").css("color", "red");
                        sessionStorage.setItem(key, "y");
                        layer.msg("点赞成功");
                    }
                },"json");

            });
        }
    };

    let scrollIndicator = function() {
        $(window).on('scroll', function() {
            let wintop = $(window).scrollTop(), docheight =
                $(document).height(), winheight = $(window).height();
            let scrolled = (wintop/(docheight-winheight))*100;
            $('.scroll-line').css('width', (scrolled + '%'));
        });
    }

    let scrollToTop = function() {
        let $backToTop = $('.back-to-top'),
            $showBackTotop = $(window).height();

        $backToTop.hide();


        $(window).scroll( function() {
            let windowScrollTop = $(window).scrollTop();
            if( windowScrollTop > $showBackTotop ) {
                $backToTop.fadeIn('slow');
            } else {
                $backToTop.fadeOut('slow');
            }
        });

        $backToTop.on('click', function (e) {
            e.preventDefault();
            $(' body, html ').animate( {scrollTop : 0}, 'slow' );
        });
    };

    let checkPreloader = function() {
        setTimeout(function() {
            $(".preloader").hide();
        }, 800);
    };


    let clipboardEvent = function() {
        let clipboard = new ClipboardJS('.social-way');
        clipboard.on('success', function(e) {
            layer.msg("复制成功");
            e.clearSelection();
        });
    };

    $(function() {
        scrollIndicator();
        scrollToTop();
        optionEvent();
        loadLazy();
        dynamicEvent();
        postEvent();
        clipboardEvent();
        checkPreloader();
    });
})(jQuery);