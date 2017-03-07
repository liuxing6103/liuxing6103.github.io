/**
 * Created by shaomingquan on 16/7/30.
 */
(function (W) {
    // var initItemPosi = {
    //     x: 480 - 360,
    //     y: 240 - 360
    // }
    // var newItemPosi = {
    //     x: 480 - 360,
    //     y: 240 - 360
    // }
    // var deriction = [
    //     //第一次
    //     [1, 0],
    //     [0, 1],
    //     [0, 1],
    //     [-1, 0],
    //     [-1, 0],
    //     [0, -1],
    //     [0, -1],
    //     [1, 0],
    // ];
    // var interval = 120;

    function getItem (x, y, number) {
        var classes = ['work-item'];
        var item = document.createElement('div');
        item.innerHTML = '<span class="dragable">' + number + '</span>';
        var SM = StyleManeger(item);
        if(number === 1) {
            //不可编辑以及拖动
            classes.push('work-item-base');
            item.style.left = FIRST_WORK_ITEM_OFFSET[0] + 'px';
            item.style.top = FIRST_WORK_ITEM_OFFSET[1] + 'px';
        } else {
            //可拖动,加入编辑panel
            classes.push('work-item-dragable');
            var editPanel = `
                <div class="dragable-panel">
                    <span class="panel-attr panel-scale panel-scale-X"></span>
                    <span class="panel-attr panel-scale panel-scale-Y"></span>
                    <span class="panel-attr panel-rotate"></span>
                    <span class="panel-attr panel-opacity"></span>
                    <span class="panel-attr panel-skew panel-skew-X"></span>
                    <span class="panel-attr panel-skew panel-skew-Y"></span>
                </div>
            `;
            SM.st('translateX', x);
            SM.st('translateY', y);
            item.innerHTML += editPanel;
        }
        item.setAttribute('class', classes.join(' '));
        return item;
    }

    // function updateNewItemPosi (number) {
    //     var currentDeriction = deriction[number % 8];
    //     newItemPosi.x += currentDeriction[0] * 120;
    //     newItemPosi.y += currentDeriction[1] * 120;
    // }

    function EA (wrapper) {

        var dom = null;

        var getMousemoveHandler = function (dom, attr, initPosi) {
            var initTransform = Object.assign({}, StyleManeger(dom).gtObj());
            var type = attr.type;
            var direction = attr.direction;
            var attrName = [type, direction ? direction : ''].join('');
            if('scale' === type) {
                return function (e) {
                    StyleManeger(dom).st(
                        attrName ,
                        (initTransform[attrName] || 1) + (e['client' + direction] - initPosi[direction]) / 100
                    );
                }
            } else if('skew' === attr.type) {
                return function (e) {
                    StyleManeger(dom).st(
                        attrName ,
                        (initTransform[attrName] || 0) + (e['client' + direction] - initPosi[direction]) / -5
                    );
                }
            } else if('rotate' === attr.type) {
                //得到转动圆心
                var wrapperOffset = getOffsetRecurrence(wrapper);
                var o = [
                    wrapperOffset[0] + initTransform.translateX + WORK_ITEM_SIZE / 2 + FIRST_WORK_ITEM_OFFSET[0],
                    wrapperOffset[1] + initTransform.translateY + WORK_ITEM_SIZE / 2 + FIRST_WORK_ITEM_OFFSET[1]
                ];
                var initialAngle = getAngle([initPosi.X, initPosi.Y], o);
                function getAngle(point, o) {
                    var x1 = point[0],
                        y1 = point[1];
                    var x2 = o[0],
                        y2 = o[1];
                    var d =  Math.sqrt(Math.pow((y2 - y1),2)+Math.pow((x2 - x1),2));
                    var angle = Math.round(Math.atan2((y2 - y1) , (x2 - x1)) * (180 / (4 * Math.atan(1))));
                    return angle;
                }
                return function (e) {
                    StyleManeger(dom).st(
                        attrName ,
                        (initTransform[attrName] || 0) + (getAngle([e.pageX, e.pageY], o) - initialAngle)
                    );
                }
            } else if('opacity' === attr.type) {
                return function (e) {
                    StyleManeger(dom).st(
                        attrName ,
                        (initTransform[attrName] || 1) + (e['clientY'] - initPosi['Y']) / -100
                    );
                }
            }
        }

        var getMainDom = function (path) {
            return path.filter(function (dom) {
                return dom.getAttribute && dom.getAttribute('class') &&
                    dom.getAttribute('class').indexOf('work-item-dragable') > -1;
            })[0]
        }

        var mouseDownHanler = function (e) {
            var panelClassArr = e.target.getAttribute('class').split(' ');
            var panelClass = panelClassArr[panelClassArr.length - 1];
            if(panelClass.indexOf('panel-') === 0) {
                var panelDom = getMainDom(e.path);
                var panelAttr = {
                    type: panelClass.split('-')[1],
                    direction: panelClass.split('-')[2],
                };
                var panelMoveHandler = getMousemoveHandler(panelDom, panelAttr, {
                    X: e.clientX,
                    Y: e.clientY
                });

                var panelUpHandler = function () {
                    RME(wrapper, 'mousemove', panelMoveHandler);
                    RME(wrapper, 'mouseup', panelUpHandler);
                }

                E(wrapper, 'mousemove', panelMoveHandler);
                E(wrapper, 'mouseup', panelUpHandler);

            }
        }

        E(wrapper, 'mousedown', mouseDownHanler)
    }

    function updateEditableitem (wrapper) {
        return function (index, NUM) {
            var items = wrapper.querySelectorAll('.work-item');
            wrapper.removeChild(items[index]);
            wrapper.querySelectorAll('.work-item').forEach(function (item, index) {
                item.querySelector('.dragable').innerHTML = index + 1;
            })

        }
    }

    function EditAble (wrapper) {
        //可以编辑的items 2之后的, queryAll返回的不是伪数组
        ___.on('addeditableitem', function (e, position, NUM) {
            if(position) {
                wrapper.appendChild(getItem(position.x, position.y, NUM));
            }else {
                wrapper.appendChild(getItem(0, 0, NUM));
            }
        });

        ___.on('deleditableitem', updateEditableitem (wrapper))

        EA (wrapper);
    }

    W.EditAble = EditAble;
}) (window)