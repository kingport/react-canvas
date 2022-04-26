import React, { useState } from 'react'
import './App.css'

function App() {

  let currentLocation = 0
  // creact imgs array
  const getImgs = () => { 
    let tatalImages = 150
    let images = []
    for (let i = 1; i < tatalImages; i++) {
      let filenName = ``
      if(i<10) {
        filenName += `000`
      }else 
      if(i <100) {
        filenName += `00`
      }else 
      if(i >=100) {
        filenName += `0`
      }
      filenName += i + `.jpeg`
      let img = new Image()
      img.src = new URL(`./img/${filenName}`, import.meta.url).href 
      images.push(img)
    }
    return {
      images,
    }
  }

  /**
   * @description
   * 更新图片
   * @param {newLocation} 当前图片展示索引
   */
  const setImage = (newLocation) => { 
    var canv = document.getElementById('background');
    var context = canv.getContext('2d');
    // console.log(newLocation, 'newLocation')
    const { images } = getImgs()
    context.drawImage(images[newLocation], 0, 0, 1280, 720);
  }

  /**
   * @description
   * 滚动距离 +为上滚动 -为下滚动
   * @param {wheelDelta} 向下滚动其值为-120；向上滚动其值为120
   * @param {detail} 监听的是detail,向下滚动其值为3；向上滚动其值为-3 
   */
  const wheelDistance = (e) => {
    // console.log(e, "E")
    let w = e.wheelDelta
    let d = e.detail
    if(d) {
      if(w) {
        return w/d/40*d>0?1:-1;
      }else {
        return -d/3
      }
    }else {
      return w/120
    }
  }

  const debounce = (func, wait = 5, immediate = true) => {
    let timer
    return (...args) => {
      let context = this
      if (timer) clearTimeout(timer)
      if (immediate) {
        let callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, wait)
        if (callNow) func.apply(context, args)
      } else {
        timer = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    }
  }

  /**
   * @description
   * 滚动事件
   * @param {e} 滚动事件参数
   */
  function mouseWheelHandler(e) {
    console.log(e, "e")
    const { images } = getImgs()
    var distance = wheelDistance(e);
    currentLocation -= Math.round(distance*3)
    console.log(currentLocation, 'currentLocation')
    if(currentLocation < 0) {
      currentLocation = 0
    }
    if(currentLocation >= images.length) { 
      currentLocation = (images.length-1)
    } 
    setImage(currentLocation)
    // throttle(setImage(currentLocation),100)
  }

  /**
   * @description
   * 窗口大小变化
   * @param {winW} 可是区域宽度
   * @param {winH} 可是区域高度
   */
  const canvasFillWin = (e) => {
    let h = 720;
    let w = 1280;
    let ratio = h/w;
    let winW = document.documentElement.clientWidth;
    let winH = document.documentElement.clientHeight;
    let winRatio = winH / winW;
    let vas = document.getElementById('background');
    console.log(winW, winH, "WINDIWS")
    if(winRatio > ratio) {
      vas.width = winH / ratio
      vas.height = winH 
      vas.style.marginLeft = -winH/ratio/2 + 'px'
      vas.style.top = 0
      vas.style.left = "50%"
      vas.style.marginTop = 0
    }else {
      vas.width = winW
      vas.height = winW * ratio 
      vas.style.marginLeft = 0
      vas.style.top = 0
      vas.style.left = "50%"
      vas.style.marginTop = -winW/ratio/2 + 'px'
    }
  }

  

  React.useEffect(() => {
    const { images } = getImgs()
    if(images.length > 0) {
      setImage(0)
    }
  }, [])

  window.addEventListener("mousewheel",debounce(mouseWheelHandler) , false);

  return (
    <div className="App">
      <canvas height="720" width="1280" id="background"></canvas>
    </div>
  )
}

export default App
