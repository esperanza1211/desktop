/**
 * 生成窗口
 */
var explorerZIndex = 1;
var con = document.querySelector('.con');
function createWindow() {
    var windowBox = document.createElement('div');
    windowBox.className = "windowBox";
    windowBox.maxWindow = false;
    windowBox.style.zIndex = explorerZIndex++;
    windowBox.onmousedown = function() {
        this.style.zIndex = explorerZIndex++;
    };
    var windowBoxHeader = document.createElement('div');
    windowBoxHeader.className = "windowBox-mod-header";
    var h3 = document.createElement('h3');
    h3.innerHTML = "资源管理器";
    // h3.setAttribute('_contextmenu', 'explorer');
    h3.ondblclick = function (e) {
        maxWindow(windowBox);
    }
    drag({
        el:h3,
        el2:windowBox
    });
    windowBoxHeader.appendChild(h3);
    windowBox.appendChild(windowBoxHeader);

    /**
     * 任务栏关联
     */
    var barLi = createFooterBarLi(windowBox);
    createWindowBar(windowBox, barLi);

    var windowBoxCon = document.createElement('div');
    windowBoxCon.className = "windowBox-con";
    var windowBoxCrumbsBar = document.createElement('div');
    windowBoxCrumbsBar.className = "windowBox-crumbsBar";
    var back = document.createElement('a');
    back.className = "back";
    back.href = "javascript:;";
    back.onclick = function () {
        var _parent = getParent(_ID);
        _ID = _parent ? _parent.id : 0;
        render(getChildren(_ID),windowBoxConList);
    }
    var img = document.createElement('img');
    img.src = "img/icos/Backward-WF.png";
    back.appendChild(img);
    windowBoxCrumbsBar.appendChild(back);
    var crumbs = document.createElement('div');
    crumbs.className = "crumbs";
    windowBoxCrumbsBar.appendChild(crumbs);
    var windowBoxConList = document.createElement('ul');
    windowBoxConList.className = "windowBox-conList";
    windowBoxCon.appendChild(windowBoxCrumbsBar);
    windowBoxCon.appendChild(windowBoxConList);
    windowBox.appendChild(windowBoxCon);

    /**
     *窗口边框
     */
    var windowLeft = document.createElement('span');
    windowLeft.className = 'windowLeft';
    changeWindowBox(windowLeft,windowBox);
    windowBox.appendChild(windowLeft);
    var windowTop = document.createElement('span');
    windowTop.className = 'windowTop';
    changeWindowBox(windowTop,windowBox);
    windowBox.appendChild(windowTop);
    var windowRight = document.createElement('span');
    windowRight.className = 'windowRight';
    changeWindowBox(windowRight,windowBox);
    windowBox.appendChild(windowRight);
    var windowBottom = document.createElement('span');
    windowBottom.className = 'windowBottom';
    changeWindowBox(windowBottom,windowBox);
    windowBox.appendChild(windowBottom);
    var windowTopLeft = document.createElement('span');
    windowTopLeft.className = 'windowTopLeft';
    changeWindowBox(windowTopLeft,windowBox);
    windowBox.appendChild(windowTopLeft);
    var windowTopRight = document.createElement('span');
    windowTopRight.className = 'windowTopRight';
    changeWindowBox(windowTopRight,windowBox);
    windowBox.appendChild(windowTopRight);
    var windowBottomLeft = document.createElement('span');
    windowBottomLeft.className = 'windowBottomLeft';
    changeWindowBox(windowBottomLeft,windowBox);
    windowBox.appendChild(windowBottomLeft);
    var windowBottomRight = document.createElement('span');
    windowBottomRight.className = 'windowBottomRight';
    changeWindowBox(windowBottomRight,windowBox);
    windowBox.appendChild(windowBottomRight);

    con.appendChild(windowBox);
    return windowBox;
}

/**
 * 窗口最大化，还原
 */
function maxWindow(box) {
    if(!box.maxWindow) {
        box.prev = {
            prevWidth: css(box,'width'),
            prevHeight: css(box,'height'),
            prevleft: box.offsetLeft,
            prevtop: box.offsetTop
        };
        box.style.width = '100%';
        box.style.height = '100%';
        box.style.left = 0;
        box.style.top = 0;
        box.maxWindow = true;
    } else {
        box.style.width = box.prev.prevWidth + 'px';
        box.style.height = box.prev.prevHeight + 'px';
        box.style.left = box.prev.prevleft + 'px';
        box.style.top = box.prev.prevtop + 'px';
        box.maxWindow = false;
    }
}

/**
 * 改变窗口大小
 */
