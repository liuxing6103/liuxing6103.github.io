/**
 * Created by shaomingquan on 16/7/31.
 */
(function (W) {
    var easingMap = {
        "linear": [0.250, 0.250, 0.750, 0.750],
        "ease": [0.250, 0.100, 0.250, 1.000],
        "easeIn": [0.420, 0.000, 1.000, 1.000],
        "easeOut": [0.000, 0.000, 0.580, 1.000],
        "easeInOut": [0.420, 0.000, 0.580, 1.000],
        "easeInQuad": [0.550, 0.085, 0.680, 0.530],
        "easeInCubic": [0.550, 0.055, 0.675, 0.190],
        "easeInQuart": [0.895, 0.030, 0.685, 0.220],
        "easeInQuint": [0.755, 0.050, 0.855, 0.060],
        "easeInSine": [0.470, 0.000, 0.745, 0.715],
        "easeInExpo": [0.950, 0.050, 0.795, 0.035],
        "easeInCirc": [0.600, 0.040, 0.980, 0.335],
        "easeInBack": [0.600, -0.280, 0.735, 0.045],
        "easeOutQuad": [0.250, 0.460, 0.450, 0.940],
        "easeOutCubic": [0.215, 0.610, 0.355, 1.000],
        "easeOutQuart": [0.165, 0.840, 0.440, 1.000],
        "easeOutQuint": [0.230, 1.000, 0.320, 1.000],
        "easeOutSine": [0.390, 0.575, 0.565, 1.000],
        "easeOutExpo": [0.190, 1.000, 0.220, 1.000],
        "easeOutCirc": [0.075, 0.820, 0.165, 1.000],
        "easeOutBack": [0.175, 0.885, 0.320, 1.275],
        "easeInOutQuad": [0.455, 0.030, 0.515, 0.955],
        "easeInOutCubic": [0.645, 0.045, 0.355, 1.000],
        "easeInOutQuart": [0.770, 0.000, 0.175, 1.000],
        "easeInOutQuint": [0.860, 0.000, 0.070, 1.000],
        "easeInOutSine": [0.445, 0.050, 0.550, 0.950],
        "easeInOutExpo": [1.000, 0.000, 0.000, 1.000],
        "easeInOutCirc": [0.785, 0.135, 0.150, 0.860],
        "easeInOutBack": [0.680, -0.550, 0.265, 1.550],
        "custom": [0.000, 0.350, 0.500, 1.300],
        "random": [Math.random().toFixed(3),
            Math.random().toFixed(3),
            Math.random().toFixed(3),
            Math.random().toFixed(3)]
    }
    var bzcurve = easingMap.linear;

    function mergeInterval (frames, stageFrame) {
        var ret = [];
        var durings = [].map.call(stageFrame.querySelectorAll('.item-frame-during > input'), function (duringInput) {
            return parseInt(duringInput.value) || 400;
        });

        var allDuring = durings.reduce(function (a, b) {
            return a + b;
        }, 0);
        ret.allDuring = allDuring;
        var duringPercantages = [];
        durings.map(function (during) {
            return during / allDuring * 100;
        }).reduce(function (a, b) {
            duringPercantages.push((a + b) + '%');
            return a + b;
        }, 0);

        frames.forEach(function (animString, index) {
            ret.push({
                anim: animString,
                percantage: duringPercantages[index]
            })
        });
        return ret;
    }

    function assembleToCss(frames, options) {
        var cssText = `
            .customaaaa {
                transform-origin: center center;
                animation-name: customaaaa;
                animation-duration: ${frames.allDuring}ms;
                animation-timing-function: cubic-bezier(${bzcurve});
            }
            @keyframes customaaaa {
                ${frames.map(function (frame) {
                    return `
                        ${frame.percantage}${frame.anim}
                    `;
                }).join('\n')}
            }`;

        return cssText;

    }

    function runAnim (baseWorkItem, cssText, time) {

        var styleCustomaaaaTag = document.querySelector('.style-customaaaa');
        styleCustomaaaaTag && document.body.removeChild(styleCustomaaaaTag);
        styleCustomaaaaTag = document.createElement('style');
        styleCustomaaaaTag.innerHTML = cssText;
        styleCustomaaaaTag.setAttribute('class', 'style-customaaaa');
        document.body.appendChild(styleCustomaaaaTag);
        baseWorkItem.setAttribute('class', baseWorkItem.getAttribute('class') + ' customaaaa');
        baseWorkItem.style.zIndex = 999;

        setTimeout(function () {
            //reset class
            var classes = baseWorkItem.getAttribute('class').split(' ');
            classes.length = 2;
            baseWorkItem.setAttribute('class', classes.join(' '));
            baseWorkItem.style.zIndex = 'auto';
        }, time)
    }

    function initBzcurve (select) {
        Object.keys(easingMap).forEach(function(timingFunc) {
            var currentOption = document.createElement('option');
            currentOption.innerHTML = timingFunc;
            currentOption.value = timingFunc;
            select.appendChild(currentOption);
        })
        E(select, 'change', function () {
            bzcurve = easingMap[select.value];
        })
    }

    function runHandler (stageWork, stageFrame, options) {
        return function () {
            var frames = [];
            var workItems = stageWork.querySelectorAll('.work-item-dragable')
            var baseItem = stageWork.querySelector('.work-item-base')
            workItems.forEach(function (itemTrans) {
                frames.push(StyleManeger(itemTrans).getStyle());
            });
            //calculate interval and percatage of per frame
            frames = mergeInterval(frames, stageFrame);
            //make frame arr to css text
            var cssText = assembleToCss(frames, options);

            //write output
            document.querySelector('.firecracker-output').innerHTML = cssText;
            //go go go
            runAnim(baseItem, cssText, frames.allDuring);
        }
    }

    function drawPhone (stageWork, stageSetting) {
        // stageWork, stageSetting

        E(stageSetting, 'input', onDraw);
        function onDraw () {
            var options = {};
            var ok = true;
            var attrs = ['phone-width',
                'phone-height',
                'phone-rem',
                'phone-left',
                'phone-top']
            attrs.forEach(function (attr) {
                var value = document.querySelector('.' + attr).value;
                if(!attr) {
                    ok = false;
                }
                options[attr] = value;
            })

            options['phone-left'] = FIRST_WORK_ITEM_OFFSET[0] - options['phone-left']
            options['phone-top'] = FIRST_WORK_ITEM_OFFSET[1] - options['phone-top']

            var phoneSim = document.querySelector('.stage-phone-sim');
            if(!ok) {
                phoneSim.style.display = 'none';
                return false;
            }

            attrs.forEach(function (attr) {
                phoneSim.style[attr.split('-')[1]] = options[attr] + 'px';
            })
            phoneSim.style.display = 'block';

        }
        onDraw();

    }

    function MainControl (stageWork, stageSetting, stageFrame) {
        var runBtn = stageSetting.querySelector('.setting-go');
        var timeFunction = stageSetting.querySelector('.setting-go');
        E(runBtn, 'click', runHandler(stageWork, stageFrame, {timeFunction}));
        drawPhone (stageWork, stageSetting);
        initBzcurve(document.querySelector('.anim-bzcurve'));
    }

    W.MainControl = MainControl;

})(window)