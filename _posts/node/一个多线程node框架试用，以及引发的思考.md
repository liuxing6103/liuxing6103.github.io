# 一个多线程node框架试用，以及引发的思考

框架的名字为Raddish，这是一款最近发布一个node框架。首先作者当然各种夸自己的框架，我们暂且不管作者的说法，先体验一下这款框架再聊聊体会。

##这是什么鬼？

###basic

Raddish is a new type of framework which will allow freedom and the structure of MVC extended with the power of DCI.

Raddish是一种新的框架，它支持MVC模式，依赖于强大的node中的DIC模块，DIC是一个dependency injection模块，这是个什么？就像socket.io那样，server和client两端使用一套相同的api，这样使全栈开发不容易分散注意力，加强了server和client的耦合。

Powered by Promises and Threads the framework is amazingly fast, and endlessly scalable for huge projects which require power above all.

基于promise技术和多线程技术，以数据为核心，也就是view交给前台来做。

The system relies a lot on URLs these will be the main entries to the framework. 
When going to a URL the system will first check if this is a static file, if so it will return this file. 
If not it will traverse the framework.

The urls of the system have a fixed setting. 
URLs are build up as follows (this is not for public files) http://example.com/<app>/<component>/<view> where view is optional. 
If new view is given the system will use the plural of the component name for the view. (unless it is overridden in the dispatcher)

I will give some examples: 

http://example.com/demo/foo this url will go to the demo application and will run the component foo with the view foos. 
http://example.com/demo/foo/bar will go to the same application but will go to the view bar.

整个系统很大程度上依赖于URL系统，这是框架的主要入口。当我们尝试访问一个url的时候，系统首先检查，这个url是否指向一个静态文件，如果是这样的话就返回这个文件。如果没有的话会通过框架来处理这个请求。

关于这个url的写法是框架严格规定的，假设下面的url不是一个静态文件，这个url的各个部分会是这样的 http://example.com/<app>/<component>/<view> ,在这里view是可选的。（这句话想表达什么并不清楚）

Below I will show the complete file structure for a component, ofcourse when there are no file overrides the folders don't have to be created. 
It is ofcourse possible to add own custom folders if needed. Also the config.json is optional and used for component config.

The component_name.js must have the same name as the component and is the file which is first called when requesting a component.

When following the tutorial be sure to place the controllers in the controller folder, 
models in the model folder etc.

<component_name>
├── controller/
│   └── permission/
│   └── behavior/
├── database/
│   ├── adapter/
│   ├── row/
│   ├── rowset/
│   └── table/
│       └── behavior/
├── dispatcher/
│   └── authenticator/
├── model/
├── view/
├── <component_name>.js
└── config.json

下面我来展示这个component的完整的文件结构，（这个地方什么意思）。当然你可以添加自定义的目录。config.json是这个component的配置文件。这个component_name.js必须要和目录的名字是一样的，每当我们请求这个component的时候，就会调用这个文件。最后保障每一类文件归类于指定的文件夹。

Component config is a powerfull tool which allows you to override certain variables without having to write a complete object to do so. 
There are two files for which the system will check. Which is the config.json in the component directory, 
or the <component_name>.json file in the config directory of the application (if specified).

The file in the application config directory serves as a fallback when the config.json in the component folder isn't found. 
In the tutorial extension details on this file are shown. 
Below I will give an example of how a component config file might look like:

{
    "table": {
        "account": {
            "db": "mongo",
            "name": "accounts"
        },
        "character": {
            "db": "mongo",
            "name": "characters"
        }
    },
    "dispatcher": {
        "controller": "product"
    }
}

component的配置文件是一个强大的工具，允许你重写一个确切的变量，此过程不需要写一个完整的对象。

这里有两个文件框架会去查看，一个是component目录里面的config.json，或者app目录下面的config路径<component_name>.json。当框架无法找到component目录下面的config.json的时候就会去app的config路径下面找<component_name>.json。

