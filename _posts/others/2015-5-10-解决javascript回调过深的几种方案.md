---
layout: post
category: "other"
---
众所周知javascript是单线程异步的，异步方法是最适合javascript的。node平台一般会提供同步方法和异步方法两个版本，然而同步方法并不能发挥node平台的优势。

#解决javascript回调过深的几种方案

> 最近在看koa，学习了ES6中的generator，顺便把解决js异步编程的方案总结一下。

##写在前面

何谓回调过深？比如现在有一个文件存着另一个文件的文件名，另一个文件里面有一个url，我们要向这个url发一个http请求。传统意义上的回调实现可能是这样的。

	//伪代码
	readFile(path ,function(err ,data){
		var fileName = data;
		readFile(fileName ,function(err ,data){
			var url = data;
			httpRequest(url ,function(err ,data){
				console.log(data);
			})
		})
	})

如果改成同步方法可能是这样的，虽然是看起来很舒服的同步写法，而且错误处理的方式是传统的try catch模式，不过这并不好，因为不能体现node的优势。

	try{
		var fileName = fs.readFileSync('./tesmp','ax');
	}catch(e){
		deal(e);
	}
	...
	...
	...

回调过深使得程序难以维护，所以有了一些“幺蛾子”- -。

##promise方法

promise是一种标准，不过各种库的函数名有所不同，有时promise也叫deferred模式，下面介绍几个库里面的应用和具体的简单实现。

###jQuery的deferred

jQuery里面有一个deferred对象，实现了promise。

jQuery规定，deferred对象有三种执行状态----未完成，已完成和已失败。如果执行状态是"已完成"（resolved）,deferred对象立刻调用done()方法指定的回调函数；如果执行状态是"已失败"，调用fail()方法指定的回调函数；如果执行状态是"未完成"，则继续等待，或者调用progress()方法指定的回调函数。

	function func(ok){
		var dtd = $.Deferred();//返回一个deferred对象。
		if(ok){
			setTimeout(function(){
				console.log("resolving");
				dtd.resolve();
			},1000);
		}else{
			setTimeout(function(){
				console.log("rejecting");
				dtd.reject();
			},1000);
		}
		return dtd;
	}
	function success(){
		console.log("success");
	}
	function failed(){
		console.log("failed");
	}
	//success
	func(true)
	.done(success)
	.fail(failed)
	//failed
	func(false)
	.done(success)
	.fail(failed)

上面一段代码应用了deferred对象的resolve和reject方法，当一个deferred对象调用done和fail对象的时候，实际上相当于对象正在监听reject和resolve的调用（嗯，一种监听的感觉）。值得注意的是done和fail方法可以重复使用以添加多个回调。现在这个对象可能像这样的。

	function Deferred(){
		this.doneCallbacks = [];
		this.failCallbacks = [];
	}
	Deferred.prototype.done = function(func){
		this.doneCallbacks.push(func);
		return this;
	}
	Deferred.prototype.fail = function(func){
		this.failCallbacks.push(func);
		return this;
	}
	Deferred.prototype.resolve = function(){
		this.doneCallbacks.forEach(function(func){
			func();
		})
	}
	Deferred.prototype.reject = function(){
		this.failCallbacks.forEach(function(func){
			func();
		})
	}

对已第一个例子有这样的问题，如果把代码后面改成下面的样子（这个的话模拟一种错误操作的感觉）。

	//failed
	var dtd = func(false)
	.done(success)
	.fail(failed)
	//提前resolve了，导致func函数内部的resolve调用失效
	dtd.resolve();

提前resolve了，导致func函数内部的resolve调用失效。最resolve的误用了使逻辑改变。避免这种误操作，jQuery Deferred对象有一个promise方法，实际上是返回没有resolve和reject等可以改变deferred对象的状态的方法的安全对象。在我的Deferred对象下面添加promise方法，大概是这样的。

	Deferred.prototype.promise = function(){
		var dtd = this;
		var tempDtd = new Deferred();
	
		tempDtd.resolve = null;
		tempDtd.reject = null;
	
		tempDtd.done = function(func){
			dtd.done(func);
			return this;
		}
		tempDtd.fail = function(func){
			dtd.fail(func);
			return this;
		}
		return tempDtd;
	}

然而jQuery既然有Deferred这么强大的工具那么，jq的其他方法必然有Deferred的封装，于是jq中的Ajax可以这样写：

	$.get("abc")
	.done(function(){ alert("suc"); })
	.fail(function(){ alert("err"); });

内部大概是这样的：

	function get(url,sucFunc,errFunc){
		var dtd = $.Deferred();

		$.ajax(
			{
				url : url ,
				method : "GET" ,
				success : function suc(data){
					sucFunc && nsucFunc(data);
					dtd.resolve(data);
				},
				error : function err(){
					errFunc && nerrFunc(err);
					dtd.reject()
				}
			}
		)

		return dtd.promise();
	}


