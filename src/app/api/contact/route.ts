import { NextRequest, NextResponse } from 'next/server'

// Catches bot-generated random tokens that are short enough to slide past a simple
// length check but look nothing like a real word: very few vowels AND unnaturally
// frequent upper/lowercase switching. Both conditions required together to avoid
// flagging real oddly-cased words (e.g. "McDonald").
function isGibberish(str: string): boolean {
  const words = (str || '').split(/\s+/).filter(w => w.length >= 6);
  const vowelChars = 'aeiouyAEIOUYäöüÄÖÜàáâãåèéêëìíîïòóôõùúûýÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÝ';
  for (const word of words) {
    const letters = word.replace(/[^a-zA-ZäöüÄÖÜßàáâãåèéêëìíîïòóôõùúûýÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÝ]/g, '');
    if (letters.length < 6) continue;
    let vowels = 0;
    for (const ch of letters) if (vowelChars.includes(ch)) vowels++;
    const vowelRatio = vowels / letters.length;
    let transitions = 0;
    for (let i = 1; i < letters.length; i++) {
      const prevUpper = letters[i - 1] === letters[i - 1].toUpperCase() && letters[i - 1] !== letters[i - 1].toLowerCase();
      const curUpper = letters[i] === letters[i].toUpperCase() && letters[i] !== letters[i].toLowerCase();
      if (prevUpper !== curUpper) transitions++;
    }
    const transitionRatio = transitions / (letters.length - 1);
    // Tiered threshold: longer strings need a less extreme vowel-ratio to be flagged,
    // since genuine long words (esp. German compounds) always carry a healthy vowel
    // share, while short strings need a stricter cutoff to avoid catching real
    // camelCase brand names (McDonald, PayPal, JavaScript...).
    const vowelThreshold = letters.length >= 14 ? 0.28 : (letters.length >= 11 ? 0.22 : 0.16);
    if (vowelRatio < vowelThreshold && transitionRatio > 0.3) return true;
  }
  if (/\S{61,}/.test(str || '')) return true;
  return false;
}

export async function GET() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }) }

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, elapsed, honeypot } = await req.json()

  // Gibberish-Bot-Erkennung (kurze Zufallsstrings) — silent success wie Honeypot
  if (isGibberish(message) || isGibberish(name)) { return NextResponse.json({ ok: true }); }
    if (honeypot) return NextResponse.json({ ok: true })
    if (!elapsed || elapsed < 3000) return NextResponse.json({ error: 'Zu schnell' }, { status: 400 })
    if (!name || name.length > 80) return NextResponse.json({ error: 'Ungültiger Name' }, { status: 400 })
    if (message?.split(' ').some((w: string) => w.length > 60)) return NextResponse.json({ error: 'Ungültige Nachricht' }, { status: 400 })
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY!)
    await resend.emails.send({
      from: 'noreply@pan21.com', to: 'info@minibeteiligung.de',
      replyTo: email, subject: `Kontakt Minibeteiligung.de: ${name}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>E-Mail:</b> ${email}</p><p>${message?.replace(/\n/g,'<br>')}</p>`
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