The identifiers are another powerfull tool to receive objects and to interact with them. 
The identifiers have a specific format and are URIs (Unique Resource Identifiers) as well. 
Later on in the advanced tutorial I will give an example to register your own Identifier Locator. 
The identifiers are as follows: 

com://<application>/<component>.<path>.<name> 
Where path is also dot-separated.

Below a few examples of identifiers and what kind of objects they return.

com://demo/foo.model.bar 
This identifier will return the model bar from the component foo in the demo application. 

com://home/bar.database.table.baz 
This identifier will return the table object baz from the bar component in the home application.

I hope that this makes the identifiers a little more clear. 
In the tutorial you will find some more to get more familliar with them.

标识符是另外一些强大的工具，去接收对象并且跟他们进行交互。这些标识符有明确的格式，他们也属于url。一会在高级教程中我会举一个例子去注册一个自己的标识符定位器。

这些标识符就像下面的一样：

先是基础的格式。

com://<application>/<component>.<path>.<name>
这些路径都是以逗号分隔的。

然后再来两个具体的例子。

com://demo/foo.model.bar
这个标识符会返回demo应用的foo组件的bar模型。

com://home/bar.database.table.baz
这个标识符会返回home应用的bar组件下面的数据库的baz表。

我希望以上可以让你更清晰的理解标识符。在下面的文章中，你会对这些标识符更加的熟悉。

###引导

####介绍

In this tutorial we will guide you through creating an application and a component. 
We will handle every small bit and give example code which you can use in your own projects.

We will handle every part step by step and explain the API in every detail. 
Please read the basics of the framework before continuing because the rest of the tutorial relies a lot on this information. 
Please keep in mind that when no overrides are needed you don't have to create an extra files.

在下面的引导中我们会告诉你如何创建一个应用和一个component，我们会抓住每一个小细节，并且给大家可以在你的项目中使用的项目示例代码。

我们会一步一步的详细的描述这些API。请先看前面的额basic部分，因为这些部分很多都是依赖前面的信息。请记在心里，当无需除了框架之外的功能时，不要创建额外的路径。

####安装

The first thing we will do is setup the the system. 
For development purposes we will use a package called Nodemon. This package will restart your system whenever you have created a change. 
So first we will create a package.json. 
This could look like this:

			{
            "dependencies": {
                "raddish": "2.0.0",
                "nodemon": "1.0.17"
            },
            "scripts": {
                "start": "nodemon app.js"
            }
        }
     
     
首先我们需要安装整个系统，为了开发过程中更加的方便，我们引入一个叫nodemen的包，这个包会重启的你的应用当你对项目中得文件作出更改的时候。那么首先我们创建一个package.json文件，添加我们所需的依赖，以及运行应用的脚本。


In this package.json we have said that that when the command npm start is executed it will start app.js with nodemon. 
Ofcourse if you want you can add more scripts or dependencies if you want. 
After we created the package.json we will issue the npm install command to download all the dependencies. This might take a while. 
When this is done you can continue.

Next step is the config.json this file is used by Raddish and will hold the basic config. 
In this example I have shown the minimum requirements, for more information go to: config.json
The config might look like this:

{
    "db": {
        "default": {
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "root",
            "database": "demo",
            "prefix": "demo_"
        }
    },
    "format": "json",
    "port": 1337,
    "public": "/public"
}

在这个package.json里面我们声明了，当我们键入npm start的时候，我们会通过nodemon启动过app.js。当然你可以添加任何你想要的脚本和依赖。

当你创建完这个package.json的时候，我们执行npm install命令去下载所有的依赖。这可能会花费一点时间。当这些任务完成之后，就可以向下进行了。

