import Vue from "vue";
// import numeral from 'numeral'

const populateChildren = (parents, pairs, childrenProperty) => {
  if (parents.length === 0) {
    return;
  }

  let children = [];
  parents.forEach((x) => {
    if (pairs[x.id]) {
      x[childrenProperty] = pairs[x.id];
      children = children.concat(x[childrenProperty]);
    }
  });

  populateChildren(children, pairs, childrenProperty);
};

/**
 * 数组转树，支持多个根节点
 * @param {Array} array 数组
 * @param {Object} options 配置项
 */
export const arrayToTree = (array, options = {}) => {
  if (!Array.isArray(array)) {
    throw new Error("参数必须是数组");
  }

  const id = options.idProperty || "id";
  const parent = options.parentProperty || "parent";
  const children = options.childrenProperty || "children";

  const pairs = {};
  array.forEach((x) => {
    pairs[x[parent]] = pairs[x[parent]] || [];
    pairs[x[parent]].push(x);
  });

  let roots = [];
  Object.keys(pairs).forEach((x) => {
    if (!array.find((v) => String(v[id]) === x)) {
      roots = roots.concat(pairs[x]);
    }
  });

  populateChildren(roots, pairs, children);
  return roots;
};

/**
 * 树转数组，支持多个根节点
 *
 * @param {Array|Object} tree 树形结构数据
 * @param {Object} options 配置项
 */
export const treeToArray = (tree, options = {}) => {
  const source = Array.isArray(tree) ? tree : [tree];
  const children = options.childrenProperty || "children";
  let array = source.slice();
  console.log(options);
  array.forEach((x) => {
    if (Array.isArray(x[children])) {
      array = array.concat(treeToArray(x[children]));
    }
  });
  return array;
};

/**
 * 继承属性（属性以待赋值目标为准，浅复制）
 *
 * @param {Object} target 目标对象
 * @param {Object} source 继承来源对象
 * @returns {Object} 继承后的对象
 */
export const extend = (target, source) => {
  for (const key in target) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      extend(target[key], source[key]);
    } else if (Array.isArray(source[key])) {
      target[key] = source[key].slice();
    } else {
      target[key] = source[key];
    }
  }
};

/**
 * 去掉空属性
 *
 * @param {Object} target 目标对象
 * @returns {Object} 去掉后的对象
 */
export const dropEmpty = (target) => {
  const result = {};
  for (const key in target) {
    if (
      target[key] !== undefined &&
      target[key] !== null &&
      target[key] !== ""
    ) {
      result[key] = target[key];
    }
  }
  return result;
};

// 百分号
export const toPercent = (point) => {
  var str = Number(point * 100).toFixed(1);
  str += "%";
  return str;
};

export const to2Percent = (point) => {
  var str = Number(point * 100).toFixed(2);
  str += "%";
  return str;
};
//     /**
//      * 保持精度的乘法
//      * @param {Number} number1 数据1
//      * @param {Number} number2 数据2
//      * @returns {Number} 相乘后的值
//      */
// export const mul = (a, b) => {
//     var c = 0
//     var d = a.toString()
//     var e = b.toString()
//     try {
//         c += d.split('.')[1].length
//     } catch (f) {}
//     try {
//         c += e.split('.')[1].length
//     } catch (f) {}
//     return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
// }

// /**
//  * 保持精度的加/减法
//  * @param {Number} number1 数据1
//  * @param {Number} number2 数据2
//  * @returns {Number} 相加/减后的值
//  */
// export const add = (a, b, type = 'add') => {
//     return numeral(a).add(b).value()
//         // var c = 0
//         // var f = 0
//         // var g = 0
//         // var d = a.toString()
//         // var e = b.toString()
//         // try {
//         //   f = d.split('.')[1].length
//         // } catch (f) {}
//         // try {
//         //   g = e.split('.')[1].length
//         // } catch (f) {}
//         // c = f > g ? f + 1 : g + 1
//         // if (type === 'add') {
//         //   return (Number(a) * Math.pow(10, c) + Number(b) * Math.pow(10, c)) / Math.pow(10, c)
//         // } else {
//         //   return (Number(a) * Math.pow(10, c) - Number(b) * Math.pow(10, c)) / Math.pow(10, c)
//         // }
// }

/**
 * 获取当前date的本月第一天
 * @param {String} value 时间
 * @returns {String} 相乘后的值
 */
export const getMonthStart = (value) => {
  var nowdays = new Date(value);
  var year = nowdays.getFullYear();
  var month = nowdays.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var startDay = year + "-" + month + "-" + "01" + " 00:00:00";
  return new Date(startDay);
};

/**
 * 获取当前date的本月最后一天
 * @param {String} value 时间
 * @returns {String} 相乘后的值
 */
export const getMonthEnd = (value) => {
  var nowdays = new Date(value);
  var year = nowdays.getFullYear();
  var month = nowdays.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var myDate = new Date(year, month, 0);
  var lastDay = year + "-" + month + "-" + myDate.getDate();
  return new Date(lastDay);
};

