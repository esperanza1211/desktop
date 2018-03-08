var conList = document.querySelector('.con-list');
conList.dataPid = 0;
var conLis = conList.querySelectorAll('li');
var back = document.querySelector('.back');
var _ID = 0;
var maxId = getMaxId() + 1;//数组中id的最大值
var MousePid = 0;//鼠标右键点击时，获得的pid
var selectBox;
var startMouse = {};
var nowMouse = {};
var startEl = {};
var dis = {};
var now = {};
var explorerElement = null;
var moveEl = null;
var renameBoolean = false;
var linshiUl = document.querySelector('.linshiUl');
/**
 * 渲染初始界面
 */
render(getChildren(_ID),conList);

/**
 * 窗口变化重新排列
 */
window.onresize = function() {
    render(getChildren(0), conList);
}

/*
* 获取数据中最大的id值
* */
function getMaxId() {
    return dataList.sort(function (a, b) {
        return a.id - b.id;
    })[dataList.length - 1].id;
}

/**
 * 返回指定pid的所有数据
 */
function getChildren(pid) {
    return dataList.filter( function (item) {
        return pid == item.pid;
    })
}

/**
 * 获取所有子级
 */
function getAllChildren(pid) {
    var allChildren = [];
    allChildren = getChildren(pid);
    allChildren.forEach(function (item) {
        var children = getAllChildren(item.id);
        allChildren = allChildren.concat(children);
    });
    return allChildren;
}

/**
 * 返回指定ID对应的数据
 */
function get(id) {
    return dataList.find( function(item){
        return item.id == id;
    })
}

/**
 * 获取指定ID的父级
 */
function getParent(id) {
    return get((get(id) ? get(id).pid : 0));
}

/**
 * 获取所有父级
 */
function getParents(id) {
    var parents = [];
    var _parent = getParent(id);
    if(_parent) {
        parents.push(_parent);
        parents = getParents(_parent.id).concat(parents);
    }
    return parents;
}

/**
 * 根据数据渲染视图
 */
