/**
 * Created by shaomingquan on 16/7/30.
 */
(function (W) {

    var NUM = 1;

    function addAFrame () {
        if(NUM === 1) {
            return `<div class="frame-item frame-item-base">
                        <div class="item-common item-number">
                            <span class="number-num">1</span>
                        </div>
                    </div>`
        } else {
            return `<div class="frame-item frame-item-during">
                        <div class="item-common item-frame-during">
                            <input type="text" placeholder="ms">
                            <div></div>
                        </div>
                        <div class="item-common item-number">
                            <span class="number-del">×</span>
                            <span class="number-num">${NUM}</span>
                        </div>
                    </div>`
        }
    }

    function updateNumber (fStage) {
        fStage.querySelectorAll('.frame-item').forEach(function (item, index) {
            item.querySelector('.number-num').innerHTML = index + 1;
        })
    }

    function bindDelete (fStage) {
        fStage.querySelectorAll('.frame-item').forEach(function (item, index) {
            item.querySelector('.number-del') && (item.querySelector('.number-del').onclick = function () {
                ___.trigger('deleditableitem', index, NUM);
                fStage.removeChild(item);
                updateNumber(fStage);
                bindDelete (fStage);
                NUM --;
            })
        });
    }
    
    function FrameControl (wrapper) {
        var fStage = wrapper.querySelector('.frames-item-stage');
        var addFrameBtn = wrapper.querySelector('.frame-item-add');
        var addHandler = function (e, posi) {
            fStage.innerHTML += addAFrame();
            ___.trigger('addeditableitem', e, posi, NUM);
            bindDelete (fStage);
            NUM ++;
        }
        E(addFrameBtn, 'click', addHandler)

        //将前两个添加
        addHandler(null);
        addHandler(null, {x: 120, y: 0});
    }

    W.FrameControl = FrameControl;

}) (window)