$.when方法，这个方法很实用，多个Deferred对象都resolve之后再执行回调函数，可以这样想，when方法将Deferred对象汇总，返回一个大的Deferred对象。

非常好用，假设我有一个url数组，要请求这些资源，等全部相应之后再，执行成功的回调函数。

	var requests = [get("abc"),get("def")];
	$.when
	.apply(null,requests)
	.done(function(result){
		console.log(result);
		console.log("all fetched!!!");
	})
	.fail(function(){
		console.log("something goes wrong");
	})

其中一个失败也是不行的，满足&&关系。我想其他库可能有对||关系的封装。

拍脑袋想出来的when方法的实现，写法很不优雅，待重构（不过亲测好用- -）。

	function Deferred(){
		// 这两个属性不是每个Dtd都需要
		// this.whenDtd = null;
		// this.dtds = []
		this.status = 0;
		this.doneCallbacks = [];
		this.failCallbacks = [];
	}
	Deferred.prototype.done = function(func){
		this.doneCallbacks.push(func);
		return this;
	}
	Deferred.prototype.fail = function(func){
		this.failCallbacks.push(func);
		return this;
	}
	Deferred.prototype.resolve = function(){
		this.status = 1;
		this.whenDtd && this.whenDtd.ifAllDtdsResolve() && this.whenDtd.resolve();
		this.doneCallbacks.forEach(function(func){
			func();
		})
	}
	Deferred.prototype.ifAllDtdsResolve = function(){
		var result = true;
		var dtds = this.dtds || [];
		if(dtds.length == 0){return false}
		else return function(){
			dtds.forEach(function(dtd){
				result = result && dtd.status == 1;
				if(result == false){return false}
			})
			return result;
		}()
	}
	Deferred.prototype.reject = function(){
		this.status = 2;
		this.whenDtd && this.whenDtd.reject();
		this.failCallbacks.forEach(function(func){
			func();
		})
	}
	Deferred.prototype.promise = function(){
		var dtd = this;
		var tempDtd = new Deferred();

		tempDtd.resolve = null;
		tempDtd.reject = null;

		tempDtd.done = function(func){
			dtd.done(func);
			return this;
		}
		tempDtd.fail = function(func){
			dtd.fail(func);
			return this;
		}
		return tempDtd;
	}
	Deferred.when = function(){
		var whenDtd = new Deferred();

		var dtds = Array.prototype.slice.apply(arguments);

		var result = {reuslt : false};

		whenDtd.dtds = dtds;

		dtds.forEach(function(dtd){

			dtd.whenDtd = whenDtd;

		})

		return whenDtd;
	}

	var requests = [get("abc"),get("def")];
	Deferred.when
	.apply(null,requests)
	.done(function(result){
		console.log(result);
		console.log("all fetched!!!");
	})
	.fail(function(){
		console.log("something goes wrong");
	})

