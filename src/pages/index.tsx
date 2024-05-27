import React from 'react'
import dynamic from 'next/dynamic'
import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
// import { HomeFeature, HomeHero, HomePopularCourse, HomeTestimonial, HomeOurMentors, DynamicHomeNewsLetter } from '@/components/home'

const DynamicLanding = dynamic(() => import('../components/home/landing'))
const DynamicHomeHero = dynamic(() => import('../components/home/hero'))
const DynamicHomeFeature = dynamic(() => import('../components/home/feature'))
const DynamicHomePopularCourse = dynamic(() => import('../components/home/popular-courses'))
const DynamicHomeTestimonial = dynamic(() => import('../components/home/testimonial'))
const DynamicHomeOurMentors = dynamic(() => import('../components/home/mentors'))
const DynamicHomeNewsLetter = dynamic(() => import('../components/home/newsletter'))

const Home: NextPageWithLayout = () => {
  return (
    <>
      <DynamicLanding />
      {/* <DynamicHomePopularCourse />
      <DynamicHomeFeature />
      <DynamicHomeTestimonial />
      <DynamicHomeOurMentors />
      <DynamicHomeNewsLetter /> */}
    </>
  )
}

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>

export default Home
