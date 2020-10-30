let GuestBookManager = (function ($) {

    let GuestBookManager = {
        init: function (nickname) {
            let flag = false;
            let $footer = $("#footer-copyright");
            let top = parseInt($footer.offset().top);
            let winHeight = $(window).height();
            if (top > winHeight) {
                $(window).scroll(function(e) {
                    let scrollTop = $(this).scrollTop();
                    if (!flag && (winHeight + scrollTop >= top)) {
                        // 获取留言列表
                        flag = true;
                        GuestBookManager.initComment(nickname);
                    }
                });
            } else {
                GuestBookManager.initComment(nickname);
            }
        },
        initComment: function (nickname) {
            $("#comment-container").BeautyComment({
                title: "留言",
                subTitle: "最新留言",
                bloggerName: nickname,
                baseUrl: "/admin/assets/custom/",
                listUrl: "/guestBookList.json",
                sendUrl: "/auth/sendGuestBook.json",
                wrapClass: "",
                ajaxParams: {pageNum: 1, pageSize: 10},
                listHandler: function (resp) {
                    return {
                        totalNum: resp.data.totalNum,
                        commentList: resp.data.commentList,
                        commentShowType: resp.data.commentShowType
                    }
                },
                sendHandler: function (resp) {
                    return {
                        success: resp.success,
                        message: resp.message
                    };
                }
            });
        }
    };

    return {
        init: GuestBookManager.init
    }

})(jQuery);