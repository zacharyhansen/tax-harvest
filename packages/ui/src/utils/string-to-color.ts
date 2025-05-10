export function stringToTailwindColor(string_: string) {
  const tailwindColors = [
    "bg-red-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-yellow-300",
    "bg-purple-300",
    "bg-pink-300",
    "bg-indigo-300",
    "bg-gray-300",
    "bg-orange-300",
    "bg-teal-300",
    "bg-emerald-300",
    "bg-lime-300",
    "bg-sky-300",
    "bg-stone-300",
    "bg-amber-300",
    "bg-slate-300",
    "bg-indigo-300",
    "bg-fuchsia-300",
  ];

  let hash = 0;

  // Create a hash from the string
  for (let index = 0; index < string_.length; index++) {
    hash = string_.charCodeAt(index) + ((hash << 5) - hash);
  }

  // Map the hash to one of the Tailwind colors
  const colorIndex = Math.abs(hash) % tailwindColors.length;

  return tailwindColors[colorIndex];
}
