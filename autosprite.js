const imgLocation = 'sprites.svg';

const XMLNS_SVG = 'http://www.w3.org/2000/svg';
const XMLNS_XLINK = 'http://www.w3.org/1999/xlink';

const svgElement = (nodeName) => document.createElementNS(XMLNS_SVG, nodeName);
const xlinkAttr = (el, attrName, value) => el.setAttributeNS(XMLNS_XLINK, attrName, value);

const parent = (el, selector) => {
	let parent;
	while ((parent = el.parentNode) && parent) {
		if (parent.matches && parent.matches(selector)) {
			return parent;
		}
	}
	return null;
}

const hasBBoxFn = el => typeof el.getBBox === 'function';

const createSprite1 = (el, id, bbox) => {

	const svg = parent(el, 'svg');

	const view = svgElement('view');
	const viewBox = [
		bbox.x,
		bbox.y,
		bbox.width,
		bbox.height
	].map(Math.round).join(' ');

	view.setAttribute('id', `${id}-view`);
	view.setAttribute('viewBox', viewBox);

	svg.appendChild(view);

	const img = new Image();

	const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
	const blobURL = URL.createObjectURL(blob);

	img.src = `${blobURL}#${id}-view`;
	img.width = bbox.width;
	img.height = bbox.height;

	return img;
};

const createSprite2 = (el, id, bbox) => {

	const viewBox = [
		bbox.x,
		bbox.y,
		bbox.width,
		bbox.height
	].map(Math.round).join(', ');

	const img = new Image();

	img.src = `${imgLocation}#svgView(viewBox(${viewBox}))`;
	img.width = bbox.width;
	img.height = bbox.height;

	return img;

};


const createSprite3 = (el, id, bbox) => {

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
		const para = document.createElement('p');
		para.textContent = technique.desc;
		section.appendChild(para);
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

			return technique.converter(el, el.id, bbox);

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
			desc: 'Generate a <view id="xyz" viewBox="..."> element in the SVG, and refer to it '
			    + 'using <img src=example.svg#xy`>. Because in this example I add the <view> '
			    + 'element in an embedded <svg>, I needed to create a blob URL to be able to use '
			    + 'the fragment identifier. Just <img src="#xyz"> did not work.',
			converter: createSprite1
		},
		{
			title: 'technique #2',
			desc: 'This approach is similar to the <view> technique, but when the sprite elements '
			    + 'in SVG already have id attributes, it does not require any modifications to the'
			    + ' SVG file.',
			converter: createSprite2
		},
		{
			title: 'technique #3',
			desc: 'This is a technique that is similar to viewBox fragment identifier URLs, '
			    + 'but for browsers that do not support those URLs.',
			converter: createSprite3
		}
	];

	techniques.forEach((technique) => createExample(technique, svg));

});
