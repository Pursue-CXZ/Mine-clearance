//获取页面的所有按钮和数据
let chujiBtn = document.getElementById("chuji");
let zhongjiBtn = document.getElementById("zhongji");
let gaojiBtn = document.getElementById("gaoji");
let resetBtn = document.getElementById("reset");
let boomNum = document.getElementById("leishu");
let timer = document.getElementById("timer");
//获取渲染到页面后所有的div
let allDiv;
//获取游戏区域
let gameArea = document.getElementsByClassName("game-area")[0];
//获取最外层容器
let wrap = document.getElementById("container");

//生成的行数和列数
let row = 10, cell = 10;

//初始雷数
let Boom = 10;
//剩余雷数
let flagBoom = 10;

//初始化时间
let s = 0;
//设置一个定时器名称
let a = '';

//初始化数组地图
function map(){
    //游戏内容，生成地图
    let gameContent = [];

    //初始化地图
    for(let i = 0; i < row; i++){
        gameContent.push(Array(cell).fill(0))
    }

    //生成随机的炸弹
    function initBoom(){
        let nowBoom = 0;
        let randomX,randomY;
        while(nowBoom < Boom){
            randomX = Math.floor(Math.random() * cell);
            randomY = Math.floor(Math.random() * row);
            //有可能随机生成的两个点一样，会覆盖之前已经填好的雷，所以需要判断
            if(gameContent[randomX][randomY] === 0){
                //10表示地雷
                gameContent[randomX][randomY] = 10;
                ++nowBoom;
            }
        }
        initDisplay();
    }
    initBoom()

    //初始化单元格显示周围的雷数
    function initDisplay(){
        for(let i = 0; i < row; i++){
            for(let j = 0; j < cell; j++){
                if(gameContent[i][j] !== 10){
                    calcBoom(i,j)
                }
            }
        }
    }

    //计算九宫格雷数
    function calcBoom(x,y){
        let initNum = 0;
        let zuobiao = [
            [x-1,y-1],
            [x-1,y],
            [x-1,y+1],
            [x,y+1],
            [x,y-1],
            [x+1,y-1],
            [x+1,y],
            [x+1,y+1]
        ];
        for(let i =0; i < zuobiao.length; i++){
            let gameX = zuobiao[i][0];
            let gameY = zuobiao[i][1];
            try{
                if(gameContent[gameX][gameY] === 10){
                    ++initNum;
                }
            }catch (e) {

            }
        }
        gameContent[x][y] = initNum;
    }

    return gameContent;
}

//初始化游戏，渲染到页面上
function init(){
    let gameContent = map();
    let divs = "";
    for(let i = 0; i < row; i++){
        for(let j = 0; j < cell; j++){
            if(gameContent[i][j] === 10){
                divs += `<div data-open="no" data-x="${i}" data-y="${j}" data-nums="${gameContent[i][j]}">
                           X
                         </div>`
            }else if(gameContent[i][j] !== 0){
                divs += `<div data-open="no" data-x="${i}" data-y="${j}" data-nums="${gameContent[i][j]}">${gameContent[i][j]}</div>`
            }else{
                divs += `<div data-open="no" data-x="${i}" data-y="${j}" data-nums="${gameContent[i][j]}">&nbsp;</div>`
            }
        }
    }
    gameArea.innerHTML = divs;
    allDiv = gameArea.getElementsByTagName("div");
}
init();
boomNum.innerText = flagBoom;
s = 0;
timer.innerText = s + " 秒";
goTime();

