import React, {useEffect} from 'react'
// import MyPromise from '@/resource/promise'
import {foo, run, thunkfiy} from '@/resource/promise/generator'

const Home = () => {
  useEffect(() => {
    run(foo)
  }, [])

  return <></>
}

export default Home
