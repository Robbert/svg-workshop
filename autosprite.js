const XMLNS_SVG = 'http://www.w3.org/2000/svg';
const XMLNS_XLINK = 'http://www.w3.org/1999/xlink';

const svgElement = (nodeName) => document.createElementNS(XMLNS_SVG, nodeName);
const xlinkAttr = (el, attrName, value) => el.setAttributeNS(XMLNS_XLINK, attrName, value);

const createSprite1 = (el) => {

	const id = el.id;
	const sprite = svgElement('svg');
	const use = svgElement('use');

	sprite.appendChild(use);
	xlinkAttr(use, 'href', `#${id}`);
	console.dirxml(sprite);

	console.log(el, el.getBBox)
	if (el.getBBox) {
		const bbox = el.getBBox();
		const viewBox = [
			bbox.x,
			bbox.y,
			bbox.width,
			bbox.height
		].map(Math.round).join(' ');

		console.log(bbox, viewBox)
		// sprite.viewBox = viewBox;
		sprite.setAttribute('viewBox', viewBox);
		sprite.setAttribute('height', Math.round(bbox.height));
		sprite.setAttribute('width', Math.round(bbox.width));
	}
	else {
		return null;
	}

	return sprite;

};

document.addEventListener('DOMContentLoaded', () => {

	const foo = (svg) => {
		// TODO: Exclude elements with an `id`, that contain other elements with an `id`
		const idRoots = Array.from(svg.querySelectorAll('[id]'));
		console.log(idRoots);

		idRoots.map(createSprite1).filter(Boolean).forEach((sprite) => {

			const container = document.createElement('p');
			container.appendChild(sprite);

			document.getElementById('generated')
				.appendChild(container);

		});

	};

	const svg = document.querySelector('svg');
	console.log(svg)
	console.log(foo(svg))

});
