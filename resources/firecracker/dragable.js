/**
 * Created by shaomingquan on 16/7/30.
 */
(function (W) {
    function getOffsetRecurrence (dom) {
        function _ (dom) {
            if(!dom) {
                return false;
            }

            if(dom === document.body) {
                return [0, 0]
            }

            var nextOffsets = _ (dom.parentNode);
            if(getComputedStyle(dom).position === 'static') {
                return [nextOffsets[0] - dom.scrollLeft, nextOffsets[1] - dom.scrollTop];
            } else {
                return [nextOffsets[0] + dom.offsetLeft - dom.scrollLeft, nextOffsets[1] + dom.offsetTop - dom.scrollTop];
            }
        }

        return _(dom)
    }

    function getStyle(dom, style) {
        return parseInt(dom.style[style]);
    }

    function setStyle(dom, style, value) {
        dom.style[style] = value + 'px';
    }

    function restrict (type, value) {
        var min = {
            x: -FIRST_WORK_ITEM_OFFSET[0],
            y: -FIRST_WORK_ITEM_OFFSET[1]
        }
        var max = {
            x: FIRST_WORK_ITEM_OFFSET[0],
            y: FIRST_WORK_ITEM_OFFSET[1]
        }

        if(value < min[type]) {
            return min[type];
        } else if(value > max[type]) {
            return max[type]
        } else {
            return value;
        }
    }

    function DragAble (wrapper) {
        //获取wrapper距离页面左上角的距离
        var recurrenceOffsets = null;

        //阻止默认事件以免选择块内数字
        E(wrapper, 'mousemove', function (e) {
            e.preventDefault();
        })
        var dom = null;
        var dragOffset = {};
        var SM = null;
        var mousedowmHandler = function (e) {
            recurrenceOffsets = getOffsetRecurrence(wrapper);
            dom = e.target.tagName === 'SPAN' ? e.target.parentElement : e.target;
            SM = StyleManeger (dom)
            if(dom.getAttribute('class').indexOf('dragable') >= 0) {
                var posiLeft = SM.gt('translateX');
                var posiTop = SM.gt('translateY');
                dragOffset.left = e.layerX - posiLeft;
                dragOffset.top = e.layerY - posiTop;
                E(wrapper, 'mousemove', mousemoveHandler);
                E(wrapper, 'mouseup', mouseupHandler);
            }
        }

        var mousemoveHandler = function (e) {
            SM.st('translateX', restrict('x', e.pageX - recurrenceOffsets[0] - dragOffset.left - FIRST_WORK_ITEM_OFFSET[0]));
            SM.st('translateY', restrict('y', e.pageY - recurrenceOffsets[1] - dragOffset.top - FIRST_WORK_ITEM_OFFSET[1]));
            return false;
        }

        var mouseupHandler = function (e) {
            RME(wrapper, 'mousemove', mousemoveHandler);
            RME(wrapper, 'mouseup', mouseupHandler);
        }
        E(wrapper, 'mousedown', mousedowmHandler);
    }

    W.DragAble = DragAble;
    W.getOffsetRecurrence = getOffsetRecurrence;
})(window)