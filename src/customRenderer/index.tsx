import Reconciler from 'react-reconciler'
const rootHostContext = {}
const childHostContext = {}

const HostConfig = {
  getRootHostContext: () => {
    return rootHostContext
  },
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => {
    return childHostContext
  },
  shouldSetTextContent: (type, props) => {
    return typeof props.children === 'string' || typeof props.children === 'number'
  },
  /**
     This is where react-reconciler wants to create an instance of UI element in terms of the target. Since our target here is the DOM, we will create document.createElement and type is the argument that contains the type string like div or img or h1 etc. The initial values of domElement attributes can be set in this function from the newProps argument
    */
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
    const domElement = document.createElement(type)
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName]
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = propValue
        }
      } else if (propName === 'onClick') {
        domElement.addEventListener('click', propValue)
      } else if (propName === 'className') {
        domElement.setAttribute('class', propValue)
      } else {
        const propValue = newProps[propName]
        domElement.setAttribute(propName, propValue)
      }
    })
    return domElement
  },
  createTextInstance: text => {
    return document.createTextNode(text)
  },
  appendInitialChild: (parent, child) => {
    parent.appendChild(child)
  },
  appendChild(parent, child) {
    parent.appendChild(child)
  },
  finalizeInitialChildren: (domElement, type, props) => {},
  supportsMutation: true,
  appendChildToContainer: (parent, child) => {
    parent.appendChild(child)
  },
  prepareUpdate(domElement, oldProps, newProps) {
    return true
  },
  commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName]
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = propValue
        }
      } else {
        const propValue = newProps[propName]
        domElement.setAttribute(propName, propValue)
      }
    })
  },
  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.text = newText
  },
  removeChild(parentInstance, child) {
    parentInstance.removeChild(child)
  },
  clearContainer() {},
}

const reconcilerInstance = Reconciler(HostConfig)

const CustomRender = {
  render(element, renderDom, callback) {
    // element: This is the react element for App component
    // renderDom: This is the host root element to which the rendered app will be attached.
    // callback: if specified will be called after render is done.
    const isSync = false
    // Creates root fiber node.
    const container = reconcilerInstance.createContainer(renderDom, isSync)
    const parentComponent = null // Since there is no parent (since this is the root fiber). We set parentComponent to null.
    reconcilerInstance.updateContainer(element, container, parentComponent, callback)
  },
}

export default CustomRender