/**
  返回当天的23:59:59秒时间
  @param {date}
  @returns {date}
*/
export const getFinishDate = (value) => {
  value = new Date(value);
  var str =
    value.getFullYear() +
    "-" +
    (value.getMonth() + 1) +
    "-" +
    value.getDate() +
    " 23:59:59.999";
  return new Date(str);
};
/**
      返回当天的23:59:59秒时间
      @param {date}
      @returns {date}
    */
export const getFinishDateNew = (value) => {
  value = new Date(value);
  var str =
    value.getFullYear() +
    "-" +
    (value.getMonth() + 1) +
    "-" +
    value.getDate() +
    " 23:59:59.000";
  return new Date(str);
};

/**
  返回当天的00:00:00秒时间
  @param {date}
  @returns {date}
*/
export const getStartDate = (value) => {
  value = new Date(value);
  var str =
    value.getFullYear() +
    "-" +
    (value.getMonth() + 1) +
    "-" +
    value.getDate() +
    " 00:00:00";
  return new Date(str);
};

// 返回放年月时间
export const getYearMonthDate = (value) => {
  value = new Date(value);
  console.log(value.getFullYear(), "value.getFullYear()", value.getMonth());
  var str = "";
  if (value.getMonth() + 1 < 10) {
    str = String(value.getFullYear()) + "0" + (value.getMonth() + 1);
  } else {
    str = String(value.getFullYear()) + (value.getMonth() + 1);
  }
  return str;
};
/**
  返回当天的00:00:00秒时间
  @param {date}
  @returns {date}
*/
export const getYearMonthDayDate = (value) => {
  value = new Date(value)
  var str = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate()
  return new Date(str)
}

/**
 返回特殊时间格式处理 20180718000000
 @param {Number || String}
 @returns {String}
*/
export const transformTime = (num) => {
  if (typeof num !== "number" && typeof num !== "string") {
    return num;
  }

  if (String(num).length !== 14) {
    return num;
  }

  var str = String(num);
  var reg = /\d{2}/g;

  var str1 = str.slice(0, 9);
  const arr1 = str1.match(reg);
  var res1 = arr1[0] + arr1[1] + "-" + arr1[2] + "-" + arr1[3];

  // var str2 = str.slice(-6)
  // const arr2 = str2.match(reg)
  // var res2 = arr2.join(':')
  // return res1 + ' ' + res2
  return res1;
};

/**
 对金额整数部分作千位符
 @param { Number }
 @returns { Number }
 */
export const kiloSplit = (num) => {
  const reg = /^-?\d*\.?\d*$/;
  if (typeof num !== "number" && typeof num !== "string") {
    return num;
  }

  if (typeof num === "string") {
    if (reg.test(num)) num = Number(num);
    else return num;
  }

  if (num < 1000 && num > -1000) {
    return num;
  }

  let dotIndex = num.toString().indexOf(".");
  const haveDot = dotIndex !== -1;
  const haveMinus = num < 0;
  if (haveMinus) {
    dotIndex -= 1;
  }
  num = Math.abs(num);
  let endNum = "";
  let strNum = "";
  if (haveDot) {
    strNum = num.toString().slice(0, dotIndex);
    endNum = num.toString().slice(dotIndex);
  } else {
    strNum = num.toString();
  }
  let result = "";
  while (strNum.length > 3) {
    result = "," + strNum.slice(-3) + result;
    strNum = strNum.slice(0, strNum.length - 3);
  }
  if (strNum) {
    result = strNum + result;
  }
  // console.log(result, 'tesult');
  if (haveMinus) {
    return "-" + result + endNum;
  }
  // console.log(endNum.length, '????????????', endNum);
  if (endNum.length === 0) {
    endNum = ".00";
  } else if (endNum.length !== 3) {
    endNum += "0";
  }
  return result + endNum;
};

export const getParamsUrl = (data) => {
  let params = "";
  for (let key in data) {
    if (Array.isArray(data[key])) {
      const value = data[key].join(",");
      params +=
        params.indexOf("?") > -1
          ? "&" + key + "=" + value
          : "?" + key + "=" + value;
    } else {
      params +=
        params.indexOf("?") > -1
          ? "&" + key + "=" + data[key]
          : "?" + key + "=" + data[key];
    }
  }
  return params;
};

/**
 * table树状数据初始化
 *
 * @param {Array} data
 * @returns {Array} data formatted
 */

export const DataTransfer = function DataTransfer(data) {
  if (!(this instanceof DataTransfer)) {
    return new DataTransfer(data, null, null);
  }
};

// 生成一个不重复的uuid
export const getUUID = () => {
  return "xxxxxx_xxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 10) | 0;
    let v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(10);
  });
};

DataTransfer.treeToArray = function (data, parent, level, expandedAll) {
  let tmp = [];
  Array.from(data).forEach(function (record) {
    if (record._expanded === undefined) {
      Vue.set(record, "_expanded", expandedAll);
    }
    if (parent) {
      Vue.set(record, "_parent", parent);
    }
    let _level = 0;
    if (level !== undefined && level !== null) {
      _level = level + 1;
    }
    Vue.set(record, "_level", _level);
    tmp.push(record);
    if (record.children && record.children.length > 0) {
      let children = DataTransfer.treeToArray(
        record.children,
        record,
        _level,
        expandedAll
      );
      tmp = tmp.concat(children);
    }
  });
  return tmp;
};

