/**
 * Created by shaomingquan on 16/1/2.
 */
(function(W){

    //ES5的方法考虑兼容性的问题
    Array.prototype.forEach || function(){
        Array.prototype.forEach = function(func){
            var length = this.length;
            var index = 0;
            for( ; index < length ; index++){
                func(this[index]);
            }
        }
    }();

    //得到ID的方法
    function _ID(id){
        return document.getElementById(id);
    }

    var main = _ID("main");

    //色块
    var a = _ID("a")
        ,b = _ID("b")
        ,c = _ID("c")
        ,d = _ID("d");

    //contents
    var contents = [
        _ID("content_a") ,
        _ID("content_b") ,
        _ID("content_c") ,
        _ID("content_d")
    ];

    function showContent(number){
        var length = 4;
        var index = 0;
        for(  ; index < length ; index++){
            if(index == number){
                contents[index].style.opacity = 1;
            }else{
                contents[index].style.opacity = 0;
            }
        }
    }

    function changeTransform(dom ,tx ,ty ,rz){

        function getTransformTexts(){
            var _rz = rz ? "rotateZ("+ rz +"deg) " : "";
            var _ty = ty ? "translateY("+ ty +"px) " : "";
            var _tx = tx ? "translateX("+ tx +"px) " : "";
            return _tx + _ty + _rz;
        }

        function addPrefix(){
            var prefixs = [
                "webkit" ,
                "moz" ,
                "ms" ,
                "o" ,
                ""
            ]
            dom.style = {};
            prefixs.forEach(function(pref){
                dom.style[pref + "Transform"] = getTransformTexts();
            });
        }

        addPrefix();
    }

    function changePosition(dom ,left ,top){
        dom.style.top = top ;
        dom.style.left = left ;
    }

    function animationStart(){
        changeTransform(a ,50 ,50);
        changeTransform(b ,-50 ,50);
        changeTransform(c ,50 ,-50);
        changeTransform(d ,-50 ,-50);
    }

    function animation1(){
        showContent(0);
        changeTransform(main ,-50 ,-50);
        changePosition(a ,"0%" ,"0%");
        changePosition(b ,"100%" ,"0%");
        changePosition(c ,"0%" ,"100%");
        changePosition(d ,"100%" ,"100%");
    }

    function animation2(){

        showContent(1);
        changeTransform(main ,50 ,-50);
        changePosition(a ,"-100%" ,"0%");
        changePosition(b ,"0%" ,"0%");
        changePosition(c ,"-100%" ,"100%");
        changePosition(d ,"0%" ,"100%");
    }

    function animation3(){
        showContent(2);
        changeTransform(main ,-50 ,50);
        changePosition(a ,"0%" ,"-100%");
        changePosition(b ,"100%" ,"-100%");
        changePosition(c ,"0%" ,"0%");
        changePosition(d ,"100%" ,"0%");
    }

    function animation4(){
        showContent(3);
        changeTransform(main ,50 ,50);
        changePosition(a ,"-100%" ,"-100%");
        changePosition(b ,"0%" ,"-100%");
        changePosition(c ,"-100%" ,"0%");
        changePosition(d ,"0%" ,"0%");
    }

    function animationEnd() {

    }

    function play(){
        setTimeout(function(){
            animationStart();
            setTimeout(function(){
                animation1();
                setTimeout(function(){
                    animation2();
                    setTimeout(function(){
                        animation3();
                        setTimeout(function(){
                            animation4();
                        },1500)
                    },1500)
                },1500)
            },1500)
        } ,1500)
    }

    W.play = play;
    W.animation1 = animation1;
    W.animation2 = animation2;
    W.animation3 = animation3;
    W.animation4 = animation4;
    W.animationStart = animationStart;

    //输入一个项目文件夹


})(window)



