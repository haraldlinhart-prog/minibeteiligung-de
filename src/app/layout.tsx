import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Minibeteiligung.de — Private Aktienbörse ab USD 5',
  description: 'Erwerben Sie Aktien von Series LLCs ab USD 5 Nennwert. Private Mini-Börse für Kleinanleger — Minibeteiligung, Privataktie, stille Beteiligung, private Börsenbeteiligung, Privatinvestor.',
  keywords: [
    'Minibeteiligung', 'Mini Beteiligung', 'Privataktie', 'private Börse',
    'Privatbörse', 'private Beteiligungsbörse', 'Privatinvestor', 'Kleinanleger',
    'stille Beteiligung kaufen', 'Aktien ab 5 Dollar', 'Mikroinvestment',
    'Series LLC Aktien', 'Firmenaktie kaufen', 'Unternehmensanteile kaufen',
    'Beteiligung ab 5 Euro', 'Mini Aktie', 'Kleinstbeteiligung',
    'Aktiendepot privat', 'private Aktiengesellschaft', 'LLC Aktien kaufen',
    'Privatanleger Aktien', 'Börsenbeteiligung ohne Bank',
    'Unternehmensanteile ohne Notar', 'Beteiligung ohne Mindestanlage',
  ].join(', '),
  openGraph: {
    title: 'Minibeteiligung.de — Private Aktienbörse ab USD 5',
    description: 'Kaufen und handeln Sie Aktien von Series LLCs. Ab USD 5 Nennwert, keine Bank, kein Mindestbetrag.',
    url: 'https://www.minibeteiligung.de',
    siteName: 'Minibeteiligung.de',
    locale: 'de_DE',
    type: 'website',
  },
  alternates: { canonical: 'https://www.minibeteiligung.de' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: `var _paq=window._paq=window._paq||[];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u="https://counter.ixan.org/";_paq.push(['setTrackerUrl',u+'matomo.php']);_paq.push(['setSiteId','79']);var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];g.async=true;g.src=u+'matomo.js';s.parentNode.insertBefore(g,s);})();`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Minibeteiligung.de",
          "url": "https://www.minibeteiligung.de",
          "description": "Private Mini-Börse für Aktien von Series LLCs ab USD 5"
        })}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
