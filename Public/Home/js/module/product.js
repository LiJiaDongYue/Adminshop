require([], function(){
    //var attrValue = new Array();
    for(i=0;i<attr_count;i++){
        $('#attr-'+i).on('click','li',function(){
            var j = $(this).parent().parent().parent().attr("data-num");
            $(this).parent().find('li').removeClass('tb-selected');
            $(this).addClass('tb-selected');
            attrValue[j] = $(this).find('span').text();
            if(attrValue.length == attr_count) {
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: '/Home/Product/attr?value=' + attrValue,
                    dataType: "json",
                    success : function(resp){
                        if(resp || resp.status == 1){
                            $('#price').html(resp.price);
                            if(resp.s_1000_pic) {
                                $('#zoom1').attr("href","/"+resp.s_1000_pic);
                                $('.MagicThumb-image').attr("src","/"+resp.s_1000_pic);
                                $('.MagicZoomBigImageCont img').attr("src","/"+resp.s_1000_pic);
                            }
                            if(resp.s_500_pic) $('#zoom1 > img').attr("src","/"+resp.s_500_pic);
                            $('#showArea img').removeClass('img-hover');
                        }
                    }
                });
            }
        });
    }

});