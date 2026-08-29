const magazines = [
  "Elle Décoration",
  "Marie Claire Maison",
  "Côté Maison",
  "Art & Décoration",
  "Architectural Digest",
  "IDEAT",
  "Milk Décoration",
  "Maison & Jardin",
  "Le Monde",
  "Le Figaro",
  "Les Échos",
  "Madame Figaro",
  "Vogue",
  "Vanity Fair",
];

export function MagazineTicker() {
  const loop = [...magazines, ...magazines];

  return (
    <div className="magazine-ticker" aria-hidden="true">
      <div className="magazine-ticker-track">
        {loop.map((name, index) => (
          <span key={`${name}-${index}`} className="magazine-ticker-item">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
