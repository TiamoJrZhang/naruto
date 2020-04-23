import React from 'react'
import ProLayout, {
  PageHeaderWrapper,
} from '@ant-design/pro-layout'
import route from '@/bussiness/route.config'

export default (props: any) => (
  <ProLayout
    location={{
      pathname: '/welcome',
    }}
    route={route}
  >
    <PageHeaderWrapper content="欢迎使用">
      <div
        style={{
          height: '120vh',
        }}
      >
        {props.children}
      </div>
    </PageHeaderWrapper>
  </ProLayout>
)