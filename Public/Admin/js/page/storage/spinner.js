/**
 * Created by Administrator on 2015/6/30.
 */
define(['spinner'],function(){
    return {
        piusOrMinus : function(){
            $('.plus-minus').spinner({value:0, step: 1, min: 0, max: 999});
        }
    }
});