下一步是创建config.json，这是一个raddish应用的基础性的配置文件。在这个例子里面对最基本的需求做了配置，获取更多信息请访问[这里](http://getraddish.com/basics/config.html)。这个配置可能像下面一样。

Next we will create a file called app.js this is our main entry point of the framework. 
In this file we will set the config, register the applications and start the framework. 
The file can look like this:

var raddish = require('raddish');               // Require the raddish module.
    
raddish.setConfig('./config.json');             // This function accepts a string or an object for the config.
raddish.setApplication('demo', 'app/demo/app'); // Here we will register the demo application.
raddish.checkUpdate();                          // This function will automatically check for updates and let you know.
    
raddish.start();                                // Start raddish.
This covers the setup. 
On the next page we will create the application which we registered in the app.js file.

下一步我们要创建一个叫app.js的文件，这是我们整个框架的的入口文件。在这个文件里面我们会设置整个配置，注册这些应用，并且启动整个框架（就是说这个入口文件实际上是没有什么逻辑的）。这个入口文件可能像下面的一样。

####application

下面我们来看看被这个入口注册的应用会是什么样子的。

var Application = require('raddish').Application;
var util        = require('util');
    
function DemoApp() {
    Application.call(this);                     // Call the parent object.
    
    this.setConfig({
        component: __dirname + '/components',   // Set the directory for the components. (required)
        config: __dirname + '/config'           // Set the directory for the config files. (used for component config, optional)
    });
};
    
util.inherits(DemoApp, Application);
    
module.exports = DemoApp;
This is a complete component. We have said to the application where it can find the config files (if set) and the components. 
Now the application is registred and raddish can be started.

For the following examples please read the file structure information. 
In the following tutorials we will give a small explanation followed by an example.

这时一个完整的组件。我们必须告诉这个应用，去哪里可以找到配置文件和组件。现在这个组件已经被注册了，并且raddish可以启动了,但是启动的时候会伴随404的错误。阅读下面的文章请先参阅[component的目录结构](http://getraddish.com/basics/file-structure.html)。

####component file

To successfully start you component and to suppress the 404 component not found. Error you have to create a file 
in the root you your component with the same name as your component. This is also done to correctly start your component.

See an example below.

function DemoComponent(request, response) {
    ObjectManager.get('com://demo/demo.dispatcher.http')
        .then(function(dispatcher) {
            dispatcher.dispatch(request, response);
        });
}
        
module.exports = DemoComponent;
In the following tutorial we will handle the dispatcher.

要想修改好这个404的错误，你需要在你的component根目录下面写一个与component同名的文件。如果这些都做完的话你就可以成功的运行你的程序了。

加好这个文件之后，当你访问localhost:1337/demo/demo的时候就会试图访问这个application中的这个模块，这时不会报错404，而是500internal error，这至少证明我们已经开始访问component，所以项目的目录已经没有问题了，不过不用担心暂时的错误，因为这时因为我们的应用还没有搭建完，所以要继续看下面的文章。

####dispatcher file

The dispatcher handles request and response. 
This is the first place where the request and response come together.

This is also the place where the system checks to where the system has to go next. 
The system checks the request and when a view parameter is found it will get the controller for this request. 
When none is found the system will check for the same controller as the component name.

Althought it is possible to override this behavior, this can be done in two different ways. I will show them below

Object override:

var Dispatcher  = require('raddish').Dispatcher;
var util        = require('util');

function DemoDispatcher(config) {
    Dispatcher.call(this, config);
};

util.inherits(DemoDispatcher, Dispatcher);

DemoDispatcher.prototype.initialize = function(config) {
    config.controller = 'foo';

    return Dispatcher.prototype.initialize.call(this, config);
};

module.exports = DemoDispatcher;
Component config:

{
    "dispatcher": {
        "controller": "foo"
    }
}

dispatcher是调度器的意思，至于为啥叫调度器，想必跟他的作用是紧密相关的。一个dispatcher大概就是一个函数，这时你可以看到关于http，request对象和response对象的第一个函数。这也是检验系统将要往哪个方向运行的一个地方。系统会检测这个请求，当一个view参数被发现的事后，系统将会去找到相应的控制器controller去处理这个请求。当没有找到这个view参数的时候，系统会去找与这个component同名的controller.

还可以通过简单的配置一下component的config文件来达到同样的效果。

写过之后发现程序可以执行到dispatcher里面去了说明目录没问题，但是访问的时候还是报错，没关系继续往下看。

The controller is the object which responds to the user action. 
Because we use BREAD (Browse, Read, Edit, Add and Delete) we can also use these actions for behaviors. 
Also we can override these actions (highly disadvised). Also you can add static states in the controller if they are dependent on other data. 
Also I will show an example of binding behaviors (can also be done by component config).

Below I will give an example on how to bind static state data (used for security) and set a few behaviors.

controller是可以相应用户动作的对象。因为我们使用bread（这里大概就是web应用上面的各种操作），我们（卧槽后面有点没理解。。。）

Object override:

var Controller  = require('raddish').Controller;
var util        = require('util');

function DemoController(config) {
    Controller.call(this, config);
}

util.inherits(DemoController, Controller);

DemoController.prototype.initialize = function(config) {
    // When a behavior is in this component you can just give the behavior name
    // but when it is in another component you must give the full identifier.
    config.behaviors = {
        'uploadable': {},
        'com://demo/menu.controller.behavior.itemable': {}
    };

    return Controller.prototype.initialize.call(this, config);
};

DemoController.prototype.getRequest = function() {
    var request = Controller.prototype.getRequest.call(this);

    request.id = 11;

    return request;
};

module.exports = DemoController;
The behaviors can also be set in Component config:

{
    "controller": {
        "demo": {
            "behaviors": {
                "uploadable": {},
                "com://demo.menu.controller.behavior.itemable": {}
            }
        }
    }
}
In this example no matter what you will only get the item with id 11. Even when another id is given.

Permissions
Next to the controller we also have permissions. 
This as well is based on BREAD. And on these functions you can add your own permissions check. 
By default the get requests are allowed, and on post/ delete requests you must be authenticated. 
When you want to override the permissions for a specific view you can give the file the name of the controller. 
When the view you visit is demo the controller demo is called and so the permissions file with the same name. 
The function names are: canBrowse, canRead, canEdit, etc. 
Below an example of the canEdit permission. Ofcourse you can change it to whatever you need.

var Permission  = require('raddish').Permission;
var util        = require('util');

function DemoPermission(config) {
    Permissions.call(this, config);
}

util.inherits(DemoPermission, Permission);

DemoPermission.prototype.canEdit = function(context) {
    if(context.auth) {
        if(context.auth.username && context.auth.password) {
            return Promise.resolve(true);
        }
    }

    return Promise.resolve(false);
};

module.exports = DemoPermission;
The following example shows that only users which are logged can edit, else a 401 error will be returned.

并不知道permission这个东西需要放在哪里。。。应该是permission文件夹里面吧...如果是放在permission文件夹下面但是叫什么名字呢。

##试用

###helloworld

不过用什么东西，框架还是语言，第一件事肯定就是写一个helloworld了。不过首先还是要安装和配置一下。

安装:

``npm init``之后生成项目的package.json文件，然后添加项目依赖包。nodemon这个包得作用是当你在修改代码并保存的时候，将会重新启动app，这样就省得ctrl+c --> node app.js了。

````
{
	"dependencies": {
		"raddish": "2.0.0",
		"nodemon": "1.0.17"
	},
	"scripts": {
		"start": "nodemon app.js"
	}
}          
````

配置：

配置文件名为config.json放置在项目的根目录下面。配置了服务器监听的端口，数据的格式，静态服务器地址。还配置了数据库的地址，端口，用户名密码数据库名。

````
{
    "db": {
        "default": {
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "root",
            "database": "demo",
            "prefix": "demo_"
        }
    },
    "format": "json",
    "port": 1337,
    "public": "/public"
}
````


