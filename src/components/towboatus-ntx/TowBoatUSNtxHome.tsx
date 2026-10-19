import EmergencyBar from "./exact/layout/EmergencyBar";
import Header from "./exact/layout/Header";
import Footer from "./exact/layout/Footer";
import Hero from "./exact/sections/Hero";
import CoverageStrip from "./exact/sections/CoverageStrip";
import Locations from "./exact/sections/Locations";
import Services from "./exact/sections/Services";
import Membership from "./exact/sections/Membership";
import WhyBigWater from "./exact/sections/WhyBigWater";
import Network from "./exact/sections/Network";
import FAQ from "./exact/sections/FAQ";
import StructuredData from "./exact/seo/StructuredData";
import type { TowBoatUSData } from "@/lib/towboatus";
import type { BrandNetworkSettings } from "@/config/types";

export function TowBoatUSNtxHome({ data, network }: { data: TowBoatUSData; network: BrandNetworkSettings }) {
  const { locations, operators, config, coverageMapImages, fleetImages, heroImages, heroImagesMobile } = data;
  return <div className="tbus-exact">
    <StructuredData locations={locations} />
    <EmergencyBar locations={locations} dispatchUrl={config.dispatch_url} />
    <Header network={network} />
    <main>
      <Hero locations={locations} boatusJoinUrl={config.boatus_join_url} heroImages={heroImages} heroImagesMobile={heroImagesMobile} />
      <CoverageStrip locations={locations} />
      <Locations locations={locations} />
      <Services />
      <Membership boatusJoinUrl={config.boatus_join_url} boatusTowingUrl={config.boatus_towing_url} coverageMapImages={coverageMapImages} />
      <WhyBigWater fleetImages={fleetImages} />
      <Network operators={operators} nationalDispatchPhone={config.national_dispatch_phone} />
      <FAQ />
    </main>
    <Footer locations={locations} nationalDispatchPhone={config.national_dispatch_phone} />
  </div>;
}
