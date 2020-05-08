/** @format */

import {useEffect, useState, useCallback} from 'react'
import produce from 'immer'

export const useDocTitle = (title: string) => {
  useEffect(() => {
    document.title = title

    return () => {
      document.title = '测试专用APP'
    }
  }, [title])
}

export const useInputVal = (initVal: any) => {
  const [value, setValue] = useState(initVal)

  const onChange = useCallback(event => {
    setValue(event.target.value)
  }, [])

  return {value, onChange}
}

export const useImmer = (initialValue: any) => {
  const [val, updateValue] = useState(initialValue)

  return [
    val,
    useCallback(updater => {
      updateValue(produce(updater))
    }, []),
  ]
}
