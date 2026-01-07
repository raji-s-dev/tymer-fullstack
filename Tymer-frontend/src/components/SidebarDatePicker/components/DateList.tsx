import DateItem from "./DateItem";


export default function DateList({
  datesArray,
  selectedDate,
  onSelect,
  dateRefs,
}: any) {
  return (
    <div>
      {datesArray.map((d: any, index: number) => (
        <DateItem
          key={index}
          number={d.number}
          fullDate={d.fullDate}
          taskCount={d.taskCount}
          isSelected={selectedDate.format("YYYY-MM-DD") === d.fullDate}
          onSelect={() => onSelect(d.fullDate, index)}
          refEl={(el) => (dateRefs.current[index] = el)}
        />
      ))}
    </div>
  );
}