//为所有div添加点击事件
gameArea.onclick = function(event){
    //获取点击所在的元素
    if(event.target.nodeName.toLowerCase() === "div"){
        let target = event.target;
        //获取所点击元素的数值
        let number = Number(target.getAttribute("data-nums"));
        //获取所在的行数和列数
        let currentx = Number(target.getAttribute("data-x"));
        let currenty = Number(target.getAttribute("data-y"));

        target.style.textIndent = "0";
        //如果点击后是雷，结束游戏，点击确定重新开始游戏
        if(number === 10){
            //如果点到雷，遍历所有div元素，将雷的地方变为红色，不是雷的地方，变为黄色，内容全部出来
            for(let i = 0; i < allDiv.length; i++){
                allDiv[i].style.textIndent = "0"
                if(allDiv[i].getAttribute("data-nums") == 10){
                    allDiv[i].style.backgroundColor = "red"
                }else{
                    allDiv[i].style.backgroundColor = "yellow"
                }
            }
            setTimeout(()=>{
                let res = confirm("游戏结束，是否重新开始");
                if(res){
                    init()
                    boomNum.innerText = flagBoom;
                    s = 0;
                    timer.innerText = s + " 秒";
                    goTime();
                }
            },100)
            //如果点击的地方所包含的9宫格啥都没有，那么自动开区域
        }else if(number === 0){
            target.style.backgroundColor = "yellow"
            openArea(currentx,currenty)
        }else{
            target.style.backgroundColor = "yellow";
            target.setAttribute("data-open","yes");
            target.style.textIndent = "0";
        }
        //判断最后一次点击剩余的雷数是不是和初始值一样，如果是，则胜利
        if(document.querySelectorAll("[data-open='no']").length === Boom){
            let res = confirm("你成功了，耗时"+s+"秒，是否要重新开始游戏");
            clearInterval(a);
            if(res){
                init();
                boomNum.innerText = flagBoom;
                s = 0;
                timer.innerText = s + " 秒";
                goTime();
            }
        }
    }
}
//计算并开辟空间的函数
function openArea(x,y) {
    //这里加1的目的是为了减少遍历的次数，比如，如果我点击了第一行的元素，在元素里面的data-x是0，但是你得写1
    //如果不写，你遍历的次数是0*cell，是错的，最少是1，所以加1
    let count = 3 * cell;
    //遍历的元素起始点
    let index = 0;
    //显示8宫格所对应的坐标
    let zuobiao = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1]
    ];
    //判断，如果行数是0或者1，那么起始点都是0，大于1的行数，起始点都是cell*（x-1）+1
    if(x === 0 || x === 1){
        for(let i = 0; i < count; i++){
            for(let j = 0; j < zuobiao.length; j++){
                //当遍历的元素等于坐标里面的位置，还要判断这个位置的元素是否已经被开过了（data-open），如果开过，就不管
                //没开过就进行渲染，然后改状态为开过
                //还要判断当前的值是不是0，如果是，那么保存坐标点，然后递归openArea（），直到点开的周围都不是0，停止
                if(allDiv[index].getAttribute("data-x") == zuobiao[j][0] && allDiv[index].getAttribute("data-y") == zuobiao[j][1]){
                   if(allDiv[index].getAttribute("data-open") == "no"){
                       allDiv[index].style.textIndent = "0";
                       allDiv[index].setAttribute("data-open","yes");
                       allDiv[index].style.backgroundColor = "yellow";
                       if(Number(allDiv[index].getAttribute("data-nums")) === 0){
                           let marginx = Number(allDiv[index].getAttribute("data-x"));
                           let marginy = Number(allDiv[index].getAttribute("data-y"));
                           openArea(marginx,marginy)
                       }
                   }
                }
            }
            ++index;
        }
    }else{
        index = cell*(x-1);
        for(let i = 0; i < count; i++){
            for(let j = 0; j < zuobiao.length; j++){
                //将超出坐标点的地方直接捕获不提示
                try{
                    if(allDiv[index].getAttribute("data-x") == zuobiao[j][0] && allDiv[index].getAttribute("data-y") == zuobiao[j][1]){
                       if(allDiv[index].getAttribute("data-open") == "no"){
                           allDiv[index].style.textIndent = "0";
                           allDiv[index].setAttribute("data-open","yes");
                           allDiv[index].style.backgroundColor = "yellow";
                           if(Number(allDiv[index].getAttribute("data-nums")) === 0){
                               let marginx = Number(allDiv[index].getAttribute("data-x"));
                               let marginy = Number(allDiv[index].getAttribute("data-y"));
                               openArea(marginx,marginy)
                           }
                       }
                    }
                }catch (e) {

                }
            }
            ++index;
        }
    }
}

//当鼠标右键的时候，设置标记，然后雷数减一，当雷数为0，并且
document.oncontextmenu = function(event){
    //取消右键默认行为
    event.preventDefault();
    if(event.target.nodeName.toLowerCase() === "div"){
        let target = event.target;
        //判断在标记的位置是否已经标记过并且是否打开过，如果标记过，那么取消标记，flag+1，如果没标记，那么标记，flag——1
        if(target.style.backgroundImage && target.getAttribute("data-open") == "no"){
            target.style.backgroundImage = "";
            target.style.backgroundSize = "";
            flagBoom +=1;
            boomNum.innerText = flagBoom
        }else if(!target.style.backgroundImage && target.getAttribute("data-open") == "no"){
            target.style.backgroundImage = "url(\"./images/flag.svg\")";
            target.style.backgroundSize = "25px 25px";
            flagBoom -=1;
            boomNum.innerText = flagBoom;
        }

    }
}

//点击初级按钮的时候，将
chujiBtn.onclick = function(){
    let res = confirm("是否结束当前游戏，进行新的游戏")
    if(res){
        row = 10;
        cell = 10;
        Boom = 10;
        gameArea.style.width = "270px";
        wrap.style.width = "270px";
        init();
        boomNum.innerText = flagBoom = 10;
        s = 0;
        timer.innerText = s + " 秒";
        goTime();
    }
}
zhongjiBtn.onclick = function () {
    let res = confirm("是否结束当前游戏，进行新的游戏")
    if(res){
        row = 16;
        cell = 16;
        Boom = 40;
        gameArea.style.width = "432px";
        wrap.style.width = "432px"
        init();
        boomNum.innerText = flagBoom = 40;
        s = 0;
        timer.innerText = s + " 秒";
        goTime();
    }
}
gaojiBtn.onclick = function () {
    let res = confirm("是否结束当前游戏，进行新的游戏")
    if(res){
        row = 30;
        cell = 30;
        Boom = 99;
        gameArea.style.width = "810px";
        wrap.style.width = "810px";
        init();
        boomNum.innerText = flagBoom = 99;
        s = 0;
        timer.innerText = s + " 秒";
        goTime();
    }
}
resetBtn.onclick = function(){
    let res = confirm("是否结束当前游戏，进行新的游戏")
    if(res){
        s = 0;
        timer.innerText = s + " 秒";
        goTime();
    }
}

//调用时间
function goTime(){
    clearInterval(a);
     a = setInterval(()=>{
        s += 1;
        timer.innerText = s + " 秒";
    },1000)
}
