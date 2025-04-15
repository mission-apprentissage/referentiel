export default function Validation ({ id, validation }) {
  return (
    <p id={id} className={`fr-${validation.type}-text`}>
      {validation.message}
    </p>
  );
}
