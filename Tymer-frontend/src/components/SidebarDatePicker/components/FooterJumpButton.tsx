export default function FooterJumpButton({ onClick }: any) {
  return (
    <div className="h-16 border-t border-black/20 flex items-center justify-center hover:bg-sky-100 transition-colors cursor-pointer">
    <button
      onClick={onClick}
      className="text-blue-500 text-base font-medium font-poppins "
    >
      Jump to Today
    </button>
    </div>
  );
}
