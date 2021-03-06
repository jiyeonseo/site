import React from 'react'

import { Testimonial, TrustedClients, Helmet, NewToServerlessPrefooter } from 'src/fragments'
import DefaultLayout from 'src/layouts/Default'
import Hero from 'src/components/pages/homeOLD/Hero'
import Benefits from 'src/components/pages/homeOLD/Benefits'
import PlatformFeatures from 'src/components/pages/homeOLD/PlatformFeatures'

const Home = ({ location }) => {
  return (
    <DefaultLayout prefooter={NewToServerlessPrefooter} transparentHeader>
      <Helmet
        title='Serverless - The Serverless Application Framework powered by AWS Lambda, API Gateway, and more'
        description='Build web, mobile and IoT applications using AWS Lambda and API Gateway, Azure Functions, Google Cloud Functions, and more.'
        location={location}
      />
      <Hero />
      <Benefits />
      <Testimonial />
      <PlatformFeatures />
      <TrustedClients />
    </DefaultLayout>
  )
}

export default Home