/**
 * Created by Administrator on 2015/6/11.
 */

define(['select2'], function () {
    return {
        select2: function (){
            function formatState (state) {
                if (!state.id) { return state.text; }
                var li = '<span class="ml-'+state.element.dataset.level*5+'">';
                for(var i=0;i<state.element.dataset.level;i++)
                {
                    li += '>';
                }
                li += state.text + '</span>';
                var $state = $(li);
                return $state;
            };

            $(".select2").select2({
                templateResult: formatState
            });
        }
    }
});