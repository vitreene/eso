export function getElementOffset(el = null) {
  const width = el && el.offsetWidth;
  const height = el && el.offsetHeight;
  return getOffset(el);

  function getOffset(el, left = 0, top = 0) {
    // trace(el, top, left);
    if (!el || isNaN(el.offsetLeft) || isNaN(el.offsetTop))
      return { x: left, y: top, top, left, width, height };
    return getOffset(
      el.offsetParent,
      left + el.offsetLeft - el.scrollLeft,
      top + el.offsetTop - el.scrollTop
    );
  }
}

/* 
const essoo = document.getElementById("trace");

export function trace(node, y, x) {
  const trac = document.createElement("div");
  trac.classList.add("point");
  trac.style.top = y + "px";
  trac.style.left = x + "px";
  trac.innerHTML = node.id + "x: " + x + " y: " + y;
  essoo.appendChild(trac);
}

 */
