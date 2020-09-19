function renderElem (element) {
  const tagName = element.tagName
  const attrs = element.attrs
  const children = element.children
  const elem = document.createElement(tagName);
  if (attrs) {
    Object.keys(attrs).map(key => {
      elem.setAttribute(key, attrs[key]);
    })
  }

  if (children) {
    for (const child of children) {
      elem.appendChild(render(child));
    }
  }

  return elem;
};

function render (vNode) {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }
  return renderElem(vNode);
};

function mount (element, id) {
  const targetNode = document.getElementById(id)
  if (!targetNode) {
    return
  }

  targetNode.appendChild(element);
};