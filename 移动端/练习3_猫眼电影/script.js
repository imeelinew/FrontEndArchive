var oHotList = document.querySelectorAll(".hot-item");
var oSlider = document.querySelector(".slider");
var oBottomBtns = document.querySelectorAll(".bottom-btns li");
var positions = ["18%", "50%", "84%"];

for (var i = 0; i < oHotList.length; i++) {
    oHotList[i].index = i;
    oHotList[i].ontouchstart = function () {
        for (var j = 0; j < oHotList.length; j++) {
            //切换效果
            oHotList[j].classList.remove("active");
        }
        this.classList.add("active");
        // 横条动画
        oSlider.style.left = positions[this.index];
    }
}
//底部切换动画
for (var j = 0; j < oBottomBtns.length; j++) {
    oBottomBtns[j].ontouchstart = function () {
        for (var k = 0; k < oBottomBtns.length; k++) {
            oBottomBtns[k].classList.remove("active");
        }
        this.classList.add("active");
    }
}

