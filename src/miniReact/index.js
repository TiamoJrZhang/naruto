
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(function(child) {
        if (typeof child === 'object') {
          return child
        } else {
          return createTextElement(child)
        }
      })
    }
  }
}

function render(element, container) {
  var dom = element.type !== 'TEXT_ELEMENT' ? 
    document.createElement(element.type) :
    document.createTextNode('')
  
  Object.keys(element.props).filter(key => key !== 'children').forEach((key) => {
    dom[key] = element.props[key]
  })

  element.props.children.forEach((child) => {
    render(child, dom)
  })

  container.appendChild(dom)
}

const didAct = {
  createElement
}