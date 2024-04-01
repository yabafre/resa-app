import { useEffect } from 'react';
import "@/styles/globals.css";
import Lenis from '@studio-freight/lenis';
import {ThemeProvider} from "@/components/ThemeProvider";
import {ModeToggle} from "@/components/SwitchTheme";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Slash } from "lucide-react"
import Link from "next/link";
export default function App({ Component, pageProps }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.6,
      lerp: 0.05,
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <main className="flex flex-col gap-8 p-6">
        <div className={'contain-info-barbershop flex flex-col gap-6 w-fit'}>
          <Card>
            <CardContent className={'!py-0 flex flex-row items-center'}>
              <CardHeader>
                <Link href={'/'}>
                  <CardTitle className={'text-black dark:text-white'}>Barber Shop</CardTitle>
                </Link>
              </CardHeader>
              <div>
                <ModeToggle />
              </div>
            </CardContent>
          </Card>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/reservation">Réservation</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
