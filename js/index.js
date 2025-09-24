let dataArray = [];

$(document).ready(function () {
    // 先加载数据
    $.getJSON('https://cdn.jsdmirror.com/gh/EMIYangR/CDN@latest/json/hero.json', function (response) {
        dataArray = response;
        getPrint(); // 调用getPrint函数以处理数据
        // 数据加载完成后，绑定点击事件
        $(document).on('click', '#every-game-list li', function () {
            if (typeof getPrint === 'function') { setTimeout(getPrint, 500); }
        });
    });
});

function getBans() {
    const rightBanbp4 = document.querySelector('.gradual-right .gl2.banbp4.clearfix');
    let rightSelector;
    if (rightBanbp4 && /display\s*:\s*none/.test(rightBanbp4.getAttribute('style') || '')) {
        rightSelector = '.gradual-right .banbp5';
    } else {
        rightSelector = '.gradual-right .banbp4';
    }

    const leftBanbp4 = document.querySelector('.gradual-left .gl2.banbp4.clearfix');
    let leftSelector;
    if (leftBanbp4 && /display\s*:\s*none/.test(leftBanbp4.getAttribute('style') || '')) {
        leftSelector = '.gradual-left .banbp5';
    } else {
        leftSelector = '.gradual-left .banbp4';
    }
    const getAlts = selector => Array.from(
        document.querySelectorAll(selector)).flatMap(banbp => Array.from(
            banbp.querySelectorAll('img')).map(img => img.alt));
    return {
        leftAlts: getAlts(leftSelector),
        rightAlts: getAlts(rightSelector)
    };
}

function getBansPic() {
    const rightBanbp4 = document.querySelector('.gradual-right .gl2.banbp4.clearfix');
    let rightSelector;
    if (rightBanbp4 && /display\s*:\s*none/.test(rightBanbp4.getAttribute('style') || '')) {
        rightSelector = '.gradual-right .banbp5';
    } else { rightSelector = '.gradual-right .banbp4'; }

    const leftBanbp4 = document.querySelector('.gradual-left .gl2.banbp4.clearfix');
    let leftSelector;
    if (leftBanbp4 && /display\s*:\s*none/.test(leftBanbp4.getAttribute('style') || '')) {
        leftSelector = '.gradual-left .banbp5';
    } else { leftSelector = '.gradual-left .banbp4'; }

    // 获取 img 文件名
    const getImageFileNames = selector => Array.from(
        document.querySelectorAll(selector)).flatMap(banbp => Array.from(
            banbp.querySelectorAll('img')
        ).map(img => img.src.split('/').pop()));// 直接从 src 中提取文件名

    return {
        leftFileNames: getImageFileNames(leftSelector),
        rightFileNames: getImageFileNames(rightSelector)
    };
}

function getPicksBySide() {
    return Array.from(
        document.querySelectorAll('.tb-box.types-show-box .c-img img:first-child')).map(img => {
            const filename = img.src.split('/').pop();
            return filename.length > 8 ? '' : filename;
        }).filter(Boolean);
}

function getPicksNameDict() {
    const dict = {};
    document.querySelectorAll('.gl3-img img').forEach(img => {
        const filename = (img.getAttribute('src') || '').split('/').pop();
        if (filename) dict[filename] = img.getAttribute('alt') || '';
    });
    return dict;
}

function getPicksPicDict() {
    return Array.from(
        document.querySelectorAll('.tb-box.types-show-box .c-img img:first-child')).map(img => {
            const filename = img.src.split('/').pop();
            return filename.length > 8 ? '' : filename;
        }).filter(Boolean)
}

function getTopLeftImgSrcFilename() {
    const img = document.querySelector('.md-top-left .mdl-img');
    if (img && img.getAttribute('src')) {
        return img.getAttribute('src').split('/').pop();
    }
    return '';
}

function checkUB() {
    const el = document.querySelector('.main-context > .null-gradual');
    return el ? !(/display\s*:\s*none/.test(el.getAttribute('style') || '')) : true;
}

function getFirstTeamImgFilename() {
    const img = document.querySelector('.main-context .gradual .gradual-left .gl1 .team-img img');
    if (img && img.getAttribute('src')) {
        return img.getAttribute('src').split('/').pop();
    }
    return '';
}

function getLeftWinStatus() {
    const el = document.querySelector('.main-context .gradual .gradual-left .gl1 .reslute-img');
    return el ? /display\s*:\s*none/.test(el.getAttribute('style') || '') : false;
}

function getrightWinStatus() {
    const el = document.querySelector('.main-context .gradual .gradual-right .gl1 .reslute-img');
    return el ? /display\s*:\s*none/.test(el.getAttribute('style') || '') : false;
}

function getWinner() {
    if (getLeftWinStatus() === getrightWinStatus()) {
        return '';
    } else if (getLeftWinStatus()) {
        return getWhoChooseBlueside() ? 2 : 1;
    } else if (getrightWinStatus()) {
        return getWhoChooseBlueside() ? 1 : 2;
    }
}

