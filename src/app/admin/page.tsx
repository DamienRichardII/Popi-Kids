import { eur, getAdminStats } from "@/lib/commerce";

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">{children}</p>;
}

function Chart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const pts = data.map((d, i) => `${(i / Math.max(data.length - 1, 1)) * 300},${90 - (d.value / max) * 80}`).join(" ");
  return (
    <svg viewBox="0 0 300 100" role="img" aria-label="Évolution des ventes" className="h-40 w-full">
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2" />
    </svg>
  );
}

/** Tous les chiffres viennent de getAdminStats() ; sans moteur branché → états vides, aucun chiffre inventé. */
export default async function Dashboard() {
  const s = await getAdminStats();
  const kpis = [
    ["Chiffre d'affaires", s ? eur(s.revenue) : "—"], ["Commandes", s ? String(s.orders) : "—"],
    ["Clients", s ? String(s.customers) : "—"], ["Produits", s ? String(s.products) : "—"],
  ];
  return (
    <div>
      <h1 className="section-title text-4xl">Tableau de bord</h1>
      {!s && <p className="mt-2 text-sm text-muted">Aucune donnée : le moteur e-commerce n&apos;est pas encore connecté.</p>}
      <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(([k, v]) => <div key={k} className="rounded-2xl border border-line bg-surface p-5"><dt className="text-xs text-muted">{k}</dt><dd className="serif mt-1 text-3xl">{v}</dd></div>)}
      </dl>
      <section className="mt-6 rounded-2xl border border-line bg-surface p-5"><h2 className="serif mb-3 text-xl">Évolution des ventes</h2>
        {s?.series.length ? <Chart data={s.series} /> : <Empty>Les ventes apparaîtront dès la première commande.</Empty>}</section>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5"><h2 className="serif mb-3 text-xl">Commandes récentes</h2>
          {s?.recentOrders.length ? (
            <table className="w-full text-sm"><caption className="sr-only">Commandes récentes</caption><tbody>{s.recentOrders.map((o) => <tr key={o.id} className="border-t border-line"><td className="py-2">{o.id}</td><td>{o.customer}</td><td>{eur(o.total)}</td><td>{o.status}</td></tr>)}</tbody></table>
          ) : <Empty>Aucune commande.</Empty>}</section>
        <section className="rounded-2xl border border-line bg-surface p-5"><h2 className="serif mb-3 text-xl">Alertes de stock</h2>
          {s?.lowStock.length ? <ul className="text-sm">{s.lowStock.map((l) => <li key={l.name + l.size} className="border-t border-line py-2">{l.name} – {l.size} : {l.stock}</li>)}</ul> : <Empty>Aucune alerte.</Empty>}</section>
      </div>
    </div>
  );
}
