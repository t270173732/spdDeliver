import PinYin from '@/utils/pinyin.js';

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor((Math.random()*arr.length))
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function toDefaultPage(routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
}

export function getHomeRoute(routers) {
    let len = routers.length,
        i = -1,
        homeRoute = {};
    while (++i < len) {
        let item = routers[i];
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children);
            if (res.name) return res
        } else {
            if (item.name === 'home') homeRoute = item
        }
    }
    return homeRoute
}

export function getBreadCrumbList (routeMetched, homeRoute){
    let res = routeMetched.filter(item => {
        return !item.hidden
    }).map(item => {
        let obj = {
            name: item.name,
            meta:item.meta,
            path: item.path
        };
        return obj
    });
    return [homeRoute, ...res]
}

export function routeEqual(route1, route2) {
    const params1 = route1.params || {};
    const params2 = route2.params || {};
    const query1 = route1.query || {};
    const query2 = route2.query || {};
    return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

export function objEqual(obj1, obj2) {
    const keysArr1 = Object.keys(obj1)
    const keysArr2 = Object.keys(obj2)
    if (keysArr1.length !== keysArr2.length) return false
    else if (keysArr1.length === 0 && keysArr2.length === 0) return true
    /* eslint-disable-next-line */
    else return !keysArr1.some(key => obj1[key] != obj2[key])
}

export function getParentRouterObjByName(routers, name, parent) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return parent;
        }
        routerObj = getParentRouterObjByName(item.children, name, item);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
}

export function getRouterObjByName(routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
}

export function openNewPage(vm,to) {
  const { name, params, query, fullPath,meta } = to
  // 多页控制 打开新的页面
  vm.$store.dispatch('page/open', { name, params, query, fullPath,meta })
   // let pageOpenedList = vm.$store.state.app.tagNavList;
   // let openedPageLen = pageOpenedList.length;
   //  let i = 0;
   //  let tagHasOpened = false;
   //  //检查已打开页面，替换原来的页面
   //  while (i < openedPageLen) {
   //      //获取父级
   //      let parentRoute = getParentRouterObjByName(vm.$store.state.app.routers, name);
   //      let parentRoute2 = getParentRouterObjByName(vm.$store.state.app.routers, pageOpenedList[i].name);
   //      let route = getRouterObjByName(vm.$store.state.app.routers, name);
   //      //如果是同一个父级则替换pageOpenedList
   //      if (parentRoute === parentRoute2 && route && route.meta && (route.meta.index || route.meta.detail)) {
   //          vm.$store.commit('pageOpenedList', {
   //              index: i,
   //              argu: argu,
   //              query: query,
   //              name: name,
   //              meta: route ? route.meta : '',
   //              path: route.path
   //          });
   //          tagHasOpened = true;
   //          break;
   //      }
   //      if (name === pageOpenedList[i].name) { //||(parentRoute&&parentRoute2&&parentRoute.name === parentRoute2.name)) { // 页面已经打开
   //          //更新详细页面
   //          vm.$store.commit('pageOpenedList', {
   //              index: i,
   //              argu: argu,
   //              query: query,
   //              name: name,
   //              meta: route ? route.meta : '',
   //              path: route.path
   //          });
   //          tagHasOpened = true;
   //          break;
   //      }
   //      i++;
   //  }
}

export function getFormat(dataField) {
    let params;
    params = [dataField[0].format('YYYY-MM-DD'),dataField[1].format('YYYY-MM-DD')];
    return params;
}

export function hasChild(route) {
  if(route.children.length){
    return true;
  }else{
    return false
  }
}

export const name_to_code = function (l1) {
    let l2 = l1.length;
    let I1 = "";
    let reg = new RegExp('[a-zA-Z0-9\- ]');
    for (let i=0;i<l2;i++) {
        let val = l1.substr(i,1);
        let name = arraySearch(val,PinYin);
        if(reg.test(val)) {
            I1 += val;
        } else if (name!==false) {
            I1 += name;
        }

    }
    I1 = I1.replace(/ /g,'-');
    while (I1.indexOf('--')>0) {
        I1 = I1.replace('--','-');
    }
    return I1;
};

export const arraySearch = function (l1,l2){
    for (let name in PinYin){
        if (PinYin[name].indexOf(l1)!=-1) {
            return ucfirst(name); break;
        }
    }
    return false;
};

export const ucfirst = function (l1){
    if (l1.length>0) {
        let first = l1.substr(0,1).toUpperCase();
        // let spare = l1.substr(1,l1.length);
        return first;
    }
};

/**
 * @param {Number} time 传入的时间
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
export const getDate = (time, startType) => {
    const d = time;
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const second = d.getSeconds()
    let resStr = ''
    if (startType === 'year') {
        resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
    }else {
        resStr = month + '-' + date + ' ' + hours + ':' + minutes
    }
    return resStr
}

/**
 * 输入值与数据匹配 高亮
 * @param data 数据
 * @param value 输入值
 * @param text 显示字段
 */
export const pinyinMatch = (data, value, text)=>{
    const PinyinMatch = require('pinyin-match');
    let result = [],copyData = data.concat();
    if(value){
        copyData.forEach(i => {
            let m = PinyinMatch.match(i[text], value);
            if (m) {
                //生成text字段供选中时显示
                i.text = hightlight(i[text], m[0], m[1]);
                result.push(i)
            }
        })
    }else {
        copyData.forEach(i => {
            i.text = i[text];
            result.push(i)
        })
    }
    return result;
}
export const hightlight = (str,start, end) => {
    return str.substring(0, start) + '<span class="highlight">' + str.substring(start, end + 1) + '</span>' + str.substring(end + 1)
}