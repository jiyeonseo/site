import React from 'react'

import DefaultLayout from 'src/layouts/Default'
import Hero from 'src/components/pages/company/jobs/Hero'
import OpenPositions from 'src/components/pages/company/jobs/OpenPositions'
import HowWeOperate from 'src/components/pages/company/jobs/HowWeOperate'
import OurValues from 'src/components/pages/company/jobs/OurValues'
import { Helmet, NewToServerlessPrefooter } from 'src/fragments'

const Jobs = ({ location }) => (
  <DefaultLayout prefooter={NewToServerlessPrefooter} transparentHeader>
    <Helmet title="Jobs" location={location} />
    <Hero />
    <OpenPositions />
    <HowWeOperate />
    <OurValues />
  </DefaultLayout>
)

export default Jobs
