/**
 * 桌面内容
 */
var dataList = [
    {
        id:1,
        pid:0,
        type:"Recycle",
        name:"回收站"
    },
    {
        id:2,
        pid:0,
        type:"folder",
        name:"上传文件夹"
    },
    {
        id:3,
        pid:0,
        type:"CMS",
        name:"内容管理"
    },
    {
        id:4,
        pid:3,
        type:"folder",
        name:"编程"
    },
    {
        id:5,
        pid:4,
        type:"folder",
        name:"前端"
    },
    {
        id:6,
        pid:4,
        type:"folder",
        name:"后端"
    },
    {
        id:7,
        pid:5,
        type:"folder",
        name:"HTML"
    },
    {
        id:8,
        pid:5,
        type:"folder",
        name:"CSS"
    },
    {
        id:9,
        pid:5,
        type:"folder",
        name:"javaScript"
    },
    {
        id:10,
        pid:6,
        type:"folder",
        name:"Node"
    },
    {
        id:11,
        pid:6,
        type:"folder",
        name:"PHP"
    }
];

/**
 * 临时数组
 */
var temporaryList = [];

/**
 * 粘贴数组
 */
var pasteList = [];

/**
 * 上下文菜单
 */
var mouseList = {
    common: [],
    global: [
        {
            name: "新建",
            src: "img/icos/New Mail-WF.png",
            child: [
                {
                    name: "新建文件夹",
                    exe: function(ev1,ev2) {
                        newFolderFn(ev2.target);
                    },
                },
                {
                    name: "新建文件",
                    exe: function(ev1,ev2) {
                        newFilesFn(ev2.target);
                    },
                }
            ]
        },
        // {
        //     name: "查看",
        //     src: "img/icos/Preview.png",
        //     child: [
        //         {
        //             name: "大图标",
        //             exe: function() {
        //                 addNewData({
        //                     pid: 0,
        //                     name: '',
        //                     type: 'folder'
        //                 });
        //                 render( getChildren(0), list );
        //             },
        //         },
        //         {
        //             name: "中等图标",
        //             exe: function() {
        //                 addNewData({
        //                     pid: 0,
        //                     name: '',
        //                     type: 'flies'
        //                 });
        //                 render( getChildren(0), list );
        //             },
        //         },
        //         {
        //             name: "小图标",
        //             exe: function() {
        //                 addNewData({
        //                     pid: 0,
        //                     name: '',
        //                     type: 'flies'
        //                 });
        //                 render( getChildren(0), list );
        //             },
        //         }
        //     ]
        // },
        {
            name: "粘贴",
            src: "img/icos/Paste.png",
            exe: function(ev1,ev2) {
                var el = ev2.target;
                pasteMouseFn(el);
            }
        },
        {
            name: "全选",
            src: "img/icos/Check List-WF.png",
            exe: function(ev1,ev2) {
                var el = ev2.target;
                checkMoreFn(el);
            }
        }
    ],
    folder: [
        {
            name: '打开',
            src: "img/icos/Open Folder-WF.png",
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                openMouse(arr);
            }
        },
        {
            name: '复制',
            src: "img/icos/Copy-WF.png",
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                copyMouse(arr);
            }
        },
        {
            name: '剪切',
            src: "img/icos/Cut-WF.png",
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                cutMouse(arr,el);
            }
        },
        {
            name: '重命名',
            src: "img/icos/Rename Report.png",
            exe: function(ev1,ev2) {
                var el = ev2.target;
                if(el.tagName != "LI") {
                    el = el.parentNode;
                }
                rename(el);
            }
        },
        {
            name: '删除',
            src: "img/icos/Delete-02-WF.png",
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                del(arr,el);
            }
        },
        {
            name: '属性',
            src: "img/icos/Setting_2-WF.png",
        }
    ],
    files: [
        {
            name: '复制',
            src: "img/icos/Copy-WF.png",
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                copyMouse(arr);
            }
        },
        {
            name: '剪切',
            src: "img/icos/Cut-WF.png",
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                cutMouse(arr);
            }
        },
        {
            name: '重命名',
            src: "img/icos/Rename Report.png",
            exe: function(ev1,ev2) {
                var el = ev2.target;
                if(el.tagName != "LI") {
                    el = el.parentNode;
                }
                rename(el);
            }
        },
        {
            name: '删除',
            src: "img/icos/Delete-02-WF.png",
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                del(arr,el);
            }
        },
        {
            name: '属性',
            src: "img/icos/Setting_2-WF.png",
        }
    ],
    // explorer: [
    //     {
    //         name: '最小化'
    //     },
    //     {
    //         name: '最大化'
    //     },
    //     {
    //         name: '关闭',
    //         exe: function(e1, e2) {
    //             console.log(e2.target.parentNode.parentNode)
    //             con.removeChild(e2.target.parentNode.parentNode);
    //             console.log(barLi)
    //             // var barLi = e2.target.parentNode.parentNode.querySelector('.barLi');
    //             barLi.parentNode.removeChild(barLi);
    //         }
    //     }
    // ],
    recycle: [
        {
            name: '删除',
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                removeData(arr);
            }
        },
        {
            name: '还原',
            exe: function(ev1,ev2) {
                var el = ev2.target.parentNode;
                if(el.tagName != "UL") {
                    el = el.parentNode;
                }
                var arr = onchangeEl(el);
                restore(arr);
            }
        }
    ]
};
