import React, {useState} from 'react'

const COLORS = ['green', 'gray']

//这其实是一个单个任务调度的示例，改任务即是performConcurrentWorkOnRoot
//调度者，unstable_schedulerCallback, performWorkUntilDeadline   执行者，flushwork workloop

function App() {
  const [cellCount, setCellCount] = useState(100)
  const [text, setText] = useState('0')

  return (
    <div className="app">
      <label>
        Enter some text:
        <input type="text" value={text} onChange={e => setText(e.target.value)} />
      </label>
      <label>
        Set the number of cells:
        <input type="number" value={cellCount} onChange={e => setCellCount(Number(e.target.value))} maxLength={20000} />
      </label>
      <button onClick={() => setText('2')}>ceshi</button>

      <p className="text">{text}</p>
      <div className="cells">
        {/* 当前任务进入调度时一直会返回当前任务，当前任务的callback = performConcurrentWorkOnRoot，一直返回所以会一直执行 
        每次都会进入ensureRootIsScheduled函数，该函数中 
        if (existingCallbackNode !== null) {
            var existingCallbackPriority = root.callbackPriority;

            if (existingCallbackPriority === newCallbackPriority) {
              // The priority hasn't changed. We can reuse the existing task. Exit.
              return;
            } // The priority changed. Cancel the existing callback. We'll schedule a new
            // one below.


            cancelCallback(existingCallbackNode);
          } // Schedule a new callback.
          这段代码判断如果当前任务优先级并没有变化，则终止，不改变root节点上的callbackNode
          否则就取消当前任务调度（如果有高优先级任务进来）
        */}
        {new Array(cellCount).fill(0).map((item, index) => (
          <div key={index} className={`cell ${COLORS[Math.round(Math.random())]}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

// const rootElement = document.getElementById("root");

// // Normal Mode
// // ReactDOM.render(<App />, rootElement);

// // Enable Concurrent Mode
// ReactDOM.createRoot(rootElement).render(<App />);