function render(data,el) {
    el.innerHTML = '';
    data.forEach(function(item,index){
        var li = document.createElement('li');
        li.dataid = item.id;
        li.pid = item.pid;
        li.type = item.type;
        li.filetype = item.filetype;
        li.dataUrl = item.dataUrl;
        li.name = item.name;
        var img = document.createElement('img');
        if(item.type == 'folder') {
            img.src = "img/icos/Folder-02-WF.png";
            li.setAttribute('_contextmenu', 'folder');
        } else if(item.type == 'files') {
                img.src = "img/icos/File-WF.png";
            if(item.filetype == 'audio') {
                img.src = "img/icos/Document Music-02-WF.png";
            } else if(item.filetype == 'video') {
                img.src = "img/icos/Video.png";
            } else if(item.filetype == 'text') {
                img.src = "img/icos/Text-Document.png";
            } else if(item.filetype == 'image') {
                img.src = "img/icos/Images.png";
            }
            li.setAttribute('_contextmenu', 'files');
        } else if (item.type == 'Recycle') {
            img.src = "img/icos/Recycle-Bin.png";
            li.setAttribute('_contextmenu', 'folder');
        } else if (item.type == 'Settings') {
            img.src = "img/icos/Settings - 13.png";
            li.setAttribute('_contextmenu', 'folder');
        } else if (item.type == 'CMS') {
            img.src = "img/icos/Media Connect-WF.png";
            li.setAttribute('_contextmenu', 'folder');
        };
        var p = document.createElement('p');
        p.innerHTML = item.name;
        /**
         * 新建文件重名
         */
        var LiNub = 2;
        newName();
        function newName() {
            var elLis = el.querySelectorAll('li');
            elLis.forEach(function(elLi){
                var elp = elLi.querySelector('p');
                if(p.innerHTML == elp.innerHTML) {
                    p.innerHTML = item.name + "(" + LiNub + ")";
                    LiNub++;
                    newName();
                }
            });
        }
        item.name = p.innerHTML;
        var text = document.createElement('input');
        text.className = 'text';
        text.type = 'text';
        text.value = p.innerHTML;
        li.appendChild(img);
        li.appendChild(p);
        li.appendChild(text);
        if(el == conList) {
            var count = Math.floor(el.clientHeight / 100);
            li.style.left = ((Math.floor(index / count) * 100) + 10) + "px";
            li.style.top = (((index % count) * 100) + 10) + "px";
        } else {
            var count = Math.floor(el.clientWidth / 100);
            li.style.top = ((Math.floor(index / count) * 100) + 10) + "px";
            li.style.left = (((index % count) * 100) + 10) + "px";
        }
        /**
         * 双击文件夹，创建窗口
         */
        if(li.type == "folder" || li.type == "Recycle" || li.type == "CMS"){
            li.ondblclick = function () {
                _ID = li.dataid;
                var windowBox;
                if(li.parentNode.className == "con-list"){
                    windowBox = createWindow();
                }
                if(li.pid == 1){
                    return;
                }
                var windowBoxConList;
                var crumbs;
                if (li.pid == 0) {
                    windowBoxConList = windowBox.querySelector('.windowBox-conList');
                    crumbs = windowBox.querySelector('.crumbs');
                } else {
                    windowBoxConList = li.parentNode;
                }
                windowBoxConList.dataPid = li.dataid;
                if(windowBoxConList.dataPid == 1) {
                    windowBoxConList.setAttribute('_contextmenu', 'recycle');
                }
                render(getChildren(_ID),windowBoxConList);
                frameBox(windowBoxConList);
                dragLi(windowBoxConList);
            }
        }
        /**
         * 打开文件
         */
        if(li.type == 'files') {
            li.ondblclick = function () {
                var fileShow = createFileWindow(li);
                if(!li.filetype) {
                    var p = document.createElement('p');
                    p.innerHTML = "未知类型，无法打开";
                    fileShow.appendChild(p); 
                } else if(li.filetype == "text") {
                    var p = document.createElement('p');
                    p.innerHTML = li.dataUrl;
                    fileShow.appendChild(p); 
                } else if(li.filetype == "image") {
                    var img = new Image();
                    img.src = li.dataUrl;
                    fileShow.appendChild(img); 
                } else if(li.filetype == "audio") {
                    createAudioWindow(li,fileShow);
                } else if(li.filetype == "video") {
                    createVideoWidow(li,fileShow);
                }
            }
        }
        if(li.pid == 1) {
            li.setAttribute('_contextmenu', 'recycle');
        }
        el.appendChild(li);
        frameBox(el);
        dragLi(el);
    });
    if(el == conList) {
        return;
    } else {
        renderCrumbs(el);
    }
}

/**
 * 面包屑导航
 */
function renderCrumbs(el) {
    var parents = getParents(_ID);
    var crumbs = el.previousElementSibling.children[1];
    crumbs.innerHTML = '';
    parents.forEach(function(item) {
        var a = document.createElement('a');
        a.innerHTML = item.name + '>';
        a.href = 'javascript:;';
        a.onclick = function () {
            _ID = item.id;
            render(getChildren(_ID),el);
            return false;
        }
        crumbs.appendChild(a);
    })
    if(_ID > 0) {
        var currentInfo = get(_ID);
        var a = document.createElement('a');
        a.innerHTML = currentInfo.name;
        crumbs.appendChild(a);
    }
}

/*
* 上下文菜单,右键菜单
* */
document.oncontextmenu = function (e) {
    var menudata = 'global';
    if (e.target.getAttribute('_contextmenu')) {
        menudata = e.target.getAttribute('_contextmenu');
    } else if(e.target.parentNode.getAttribute('_contextmenu')) {
        menudata = e.target.parentNode.getAttribute('_contextmenu');
    }
    if((e.target.parentNode.tagName == 'LI' || e.target.tagName == 'LI') && e.target.parentNode.className == '') {
        e.target.parentNode.className = 'activeLi';
    }
    // explorerElement = e.target;
    // while( explorerElement && explorerElement.className != 'explorer' ) {
    //     explorerElement = explorerElement.parentNode;
    // }
    createContextmenu(e, mouseList[menudata]);
}
document.onclick = function(e) {
    if(e.target.tagName == 'UL') {
        var lis = e.target.children;
        for(var i = 0; i < lis.length; i++) {
            lis[i].className = '';
        }
    }
    contextmenuElement.style.display = 'none';
}

/**
 * 选框
 */
