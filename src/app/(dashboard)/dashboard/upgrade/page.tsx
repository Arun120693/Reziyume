import { detectCountry } from "@/lib/country";
import { UpgradeClient } from "./UpgradeClient";

export default async function UpgradePage() {
  const country = await detectCountry();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: "#111111" }}>
          Upgrade to Reziyume Pro
        </h1>
        <p className="text-[17px] font-medium mt-3" style={{ color: "#6b6880" }}>
          Unlock premium AI-powered resume building.
        </p>
      </div>

      <UpgradeClient country={country} />
    </div>
  );
}
