/********************** 音频 BEGIN **************/
//音频播放
function audioPlay(musicId) {
	let au = document.getElementById(musicId)
	au.play()
	document.addEventListener('WeixinJSBridgeReady', function () {
		au.play()
	}, false)
}

// 暂停
function audioPause(musicId) {
	let au = document.getElementById(musicId)
	au.pause()
	document.addEventListener('WeixinJSBridgeReady', function () {
		au.pause()
	}, false)
}


// 背景音乐默认播放
audioPlay('bgmusic')
let audioFlag = true
function musicAction() {
	if (audioFlag) {
		audioPause('bgmusic')
		audioFlag = false
		$('#musicIcon').removeClass('mplay').addClass('mpause')

	} else {
		audioPlay('bgmusic')
		audioFlag = true
		$('#musicIcon').removeClass('mpause').addClass('mplay')

	}
}

document.getElementById('musicIcon').onclick = function () {
	musicAction()
}

// 预加载其他声音文件
setTimeout(() => {
	audioPlay('ding')
	audioPause('ding')
}, 200)

setTimeout(() => {
	audioPlay('huanhu')
	audioPause('huanhu')
}, 200)

/********************** 音频 END **************/


/********************** 加载动画素材 BEGIN **************/
// 加载素材 
import {
	p1Arr,
	p2Arr,
	p2Arr2,
	p3Arr,
	p4Arr,
	p5Arr,
	spriteGroupBgObject,
	sence1Object,
	sence2Object,
	sence3Object,
	sence4Object,
	spriteGroupLastObject
} from './data.js'
PIXI.loader
	.add(p1Arr)
	.add(p2Arr)
	.add(p2Arr2)
	.add(p3Arr)
	.add(p4Arr)
	.add(p5Arr)
	.on('progress', function (loader, resource) {
		// console.log(loader.progress)
		$('#loadingProgress').html(Math.round(loader.progress) + '%')

	})
	.load(setup)

// 总时间轴
let allTimeline = new TimelineMax({
	paused: true
})

// 舞台
let app = null

// setup 函数
function setup() {
	// load加载完毕
	$('#loadingProgress').hide()
	setTimeout(() => {
		$('#tip').fadeIn('slow')
		setTimeout(() => {
			$('#tip').addClass('upTip')
		}, 1500);
	}, 1000);


	app = new PIXI.Application({
		width: 750,
		height: 1448
	})

	document.getElementById("stage").appendChild(app.view)


	// 创建精灵组
	let spriteGroupBg = new PIXI.Container()
	spriteGroupBg.position.set(0, 0)
	spriteGroupBg.name = 'spriteGroupBg'
	app.stage.addChild(spriteGroupBg)

	let spriteGroupSences = new PIXI.Container()
	spriteGroupSences.position.set(0, 0)
	spriteGroupSences.name = 'spriteGroupSences'
	app.stage.addChild(spriteGroupSences)

	let sence1 = new PIXI.Container()
	sence1.position.set(1784, 621)
	sence1.pivot.set(1784, 621)
	sence1.name = 'sence1'

	let sence2 = new PIXI.Container()
	sence2.position.set(1773, 0)
	sence2.name = 'sence2'
	sence2.alpha = 0

	let sence3 = new PIXI.Container()
	sence3.position.set(4960, 0)
	sence3.name = 'sence3'

	let sence4 = new PIXI.Container()
	sence4.position.set(7902, 0)
	sence4.name = 'sence4'

	spriteGroupSences.addChild(sence1)
	spriteGroupSences.addChild(sence2)
	spriteGroupSences.addChild(sence3)
	spriteGroupSences.addChild(sence4)


	let spriteGroupLast = new PIXI.Container()
	spriteGroupLast.position.set(-203, 0)
	spriteGroupLast.name = 'spriteGroupLast'
	app.stage.addChild(spriteGroupLast)

	// 添加精灵到精灵组
	let spritesObject = []
	spritesObject.push(...spriteGroupBgObject)
	spritesObject.push(...sence1Object)
	spritesObject.push(...sence2Object)
	spritesObject.push(...sence3Object)
	spritesObject.push(...sence4Object)
	spritesObject.push(...spriteGroupLastObject)


	for (let key of Object.keys(spritesObject)) {
		let temp = spritesObject[key]
		addSprToGruop(temp.img, temp.x, temp.y, temp.alpah, temp.sprName, temp.sprGroup)
	}

	// 各种滑动

	tweenAction()
	$('#loading').on('touchstart',()=>{
		$('#loading').hide()
		touchAction()
	})

}

