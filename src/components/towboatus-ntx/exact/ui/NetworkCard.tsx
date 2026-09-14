import type { NetworkOperator } from "@/components/towboatus-ntx/exact/types";
import { PhoneIcon } from "@/components/towboatus-ntx/exact/icons";

interface NetworkCardProps {
  operator: NetworkOperator;
}

export default function NetworkCard({ operator }: NetworkCardProps) {
  const phoneClean = operator.phone?.replace(/[^0-9]/g, "") || "";

  return (
    <div
      className={`rounded-md p-4 flex flex-col gap-3 transition-all duration-200 ${
        operator.is_ours
          ? "bg-red/10 border border-red/50"
          : "bg-white/5 border border-white/15 hover:border-white/30"
      }`}
    >
      {/* OUR OPERATION badge */}
      {operator.is_ours && (
        <div className="inline-block w-fit bg-red text-white text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded">
          OUR OPERATION
        </div>
      )}

      {/* Operator name */}
      <div className="font-display text-lg font-bold text-white leading-tight">
        {operator.name}
      </div>

      {/* Phone + links */}
      <div className="flex flex-wrap items-center gap-3">
        {operator.phone && (
          <a
            href={`tel:+1${phoneClean}`}
            className="inline-flex items-center gap-2 text-red font-bold text-base hover:text-red-dark transition-colors"
          >
            <PhoneIcon className="w-4 h-4" aria-hidden="true" />
            {operator.phone}
          </a>
        )}

        {operator.website_url && (
          <a
            href={operator.website_url}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 text-white text-sm font-medium bg-white/10 border border-white/30 rounded px-3 py-1 hover:bg-white/20 transition-colors"
          >
            {operator.website_url
              .replace("https://", "")
              .replace("http://", "")
              .replace(/\/$/, "")
              .split("/")[0]}
            <span className="text-white/60">↗</span>
          </a>
        )}

        {operator.facebook_url && (
          <a
            href={operator.facebook_url}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 text-white text-sm font-medium bg-white/10 border border-white/30 rounded px-3 py-1 hover:bg-white/20 transition-colors"
          >
            Facebook
            <span className="text-white/60">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}
