import React from 'react'
import BasicLayout from '@/bussiness/components/basiclayout'

type A = (a: number) => string

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any

type Parameters<T extends (...p: any[]) => any> = T extends (...args: infer R) => any ? R : never

type EventListenerParamsType = Parameters<typeof window.addEventListener>

type B = ReturnType<A>
const App = (props: any) => {
  return (
    <>
      <BasicLayout>{props.children}</BasicLayout>
    </>
  )
}

export default App
