/**
 * Created by hodo on 2017/6/21.
 */

var colorArr=["pink","#c29f7c","#8e9aa8"];
// 颜色值
var colorRand = ["#3bb19c", "#ef553b", "#414a4e", "#d3d9dc", "#19a4e1", "#2bc8ed", "#63d1c4", "#f58f63"];


////////////////////////////////////////////////////////////


var section3=document.getElementsByClassName("section-3")[0];
var section4=document.getElementsByClassName("section-4")[0];
for(var i=0;i<colorArr.length;i++)
{
    section3.getElementsByTagName("li")[i].index=i;
    section4.getElementsByTagName("li")[i].index=i;
}

//获取左右箭头并
var Sec3arrSpan=$(".section-3 .arrow span");
var Sec4arrSpan=$(".section-4 .arrow span");
//    console.log(arrSpan);
var Sec3bigSlide=document.getElementsByClassName("section-slide")[0];
var Sec4bigSlide=document.getElementsByClassName("section-slide")[1];
var bigStep=Sec3bigSlide.offsetWidth;
var bigHight=Sec3bigSlide.offsetHeight;
var Sec3smallSlide=document.getElementsByClassName("section-slide-mini")[0];
var Sec4smallSlide=document.getElementsByClassName("section-slide-mini")[1];
var smallStep=Sec3smallSlide.offsetWidth;
var smallHeight=Sec3smallSlide.offsetHeight;
var Sec3bigSlideUl=Sec3bigSlide.getElementsByTagName("ul")[0];
var Sec3smallSlideUl=Sec3smallSlide.getElementsByTagName("ul")[0];
var Sec4bigSlideUl=Sec4bigSlide.getElementsByTagName("ul")[0];
var Sec4smallSlideUl=Sec4smallSlide.getElementsByTagName("ul")[0];
var Sec3bigSlideLi=Sec3bigSlideUl.getElementsByTagName("li");
var Sec3smallSlideLi=Sec3smallSlideUl.getElementsByTagName("li");
var Sec4bigSlideLi=Sec4bigSlideUl.getElementsByTagName("li");
var Sec4smallSlideLi=Sec4smallSlideUl.getElementsByTagName("li");
var newLi=Sec3bigSlideLi[0].cloneNode(true);
Sec3bigSlideUl.appendChild(newLi);
newLi=Sec3smallSlideLi[0].cloneNode(true);
Sec3smallSlideUl.append(newLi);
newLi=Sec4bigSlideLi[0].cloneNode(true);
Sec4bigSlideUl.appendChild(newLi);
newLi=Sec4smallSlideLi[0].cloneNode(true);
Sec4smallSlideUl.appendChild(newLi);
var key=0;
Sec3arrSpan[0].onclick=function()
{
    key--;
    if(key===-1)
    {
        Sec3bigSlideUl.style.left = -(Sec3bigSlideLi.length-1)*bigStep+"px";
        $("body > div.wraper > div.section-3 > div.section-slide > div > ul")[0].style.left = "-600px";
        key = Sec3bigSlideLi.length-2;
    }
    $(".section-3 .number").html(key+1+"/3");
    animate(Sec3bigSlideUl,{left:-key*bigStep});
    animate(Sec3smallSlideUl,{left:-key*smallStep});

    setColorRand($(".section-3")[0]);

}

Sec3arrSpan[1].onclick=function()
{
    key++;
    if(key===Sec3bigSlideLi.length)
    {
        Sec3bigSlideUl.style.left = 0 + "px";
        $("body > div.wraper > div.section-3 > div.section-slide > div > ul")[0].style.left = "0px";
        key = 1;
    }
    if(key===Sec3bigSlideLi.length-1)
    {
        $(".section-3 .number").html(1+"/3");
    }
    else
    {
        $(".section-3 .number").html(key+1+"/3");
    }
    animate(Sec3bigSlideUl,{left:-key*bigStep});
    animate(Sec3smallSlideUl,{left:-key*smallStep});

    setColorRand($(".section-3")[0]);

}

var keys=0;
Sec4arrSpan[0].onclick=function()
{
    keys--;
    if(keys===-1)
    {
        Sec4bigSlideUl.style.left = -(Sec4bigSlideLi.length-1)*bigStep+"px";
        $("body > div.wraper > div.section-4 > div.section-slide > div > ul")[0].style.left = "-600px";
        keys = Sec4bigSlideLi.length-2;
    }
    $(".section-4 .number").html(keys+1+"/3");
    animate(Sec4bigSlideUl,{left:-keys*bigStep});
    animate(Sec4smallSlideUl,{left:-keys*smallStep});

    setColorRand($(".section-4")[0]);
}

Sec4arrSpan[1].onclick=function()
{
    keys++;
    if(keys===Sec4bigSlideLi.length)
    {
        Sec4bigSlideUl.style.left = 0;
        $("body > div.wraper > div.section-4 > div.section-slide > div > ul")[0].style.left = "0px";
        keys = 1;
    }

    if(keys===Sec4bigSlideLi.length-1)
    {
        $(".section-4 .number").html(1+"/3");
    }
    else
    {
        $(".section-4 .number").html(keys+1+"/3");
    }
    animate(Sec4bigSlideUl,{left:-keys*bigStep});
    animate(Sec4smallSlideUl,{left:-keys*smallStep});

    setColorRand($(".section-4")[0]);
}

// 分享
var share=document.getElementById("share");
var shareTop=share.getElementsByClassName("share-top")[0];
var shareBottom=share.getElementsByClassName("share-bottom")[0];
share.onmouseleave=function()
{
    animate(shareTop,{height:0});
    animate(shareBottom,{height:0});
}

share.onmouseenter=function()
{
    animate(shareTop,{height:50});
    animate(shareBottom,{height:50});
}



/////////////////////////////////////////////////////////////