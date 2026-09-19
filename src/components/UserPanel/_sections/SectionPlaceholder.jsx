// Shared visual stub for Home page sections that are explicitly out of
// scope for this migration phase (their real implementation lands in a
// later phase, at the same import path this stub currently occupies —
// so the Home orchestrator's imports never need to change).
export default function SectionPlaceholder({ name, minHeight = 200 }) {
  return (
    <div
      data-section-placeholder={name}
      style={{
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9ca3af",
        fontSize: 13,
      }}
    >
      {name} section — migrates in a later phase
    </div>
  );
}
