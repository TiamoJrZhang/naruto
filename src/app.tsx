
import React, { useMemo, useState } from 'react'
import Child from './child'
import { useDocTitle, useInputVal } from './hooks/index'

const App = (props: any) => {

  const [ curTime, setTime ] = React.useState(0)

  useDocTitle('APP')
  
  let name = useInputVal('jack')

  const upadteParent = () => {
    setTime(2)
  }
  console.log(curTime)

  return (
    <>
      <Child></Child>
      <input type="text" {...name}/>
      <button onClick={upadteParent}>更新</button>
    </>
  );
}

export default App;