// 创建精灵组，加载精灵
function addSprToGruop(img, x, y, alpah, sprName, sprGruop) {
	let spr = new PIXI.Sprite(PIXI.Texture.fromImage(img))
	spr.position.set(x, y)
	spr.alpha = alpah
	spr.name = sprName

	let sprArr = sprGruop.split('/')
	let sprites = app.stage.getChildByName(sprArr[0])
	let sprArrNum = sprArr.length

	if (sprArrNum > 1) {
		for (let i = 1; i < sprArrNum; i++) {
			let midName = sprArr[i]
			sprites = sprites.getChildByName(midName)
		}
	}

	sprites.addChild(spr)
}
/********************** 加载动画素材 END **************/


/********************** 识别滑动 BEGIN **************/
let maxLong = -(10800 - 750)
//  seek progress
function touchAction() {
	let alloyTouch = new AlloyTouch({
		touch: 'body',
		vertical: false,
		maxSpeed: 0.8,
		max: 0,
		min: maxLong,
		bindSelf: false,
		initialValue: 0,
		change: function (value) {
			if ((value <= 0) && (value > maxLong)) {
				let progress = value / maxLong
				allTimeline.seek(progress)
				animationPlay(progress)
				audioAction(progress)
			}
		}
	})
}

/********************** 识别滑动 END **************/



/********************** 时间轴动画 BEGIN **************/
// 子时间轴 TweenMax
function tweenAction() {
	let sences = app.stage.getChildByName('spriteGroupSences')
	let sencesTimeline = new TimelineMax({ delay: 0 })
	let sencesTween = new TweenMax.to(sences.position, 1, { x: maxLong })
	sencesTimeline.add(sencesTween, 0)
	allTimeline.add(sencesTimeline, 0)


	// 星星显现
	let star = app.stage.getChildByName('spriteGroupSences').getChildByName('sence1').getChildByName('p1Star')
	let starStartTimeLine = -15 / maxLong
	let starDuringTime = -25 / maxLong
	let starTimeLine = new TimelineMax({ delay: starStartTimeLine })
	let starTween = TweenMax.to(star, starDuringTime, { alpha: 1 })
	starTimeLine.add(starTween, 0)
	allTimeline.add(starTimeLine, 0)

	// 房子放大
	let house = app.stage.getChildByName('spriteGroupSences').getChildByName('sence1')
	let houseStartTime = -600 / maxLong
	let houseDuringTime = -200 / maxLong
	let houseTimeLine = new TimelineMax({ delay: houseStartTime })
	let houseTween1 = TweenMax.to(house.scale, houseDuringTime, { x: 3, y: 3 })
	let houseTween2 = TweenMax.to(house, houseDuringTime, { alpha: 0 })
	houseTimeLine.add(houseTween1, 0)
	houseTimeLine.add(houseTween2, 0)
	allTimeline.add(houseTimeLine, 0)

	let sence2 = app.stage.getChildByName('spriteGroupSences').getChildByName('sence2')
	let sence2StartTime = -680 / maxLong
	let sence2DuringTime = -100 / maxLong
	let sence2Timeline = new TimelineMax({ delay: sence2DuringTime })
	let sences2Tween = TweenMax.to(sence2, sence2DuringTime, { alpha: 1 })
	sence2Timeline.add(sences2Tween, 0)
	allTimeline.add(sence2Timeline, 0)

	// 音符飘动
	let yinfu = app.stage.getChildByName('spriteGroupSences').getChildByName('sence2').getChildByName('p2Yinfu')
	let yinfuStartTime = -2450 / maxLong
	let yinfuDuringTime = -800 / maxLong
	let yinfuTimelne = new TimelineMax({ delay: yinfuStartTime })
	let yinfuTWeen = TweenMax.to(yinfu.position, yinfuDuringTime, { x: 3400, y: 300 })
	let yinfuTWeen2 = TweenMax.to(yinfu, yinfuDuringTime, { alpha: 0 })
	yinfuTimelne.add(yinfuTWeen, 0)
	yinfuTimelne.add(yinfuTWeen2, 0)
	allTimeline.add(yinfuTimelne, 0)

	// 黑夜缩小窗户
	let chuang = app.stage.getChildByName('spriteGroupSences').getChildByName('sence3').getChildByName('p32')
	let chuangStartTime = -2780 / maxLong
	let chuangDuringTime = -800 / maxLong
	let chuangTimeline = new TimelineMax({ delay: chuangStartTime })
	let chuangTween = new TweenMax.from(chuang.position, chuangDuringTime, { x: 0, y: -20 })
	let chuangTween2 = TweenMax.from(chuang.scale, chuangDuringTime, { x: 5, y: 5 })
	chuangTimeline.add(chuangTween, 0)
	chuangTimeline.add(chuangTween2, 0)
	allTimeline.add(chuangTimeline, 0)

	// 工作中的小男孩
	let boyWorking = app.stage.getChildByName('spriteGroupSences').getChildByName('sence3').getChildByName('p31')
	let bwStartTime = - 2780 / maxLong
	let bwfuDuringTime = -600 / maxLong
	let bwTimeline = new TimelineMax({ delay: bwStartTime })
	let bwTween = TweenMax.to(boyWorking, bwfuDuringTime, { alpha: 1 })
	bwTimeline.add(bwTween, 0)
	allTimeline.add(bwTimeline, 0)

	// 旋涡显示
	let xun = app.stage.getChildByName('spriteGroupLast').getChildByName('bgLast')
	let xunStartTime = - 6613 / maxLong
	let xunDuringTime = -1000 / maxLong
	let xunTimeline = new TimelineMax({ delay: xunStartTime })
	let xunTween = TweenMax.to(xun, xunDuringTime, { alpha: 1 })
	xunTimeline.add(xunTween, 0)
	allTimeline.add(xunTimeline, 0)
}
/********************** 时间轴动画 END **************/


