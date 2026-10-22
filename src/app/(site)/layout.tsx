import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileTabBar from "@/components/MobileTabBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg">Aller au contenu</a>
      <Header />
      {/* pb-24 : réserve la place de la navigation inférieure mobile */}
      <main id="main" className="pb-24 lg:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileTabBar />
    </>
  );
}
