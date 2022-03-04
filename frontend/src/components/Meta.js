import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  console.log(title);
  return (
    <Helmet>
      <title>{title === "Welcome To ProShop" ? "welcom to Books e-store" : title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome To ProShop',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buy electronics, cheap electroincs',
}

export default Meta