function getWhoChooseBlueside() {
    return getTopLeftImgSrcFilename() === getFirstTeamImgFilename() ? true : false;
}
function getLength() {
    const el = document.querySelector('.gradual .gradual-center .center1');
    return el ? el.textContent.trim() : '';
}

function replaceInArray(array, oldValue, newValue) {
    return array.map(item => item.trim() === oldValue.trim() ? newValue : item);
}

// 获取 Cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function getPrint() {
    let allBans = getBansPic();                     // 获取全部禁用的英雄对应的图片
    let allPickBySide = getPicksBySide();           // 获取全部选择英雄对应的图片
    let length = getLength();                       // 获取比赛时长
    let getSide = "";                               // 默认左侧为蓝色方
    let team1side, team2side, t1h, t2h, t1b, t2b;   // 定义队伍和英雄变量
    let winner = getWinner();                       // 获取比赛胜利方
    winner === '' ? length = '' : length = length;  // 如果没有胜利方，则不显示比赛时长

    // 按heroImgs顺序，查找gl3ImgAltDict的值
    let pickleft = allPickBySide.filter((_, i) => i % 2 === 0);     // 左侧选择英雄
    let pickright = allPickBySide.filter((_, i) => i % 2 === 1);    // 右侧选择英雄

    // 用dataArray的text匹配pickleft、pickright、allBans的值，匹配到则替换为value
    function mapWithDataArray(arr) {
        if (!Array.isArray(dataArray)) return arr;
        return arr.map(val => {
            const found = dataArray.find(item => item.img === val);
            return found ? found.value : val;
        });
    }

    pickleft = mapWithDataArray(pickleft);                      // 替换左侧选择英雄
    pickright = mapWithDataArray(pickright);                    // 替换右侧选择英雄
    allBans.leftFileNames = mapWithDataArray(allBans.leftFileNames);      // 替换左侧禁用英雄
    allBans.rightFileNames = mapWithDataArray(allBans.rightFileNames);    // 替换右侧禁用英雄

    // 下次更新再降低耦合
    if (getCookie('isChangeHero1') === 'true') {
        pickleft = replaceInArray(pickleft, 'cao cao', 'fatih');
        pickright = replaceInArray(pickright, 'cao cao', 'fatih');
        allBans.leftFileNames = replaceInArray(allBans.leftFileNames, 'cao cao', 'fatih');
        allBans.rightFileNames = replaceInArray(allBans.rightFileNames, 'cao cao', 'fatih');
    }

    if (getCookie('isChangeHero2') === 'true') {
        pickleft = replaceInArray(pickleft, 'chano', 'genghis khan');
        pickright = replaceInArray(pickright, 'chano', 'genghis khan');
        allBans.leftFileNames = replaceInArray(allBans.leftFileNames, 'chano', 'genghis khan');
        allBans.rightFileNames = replaceInArray(allBans.rightFileNames, 'chano', 'genghis khan');
    }

    // 判断初始默认选边
    if (getWhoChooseBlueside()) { getSide = true; } else { getSide = false; }

    // 如果需要交换红蓝方，则取反
    if (getCookie('isChangeSide') === 'true') {
        getSide = !getSide; winner == 1 ? winner = 2 : winner == 2 ? winner = 1 : winner = '';
    }
    if (getSide) {
        team1side = 'blue'; team2side = 'red'; t1h = pickleft; t2h = pickright;
        t1b = allBans.leftFileNames; t2b = allBans.rightFileNames;
    } else {
        team1side = 'red'; team2side = 'blue'; t1h = pickright; t2h = pickleft;
        t1b = allBans.rightFileNames; t2b = allBans.leftFileNames;
    }

    let result = [];
    // 判断ban数，动态输出ban行
    function formatBans(bans, team) {
        if (bans.length === 4) {
            return `        |${team}b1=${bans[0] || ''} |${team}b2=${bans[1] || ''} |${team}b3=${bans[2] || ''} |${team}b4=${bans[3] || ''} `;
        } else {
            // 通常其余情况下为5个，但是如果支持早期3bans版本，则需要额外处理
            return `        |${team}b1=${bans[0] || ''} |${team}b2=${bans[1] || ''} |${team}b3=${bans[2] || ''} |${team}b4=${bans[3] || ''} |${team}b5=${bans[4] || ''}`;
        }
    }
    function getBansString() {
        if (checkUB()) {
            return '';
        } else {
            return '        <!-- Hero bans -->\n' + formatBans(t1b, 't1') + '\n' + formatBans(t2b, 't2');
        }
    }

    result = [
        `        |team1side=${team1side} |team2side=${team2side} |length=${length} |winner=${winner}`,
        '        <!-- Hero picks -->',
        `        |t1h1=${t1h[0] || ''} |t1h2=${t1h[1] || ''} |t1h3=${t1h[2] || ''} |t1h4=${t1h[3] || ''} |t1h5=${t1h[4] || ''}`,
        `        |t2h1=${t2h[0] || ''} |t2h2=${t2h[1] || ''} |t2h3=${t2h[2] || ''} |t2h4=${t2h[3] || ''} |t2h5=${t2h[4] || ''}`,
        getBansString()
    ].join('\n');
    console.log(result);
}