function frameBox(el) {
    var setSelectBox = false;
    drag({
        el: el,
        el2: null,
        isExe: function (e) {
            if(e.target.tagName != "UL") {
                return true;
            }
        },
        start: function (e) {
            selectBox = document.createElement("div");
            selectBox.className = "selectBox";
            selectBox.innerHTML = '<span class="selectBoxLeft"></span><span class="selectBoxTop"></span><span class="selectBoxRight"></span><span class="selectBoxBottom"></span>';
        },
        move: function () {
            if(Math.abs(nowMouse.x - startMouse.x) > 10 || Math.abs(nowMouse.y - startMouse.y) > 10) {
                setSelectBox = true;
                document.body.appendChild(selectBox);
            } else {
                return;
            }
            selectBox.style.left = startMouse.x + "px";
            selectBox.style.top = startMouse.y + "px";
            var elRect = el.getBoundingClientRect();
            var frameBoxW = dis.x;
            var l = startMouse.x;
            if(dis.x < 0) {
                l = nowMouse.x;
                if(nowMouse.x < elRect.left) {
                    l = elRect.left;
                    frameBoxW = elRect.left - startMouse.x;
                }
            }
            var frameBoxH = dis.y;
            var t = startMouse.y;
            if(dis.y < 0){
                t = nowMouse.y;
                if(nowMouse.y < elRect.top) {
                    t = elRect.top;
                    frameBoxH = elRect.top - startMouse.y;
                }
            }
            selectBox.style.top = t + "px";
            selectBox.style.left = l + "px";
            if(nowMouse.x > elRect.right) {
                frameBoxW = startMouse.x - elRect.right;
            }
            if(nowMouse.y > elRect.bottom) {
                frameBoxH = startMouse.y - elRect.bottom;
            }
            selectBox.style.width = Math.abs(frameBoxW) + "px";
            selectBox.style.height = Math.abs(frameBoxH) + "px";
            var lis = el.querySelectorAll("li");
            lis.forEach(function (li) {
                if(collision(li,selectBox)) {
                    li.className = "activeLi";
                } else {
                    li.className = "";
                }
            })
        },
        end: function () {
            if(setSelectBox) {
                document.body.removeChild(selectBox);
                setSelectBox = false;
            }
        }
    })
}

/**
 * 桌面上的li的拖拽
 */
// function dragLi(el) {
//     if(el.className != 'con-list') {
//         return;
//     }
//     var lis = el.querySelectorAll('li');
//     lis.forEach(function (li) {
//         drag({
//             el: li,
//             el2: li,
//             start: function (e) {
//                 if(event.button != 0) {
//                     return;
//                 }
//             },
//             move: function () {
//                 if(startMouse == nowMouse){
//                     return;
//                 }
//                 var lis = el.querySelectorAll('li');
//                 lis.forEach(function (boomLi) {
//                     if(boomLi != li && collisionMouse(boomLi)) {
//                         boomLi.className = 'activeLi';
//                     } else {
//                         boomLi.className = '';
//                     }
//                 })
//             },
//             end: function () {
//                 var boomli = el.querySelectorAll('.activeLi');
//                 if(boomli.length != 1) {
//                     return;
//                 }
//                 if(li != boomli[0]) {
//                     if(boomli[0].type == 'Recycle' || boomli[0].type == 'folder' || boomli[0].type == 'CMS') {
//                         get(li.dataid).pid = boomli[0].dataid;
//                         _ID = 0;
//                         render(getChildren(_ID),el);
//                     }
//                 }
//             }
//         })
//     })
// }

