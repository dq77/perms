/*
 * @Author: 刁琪
 * @Date: 2020-11-27 15:27:23
 * @LastEditors: わからないよう
 */
import E from 'wangeditor'
import axios from './axios.js';
import './style.css';
const editor = new E('#editor')
console.log(window.innerHeight);
const config = {
  height: window.innerHeight-250,
  zIndex: 500,
  showFullScreen: false,
  menus: [ 'head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'lineHeight', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'emoticon', 'image', 'table', 'code', 'splitLine' ]
}
editor.config = Object.assign(editor.config, config)
editor.create()
let artVal = 0 // 缓存当前文章id 避免编辑文章且未保存时改动id
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