/**
 * 简版深拷贝，仅支持基本对象，数组，Date，正则，以及基本类型。
 *
 * 其他引用类型均按原地址拷贝，**不支持循环引用**
 *
 * @param {*} source 复制源
 */
// export const clone = source => {
//     const str = Object.prototype.toString.call(source)
//     if (str === '[object Object]') {
//         const o = {}
//         for (const key in source) {
//             if (source.hasOwnProperty(key)) {
//                 o[key] = clone(source[key])
//             }
//         }
//         return o
//     } else if (str === '[object Array]') {
//         return source.map(clone)
//     } else if (str === '[object Date]') {
//         return new Date(source.getTime())
//     } else if (str === '[object RegExp]') {
//         return new RegExp(source.source, source.flags)
//     } else {
//         return source
//     }
// }

/**
 * 保存文件至本地
 * @param {Blob} file 保存的文件
 * @param {string} filename 文件名
 */
export const saveFile = (file, filename = "") => {
  if (!(file instanceof Blob)) {
    throw new Error("only suport Blob type");
  }

  const name = filename || "file";
  const url = URL.createObjectURL(file);
  let link = document.getElementById("download-link");
  if (!link) {
    link = document.createElement("a");
    link.id = "download-link";
    link.style.display = "none";
    document.body.appendChild(link);
  }

  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};
/**
 * 生成CSV文件
 * @param {Array} data 数据
 * @param {object} options 配置项
 * @returns {Blob} CSV Blob对象
 */
export const generateCSV = (data, options = {}) => {
  const columns = options.columns || [];
  const propInclude = options.propInclude;

  // 字段
  const validColumns = [];
  columns.forEach((col) => {
    if (typeof col === "string") {
      validColumns.push({
        property: col,
      });
    } else if (typeof col === "object") {
      validColumns.push(col);
    }
  });

  // 数据
  const content = data.map((record) => {
    return columns
      .map((col) => {
        let value = "";
        if (typeof col.formatter === "function") {
          value = col.formatter.call(
            undefined,
            record,
            col,
            record[col.property]
          );
        } else {
          value = record[col.property];
        }
        value = value === undefined ? "" : value;
        return `"${value}"`;
      })
      .join(",");
  });
  const headers = [];
  // 表头
  const header = validColumns
    .map((col) => `"${col.title || col.property}"`)
    .join(",");
  headers.push(header);
  // 英文表头
  if (propInclude) {
    headers.push(validColumns.map((col) => col.property).join(","));
  }

  // 文件头加入BOM信息U+FEFF，避免中文乱码
  return new Blob(["\uFEFF" + [...headers, ...content].join("\r\n")], {
    type: "text/csv",
  });
};
const IMAGE_TYPES = [
  "xbm",
  "bmp",
  "jpeg",
  "webp",
  "jpg",
  "gif",
  "png",
  "svg",
  "svgz",
  "ico",
  "tiff",
  "jfif",
  "pjpeg",
  "pjp",
  "tif",
];
export const getExt = (name = "") => {
  const index = name.lastIndexOf(".");
  return index > -1 ? name.substring(index + 1).toLowerCase() : "";
};
export const isImg = (name = "") => {
  const ext = getExt(name);
  if (IMAGE_TYPES.includes(ext)) {
    return true;
  } else {
    return false;
  }
};
const kb = 1024;
const mb = 1024 * kb;
const gb = 1024 * mb;
/**
 * 文件体积字节数转成用可读的单位显示
 * @param {Number} size 字节数
 * @return {String}
 */
export const sizeInfo = (size) => {
  if (size < kb) {
    return `${size}B`;
  } else if (size < mb) {
    let k = size / kb;
    k !== Math.floor(k) && (k = k.toFixed(2));
    return `${k}KB`;
  } else if (size < gb) {
    let m = size / mb;
    m !== Math.floor(m) && (m = m.toFixed(2));
    return `${m}MB`;
  } else {
    let g = size / gb;
    g !== Math.floor(g) && (g = g.toFixed(2));
    return `${g}GB`;
  }
};
/**
 * 获取两个日期中所有的月份
 * 返回两个时间之间所有的月份
 * 参数示例 （'2021-01-01','2021-06-01'）
 * **/
export const getMonthBetween = (start, end) => {
  let result = [];
  let min = new Date(start);
  let max = new Date(end);
  let curr = min;
  while (curr <= max) {
    let month = new Date(curr).getMonth() + 1;
    let t = "";
    if (month < 10) {
      t = "0" + month;
    } else t = month;
    let str = curr.getFullYear() + String(t);
    let s = curr.getFullYear() + "0";
    if (str === s) {
      str = curr.getFullYear() + "12";
    }
    result.push({
      month: str,
    });
    curr.setMonth(month);
  }
  return result;
};