function dragLi(el) {
    var BoxparentId = null;
    var lis = el.querySelectorAll('li');
    lis.forEach(function (li) {
        li.onmousedown = function (e) {
            if(event.button != 0) {
                return;
            }
            if(li.className == 'activeLi') {
                startMouse = {
                    x: e.clientX,
                    y: e.clientY
                };
                BoxparentId = li.pid;
                var actLis = li.parentNode.querySelectorAll('.activeLi');
                var cloneArr = [];
                actLis.forEach(function (li,index) {
                    var liRect = li.getBoundingClientRect();
                    startEl = {
                        x: liRect.left,
                        y: liRect.top
                    };
                    var cloneName = 'newNode'+index;
                    window[cloneName] = li.cloneNode(true);
                    window[cloneName].className = '';
                    window[cloneName].dataid = li.dataid;
                    css(window[cloneName],"left",startEl.x);
                    css(window[cloneName],"top",startEl.y);
                    css(window[cloneName],"opacity",.7);
                    window[cloneName].startLeft = startEl.x;
                    window[cloneName].startTop = startEl.y;
                    window[cloneName].style.zIndex = 999;
                    cloneArr.push(window[cloneName]);

                    document.onmousemove = function(e){
                        nowMouse = {
                            x: e.clientX,
                            y: e.clientY		
                        };
                        if(Math.abs(nowMouse.x - startMouse.x) > 10 || Math.abs(nowMouse.y - startMouse.y) > 10 ) {
                            for(var i = 0; i < actLis.length; i++) {
                                conList.appendChild(cloneArr[i]);
                                dis = {
                                    x: nowMouse.x - startMouse.x,
                                    y: nowMouse.y - startMouse.y
                                };
                                li.now = {
                                    x: cloneArr[i].startLeft + dis.x,
                                    y: cloneArr[i].startTop + dis.y
                                };
                                cloneArr[i].style.left = li.now.x + "px";
                                cloneArr[i].style.top = li.now.y + "px";
                            }
                        }
                        var windowBoxes = document.querySelectorAll('.windowBox');
                        windowBoxes.forEach(function (windowBox) {
                            var boxRect = windowBox.getBoundingClientRect();
                            if(nowMouse.x > boxRect.left 
                            && nowMouse.x < boxRect.right
                            && nowMouse.y > boxRect.top
                            && nowMouse.y < boxRect.bottom) {
                                var windowBoxConList = windowBox.querySelector('.windowBox-conList');
                                // console.log(windowBoxConList.dataPid)
                                var windowBoxConLis = windowBoxConList.querySelectorAll('li');
                                windowBoxConLis.forEach(function (windowBoxConLi) {
                                    var windowBoxConLiRect = windowBoxConLi.getBoundingClientRect();
                                    if(nowMouse.x > windowBoxConLiRect.left 
                                    && nowMouse.x < windowBoxConLiRect.right
                                    && nowMouse.y > windowBoxConLiRect.top
                                    && nowMouse.y < windowBoxConLiRect.bottom) {
                                        // console.log(windowBoxConLi.dataid)
                                        windowBoxConLi.className = 'activeLi';
                                    } else {
                                        windowBoxConLi.className = '';
                                    }
                                })
                            } else {
                                var conList = document.querySelector('.con-list');
                                var conLis = conList.querySelectorAll('li');
                                conLis.forEach(function (conLi) {
                                    var conLiRect = conLi.getBoundingClientRect();
                                    if(nowMouse.x > conLiRect.left 
                                    && nowMouse.x < conLiRect.right
                                    && nowMouse.y > conLiRect.top
                                    && nowMouse.y < conLiRect.bottom) {
                                        for(var i = 0; i < actLis.length; i++) {
                                            if(conLi != cloneArr[i]) {
                                                conLiRect.className = 'activeLi';
                                            }
                                        }
                                    } else {
                                        conLiRect.className = '';
                                    }
                                })
                            }
                        })
                    }
                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                        // conList.removeChild(window[cloneName]);
                        var windowBoxes = document.querySelectorAll('.windowBox');
                        windowBoxes.forEach(function (windowBox) {
                            var boxRect = windowBox.getBoundingClientRect();
                            if(nowMouse.x > boxRect.left 
                            && nowMouse.x < boxRect.right
                            && nowMouse.y > boxRect.top
                            && nowMouse.y < boxRect.bottom) {
                                var windowBoxConList = windowBox.querySelector('.windowBox-conList');
                                var windowBoxConLis = windowBoxConList.querySelectorAll('li');
                                windowBoxConLis.forEach(function (windowBoxConLi) {
                                    var windowBoxConLiRect = windowBoxConLi.getBoundingClientRect();
                                    if(nowMouse.x > windowBoxConLiRect.left 
                                    && nowMouse.x < windowBoxConLiRect.right
                                    && nowMouse.y > windowBoxConLiRect.top
                                    && nowMouse.y < windowBoxConLiRect.bottom) {
                                        for(var i = 0; i < actLis.length; i++) {
                                            get(cloneArr[i].dataid).pid = windowBoxConLi.dataid;
                                            conList.removeChild(cloneArr[i]);
                                        }
                                        render(getChildren(0),conList);
                                        getWindow(BoxparentId);
                                        getWindow(windowBoxConLi.dataid);
                                    }
                                })
                                console.log(cloneArr)
                                // for(var i = 0; i < actLis.length; i++) {
                                    // get(cloneArr[i].dataid).pid = windowBoxConList.dataid;
                                    // conList.removeChild(cloneArr[i]);
                                // }
                                actLis.forEach(function (li,index) {
                                    var cloneName = 'newNode'+index;
                                    conList.removeChild(window[cloneName]);
                                })
                                render(getChildren(0),conList);
                                getWindow(BoxparentId);
                                getWindow(windowBoxConList.dataPid);
                            } else {
                                var conList = document.querySelector('.con-list');
                                var conLis = conList.querySelectorAll('li');
                                conLis.forEach(function (conLi) {
                                    var conLiRect = conLi.getBoundingClientRect();
                                    if(nowMouse.x > conLiRect.left 
                                    && nowMouse.x < conLiRect.right
                                    && nowMouse.y > conLiRect.top
                                    && nowMouse.y < conLiRect.bottom) {
                                        for(var i = 0; i < actLis.length; i++) {
                                            if(conLi != cloneArr[i]) {
                                                console.log(conLi.dataid)
                                                conLiRect.className = 'activeLi';
                                            }
                                        }
                                    } else {
                                        conLiRect.className = '';
                                    }
                                })
                                actLis.forEach(function (li,index) {
                                    var cloneName = 'newNode'+index;
                                    conList.removeChild(window[cloneName]);
                                })
                            }

                        })
                    };
                });

            } 
            // else {
            //     var liRect = li.getBoundingClientRect();
            //     startMouse = {
            //         x: e.clientX,
            //         y: e.clientY
            //     };
            //     startEl = {
            //         x: liRect.left,
            //         y: liRect.top
            //     };
            //     if(event.button != 0) {
            //         return;
            //     }
            //     var newNode = li.cloneNode(true);
            //     css(newNode,"left",startEl.x);
            //     css(newNode,"top",startEl.y);
            //     css(newNode,"opacity",.7);
            //     newNode.style.zIndex = 999;
            //     document.onmousemove = function(e){
            //         nowMouse = {
            //             x: e.clientX,
            //             y: e.clientY		
            //         };
            //         dis = {
            //             x: nowMouse.x - startMouse.x,
            //             y: nowMouse.y - startMouse.y	
            //         };
            //         now = {
            //             x: startEl.x + dis.x,
            //             y: startEl.y + dis.y
            //         };
            //         newNode.style.left = now.x + "px";
            //         newNode.style.top = now.y + "px";
            //         var lis = conList.querySelectorAll('li');
            //         lis.forEach(function (boomLi) {
            //             if(boomLi != li && collisionMouse(boomLi)) {
            //                 boomLi.className = 'activeLi';
            //             } else {
            //                 boomLi.className = '';
            //             }
            //         })
            //     };
            //     document.onmouseup = function () {
            //         document.onmousemove = null;
            //         document.onmouseup = null;
            //         var boomli = el.querySelectorAll('.activeLi');
            //         if(boomli.length != 1) {
            //             return;
            //         }
            //         if(li != boomli[0]) {
            //             if(boomli[0].type == 'Recycle' || boomli[0].type == 'folder' || boomli[0].type == 'CMS') {
            //                 get(li.dataid).pid = boomli[0].dataid;
            //                 _ID = 0;
            //                 render(getChildren(_ID),el);
            //             }
            //         }
            //     };
            // }
            return false;
        }
    });
}

