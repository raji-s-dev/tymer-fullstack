interface TimeSlotProps {
  time: string;
  children?: React.ReactNode;
}

export default function TimeSlot({ time, children }: TimeSlotProps) {
  return (
    <div className="flex items-start  gap-0 mb-1.5 pl-4">

      <div className="w-[90px] pt-0 text-black text-[15px] font-medium font-inter">
        {time}
      </div>

  <div
  className="
    flex-1
    min-h-[70px]
    bg-[#FAFAFA]
    rounded-l-[10px]
    px-6
    py-6
    grid
    gap-6
    justify-start
    [grid-template-columns:repeat(auto-fill,621px)]
  "
>
  {children}
</div>

    </div>
  );
}
