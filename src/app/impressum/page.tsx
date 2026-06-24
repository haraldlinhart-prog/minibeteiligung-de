import Link from 'next/link'
export default function Impressum() {
  return (
    <div className="min-h-screen bg-void px-4 sm:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-glow text-sm hover:text-blue mb-8 block">← Zurück</Link>
        <h1 className="font-display text-3xl font-bold text-white mb-8">Impressum</h1>
        <div className="text-slate/60 text-sm space-y-4">
          <p><strong className="text-white">Minibeteiligung.de</strong> ist ein Angebot der</p>
          <p>PAN21.COM Corporate Consultants Ltd<br/>61 Bridge Street<br/>Kington, Herefordshire HR5 3DJ<br/>United Kingdom · Company No. 16117708</p>
          <p>Geschäftsführer: Harald Linhart</p>
          <p>E-Mail: info@minibeteiligung.de</p>
          <p className="text-xs text-slate/30 mt-8">Hinweis: Minibeteiligung.de ist eine private Handelsplattform für Aktien von US Series LLCs. Es handelt sich nicht um regulierte Wertpapiere im Sinne des WpHG. Keine Anlageberatung.</p>
        </div>
      </div>
    </div>
  )
}