/**
 * 拖动
 */
function drag(init) {
    var el = init.el;
    var el2 = init.el2;
	el.onmousedown = function (e) {
		startMouse = {
			x: e.clientX,
			y: e.clientY
        };
        if(el2) {
            var startEl = {
                x: el2.offsetLeft,
                y: el2.offsetTop
            };
        } else {
            var startEl = {
                x: el.offsetLeft,
                y: el.offsetTop
            };
        }
        if(init.isExe&& init.isExe(e)) {
            return false;
        }
        init.start&&init.start(e);
		document.onmousemove = function(e){
			nowMouse = {
				x: e.clientX,
				y: e.clientY		
			};
			dis = {
				x: nowMouse.x - startMouse.x,
				y: nowMouse.y - startMouse.y	
			};
			now = {
				x: startEl.x + dis.x,
				y: startEl.y + dis.y
            };
            if(el2){
                el2.style.left = now.x + "px";
                el2.style.top = now.y + "px";
            }
			init.move&&init.move();
		};
		document.onmouseup = function () {
			document.onmousemove = null;
			document.onmouseup = null;
			init.end&&init.end();
		};
		return false;
	}
}

/**
 * 碰撞检测
 */
function collision(el,el2) {
    var rect = el.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();
    if(rect.bottom < rect2.top
    || rect.top > rect2.bottom
    || rect.right < rect2.left
    || rect.left > rect2.right){
        return false;
    }
    return true;
}
function collisionMouse(el) {
    var rect = el.getBoundingClientRect();
    if(nowMouse.y < rect.top
    || nowMouse.y > rect.bottom
    || nowMouse.x < rect.left
    || nowMouse.x > rect.right){
        return false;
    }
    return true;
}

