# Bible datasets

- `pt-BR.json`: Almeida 1819 (Bíblia Livre), public domain.
  - Dataset: https://github.com/midvash/bible-data/tree/main/versions/pt/almeida-livre
  - Metadata: `pt-BR.metadata.json`
  - License declaration: public domain, 1819 edition of the João Ferreira de Almeida translation.

- `en.json`: World English Bible (WEB), public domain.
  - Official source: https://worldenglish.bible/
  - Dataset: https://github.com/midvash/bible-data/tree/main/versions/en/web
  - Metadata: `en.metadata.json`
  - License declaration: public domain, released by Rainbow Missions, Inc.
  - Trademark note: "World English Bible" is a trademark. Use the name only to identify faithful copies of the public-domain translation.

Both datasets are generated from [midvash/bible-data](https://github.com/midvash/bible-data), which publishes open, machine-readable public-domain Bible texts. The adjacent `*.metadata.json` files preserve each edition's source provenance and license declaration. Run `npm run fetch:bible` to refresh them.
