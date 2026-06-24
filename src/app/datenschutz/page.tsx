import Link from 'next/link'
export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-void px-4 sm:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-glow text-sm hover:text-blue mb-8 block">← Zurück</Link>
        <h1 className="font-display text-3xl font-bold text-white mb-8">Datenschutz</h1>
        <div className="text-slate/60 text-sm space-y-6">
          <div><h2 className="text-white font-medium mb-2">1. Verantwortlicher</h2><p>PAN21.COM Corporate Consultants Ltd, 61 Bridge Street, Kington, Herefordshire HR5 3DJ, UK</p></div>
          <div><h2 className="text-white font-medium mb-2">2. Erhobene Daten</h2><p>E-Mail-Adresse, Name, Transaktionsdaten, Depotbestand. Zahlungsdaten werden ausschließlich von Stripe verarbeitet.</p></div>
          <div><h2 className="text-white font-medium mb-2">3. Öffentliche Daten</h2><p>Gebote und Listings sind öffentlich sichtbar. Ihr Name wird dabei nicht angezeigt.</p></div>
          <div><h2 className="text-white font-medium mb-2">4. Analyse</h2><p>Diese Website verwendet Matomo (self-hosted, counter.ixan.org). Keine Weitergabe an Dritte.</p></div>
          <div><h2 className="text-white font-medium mb-2">5. Ihre Rechte</h2><p>Auskunft, Berichtigung, Löschung: info@minibeteiligung.de</p></div>
        </div>
      </div>
    </div>
  )
}