/**
 * 全选
 */
function checkMoreFn(el) {
    var lis = el.querySelectorAll('li');
    lis.forEach(function (li) {
        li.className = 'activeLi';
    })
}

/**
 * 新建
 */
function newFolderFn(el) {
    MousePid = el.dataPid;
    var arr = {
        id:maxId,
        pid:MousePid,
        type:"folder",
        name:"新建文件夹"
    };
    maxId++;
    dataList.push(arr);
    _ID = MousePid;
    render(getChildren(_ID),el);
}
function newFilesFn(el) {
    MousePid = el.dataPid;
    var arr = {
        id:maxId,
        pid:MousePid,
        type:"files",
        name:"新建文件"
    };
    maxId++;        
    dataList.push(arr);
    _ID = MousePid;
    render(getChildren(_ID),el);
}

/**
 * 重命名
 */
function rename(li) {
    var nub = li.dataid;
    var p = li.querySelector('p');
    var text = li.querySelector('.text');
    var nowName = p.innerHTML;
    setTimeout(function () {
        renameBoolean = true;
        p.style.display = "none";
        text.style.display = "block";
        text.value = p.innerHTML;
        text.select();
    },100);
    text.ondblclick = function (e) {
        e.cancelBubble= true;
    }
    text.onblur = function () {
        renameBoolean = false;
        if(!getfilesName(text.value,li)) {
            p.innerHTML = nowName;
            text.select();
            return;
        }
        text.style.display = "none";
        p.style.display = "block";
        if(text.value.trim() != "") {
            p.innerHTML = text.value;
        } else if(text.value.trim() == "") {
            p.innerHTML = nowName;
        }
        get(li.dataid).name =  p.innerHTML;
    };
}
function getfilesName(Name,li) {
    var parentUl = li.parentNode;
    var elLis = parentUl.querySelectorAll('li');
    for(var i = 0; i< elLis.length; i++) {
        if(elLis[i].dataid == li.dataid) {
            continue;
        }
        var fileName =  elLis[i].children[1].innerHTML;
        if(fileName == Name) {
            return false;
        }
    }
    return true;
}

/**
 * 复制
 */
function copyMouse(ids) {
    temporaryList.length = 0;
    ids.forEach(function (id) {
        var str = JSON.stringify(get(id));
        var json = JSON.parse(str);
        json.id = maxId;
        maxId++;
        json.pid = 'pastePid';
        pasteList.push(json);
        pasteList = pasteList.concat(copyAllChildren(id,json.id));
    })
}
function copyAllChildren(id,pid) {
    var allChildren = [];
    allChildren = getCopyChildren(id);
    allChildren.forEach(function (item) {
        item.pid = pid;
        var prevId = item.id;
        item.id = maxId;
        maxId++;
        var children = copyAllChildren(prevId,item.id);
        allChildren = allChildren.concat(children);
    })
    return allChildren;
}
function setTemporaryList() {
    var temporaryList = [];
    dataList.forEach(function (item) {
        var str = JSON.stringify(item);
        var json = JSON.parse(str);
        temporaryList.push(json);
    })
    return temporaryList;
}
function getCopyChildren(pid) {
    return setTemporaryList().filter( function(item){
        return pid == item.pid;
    })
}

