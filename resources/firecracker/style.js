/**
 * Created by shaomingquan on 16/7/31.
 */
var STAGE_WIDTH = 600;
var STAGE_HEIGHT = 600;
var WORK_ITEM_SIZE = 60;
var FIRST_WORK_ITEM_OFFSET = [
    (STAGE_WIDTH - WORK_ITEM_SIZE) / 2,
    (STAGE_HEIGHT - WORK_ITEM_SIZE) / 2,
];
var FRAME_ITEM_SIZE = 50;

var style = `
        .firecracker * {
            box-sizing: border-box;
            overflow: visible;
        }
        .firecracker{
            width: ${STAGE_WIDTH}px;
            margin:0 auto;
            margin-top: 20px;
        }
        .firecracker::after {
            clear: both;
            content: '';
            display: block;
        }
        .firecracker-stage {
            height: ${STAGE_HEIGHT}px;
            border:1px solid #2D777F;
            -webkit-border-radius:8px;
            -moz-border-radius:8px;
            border-radius:8px;
            position: relative;
        }
        .stage-phone-sim{
            position: absolute;
            display: none;
            background-color: rgba(0,0,0,0.1);
            border: 1px solid #ccc;
            border-radius: 8px;
            -webkit-transition: all 500ms;-moz-transition: all 500ms;-ms-transition: all 500ms;-o-transition: all 500ms;transition: all 500ms;
        }
        .stage-line {
            height: ${STAGE_HEIGHT / 2}px;
            width: ${STAGE_WIDTH / 2}px;
            float: left;
        }
        .stage-line1 {
            border-right:1px dashed #2D777F;
        }
        .stage-line2 {
            border-bottom:1px dashed #2D777F;
        }
        .stage-line3 {
            border-top:1px dashed #2D777F;
        }
        .stage-line4 {
            border-left:1px dashed #2D777F;
        }
        .stage-work {
            width:100%;
            height:100%;
            position: relative;
        }
        .work-item {
            height: ${WORK_ITEM_SIZE}px;
            width: ${WORK_ITEM_SIZE}px;
            border: 2px solid #A8F6FF;
            background-color: #2D777F;
            font-size: ${WORK_ITEM_SIZE / 5 * 3}px;
            color: whitesmoke;
            font-weight: bolder;
            line-height: ${WORK_ITEM_SIZE}px;
            text-align: center;
            position: absolute;
            border-radius: 8px;
            left: ${FIRST_WORK_ITEM_OFFSET[0]}px;
            top:${FIRST_WORK_ITEM_OFFSET[1]}px;
        }
        .work-item-dragable {
            cursor: move;
        }
        .work-item-base {
            -webkit-filter: grayscale(0.5);
            cursor: no-drop;
        }
        .frame-item{
            float: left;
            margin-bottom:20px;
        }

        .frame-item-add {
            border:none;
            height: ${FRAME_ITEM_SIZE}px;
            width: ${FRAME_ITEM_SIZE / 3 * 4}px;
            line-height: ${FRAME_ITEM_SIZE}px;
            -webkit-user-select: none;
            cursor: pointer;
            font-size: 60px;
            color: #2D777F;
            text-align: center;
            -webkit-transition: all 300ms;
            -moz-transition: all 300ms;
            -ms-transition: all 300ms;
            -o-transition: all 300ms;
            transition: all 300ms;
        }

        .frame-item-add:hover {
            -webkit-transform: scale(1.2);
            -moz-transform: scale(1.2);
            -ms-transform: scale(1.2);
            -o-transform: scale(1.2);
            transform: scale(1.2);
        }
        .frame-item-add:active {
            -webkit-transform: scale(1.4);
            -moz-transform: scale(1.4);
            -ms-transform: scale(1.4);
            -o-transform: scale(1.4);
            transform: scale(1.4);
        }

        .item-common {
            height: ${FRAME_ITEM_SIZE}px;
            width: ${FRAME_ITEM_SIZE}px;
            float: left;
            position: relative;
        }
        .item-number {
            line-height:${FRAME_ITEM_SIZE}px;
            font-size: ${FRAME_ITEM_SIZE / 5 * 3}px;
            font-weight: bolder;
            color: whitesmoke;
            border: 2px solid #477A7F;
            background-color: #5AEEFF;
            text-align: center;
        }
        .item-number .number-del {
            color: #fff;
            font-size: 12px;
            background: mediumvioletred;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            position: absolute;
            top: -10px;
            right: -10px;
            display: block;
            height: 20px;
            width: 20px;
            line-height: 20px;
            cursor: pointer;
            -webkit-transition: all 300ms;
            -moz-transition: all 300ms;
            -ms-transition: all 300ms;
            -o-transition: all 300ms;
            transition: all 300ms;
        }
        .item-number .number-del:hover {
            -webkit-transform: scale(1.2);
            -moz-transform: scale(1.2);
            -ms-transform: scale(1.2);
            -o-transform: scale(1.2);
            transform: scale(1.2);
        }
        .item-frame-during input {
            width:100%;
            border:none;
            outline:none;
            text-align: center;
            background-color: transparent;
        }
        .item-frame-during div {
            width:80%;
            height: 4px;
            background-color: #48BECC;
            position: absolute;
            left: 4%;
            top:49%;
        }
        .item-frame-during div::after {
            content: '';
            display: block;

            position: absolute;
            right: -16px;
            bottom: -6px;
            border-color: transparent transparent transparent #48BECC;
            border-width: 8px;
            border-style:solid;
        }
        .dragable-panel {
            height:100%;
            width: 100%;
        }
        .panel-attr {
            height: ${WORK_ITEM_SIZE / 5}px;
            width: ${WORK_ITEM_SIZE / 5}px;
            border:2px #A8F6FF solid;
            background-color: white;
            border-radius: 50%;
            position: absolute;
        }
        /*right*/
        .panel-scale-X, .panel-opacity {
            right:-${WORK_ITEM_SIZE / 10}px;
        }
        /*bottom*/
        .panel-opacity, .panel-scale-Y {
            bottom: -${WORK_ITEM_SIZE / 10}px;
        }
        /*left*/
        .panel-skew-Y, .panel-rotate {
            left: -${WORK_ITEM_SIZE / 10}px;
        }
        /*top*/
        .panel-rotate, .panel-skew-X {
            top:-${WORK_ITEM_SIZE / 10}px;
        }
        /*to top center*/
        .panel-scale-X, .panel-skew-Y {
            top: ${WORK_ITEM_SIZE / 2 - 8}px;
        }
        /*to left center*/
        .panel-scale-Y, .panel-skew-X{
            left: ${WORK_ITEM_SIZE / 2 - 8}px;
        }

        .panel-scale-X {
            cursor: ew-resize;
        }
        .panel-scale-Y {
            cursor: ns-resize;
        }
        .panel-rotate {
            /*cursor: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDgwIDgwIiBoZWlnaHQ9IjgwcHgiIGlkPSJJY29ucyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgODAgODAiIHdpZHRoPSI4MHB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cGF0aCBkPSJNNTguMzg1LDM0LjM0M1YyMS42MTVMNTMuNzcsMjYuMjNDNTAuMjQ0LDIyLjY5NCw0NS4zNzcsMjAuNSw0MCwyMC41Yy0xMC43NTIsMC0xOS41LDguNzQ4LTE5LjUsMTkuNVMyOS4yNDgsNTkuNSw0MCw1OS41ICBjNy4yMDUsMCwxMy40OTYtMy45MzksMTYuODcxLTkuNzY3bC00LjMyNi0yLjQ5NkM1MC4wMzUsNTEuNTcxLDQ1LjM1OCw1NC41LDQwLDU0LjVjLTcuOTk1LDAtMTQuNS02LjUwNS0xNC41LTE0LjUgIFMzMi4wMDUsMjUuNSw0MCwyNS41YzMuOTk4LDAsNy42MTcsMS42MzIsMTAuMjM5LDQuMjYxbC00LjU4Myw0LjU4M0g1OC4zODV6Ii8+PC9zdmc+) 16 16 ,auto;*/
            cursor: alias;
        }
        .panel-opacity {
            cursor: row-resize;
        }
        .panel-skew-X, .panel-skew-Y {
            cursor: -webkit-grab;
        }
        .panel-skew-Y:active, .panel-skew-Y:active {
            cursor: -webkit-grabbing;
        }
    `;
var styleTag = document.createElement('style');
styleTag.innerHTML = style;
document.getElementsByTagName('body')[0].appendChild(styleTag)