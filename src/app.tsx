
import React, { useMemo, useState, useRef } from 'react'
import BasicLayout from '@/bussiness/components/basiclayout'

const App = (props: any) => {

  return (
    <>
      <BasicLayout>
        {props.children}
      </BasicLayout>
    </>
  );
}

export default App;