/**
 * 剪切
 */
function cutMouse(ids,boxEl) {
    _ID = boxEl.dataPid;
    pasteList = [];
    ids.forEach(function (id) {
        var str = JSON.stringify(get(id));
        var json = JSON.parse(str);
        json.pid = 'pastePid';
        pasteList.push(json);
        var cutPos = getIndex(id);
        dataList.splice(cutPos,1);
    })
    render(getChildren(_ID),boxEl);
}
function getIndex(id) {
    var liIndex = 0;
    var arr = get(id);
    dataList.forEach(function (li,index) {
        if(li == arr){
            liIndex = index;
        }
    });
    return liIndex;
}

/**
 * 粘贴
 */
function pasteMouseFn(el) {
    pasteList.forEach(function (item) {
        if(item.pid == 'pastePid') {
            item.pid = el.dataPid;
        }
    })
    _ID = el.dataPid;
    dataList = dataList.concat(pasteList);
    pasteList = [];
    render(getChildren(_ID),el);
}

/**
 * 删除
 */
function del(ids,boxEl) {
    _ID = boxEl.dataPid;
    ids.forEach(function (id) {
        get(id).prevPid = _ID;
        console.log(get(id).prevPid)
        get(id).pid = 1;
    });
    render(getChildren(_ID),boxEl);
}

/**
 * 回收站中删除
 */
function removeData(ids) {
    var allids = [];
    ids.forEach(function (id) {
        allids.push(id);
        allids = allids.concat( getAllChildren(id).map( function (item) {
            return item.id;
        } ) );
    });
    dataList = dataList.filter(function (item) {
        return allids.indexOf(item.id) == -1;
    });
    getWindow(1);
}

/**
 * 还原
 */
function restore(ids) {
    ids.forEach(function (id) {
        get(id).pid = get(id).prevPid;
        getWindow(get(id).prevPid);
    })
    getWindow(1);
    render(getChildren(0),conList);
}

/**
 * 重新渲染窗口
 */
function getWindow(Pid) {
    var windowBoxConLists = document.querySelectorAll('.windowBox-conList');
    windowBoxConLists.forEach(function (windowBoxConList) {
        if(windowBoxConList.dataPid == Pid) {
            render(getChildren(Pid),windowBoxConList);
        }
    })
}

/**
 * 打开
 */
function openMouse(ids) {
    ids.forEach(function (id) {
        var obj = get(id);
        _ID = obj.id;
        var windowBox = createWindow();
        var windowBoxConList = windowBox.querySelector('.windowBox-conList');
        windowBoxConList.dataPid = obj.id;
        var crumbs = windowBox.querySelector('.crumbs');
        render(getChildren(_ID),windowBoxConList);
    })
}

/**
 * 选中
 */
function onchangeEl(el) {
    var lis = el.querySelectorAll('.activeLi');
    var arr = [];
    lis.forEach(function (li) {
        arr.push(li.dataid);
    })
    return arr;
}

/**
 * 上传文件
 */
var fileUpload = document.querySelector('#file-upload');
fileUpload.onchange = function () {
    var type = this.files[0].type.split("/")[0];
    var reader = new FileReader();
    var name = this.files[0].name;
    var dataUrl;
    reader.onload = function () {
        dataUrl = reader.result;
        var arr = {
            id:maxId,
            filetype:type,
            pid:2,
            type:"files",
            name:name,
            dataUrl:dataUrl
        };
        maxId++;
        dataList.push(arr);
        var windowBoxConLists = document.querySelectorAll('.windowBox-conList');
        windowBoxConLists.forEach(function (windowBoxConList) {
            if(windowBoxConList.dataPid == 2) {
                render(getChildren(2),windowBoxConList);
            };
        });
    }
    if(type == "text") {
        reader.readAsBinaryString(this.files[0]);
    } else {
        reader.readAsDataURL(this.files[0]);
    }
    fileUpload.value = '';
}

