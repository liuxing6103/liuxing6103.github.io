// markdownMenu.js

/*
关于config，
*/

//得到一个数据集合，包含标题的层级，数据标题，给标题插入锚点
function markdownMenu(targetId ,stageId){

	this.main = document.getElementById(targetId);
	this.parent = document.getElementById(stageId)
	this.re = [];

	var start = this.main.getElementsByTagName("h1")[0] ,
		regH = /h\w/i,
		idStart = new Date().valueOf() ,
		newId = 1;

	this.traverseNodes(start,function(ele){

		return ele.nextSibling;

	},function(ele){

		var nodeName = ele.nodeName ,
			newA = null;
		if(regH.test(nodeName)){
			newId ++;
			newA = document.createElement("a");
			newA.setAttribute("name",newId + idStart);
			this.re.push({content:ele.innerHTML ,level:nodeName.substring(1) ,id:newId + idStart});
			ele.insertBefore(newA,ele.childNodes[0]);
		}

	});
}
//节点遍历器
markdownMenu.prototype.traverseNodes = function(start ,next ,deal){
	var currentNode = next(start);
	if(currentNode == null){
		return;
	}
	deal.call(this,currentNode);
	this.traverseNodes(currentNode ,next ,deal);
}
//根据数据和配置实例化menu
markdownMenu.prototype.initDom = function(config){
	var stage = document.createElement("div") ,
		ulStack = null ,
		tUl = null ,
		tLi = null ,
		tA = null ,
		parent = this.parent,
		data = this.re ,
		length = data.length ,
		level = 2;

	config.ids = config.ids || [] ;
	config.classes = config.classes || [] ;
	
	ulStack = new Stack([(function(){

		var re = document.createElement("ul") ;
		re.setAttribute("id",config.ids[0] || "");
		re.setAttribute("class",config.classes[0] || "");
		return re;

	})()]) ;

	stage.appendChild((function(){

		var re = document.createElement("h2");
		re.setAttribute("id",config.titleId || "");
		re.innerHTML = config.title || "MENU";
		return re;

	})());

	stage.appendChild(ulStack.top());
	stage.setAttribute("id",config.stageId || "") ;
	stage.setAttribute("class",config.stageClass || "") ;

	for(var i = 0 ; i < length ; i ++){

		if(data[i].level > level){
			tUl = document.createElement("ul");
			tUl.setAttribute("id" ,config.ids[ulStack.length()] ||　"");
			tUl.setAttribute("class" ,config.classes[ulStack.length()] ||　"");
			tLi.appendChild(tUl);
			ulStack.push(tUl) ;
			level = data[i].level;
		}else if(data[i].level < level){
			ulStack.pop();
			level = data[i].level;
		}

		tLi = document.createElement("li");
		tA = document.createElement("a");
		tA.setAttribute("href","#" + data[i].id);
		tA.innerHTML = data[i].content;
		tLi.appendChild(tA);
		ulStack.top().appendChild(tLi);

	}

	parent.appendChild(stage);

}

function Stack(init){
	this.data = init;
}
Stack.prototype.push = function(ele){
	this.data.push(ele);
}
Stack.prototype.pop = function(){
	return this.data.pop();
}
Stack.prototype.top = function(){
	return this.data[this.data.length - 1];
}
Stack.prototype.length = function(){
	return this.data.length;
}