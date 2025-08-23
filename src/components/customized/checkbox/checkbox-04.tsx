import { Checkbox } from "@/components/ui/checkbox";

const technologies = [
  {
    name: "High Rate Properties",
    label: "High Rate Properties",
  },
  {
    name: "Low Rate Properties",
    label: "Low Rate Properties",
  },
  
];

export default function CheckboxHorizontalGroupDemo() {
  return (
    <div>
      
      <div className="mt-2 flex items-center justify-start gap-4 flex-wrap">
        {technologies.map(({ name, label }) => (
          <div key={name} className="flex items-center gap-2">
            <Checkbox id={name} />
            <label
              htmlFor={name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
