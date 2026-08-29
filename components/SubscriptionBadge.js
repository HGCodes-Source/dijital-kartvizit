import { grantMembershipAction } from "@/app/admin/actions";
import {
  PLAN_LABELS,
  daysRemaining,
  formatExpiryDate,
  isExpired,
} from "@/lib/subscription";

export default function SubscriptionBadge({ user, compact }) {
  const expired = isExpired(user);
  const remaining = daysRemaining(user);

  let badge;
  if (expired) {
    badge = (
      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
        Süresi Doldu
      </span>
    );
  } else if (user.plan === "trial") {
    badge = (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
        Deneme · {remaining} gün kaldı
      </span>
    );
  } else {
    badge = (
      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
        {PLAN_LABELS[user.plan] || "Üye"} · {formatExpiryDate(user.expiresAt)}
      </span>
    );
  }

  return (
    <div className={compact ? "space-y-1.5" : "space-y-1.5 text-right"}>
      {badge}
      <div className={`flex gap-1.5 ${compact ? "" : "justify-end"}`}>
        <form action={grantMembershipAction}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="plan" value="monthly" />
          <button className="rounded-lg border border-black/10 px-2 py-1 text-[11px] font-medium hover:bg-black/5">
            1 Aylık Ver
          </button>
        </form>
        <form action={grantMembershipAction}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="plan" value="yearly" />
          <button className="rounded-lg border border-black/10 px-2 py-1 text-[11px] font-medium hover:bg-black/5">
            1 Yıllık Ver
          </button>
        </form>
      </div>
    </div>
  );
}