function changeWindowBox(el,box) {
    var MoveTop = false;
    var MoveLeft = false;
    var MoveBottom = false;
    var MoveRight = false;
    var minWidth = 400;
    var minHeight = 300;
    el.onmousedown = function (e) {
        var str = e.target.className;
        if(str.indexOf('Top') != '-1') {
            MoveTop = true;
        }
        if(str.indexOf('Left') != '-1') {
            MoveLeft = true;
        }
        if(str.indexOf('Bottom') != '-1') {
            MoveBottom = true;
        }
        if(str.indexOf('Right') != '-1') {
            MoveRight = true;
        }
        var startMouse = {
            x: e.clientX,
            y: e.clientY
        }
        var boxRect = box.getBoundingClientRect();
        document.onmousemove = function (e) {
            var nowMouse = {
                x: e.clientX,
                y: e.clientY
            }
            if(MoveTop) {
                var BoxTop = nowMouse.y;
                var BoxHeight = boxRect.height + (startMouse.y - nowMouse.y);
                if(BoxHeight < minHeight) {
                    BoxHeight = minHeight;
                    BoxTop = boxRect.bottom - minHeight;
                }
                if(nowMouse.y <= 0) {
                    BoxTop = 0;
                    BoxHeight = boxRect.height + startMouse.y;
                }
                css(box, 'top', BoxTop);
                css(box, 'height', BoxHeight);
            }
            if(MoveLeft) {
                var BoxLeft = nowMouse.x;
                var BoxWidth = boxRect.width + (startMouse.x - nowMouse.x);
                if(BoxWidth < minWidth) {
                    BoxWidth = minWidth;
                    BoxLeft= boxRect.right - minWidth;
                }
                if(nowMouse.x <= 0) {
                    BoxLeft = 0;
                    BoxWidth = boxRect.Width + startMouse.x;
                }
                css(box, 'left', BoxLeft);
                css(box, 'width', BoxWidth);
            }
            if(MoveBottom) {
                var conHeight = css(con,'height');
                var MaxBoxHeight = conHeight - boxRect.top;
                var BoxHeight = boxRect.height + (nowMouse.y - startMouse.y);
                if(BoxHeight < minHeight) {
                    BoxHeight = minHeight;
                }
                if(BoxHeight >= MaxBoxHeight) {
                    BoxHeight = MaxBoxHeight;
                }
                css(box, 'height', BoxHeight);
            }
            if(MoveRight) {
                var conWidth = css(con,'width');
                var MaxBoxWidth = conWidth - boxRect.left;
                var BoxWidth = boxRect.width + (nowMouse.x - startMouse.x);
                if(BoxWidth < minWidth) {
                    BoxWidth = minWidth;
                }
                if(BoxWidth >= MaxBoxWidth) {
                    BoxWidth = MaxBoxWidth;
                }
                css(box, 'width', BoxWidth);
            }
            var boxlist = box.children[2].children[1];
            render(getChildren(boxlist.dataPid),boxlist);
        }
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        return false;
    }
}

/**
 * 窗口右上角
 */
function createWindowBar(el, barLi) {
    var windowBoxBarModel = document.createElement('ul');
    windowBoxBarModel.className = "windowBox-bar-model";
    var li = document.createElement('li');
    li.innerHTML = "-";
    /**
     * 隐藏窗口
     */
    li.onclick = function () {
        this.parentNode.parentNode.style.display = 'none';
    }
    windowBoxBarModel.appendChild(li);
    var li = document.createElement('li');
    li.innerHTML = "+";
    /**
     * 最大化
     */
    li.onclick = function () {
        maxWindow(el);
    }
    windowBoxBarModel.appendChild(li);
    var li = document.createElement('li');
    li.innerHTML = "x";
    /**
     * 关闭窗口
     */
    li.onclick = function () {
        con.removeChild(li.parentNode.parentNode);
        barLi.parentNode.removeChild(barLi);
    }
    windowBoxBarModel.appendChild(li);
    el.appendChild(windowBoxBarModel);
}

/**
 * 任务栏
 */
function createFooterBarLi(window) {
    var footerBar = document.querySelector('.footerBar');
    var li = document.createElement('li');
    li.onclick = function () {
        if(window.style.display == 'block') {
            window.style.display = 'none';
        } else {
            window.style.display = 'block';
            window.style.zIndex = explorerZIndex++;
        }
    }
    var img = document.createElement('img');
    if (window.className == 'Calculator') {
        img.src = "img/icos/Calculation-WF2.png";
    } else {
        img.src = "img/icos/Open Folder-WF.png";
    }
    li.appendChild(img);
    footerBar.appendChild(li);
    return li;
}

/**
 * 生成计算器
 */
