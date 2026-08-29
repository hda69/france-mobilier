const magazines = [
  { name: "Elle Décoration", src: "/magazines/elle-decoration.png" },
  { name: "Marie Claire Maison", src: "/magazines/marie-claire-maison.png" },
  { name: "Côté Maison", src: "/magazines/cote-maison.png" },
  { name: "Art & Décoration", src: "/magazines/art-decoration.png" },
  { name: "Architectural Digest", src: "/magazines/architectural-digest.png" },
  { name: "IDEAT", src: "/magazines/ideat.png" },
  { name: "Milk Décoration", src: "/magazines/milk-decoration.png" },
  { name: "Maison & Jardin", src: "/magazines/maison-jardin.png" },
  { name: "Le Monde", src: "/magazines/le-monde.png" },
  { name: "Le Figaro", src: "/magazines/le-figaro.png" },
  { name: "Les Échos", src: "/magazines/les-echos.png" },
  { name: "Madame Figaro", src: "/magazines/madame-figaro.png" },
  { name: "Vogue", src: "/magazines/vogue.png" },
  { name: "Vanity Fair", src: "/magazines/vanity-fair.png" },
] as const;

export function MagazineTicker() {
  const loop = [...magazines, ...magazines];

  return (
    <div className="magazine-ticker" aria-hidden="true">
      <div className="magazine-ticker-track">
        {loop.map((magazine, index) => (
          <span key={`${magazine.src}-${index}`} className="magazine-ticker-item">
            <img src={magazine.src} alt="" height={28} />
          </span>
        ))}
      </div>
    </div>
  );
}
