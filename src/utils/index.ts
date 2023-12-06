import axios from "axios";
String.prototype.cutStr = function (pre = 100, trail = 0) {
  if (this.length <= pre + 3 + trail) return this;
  let txt = this.substr(0, pre) + "...";
  if (trail) txt += this.substr(-trail);
  return txt;
};

export const debounce = (fn: () => void, delay = 1000) => {
  let timer: NodeJS.Timeout | null;
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(1, args);
      timer = null;
    }, delay);
  };
};

export const throttle = (fn: () => void, delay: number) => {
  let timer: NodeJS.Timeout | null;
  return function (...args: any) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(1, args);

      timer = null;
    }, delay);
  };
};

export const handleDownload = async (gateway: string, info: any) => {
  const { data } = await axios.get(gateway + info.cid, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(data);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = info.title;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
};
export const getLikeNum = (value: number): string | number => {
  const num = value;
  if (num >= 1e6) {
    return Math.ceil(num / 1e5) / 10 + "M";
  }
  if (num >= 1e4) {
    return Math.ceil(num / 1e2) / 10 + "K";
  }
  if (num >= 1e3) {
    const str = num.toString();
    return Math.ceil(num / 1e3) + "," + str.slice(1);
  }
  return num;
};
