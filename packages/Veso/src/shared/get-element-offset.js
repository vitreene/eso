export function getElementOffset(el = null) {
	const box = el instanceof SVGElement && el.getBoundingClientRect();
	const width = el.offsetWidth || box.width;
	const height = el.offsetHeight || box.height;

	return getOffset(el);

	function getOffset(el, left = 0, top = 0) {
		const offset = { x: left, y: top, top, left, width, height };
		if (!el) return offset;
		// trace(el, top, left);
		const box =
			el instanceof SVGElement
				? el.getBoundingClientRect()
				: {
						left: el.offsetLeft,
						top: el.offsetTop,
				  };
		if (isNaN(box.left) || isNaN(box.top)) return offset;

		return getOffset(
			el.offsetParent,
			left + box.left - el.scrollLeft,
			top + box.top - el.scrollTop
		);
	}
}

// function getOffset(el, left = 0, top = 0) {
// 	// trace(el, top, left);
// 	if (!el || isNaN(el.offsetLeft) || isNaN(el.offsetTop))
// 		return { x: left, y: top, top, left, width, height };
// 	return getOffset(
// 		el.offsetParent,
// 		left + el.offsetLeft - el.scrollLeft,
// 		top + el.offsetTop - el.scrollTop
// 	);
// }

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
