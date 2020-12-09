/*
 * @Author: 刁琪
 * @Date: 2020-11-27 15:27:23
 * @LastEditors: わからないよう
 */
import E from 'wangeditor'
import axios from './axios.js';
import './style.css';
import logo from './images/titbg.png'
const editor = new E('#editor')
let edhei = 0
if (window.innerWidth > 1000) {
  edhei = 500
} else {
  edhei = window.innerHeight-300
}
const config = {
  height: edhei,
  zIndex: 500,
  showFullScreen: false,
  menus: [ 'head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'lineHeight', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'emoticon', 'image', 'table', 'splitLine' ]
}
editor.config = Object.assign(editor.config, config)
editor.create()

const bigImg = document.createElement("img");
bigImg.src = logo;
bigImg.width="1297";
document.getElementById('logo-area').appendChild(bigImg)

let artVal = 0 // 缓存当前文章id 避免编辑文章且未保存时改动id
let historyList = [] // 历史记录
console.log(process.env.NODE_ENV);
// 点击按钮查询
document.querySelector('.searchbtn').addEventListener('click', ()=> {
  if (document.querySelector('.titleipt').value) {
    artVal = document.querySelector('.titleipt').value
    editor.txt.clear()
    readVal(artVal)
  } else {
    tips('请输入笔记编码', 'red')
  }
})
// 查询历史记录
document.querySelector('.hisbtn').addEventListener('click', ()=> {
  if (document.querySelector('.titleipt').value) {
    artVal = document.querySelector('.titleipt').value
    readHistory(artVal)
  } else {
    tips('请输入笔记编码', 'red')
  }
})

// 隐藏历史记录
document.querySelector('.clsbtn').addEventListener('click', ()=> {
  document.querySelector('.hismodel').className = 'hismodel'
})
// 回车查询
document.querySelector('.titleipt').addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    if (document.querySelector('.titleipt').value) {
      artVal = document.querySelector('.titleipt').value
      editor.txt.clear()
      readVal(artVal)
    } else {
      tips('请输入笔记编码', 'red')
    }
  }
}, true);

// 点击按钮保存
document.querySelector('.savebtn').addEventListener('click', ()=> {
  if (artVal !== 0) {
    saveVal()
  } else if (document.querySelector('.titleipt').value) {
    artVal = document.querySelector('.titleipt').value
    saveVal()
  } else {
    tips('请输入笔记编码', 'red')
  }
})

// Ctrl+S 保存
document.querySelector('.w-e-text').addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.keyCode === 83) {
    e.preventDefault();
    if (artVal !== 0) {
      saveVal()
    } else if (document.querySelector('.titleipt').value) {
      artVal = document.querySelector('.titleipt').value
      saveVal()
    } else {
      tips('请输入笔记编码', 'red')
    }
  }
}, true);

// 获取历史口
function readHistory(id) {
  axios.post('/picert/user/gethistory', {
    artid: id
  }).then(function (res) {
    if (res.data && res.data[0]) {
      historyList = res.data
      let str = ''
      for (let item of res.data) {
        str += `<tr><td>${item.val}</td><td>${item.savetime}</td><td data-idx="${item.id}" class="seehis">查看</td></tr>`
      }
      document.querySelector('#histbody').innerHTML = str
      document.querySelector('.hismodel').className = 'hismodel showmdl'
      // 查看历史按钮
      const btns = document.querySelectorAll('.seehis')
      for (let i = 0; i < btns.length;i++) {
        btns[i].addEventListener('click', (e)=> {
          const slct = historyList.find((item) => {
            return item.id === e.target.dataset.idx-0
          })
          editor.txt.html(slct.val)
          document.querySelector('.hismodel').className = 'hismodel'
        })
      }
    } else if (res.data.length === 0) {
      tips('该笔记编码并没有历史记录', 'red')
    }
  })
}

// 获取文章详情接口
function readVal(id) {
  axios.post('/picert/user/getartinfo', {
    artid: id
  }).then(function (res) {
    if (res.data && res.data[0]) {
      editor.txt.html(res.data[0].val)
    } else if (res.data.length === 0) {
      editor.txt.clear()
    }
  })
}

// 编辑保存接口
function saveVal() {
  if (!editor.txt.html()) {
    tips('笔记内容不能为空', 'red')
    return false
  }
  axios.post('/picert/user/saveart', {
    artid: artVal,
    val: editor.txt.html()
  }).then(function (res) {
    if (res.data.affectedRows) {
      tips('保存成功', 'green')
    } else if (res.data.affectedRows === 0) {
      addVal()
    }
  })
}

// 编辑保存时报错 改为调用新增文章接口
function addVal() {
  axios.post('/picert/user/addart', {
    artid: artVal,
    val: editor.txt.html()
  }).then(function (res) {
    if (res.data.affectedRows) {
      tips('保存成功', 'green')
    }
  })
}

// 封装提示框Tips 支持红色和绿色
function tips(info, type) {
  document.querySelector('.tipinfo').innerHTML = info
  document.querySelector('.tipinfo').className = 'tipinfo showtip ' + type
  setTimeout(() => {
    document.querySelector('.tipinfo').className = 'tipinfo fadeout ' + type
  },1500)
  setTimeout(() => {
    document.querySelector('.tipinfo').className = 'tipinfo hidetip'
  },1600)
}