/**
 * 清除选中状态
 */
function clearActive() {
    var lis = document.querySelectorAll('.activeLi');
    if(lis) {
        lis.forEach(function (li) {
            li.className = '';
        })
    }
}

/**
 * 开始菜单
 */
var startBar = document.querySelector('.startBar');
var start = document.querySelector('.start');
startBarFn();
function startBarFn(e) {
    start.onclick = function () {
        setTimeout(function () {
            if(startBar.style.display == 'none') {
                startBar.style.display = 'block';        
            } else {
                startBar.style.display = 'none';
            }
        },20)
    }
}

var CalculatorImg = document.querySelector('.CalculatorImg');
CalculatorFn();
function CalculatorFn() {
    CalculatorImg.onclick = function () {
        createCalculator();
    }
}

/**
 * 显示日历
 */
var times = document.querySelector('.times');
var timesP1 = times.querySelector('.timesHours');
var timesP2 = times.querySelector('.timesCalendar');
timesP1.innerHTML = WindowtoTime(); 
timesP2.innerHTML = WindowYear();
timesHours();
function timesHours() {
    setInterval(function () {
        timesP1.innerHTML = WindowtoTime(); 
        timesP2.innerHTML = WindowYear();
    },100)
}
var celendar = document.querySelector('.celendar');
times.onclick = function () {
    setTimeout(function () {
        if(celendar.style.display == 'none') {
            celendar.style.display = 'block';
        } else {
            celendar.style.display = 'none';
        }
    },20)
}
function WindowtoTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return toDB(hours) +':'+ toDB(minutes);
}
function WindowYear() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var date2 = date.getDate();
    return year + '/' + month + '/' + date2;
}
function toDB(nub) {
    return nub < 10 ? "0" + nub : "" + nub;
};

/**
 * 点击空白地区，清除所有状态
 */
document.addEventListener('click', function (e) {
    if(e.target.tagName == 'UL' || e.target.tagName == 'LI') {
        clearActive();
    }
    startBar.style.display = 'none';
    // var dataElement = e.target;
    // while( dataElement && dataElement.className != 'celendar' ) {
    //     dataElement = dataElement.parentNode;
    // }
    // if(dataElement.className == 'celendar') {
    //     celendar.style.display = 'block';    
    // } else {
        celendar.style.display = 'none';        
    // }
})

/**
 * 开始菜单新建文件夹
 */
newFolder();
function newFolder() {
    var newFolder = document.querySelector('.newFolder');
    newFolder.onclick = function () {
        newFolderFn(conList);
    }
}

/**
 * 计算器
 */


/**
 * 画板
 */
// var drawing = document.querySelector('.drawing');
// var cxt = c.getContext("2d");
// var btn = document.querySelector('#btn');
// cxt.strokeStyle = "red";
// drawing.onmousedown = function(e){
//     cxt.beginPath();
//     cxt.moveTo(e.clientX,e.clientY);
//     document.onmousemove = function(e){
//         cxt.lineTo(e.clientX,e.clientY);
//         cxt.stroke();
//     }
//     document.onmouseup = function(){
//         cxt.closePath();
//         document.onmousemove = null;
//         document.onmouseup = null;
//     }
//     return;
// };
// var buttons = document.querySelectorAll('button');
// buttons.forEach(function(btn){
//     btn.onclick = function(){
//         cxt.strokeStyle = this.value;
//     };
// });
// btn.onmousedown = function(e){
//     var div = document.createElement("div");
//     div.style.cssText = "width:30px;height:30px;background:yellow;position:fixed;opacity:.5";
//     div.style.left = e.clientX - 15 + "px";
//     div.style.top = e.clientY - 15 + "px";
//     document.body.appendChild(div);
//     document.onmousemove = function(e){
//         div.style.left = e.clientX - 15 + "px";
//         div.style.top = e.clientY - 15 + "px";
//         var cRect = c.getBoundingClientRect();
//         var x = e.clientX - 15 - cRect.left;
//         var y = e.clientY - 15 - cRect.top;
//         cxt.clearRect(x,y,30,30);
//     };
//     document.onmouseup = function(){
//         document.onmousemove = null;
//         document.onmouseup = null;
//         document.body.removeChild(div);
//     };
//     return false;
// };