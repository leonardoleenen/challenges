import React from 'react'
import '../public/style.css'

interface Props {
  Component: any
  pageProps: any
}

function MyApp(props: Props) {
  const { Component, pageProps } = props

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}


export default MyApp
