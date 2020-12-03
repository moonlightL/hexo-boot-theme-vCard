let CommentManager = (function ($) {

    let CommentManager = {
        init: function (postId, comment) {
            let flag = false;
            let $footer = $("#footer-copyright");
            let top = parseInt($footer.offset().top);
            let winHeight = $(window).height();

            if (top > winHeight) {
                $(window).scroll(function(e) {
                    let scrollTop = $(this).scrollTop();
                    if (!flag && (winHeight + scrollTop >= top)) {
                        // 获取评论列表
                        flag = true;
                        CommentManager.initComment(postId, comment);
                    }
                });
            } else {
                CommentManager.initComment(postId, comment);
            }
            CommentManager.bindEvent(postId);
        },
        initComment: function (postId) {
            $("#comment-container").BeautyComment({
                title: "评论",
                subTitle: "最新评论",
                baseUrl: "/admin/assets/custom/",
                listUrl: "/commentList.json",
                sendUrl: "/auth/sendComment.json",
                wrapClass: "ml-content",
                ajaxParams: {postId: postId, pageNum: 1, pageSize: 10},
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
        },
        bindEvent: function (postId) {
            // 点赞
            $("#priseBtn").on("click",function () {
                if (sessionStorage.getItem("hasPrize" + postId)) {
                    return;
                }

                $.post("/praisePost/" + postId, null, function (resp) {
                    if (resp.success) {
                        $("#prizeCount").text(resp.data);
                        sessionStorage.setItem("hasPrize" + postId, "y");
                    }
                },"json");

            });
        }

    };

    return {
        init: CommentManager.init
    }

})(jQuery);