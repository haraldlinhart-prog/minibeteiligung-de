import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Minibeteiligung.de — Private Aktienbörse ab USD 5',
  description: 'Minibeteiligung.de — die private Börse für Kleinanleger ab USD 5. Aktien von Series LLCs kaufen, handeln und verwalten. Stille Beteiligungen, Privataktien, Direktinvestments ohne Bank und Broker. Der Privatmarkt ist legal, anerkannt und seit Jahrhunderten etabliert.',
  keywords: [
    'Minibeteiligung', 'Mini Beteiligung', 'Privataktie', 'private Börse',
    'Privatbörse', 'private Beteiligungsbörse', 'Privatinvestor', 'Kleinanleger',
    'stille Beteiligung kaufen', 'stille Beteiligung', 'stiller Gesellschafter',
    'stille Gesellschaft', 'stille Beteiligung GmbH', 'stille Beteiligung UG',
    'Aktien ab 5 Dollar', 'Mikroinvestment', 'Series LLC Aktien',
    'Firmenaktie kaufen', 'Unternehmensanteile kaufen',
    'Beteiligung ab 5 Euro', 'Mini Aktie', 'Kleinstbeteiligung',
    'Aktiendepot privat', 'private Aktiengesellschaft', 'LLC Aktien kaufen',
    'Privatanleger Aktien', 'Börsenbeteiligung ohne Bank',
    'Unternehmensanteile ohne Notar', 'Beteiligung ohne Mindestanlage',
    'Privatmarkt Beteiligung', 'grauer Kapitalmarkt Alternative',
    'Privatmarkt Investition', 'Privatmarkt Aktien', 'Direktbeteiligung',
    'Beteiligung ohne Broker', 'Beteiligung ohne Bank',
    'private Unternehmensfinanzierung', 'Kleinbeteiligung Unternehmen',
    'Privatbörse Deutschland', 'alternative Geldanlage',
    'Unternehmensanteile Privatmarkt', 'Aktienhandel privat',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: `var _paq=window._paq=window._paq||[];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u="https://counter.ixan.org/";_paq.push(['setTrackerUrl',u+'matomo.php']);_paq.push(['setSiteId','79']);var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];g.async=true;g.src=u+'matomo.js';s.parentNode.insertBefore(g,s);})();`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Minibeteiligung.de",
          "url": "https://www.minibeteiligung.de",
          "description": "Private Mini-Börse für Aktien von Series LLCs ab USD 5"
        })}} />
              <script dangerouslySetInnerHTML={{__html: `var sc_project=13317697;var sc_invisible=1;var sc_security="458f783c";`}} />
        <script async src="https://www.statcounter.com/counter/counter.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
