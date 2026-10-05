import Link from 'next/link'
export const metadata = { title: 'Datenschutzerklärung — Minibeteiligung.de', alternates: { canonical: 'https://www.minibeteiligung.de/datenschutz' } }

const sections: [string, React.ReactNode][] = [
  ['Verantwortlicher', <>Verantwortlich für die Datenverarbeitung auf dieser Website ist die PAN21.com International LLC, 7533 South Center View CT, STE R, West Jordan, UT 84084, USA, vertreten durch Harald Linhart. E-Mail: <a href="mailto:dsgvo@pan21.com" className="text-blue-glow hover:text-blue">dsgvo@pan21.com</a>, Telefon: +49 30 5684450-0.</>],
  ['Hosting und Datenbank', <>Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf der Website verarbeitet Vercel technisch notwendige Daten wie IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Referrer und Browserinformationen (Server-Logfiles), um die Website auszuliefern und vor Missbrauch zu schützen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und stabilen Betrieb). Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung; Datenübermittlungen in die USA erfolgen auf Grundlage der EU-Standardvertragsklauseln. Konten, Depotbestände, Gebote und Transaktionen werden in einer Datenbank bei Supabase Inc. gespeichert.</>],
  ['Cookies und Anmeldung', <>Diese Website setzt keine Cookies zu Analyse- oder Werbezwecken. Für die Anmeldung per E-Mail-Link wird Ihre E-Mail-Adresse verarbeitet; die Anmeldesitzung wird technisch notwendig in Ihrem Browser gespeichert (Art. 6 Abs. 1 lit. b DSGVO).</>],
  ['Handelsplattform', <>Für die Nutzung der Börse verarbeiten wir Ihre E-Mail-Adresse, Ihren Namen, Transaktionsdaten und Ihren Depotbestand, um Käufe, Gebote und Ihr Depot zu verwalten. Gebote und Listings sind öffentlich sichtbar; Ihr Name wird dabei nicht angezeigt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</>],
  ['Zahlungen', <>Zahlungen werden über Stripe (Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Dublin 2, Irland) abgewickelt. Dabei werden die für die Zahlung erforderlichen Daten an Stripe übermittelt. Wählen Sie die Zahlung mit EUROPAN-Guthaben, werden Ihre E-Mail-Adresse und der Zahlbetrag zur Abbuchung an das EUROPAN-Guthabensystem (noble-limited.com) übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</>],
  ['Besucherzählung mit PAN21counter', <>Zur Zählung der Seitenaufrufe nutzen wir den eigenen Besucherzähler PAN21counter (pan21counter.de). Er setzt keine Cookies und erstellt keine Nutzerprofile. Aus der IP-Adresse wird beim Aufruf ein gekürzter, täglich wechselnder Hashwert gebildet, um Mehrfachzählungen am selben Tag zu vermeiden; die IP-Adresse selbst wird nicht gespeichert. Einzelne Aufrufe werden nach drei Tagen gelöscht, danach bleiben nur zusammengefasste Tageszahlen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer einfachen Reichweitenmessung).</>],
  ['Werbebanner', <>Werbebanner werden über unseren eigenen Adserver ads.pan21.com ausgeliefert. Dabei wird die IP-Adresse technisch bedingt verarbeitet, um das Banner auszuliefern; es werden keine Nutzerprofile erstellt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</>],
  ['Kontaktformular und E-Mail', <>Wenn Sie uns über das Kontaktformular oder per E-Mail schreiben, verarbeiten wir Ihre Angaben (z. B. Name, E-Mail-Adresse, Nachricht), um Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Vertrag zielt, sonst Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden gelöscht, sobald sie nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten bestehen. Der E-Mail-Versand erfolgt über Resend (Resend Inc., USA) auf Grundlage eines Auftragsverarbeitungsvertrags und der EU-Standardvertragsklauseln.</>],
  ['Newsletter', <>Für den Newsletter nutzen wir beehiiv (Beehiiv Inc., USA). Wenn Sie sich anmelden, werden Ihre E-Mail-Adresse und Anmeldedaten bei beehiiv gespeichert. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit über den Abmeldelink widerrufen können.</>],
  ['KI-Chat und Sprachanruf', <>Der KI-Chat bzw. Sprachanruf wird erst geladen, wenn Sie ihn aktiv starten. Dann werden Ihre Eingaben bzw. Ihre Stimme an den Anbieter übermittelt, um das Gespräch zu führen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. f DSGVO.</>],
  ['Schriftarten', <>Die Schriftarten dieser Website werden lokal von unserem Server geladen. Es findet keine Verbindung zu Servern von Google oder anderen Schriftanbietern statt.</>],
  ['Eingebettete Inhalte', <>Diese Website bindet Inhalte von anderen Servern ein: das Hintergrundvideo von video.pan21.com, Produktbilder von shop.pan21.com, Verzeichnis-Banner von ffa-links.de, swiss-quality.de und german-quality.net, das Firmenkauf-Widget von firmenkauf.org sowie das Skript des Anruf-Widgets von virtual-office-khaki-phi.vercel.app. Beim Laden dieser Inhalte wird Ihre IP-Adresse technisch bedingt an den jeweiligen Server übertragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</>],
  ['Ihre Rechte', <>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21). Erteilte Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Wenden Sie sich für Ihre Anliegen an <a href="mailto:dsgvo@pan21.com" className="text-blue-glow hover:text-blue">dsgvo@pan21.com</a>.</>],
]

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-void px-4 sm:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-glow text-sm hover:text-blue mb-8 block">← Zurück</Link>
        <h1 className="font-display text-3xl font-bold text-white mb-8">Datenschutzerklärung</h1>
        <div className="text-slate/60 text-sm space-y-6">
          {sections.map(([title, body], i) => (
            <div key={title}><h2 className="text-white font-medium mb-2">{i + 1}. {title}</h2><p>{body}</p></div>
          ))}
          <p>Stand: Oktober 2026</p>
          <p><Link href="/impressum" className="text-blue-glow hover:text-blue">Impressum</Link></p>
        </div>
      </div>
    </div>
  )
}