/********************** 序列帧 BEGIN **************/
// 动画进度

function animationPlay(progress) {
	// 孩子蹒跚学走路
	let childStepStartTime = -900 / maxLong
	let childDuringTime = -1300 / maxLong

	if (progress >= childStepStartTime) {
		let childNum = p2Arr2.length
		let childIndex = Math.floor((progress - childStepStartTime) / childDuringTime * childNum)
		if (childIndex < childNum && childIndex >= 0) {
			app.stage.getChildByName('spriteGroupSences').getChildByName('sence2').getChildByName('p2Child').texture = new PIXI.Texture.fromImage(p2Arr2[childIndex])
		}
	}

	// 旋涡 扣题
	let xunStartTime = -6613 / maxLong
	let xunDuringTime = -1000 / maxLong

	if (progress > xunDuringTime) {
		let xunNum = p5Arr.length
		let xunIndex = Math.floor((progress - xunStartTime) / xunDuringTime * xunNum)
		if (xunIndex < xunNum && xunIndex >= 0) {
			app.stage.getChildByName('spriteGroupLast').getChildByName('bgLast').texture = new PIXI.Texture.fromImage(p5Arr[xunIndex])
		}
	}

		// 旋涡 扣题
		let ewmStartTime = -7600 / maxLong
		if(progress >= ewmStartTime){
			$('.ewm').show()
		} else{
			$('.ewm').hide()

		}
	}
/********************** 序列帧 END **************/






/********************** 加载页 BEGIN **************/
//加载页

/********************** 加载页 END **************/


/********************** 声音 BEGIN **************/
//声音
function audioAction(progress) {
	// 出生
	let timeDur = 20
	let auStarStartTime = -40 / maxLong
	let auStarEndTime = -(40 + timeDur) / maxLong
	if (progress >= auStarStartTime && progress <= auStarEndTime) {
		audioPlay('ding')
	}
	if (progress <= auStarStartTime) {
		audioPause('ding')
	}

	// 欢呼
	let auHuanhutimeDur = 20
	let auHuanhuStartTime = -2270 / maxLong
	let auHuanhuEndTime = -(-2270 + auHuanhutimeDur) / maxLong
	if (progress >= auHuanhuStartTime && progress <= auHuanhuEndTime) {
		audioPlay('huanhu')
	}
	if (progress <= auHuanhuStartTime) {
		audioPause('huanhu')
	}
}

/********************** 声音 END **************/





/********************** 优化 BEGIN **************/
//优化

/********************** 优化 END **************/

