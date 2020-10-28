let CommentManager = (function ($) {

    let CommentManager = {
        init: function (nickname, postId, comment) {
            CommentManager.initComment(nickname, postId, comment);
            CommentManager.bindEvent(postId);
        },
        initComment: function (nickname, postId, comment) {
            $("#comment-container").BeautyComment({
                title: "评论",
                subTitle: "最新评论",
                bloggerName: nickname,
                baseUrl: "/admin/assets/custom/",
                listUrl: "/commentList.json",
                sendUrl: "/auth/sendComment.json",
                wrapClass: "ml-content",
                canComment: comment,
                ajaxParams: {postId: postId, pageNum: 1, pageSize: 10},
                listHandler: function (resp) {
                    return {
                        totalNum: resp.data.total,
                        commentList: resp.data.list
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