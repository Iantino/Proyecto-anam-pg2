export default function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E8F3EC] to-[#DCE4DA] p-4 text-center">
      <span className="text-sm text-[#5B6B63]">{label}</span>
    </div>
  );
}
