// Heritage icon sprite (public/icons.svg) — same icon set as the reference design.
// Available names: home, about, sections, collections, heritage, visit, contact,
// documents, world, museum, family, crown, stamps, coins, photograph, heirloom,
// phone, email, whatsapp, close, check, arrow-down, map, instagram, facebook,
// youtube, x, heritage-mark

export function Icon({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} className={className} aria-hidden="true">
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
}
