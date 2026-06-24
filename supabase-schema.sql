-- Minibeteiligung.de Schema
-- mb_ prefix, gleiche Supabase wie Noble Limited

-- Registrierte Nutzer
CREATE TABLE IF NOT EXISTS mb_users (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) UNIQUE,
  email        text NOT NULL UNIQUE,
  display_name text,
  created_at   timestamptz DEFAULT now()
);

-- Series LLCs die Aktien ausgeben (verknüpft mit firmenaktie.de)
CREATE TABLE IF NOT EXISTS mb_companies (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,              -- z.B. "Mustermann Trading Series of 10com Services LLC"
  short_name    text NOT NULL,              -- z.B. "MUSTERMANN"
  description   text,
  fa_company_id uuid,                       -- Referenz zu fa_companies (firmenaktie.de)
  total_shares  numeric NOT NULL DEFAULT 0, -- Gesamtanzahl ausgegebener Aktien
  nominal_usd   numeric NOT NULL DEFAULT 5, -- Nennwert pro Aktie in USD (mind. 5)
  status        text DEFAULT 'active',      -- active | suspended | delisted
  listed_at     timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now()
);

-- Aktiendepots (Bestände pro Nutzer pro Unternehmen)
CREATE TABLE IF NOT EXISTS mb_depot (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id),
  company_id  uuid REFERENCES mb_companies(id),
  shares      numeric NOT NULL DEFAULT 0,   -- Anzahl Aktien
  avg_cost    numeric NOT NULL DEFAULT 0,   -- Durchschnittlicher Einstandskurs (USD)
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Transaktionen (Käufe, Verkäufe, Gebote)
CREATE TABLE IF NOT EXISTS mb_transactions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id),
  company_id   uuid REFERENCES mb_companies(id),
  type         text NOT NULL,               -- 'buy' | 'sell' | 'bid_accepted'
  shares       numeric NOT NULL,
  price_usd    numeric NOT NULL,            -- Preis pro Aktie in USD (Ausgabepreis)
  nominal_usd  numeric NOT NULL,            -- Nennwert pro Aktie
  total_eur    numeric NOT NULL,            -- Gesamtbetrag in EUR
  payment_method text DEFAULT 'stripe',     -- 'stripe' | 'noble'
  stripe_session text,
  status       text DEFAULT 'pending',      -- pending | completed | cancelled
  created_at   timestamptz DEFAULT now()
);

-- Öffentliche Angebotsliste (Listings zum Bieten)
CREATE TABLE IF NOT EXISTS mb_listings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid REFERENCES mb_companies(id),
  seller_id    uuid REFERENCES auth.users(id),
  shares       numeric NOT NULL,            -- Anzahl angebotener Aktien
  ask_usd      numeric NOT NULL,            -- Mindestpreis pro Aktie (USD)
  current_bid  numeric,                     -- Aktuelles Höchstgebot
  status       text DEFAULT 'active',       -- active | sold | cancelled | expired
  expires_at   timestamptz,
  created_at   timestamptz DEFAULT now()
);

-- Gebote auf Listings
CREATE TABLE IF NOT EXISTS mb_bids (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  uuid REFERENCES mb_listings(id),
  bidder_id   uuid REFERENCES auth.users(id),
  bid_usd     numeric NOT NULL,             -- Gebot pro Aktie in USD
  status      text DEFAULT 'active',        -- active | outbid | accepted | withdrawn
  created_at  timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE mb_users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_companies     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_depot         ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_transactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_listings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE mb_bids          ENABLE ROW LEVEL SECURITY;

-- Service role: alles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mb_users' AND policyname='sr_all') THEN
    CREATE POLICY "sr_all" ON mb_users FOR ALL TO service_role USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mb_companies' AND policyname='sr_all') THEN
    CREATE POLICY "sr_all" ON mb_companies FOR ALL TO service_role USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mb_depot' AND policyname='sr_all') THEN
    CREATE POLICY "sr_all" ON mb_depot FOR ALL TO service_role USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mb_transactions' AND policyname='sr_all') THEN
    CREATE POLICY "sr_all" ON mb_transactions FOR ALL TO service_role USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mb_listings' AND policyname='sr_all') THEN
    CREATE POLICY "sr_all" ON mb_listings FOR ALL TO service_role USING (true) WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mb_bids' AND policyname='sr_all') THEN
    CREATE POLICY "sr_all" ON mb_bids FOR ALL TO service_role USING (true) WITH CHECK (true); END IF;
END $$;

-- Anon: nur lesen was öffentlich ist
CREATE POLICY "public_companies" ON mb_companies FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "public_listings"  ON mb_listings  FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "public_bids"      ON mb_bids      FOR SELECT TO anon USING (true);
