require(['ajaxPage','ajax','valid', 'jForm','spinner','urlQuery'], function (ajaxPage,ajax) {
            //分页加载
            ajaxPage.pageClick();
            //购物车加减
            $('.plus-minus').spinner({value:1, step: 1, min: 1, max: 999999});

            $('.spinner-input').on('keyup', function () {
                updateNum($(this).next('div.spinner-buttons'));
            });

            $('.spinner-buttons').on('click', function () {
                updateNum($(this));
            });

        function updateNum($this) {
            var i = $this.find('i');
            var price_id = parseInt(i.attr('data-val')) || 0;
            var id = parseInt(i.attr('data-id')) || 0;
            var quantity = parseInt($('#q_' + price_id).val()) || 0;

            if (price_id > 0 && id > 0 && quantity > 0) {
                ajax.todo('post', '../Cart/alterNumber.html', {id: id, quantity: quantity});

                var price =$this.parent().parent().parent().prev().find('.price').attr('data-id');
                var totalPrice = price*quantity;
                var val =$this.parent().parent().parent().next().find('.total_price').html(totalPrice+".00");

                var prices = 0;
                $('.total_price').each(function(){
                    var price = $(this).text();
                    prices += parseFloat(price);
                });
                $('#total').html("￥"+prices+".00")

                var size = 0;
                $('.quantity').each(function(){
                    var quantity = $(this).val();
                    size += parseInt(quantity);
                });
                $('#size').html(size)

            }
        }


        //全选
        $('#table-body').on('click', 'input[class="' + 'check-all' + '"]', function () {
            $('.panel-body').find('input[class="' + 'check-one'+ '"]').attr('checked', $(this).attr('checked') ? true : false);
            var checkedLen  = $('.panel-body').find('input[class="' + 'check-all' + '"]:checked').length;
            var checkOneLen = $('.panel-body').find('input[class="' + 'check-one' + '"]').length;
            if(checkedLen > 0 && checkOneLen > 0) {
                $('.panel-body').find('#submitBtn').removeClass('color');
                $('.panel-body').find('#submitBtn').attr('disabled',false);
            } else {
                $('.panel-body').find('#submitBtn').addClass('color');
                $('.panel-body').find('#submitBtn').attr('disabled',true);
            }
        });
        $('#table-body').on('click', 'input[class="' + 'check-one' + '"]', function () {
            var checkedLen = $('.panel-body').find('input[class="' + 'check-one' + '"]:checked').length;
            var chkLen = $('.panel-body').find('input[class="' + 'check-one' + '"]').length;
            $('.panel-body').find('input[class="' + 'check-all' + '"]').attr('checked', checkedLen === chkLen);
            if(checkedLen > 0) {
                $('.panel-body').find('#submitBtn').removeClass('color');
                $('.panel-body').find('#submitBtn').attr('disabled',false);
            } else {
                $('.panel-body').find('#submitBtn').addClass('color');
                $('.panel-body').find('#submitBtn').attr('disabled',true);
            }
        });

    //删除确认
    $('.panel-body').on('click', '.del', function () {
        var id = $(this).attr('data-val');
        ajax.todo('post', '../Cart/delCart', {id:id}, function (resp) {
        if (resp.status && resp.status === 1) {
            window.location.href ="../Cart/index";
        } else {
            window.location.href ="../Cart/index";
        }
      });

    });

    $('#cart-form').validate({
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                url: '../Cart/delAll',
                type: 'POST',
                dataType: 'json',
                success: function (resp) {
                    if(resp && resp.status === 1){
                        var p1 = $.query.load(window.location.hash).set('_',Math.random()).toString();
                        window.location.href ="../Cart/index";
                    } else {
                        $(form).find('#submitBtn').attr('disabled',false).html('删除');
                    }
                }
            });
        }
    });

    $('#cart-all-form').validate({
        submitHandler: function (form) {
            $(form).find('#submitCartBtn').attr('disabled',true).html('提交计划单中...');
            $(form).ajaxSubmit({
                url: '../Cart/addCart',
                type: 'POST',
                dataType: 'json',
                success: function (resp) {
                    if(resp && resp.status === 1){
                        window.location.href = "../Cart/planTable";
                    } else {
                        $(form).find('#submitCartBtn').attr('disabled',false).html('提交计划单');
                    }
                }
            });
        }
    });


    $('.open-table').click(function(){
        var div  = $(this).parent().parent().parent().parent().next().find('div');
        if($(this).hasClass('fa fa-chevron-down')){
            $(this).removeClass('fa fa-chevron-down').addClass('fa fa-chevron-up');
            div.show();
        } else {
            $(this).removeClass('fa fa-chevron-up').addClass('fa fa-chevron-down');
            div.hide();
        }

    });



});
