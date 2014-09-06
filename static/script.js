// Library


function escapeHtml(string) {
    var entityMap = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;'};
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
  });
}

function nl2br(string){
    return String(string).replace(/\n/g, '<br/>')
}

function space2br(string){
    return String(string).replace(/ /g, '&nbsp;')
}

function message(string){
    var t = Math.random();
    console.group(t);
    var string  = escapeHtml(string);
    console.log(string);
    string = nl2br(string);
    console.log(string);
    string = space2br(string);
    console.log(string);
    console.groupEnd();
    return string
}


// home.html
$(document).ready(function(){
    if($('.home').length>0) {
        function load_feed(next_cursor){
            var content = $('#content');
            var tag = content.data('tag');
            var cursor = content.data('cursor');
            var fl = $('#feed_list');
            $.ajax({
                url:'/feeddata/'+tag, 
                dataType:'json',
                type:'get',
                data:{'cursor':(cursor ? cursor : '' )},
                success:function(result){
                    var row_str = '';
                    var row = [];
                    for(var i = 0 ; i < result.feeds.length ; i++){
                        var feed = result.feeds[i];
                        row_str +=  '<tr><td>'
                        row_str += feed['full_picture'] ? '<div class="picture"><img src="'+feed['full_picture']+'" /></div>' : '';
                        row_str += '<div class="message">'+message(feed['message'])+'</div>';
                        row_str += '<div class="created"><a href="/post/'+feed['id']+'">'+feed['created_time']+'</a></div>';
                        row_str += '</td></tr>';
                    }
                    fl.append(row_str)
                    if(!result.more)
                        $('#next_btn').prop('disabled', true);
                    content.data('cursor', result.cursor);
                }
            })
        }
        $('#next_btn').click(function(){
            load_feed($('#content').data('cursor'));
        })
        load_feed();    
    } else if($('.admin').length>0){
        $('#login_btn').click(function(){
            location.href = '/admin/login'
        })
        $('#reset_btn').click(function(){
            if(confirm('정말 삭제 합니까? 모든 정보가 삭제 됩니다.')){
                $.ajax({
                    url:'/admin/reset'
                })
            }
        })
    }
})