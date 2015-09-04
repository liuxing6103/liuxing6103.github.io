# react-canvas试用感想



##是什么？能做什么？

react-canvas是什么呢？光看名字就知道这是跟react和canvas相关的。在普通的dom中我们可以使用react，也可以使用react-nitive制作app。使用react-canvas，我们使用react技术渲染canvas。

[github网址](https://github.com/Flipboard/react-canvas)。

关于能做什么？编译项目之后，看完里面的三个demo。第一感觉就是，流畅，因为它的刷新率为60fps，克服了人眼的视觉暂留所以很流畅。适合做高性能的scrolling效果来替代webview原生书写的scrolling效果，会有更流畅的用户体验。我使用这个技术写过一个三级联动的省市区位置选择器。

##如何使用

将上面的那个github的react-canvas开源项目clone下来，按照readme.md里面的提示，在项目的根目录下启动命令行，这是个node项目，首先安装所有的依赖包``npm install``，然后输入``npm start``，这个命令包括gulp的各种任务，编译出demo，启动静态服务器，然后根据命令行log的提示在localhost的8080端口就可以访问到demo了。当然你的全局环境中要有node和gulp。

书写自己的应用，查看过demo代码和github首页上面的额指导之后我想你已经开始跃跃欲试了。在src下面创建一个自己的项目文件夹，仿照demo里面的文件结构，弄好之后，这时要在webpack.config.js里面的entry项中配置自己的项目，这样再次启动npm start的时候就会将这个项目编译。而且后续你对项目的修改将会被监听，并即时编译，稍等片刻后会自动刷新，然后就可以看到这次更新。（很好奇这个让浏览器自动刷新是怎么做的）。

因为是在node环境下面编译生成的demo，所以下面的代码是以node的形式书写。

##书写细节

看一个官网的demo。

````
var React = require('react');
var ReactCanvas = require('react-canvas');

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;

var MyComponent = React.createClass({

  render: function () {
    var surfaceWidth = window.innerWidth;
    var surfaceHeight = window.innerHeight;
    var imageStyle = this.getImageStyle();
    var textStyle = this.getTextStyle();

    return (
      <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
        <Image style={imageStyle} src='...' />
        <Text style={textStyle}>
          Here is some text below an image.
        </Text>
      </Surface>
    );
  },

  getImageHeight: function () {
    return Math.round(window.innerHeight / 2);
  },

  getImageStyle: function () {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: this.getImageHeight()
    };
  },

  getTextStyle: function () {
    return {
      top: this.getImageHeight() + 10,
      left: 0,
      width: window.innerWidth,
      height: 20,
      lineHeight: 20,
      fontSize: 12
    };
  }

});
````

首先拿到react以及react-canvas，然后拿到项目里需要的react-canvas组件。这里使用了surface，image，text组件（component）。

我们使用react.createClass方法来创建一个component，这里最主要的方法是render方法。render方法里面使用了jsx来组织整个项目里面的各个component，然后在每个component上面设置样式。这时启动应用，整个布局就看得到了，如下图。

react-canvas里面有一些原生的component，当然数量很少，而且具有现成的可用功能的component貌似只有listView。

- surface可以理解为dom里面的的body元素，整个项目要被套在一个surface里面。

- image，text想必就顾名思义了，也不再多说。

- gruop，相当于dom里面的div，将元素进行分组同时定位，或者同时操作。

- listView，支持scrolling的一个component，可以添加各种参数，配置适合自己的scrolling。

同时react-canvas给组件以事件支持，有touchstart，move，end一众事件，click事件。

我们写的每一个component是可以在其他的component中被引用的。利用这个特性我们可以将一个庞大的项目分解成各种component。

可以启动css-layout模式，启动方法是在surface里面加上这条属性`` enableCSSLayout={true}``。这时可以在样式中按照css的规则来书写布局，不过作者明确指出这样做可能会牺牲一些效率。[css-layout example](https://github.com/Flipboard/react-canvas/blob/master/examples/css-layout/app.js)

##优势与劣势

下面刘平川的文章评论了这项技术的优劣，我这里不再重复他的观点。

优势：

- 基于react，因为react现在比较火，可能很多前端已经熟悉react的书写，所以react-canvas比较应景，让一部分人很快的可以上手。
- 流畅，玩游戏的都知道，60fps是大型游戏中默认刷新率，主要跟人眼的视觉暂留特性有关。
- 轻松解决移动端兼容性问题，前提是react-canvas足够成熟。

劣势：

- 当前不成熟，很多dom中的default特性在目前react-canvas里面未能实现，比如无法对文本进行复制，这让使用react-canvas作为展示性站点的时候会有一些限制。当然，制作功能性站点就更遥远了。
- 编译出的单个文件过大，每个app.js这编译过后都要占500多k的空间，由于单个文件大小的限制，所以这个方案生成的文件在公司中无法发布。所以在书写三级联动地址选择器的时候我又回归了dom方案。

时隔半年react-canvas在git上的项目并没有做出更新，我猜测可能作者们在进行项目的重构工作，通过这一版本的项目体验，我们可以明显的感觉到这个项目还不够完善，希望再次更新的时候react-canvas会变得更好。

##资料分享

如果想更好的了解react-canvas，建议访问下面的文章哦。

[react-canvas github首页](https://github.com/Flipboard/react-canvas)

[react-canvas的宣传文章](http://engineering.flipboard.com/2015/02/mobile-web/)

[刘平川：创新高性能移动 UI 框架-Canvas UI 框架](http://www.infoq.com/cn/articles/innovative-high-performance-mobile-ui-framework-canvas)