另外还有一些方法，参见[jQuery Deferred文档](http://api.jquery.com/category/deferred-object/)。

###nodejs promise库

通过jQuery Deferred的学习看这个库的时候感觉很清晰。不过形式发生变化了。

参考[npm promise包文档](https://www.npmjs.com/package/promise)。

一个promise对象就像这样（其实可以说是jQuery中的Deferred对象）。

	var Promise = require('promise');
	 
	var promise = new Promise(function (resolve, reject) {
	  get('http://www.google.com', function (err, res) {
	    if (err) reject(err);
	    else resolve(res);
	  });
	});

promise函数的参数取代了jQuery中的生成Deferred对象和返回Deferred对象，抽取共同点，隐藏了实现的细节。参考jQuery中的Deferred对象来看，可能像这样做了封装。

	function Promise(func){
		func(this.resolve ,this.reject);
	}

	Promise.prototype = $.Deferred();
	Promise.prototype.constructor = Promise;

	var promise = new Promise(function(resolve ,reject){
		$.get("abc",function(data){
			if(data){
				resolve();
			}else{
				reject();
			}
		})
	})
	promise
	.done(function(){
		console.log("get it!");
	})
	.fail(function(){
		console.log("where it is?")
	})

Promise.done/then方法，集成了Deferred对象中的done，fail方法。如果resolve执行第一个回调函数如果reject了执行第二个回调。区别是done之后不返回Promise对象。
	
	var p = new Promise(function(resolve ,reject){
		reject();
	})
	
	p.then(function(){
		console.log(0)
	}).done(function(){
		console.log(1);
	},function(){
		console.log(2);
	})

Promise.denodeify方法，将普通的方法封装上一层promise方法。如下。

	var fs = require('fs')
 
	var read = Promise.denodeify(fs.readFile)
	var write = Promise.denodeify(fs.writeFile)
	
	var p = read('./temp')
	.then(function (str) {
		console.log(str)
		return write('./temp', str + str);
	})

Promise.nodeify方法，将promise方法变回普通方法。

	var read = Promise.denodeify(fs.readFile)
	var write = Promise.denodeify(fs.writeFile)
	
	var readd = Promise.nodeify(read);
	
	readd('./temp',function(err ,data){
		console.log(data);
	})

还可以这样用（官网如是）。当可以当普通的nodeapi使用，可见nodeify的意思就是：像node一样- -。

	function awesomeAPI(foo, bar, callback) {
		return internalAPI(foo, bar)
		    .then(parseResult)
		    .then(null, retryErrors)
		    .nodeify(callback)
	}

Promise.all方法，之于jQuery Deferred中的when方法。

	Promise.all([Promise.resolve('a'), 'b', Promise.resolve('c')])
	.then(function (res) {
		assert(res[0] === 'a')
		assert(res[1] === 'b')
		assert(res[2] === 'c')
	})

Promise.catch方法，语法糖，实际上是这样。

	Promise.then(null ,onReject);

##使用ES6中的generator

###generator基础

下面的文章是根据对[这篇blog](http://www.tuicool.com/articles/3YbIVv)的理解。

generator是一种函数，执行之后会产生generator对象。generator的特性还没有默认开启，需要在 node 命令行中加入 --harnomy 参数来开启。

像这个。
	
	function* Foo(x) {
	  yield x + 1;
	
	  var y = yield null;
	  return x + y;
	}
	
	var foo = Foo(5);
	foo.next();     // { value: 6, done: false }
	foo.next();     // { value: null, done: false }
	foo.next(8);    // { value: 13, done: true }

定义就是普通函数后面加了个*。然后是关键字yield相当于return，generator函数第一次调用的时候是不反悔任何值的，当调用next方法才会返回，返回内容是下一个json，value为yield关键字后面的表达式返回值，done为是否到达return。

注意next是可以传参数的，是传递给将要返回的位置的上一个yield前面的变量。foo.next(8)要返回的地方是return，那么上一个yield前面的y将被赋值为8。

这个图也不错，盗过来- -。

![](http://img0.tuicool.com/vMr6J3.png)

下面代码做了个封装。

	var fs = require('fs');

	function run(gen) {
	  var gen_obj = gen(resume);
	  function resume() {
	    var err = arguments[0];
	    if (err && err instanceof Error) {
	      return gen_obj.throw(err);
	    }
	    var data = arguments[1];
	    gen_obj.next(data);
	  }
	  gen_obj.next();
	}
	
	run(function* gen(resume) {
	  var ret;
	  try {
	    ret = yield fs.readFile('./test.txt', resume);
	    console.log(ret);
	  } catch (e) {
	    console.log(e);
	  } finally {
	    console.log('finally');
	  }
	});

先看第一个函数，可以看到run函数里面传入一个generator函数，这个函数在run的第一句生成一个generator对象，参数是一个函数resume，这个函数里面调用next方法并传入值，然而这个值去哪了呢？

再看run函数的执行，resume最为readFile的回调，把resume内部传入的data传给yield前面的ret。把throw方法隐藏在resume内部，让readFile方法更像同步方法。

###node lib co

co要搭配一些库一起用才好用。这里举两个例子。

搭配thunkify使用

	// co.js
	var co = require("co");
	
	var request = require("request");
	
	var thunkify = require("thunkify");
	
	var fs = require("fs");
	
	var readFile = thunkify(fs.readFile);
	
	var httpGet = thunkify(request.get);
	
	co(function *(){
	
	  try{
	    var a = yield readFile('generator.js');
	    console.log(a);
	  }catch(e){
	  	console.error(e);
	  }
	
	  try{
	  	var b = yield httpGet('http://www.baidu.com');
	    console.log(b[0].statusCode);
	  }catch(e){
	  	console.error(e);
	  }
	
	});

搭配promise使用

	// coWithPromise.js
	
	var co = require("co");
	
	var Promise = require("promise");
	
	var fs = require("fs");
	
	var request = require("request");
	
	var readFile = Promise.denodeify(fs.readFile);
	
	var httpGet = Promise.denodeify(request.get);
	
	co(function* (){
	
		var fileContent = yield readFile("./generator.js");
		var httpRespond = yield httpGet("http://www.baidu.com");
	
		console.log(fileContent);
		console.log(httpRespond);
	
	}).catch(function(err){console.error(err)});

关于异常处理，两种方式皆可使用try catch方式和promise风格的方式。

###node lib koa

这是某大神翻译的官方文档。[http://koa.rednode.cn/](http://koa.rednode.cn/)

对比express学习，koa更轻量级，没有聚合任何其他功能，静态服务，bodyParse等等。有个教koala的库集成了很多有用的koa库，不过不建议像我这样新学的人使用，理解node后端编程还是要一步一步来。