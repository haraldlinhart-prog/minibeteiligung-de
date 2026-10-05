import Link from 'next/link'
export const metadata = { title: 'Impressum — Minibeteiligung.de', alternates: { canonical: 'https://www.minibeteiligung.de/impressum' } }
export default function Impressum() {
  return (
    <div className="min-h-screen bg-void px-4 sm:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-glow text-sm hover:text-blue mb-8 block">← Zurück</Link>
        <h1 className="font-display text-3xl font-bold text-white mb-8">Impressum</h1>
        <div className="text-slate/60 text-sm space-y-4">
          <p>Angaben gemäß § 5 DDG</p>
          <p>PAN21.com International LLC<br/>7533 South Center View CT, STE R<br/>West Jordan, UT 84084<br/>USA</p>
          <p>Vertreten durch: Harald Linhart<br/>Registrierung: Utah Division of Corporations, Registernummer 14723637-0163</p>
          <h2 className="text-white font-medium pt-2">Kontakt</h2>
          <p>Telefon: +49 30 5684450-0<br/>E-Mail: <a href="mailto:dsgvo@pan21.com" className="text-blue-glow hover:text-blue">dsgvo@pan21.com</a></p>
          <h2 className="text-white font-medium pt-2">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>Harald Linhart, Anschrift wie oben</p>
          <h2 className="text-white font-medium pt-2">Verbraucherstreitbeilegung</h2>
          <p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          <p className="text-xs text-slate/30 mt-8">Hinweis: Minibeteiligung.de ist eine private Handelsplattform für Aktien von US Series LLCs. Es handelt sich nicht um regulierte Wertpapiere im Sinne des WpHG. Keine Anlageberatung.</p>
          <p className="pt-4"><Link href="/datenschutz" className="text-blue-glow hover:text-blue">Datenschutzerklärung</Link></p>
        </div>
      </div>
    </div>
  )
}
