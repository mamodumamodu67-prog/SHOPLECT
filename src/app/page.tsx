import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Trust from '@/components/landing/Trust';
import Categories from '@/components/landing/Categories';
import WhyShoplect from '@/components/landing/WhyShoplect';
import Testimonials from '@/components/landing/Testimonials';
import CtaBanner from '@/components/landing/CtaBanner';
import Footer from '@/components/landing/Footer';
import { testimonialsApi } from '@/lib/api';

export default async function LandingPage() {
  const testimonials = await testimonialsApi.list().catch(() => []);
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Trust />
        <Categories />
        <WhyShoplect />
        {testimonials.length >= 3 && <Testimonials items={testimonials} />}
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
