const XMLNS_SVG = 'http://www.w3.org/2000/svg';
const XMLNS_XLINK = 'http://www.w3.org/1999/xlink';

const svgElement = (nodeName) => document.createElementNS(XMLNS_SVG, nodeName);
const xlinkAttr = (el, attrName, value) => el.setAttributeNS(XMLNS_XLINK, attrName, value);

const hasBBoxFn = el => typeof el.getBBox === 'function';

const createSprite1 = (el) => {

};

const createSprite2 = (el) => {

};


const createSprite3 = (id, bbox) => {

	const sprite = svgElement('svg');
	const use = svgElement('use');

	sprite.appendChild(use);
	xlinkAttr(use, 'href', `#${id}`);

	const viewBox = [
		bbox.x,
		bbox.y,
		bbox.width,
		bbox.height
	].map(Math.round).join(' ');

	sprite.setAttribute('viewBox', viewBox);
	sprite.setAttribute('height', Math.round(bbox.height));
	sprite.setAttribute('width', Math.round(bbox.width));

	return sprite;

};

document.addEventListener('DOMContentLoaded', () => {

	const createExample = (technique, svg) => {
		// TODO: Exclude elements with an `id`, that contain other elements with an `id`

		const section = document.createElement('section');
		const heading = document.createElement('h2');
		heading.textContent = technique.title;
		section.appendChild(heading);
		const idRoots = Array.from(svg.querySelectorAll('[id]'));

		const renderSprite = (sprite) => {

			const container = document.createElement('p');

			container.appendChild(sprite);

			section.appendChild(container);

			const pre = document.createElement('pre');
			pre.textContent = container.innerHTML;
			section.appendChild(pre);

		};

		const createSprite = (el) => {

			const bbox = el.getBBox();

			return technique.converter(el.id, bbox);

		};

		idRoots
			.filter(hasBBoxFn)
			.map(createSprite)
			.filter(Boolean)
			.forEach(renderSprite);

		document.body.appendChild(section);

	};

	const svg = document.querySelector('svg');

	const techniques = [
		{
			title: 'technique #1',
			converter: createSprite1
		},
		{
			title: 'technique #2',
			converter: createSprite2
		},
		{
			title: 'technique #3',
			converter: createSprite3
		}
	];

	techniques.forEach((technique) => createExample(technique, svg));

});
