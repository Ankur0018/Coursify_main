export default function Spinner({ size = "md", light = false }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  const border = light
    ? "border-white/30 border-t-white"
    : "border-gray-200 border-t-brand-600";
  return (
    <div
      className={`${sizes[size]} ${border} border-2 rounded-full animate-spin`}
    />
  );
}