function createCalculator() {
    var Calculator = document.createElement('div');
    Calculator.className = "Calculator";
    Calculator.style.zIndex = explorerZIndex++;
    Calculator.onclick = function() {
        this.style.zIndex = explorerZIndex++;
    };
    var CalculatorHeader = document.createElement('div');
    CalculatorHeader.className = "windowBox-mod-header";
    var h3 = document.createElement('h3');
    h3.innerHTML = "计算器";
    drag({
        el:h3,
        el2:Calculator
    });
    CalculatorHeader.appendChild(h3);
    Calculator.appendChild(CalculatorHeader);
    var barLi = createFooterBarLi(Calculator);  //任务栏
    createWindowBar(Calculator, barLi); //右上角
    var CalculatorCon = document.createElement('div');
    CalculatorCon.className = 'CalculatorCon';
    var p = document.createElement('p');
    CalculatorCon.appendChild(p);
    var p = document.createElement('p');
    CalculatorCon.appendChild(p);
    var CalculatorList = document.createElement('ul');
    CalculatorList.className = 'CalculatorList';
    CalculatorList.innerHTML = '<li>CE</li><li>C</li><li>Del</li><li>/</li><li>7</li><li>8</li><li>9</li><li>*</li><li>4</li><li>5</li><li>6</li><li>-</li><li>1</li><li>2</li><li>3</li><li>+</li><li>0</li><li>.</li><li>=</li>';
    Calculator.appendChild(CalculatorCon);
    Calculator.appendChild(CalculatorList);
    con.appendChild(Calculator);
    CalculatorFns(CalculatorList);
}
var CalculatorStr = 0;
function CalculatorFns(el) {
    var lis = el.querySelectorAll('li');
    var p1 = el.previousElementSibling.children[0];
    var p2 = el.previousElementSibling.children[1];
    for(var i = 3; i < lis.length - 1; i++) {
        lis[i].onclick = (function (i) {
            return function () {
                CalculatorStr = lis[i].innerHTML;
                p1.innerHTML += CalculatorStr;
            }
        })(i);
    }
    lis[lis.length - 1].onclick = function () {
        CalculatorStr = lis[i].innerHTML;
        p1.innerHTML += CalculatorStr;
    }
}

/*
* 创建上下文菜单
* */
var contextmenuElement = document.querySelector('#contextmenu');
function createContextmenu(e, data) {
    var originEvent = e;
    contextmenuElement.style.display = 'block';
    contextmenuElement.style.left = e.clientX + 'px';
    contextmenuElement.style.top = e.clientY + 'px';
    contextmenuElement.innerHTML = '';
    contextmenuElement.style.zIndex = 99999999;
    data.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML = item.name;
        if (item.disabled) {
            li.className = 'disabled';
            li.style.cursor = 'not-allowed';
        }
        li.onclick = function(e) {
            if (typeof item.exe == 'function') {
                item.exe(e, originEvent);
            }
        }
        if(item.src) {
            var img = document.createElement('img');
            img.src = item.src;
            li.appendChild(img);
        }
        if(item.child) {
            var ul = document.createElement('ul');
            item.child.forEach(function (itemchild) {
                var li = document.createElement('li');
                li.innerHTML = itemchild.name;
                li.onclick = function (e) {
                    if (typeof itemchild.exe == 'function') {
                        itemchild.exe(e, originEvent);
                    }
                }
                ul.appendChild(li);
            });
            li.appendChild(ul);
        }
        contextmenuElement.appendChild(li);
    });
    var rect = contextmenuElement.getBoundingClientRect();
    var winW = document.documentElement.clientWidth;
    var winH = document.documentElement.clientHeight;
    if(rect.right + 100 > winW) {
        var uls = contextmenuElement.querySelectorAll('ul');
        uls.forEach(function (ul) {
            ul.style.left = '-100px';
        })
    }
    if(rect.right > winW) {
        contextmenuElement.style.left = winW - rect.width + 'px';
    }
    if(rect.bottom > winH) {
        contextmenuElement.style.top = winH - rect.height + 'px';        
    }
    e.preventDefault();
    e.stopPropagation();
}

/**
 * 创建文件窗口
 */
function createFileWindow(li) {
    var fileShow = document.createElement('div');
    fileShow.className = "fileShow";
    fileShow.style.zIndex = explorerZIndex++;
    fileShow.onclick = function() {
        this.style.zIndex = explorerZIndex++;
    };
    var fileShowHeader = document.createElement('div');
    fileShowHeader.className = "windowBox-mod-header";
    var h3 = document.createElement('h3');
    h3.innerHTML = li.name;
    drag({
        el:h3,
        el2:fileShow
    });
    fileShowHeader.appendChild(h3);
    fileShow.appendChild(fileShowHeader);
    var barLi = createFooterBarLi(fileShow);
    createWindowBar(fileShow, barLi);
    con.appendChild(fileShow);
    return fileShow;
}

/**
 * 创建视频窗口
 */
function createVideoWidow(li,boxEl) {
    var videoWrap = document.createElement('div');
    videoWrap.className = 'videoWrap';
    var video = document.createElement('video');
    video.src = li.dataUrl;
    video.controls = 'controls';
    video.autoplay = "autoplay";
    videoWrap.appendChild(video);
    boxEl.appendChild(videoWrap);
}

/**
 * 创建音乐窗口
 */
function createAudioWindow(li,boxEl) {
    var audioWindow = document.createElement('div');
    audioWindow.className = 'audioWindow';
    var img = document.createElement('img');
    img.src = 'img/play/img2.png';
    audioWindow.appendChild(img);
    var h4 = document.createElement('h4');
    h4.innerHTML = li.name;    
    audioWindow.appendChild(h4);
    var bgAudio = document.createElement('audio');
    bgAudio.className = 'bgAudio';
    bgAudio.src = li.dataUrl;
    bgAudio.controls = 'controls';
    bgAudio.autoplay = "autoplay";
    bgAudio.loop = "loop";
    audioWindow.appendChild(bgAudio);
    boxEl.appendChild(audioWindow);
}

/**
 * 创建属性窗口
 */
// function createSetBox() {

// }