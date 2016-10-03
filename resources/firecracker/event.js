/**
 * Created by shaomingquan on 16/7/30.
 */
(function (W) {

    var events = {};

    function trigger () {
        var args = [].slice.call(arguments)
        var eventName = args.shift();
        events[eventName] && events[eventName].forEach(function (handler) {
            handler.apply(null, args);
        });
    }

    function on (name, handler) {
        events[name] = events[name] || [];
        events[name].push(handler);
    }

    function unbind (name, handler) {
        if(events[name]) {
            events[name].forEach(function (currentHandler, index) {
                if(currentHandler === handler) {
                    events[name].splice(index, 1);
                }
            })
        }
    }

    W.___ = {
        on: on, trigger: trigger, unbind: unbind
    }

    W.E = function (dom, eventName, handler) {
        dom.addEventListener(eventName, handler);
    }

    W.RME = function (dom, event, handler) {
        dom.removeEventListener(event, handler)
    }

}) (window);