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
import { coverageMapImages, fleetImages, heroImages, heroImagesMobile, locations, operators } from "./exact/data";

export function TowBoatUSNtxHome() {
  return <div className="tbus-exact">
    <StructuredData locations={locations} />
    <EmergencyBar locations={locations} dispatchUrl="https://tide.towboatuslaketexoma.com/request" />
    <Header />
    <main>
      <Hero locations={locations} boatusJoinUrl="https://www.boatus.com/towing/membership?sourcecode=WT13014A" heroImages={heroImages} heroImagesMobile={heroImagesMobile} />
      <CoverageStrip locations={locations} />
      <Locations locations={locations} />
      <Services />
      <Membership boatusJoinUrl="https://www.boatus.com/towing/membership?sourcecode=WT13014A" boatusTowingUrl="https://www.boatus.com/towing/membership?sourcecode=WT13014A" coverageMapImages={coverageMapImages} />
      <WhyBigWater fleetImages={fleetImages} />
      <Network operators={operators} nationalDispatchPhone="800-391-4869" />
      <FAQ />
    </main>
    <Footer locations={locations} nationalDispatchPhone="800-391-4869" />
  </div>;
}
