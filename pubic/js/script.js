// swiper初始化 导航 和 主体内容 联动
var mySwiper = new Swiper('.content', {
        onSlideChangeStart: function(e) {
            // 获取当前滑动的下标
            var ind = e.activeIndex;
            //排他
            $('.nav span').eq(ind).addClass('active').siblings().removeClass('active');
        }
    })
    // 事件委托
$('.nav').on('click', 'span', function() {
    //当前导航对应的下标
    var i = $(this).index();

    // 调用mySwiper实例中的一个方法。跳转到对应下标的滑块
    mySwiper.slideTo(i);
})

// 列表数据渲染
var limit = 20, // 数据有多少条
    pagenum = 1; // 第几页内容

$.ajax({
    url: 'data/data.json',
    data: {
        limit: limit,
        pagenum: pagenum
    },
    success: function(response) {

        setHtml(response);
    }

})

function setHtml(data) {
    var html = '';

    $.each(data.list, function(i, v) {
        html += `<li class="col-xs-4">
                    <div>
                        <img src="${v.img}" alt="">
                        <span>${v.person}</span>
                    </div>
                    <h5>${v.title}</h5>
                    <p>${v.p}</p>
                </li>`;
    })

    $('.list').append(html);
    // ajax得到数据是异步的请求。第一次初始化和后面加载内容后，区域滚动实例高度需要刷新
    myIScroll.refresh(); //当数据加载完成后，刷新区域滚动实例

}

// iScroll区域滚动初始化
var myIScroll = new IScroll('.index', {
    scrollbars: true, //有滚动条
    fadeScrollbars: true, //渐隐
    probeType: 2 //监听滚动条事件
})

myIScroll.on('scroll', function() {
    // 上拉
    // this.y 区域滚动当前y轴坐标
    // maxScrollY 当前滚动到底部的 值
    if (this.y < this.maxScrollY - 50) {
        $('.download').text('释放加载');
    } else if (this.y < this.maxScrollY - 20) {
        $('.download').text('上拉加载更多。。。');
    }

    // 下拉
    if (this.y > 50) {
        // 往下滑动页面超过50px，那么画布将会旋转
        $('.loading').addClass('ani');
    } else if (this.y > 10) {
        // 往下滑动页面超过10px，那么画布将会停止旋转
        $('.loading').removeClass('ani');
    }
})

// 区域滚动插件 scrollEnd 如果在这里不改变  download里面的文本 那么 数据将会每次触摸结束后都会加重
myIScroll.on('scrollEnd', function() {
    $('.download').text('上拉加载更多。。。');

    $('.loading').removeClass('ani');
})

// 在首页 滑动结束时候触发
$('.index').on('touchend', function() {
    // 判断当前 download里面文本内容 是不是 释放加载 如果是 请求ajax 得到下一页 20条数据 在页面中显示
    if ($('.download').text() === '释放加载') {
        // 请求服务器 分页中 页码改变更新数据
        pagenum++;

        //加载数据
        $.ajax({
            url: 'data/data.json',
            data: {
                limit: limit, //每次20条数据
                pagenum: pagenum //页码 动态
            },
            success: function(response) {

                setHtml(response);
            }

        })
    }

    // 画布
    if ($('.loading').hasClass('ani')) {
        window.location.reload(); //刷新页面
    }
})

// 颜色的数据
var loadingColor = ['red', 'purple', 'skyblue', 'green', 'yellow', 'gold'];
// 绘制canvas
function drawloading(el) {
    //找到画布元素
    var canvas = document.querySelector(el);
    // 得到上下文
    var ctx = canvas.getContext('2d');
    //居中点
    var x = canvas.width / 2;

    //改变画布原点
    ctx.translate(x, x);

    //1度 = 多少弧度
    var deg = Math.PI / 180;

    // 每块扇形的角度 360 除以 颜色数据 
    var radius = 360 / loadingColor.length; //60

    loadingColor.map(function(v, i) {
        console.log(i, v)
        ctx.beginPath(); //开始绘制路径
        ctx.moveTo(0, 0); //之前移动的画布原点 画布的中间位置
        ctx.arc(0, 0, x, i * radius * deg, (i * radius + radius) * deg);
        // 1起始角 0 结束角  60* deg
        // 2起始角 60 结束角  120* deg
        // 3起始角 120 结束角  180* deg
        ctx.fillStyle = v;
        ctx.lineWidth = 10;
        ctx.fill();

    })



}

drawloading(".loading");