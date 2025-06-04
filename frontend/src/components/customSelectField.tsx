import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";

interface OptionProps {
  text: string;
  value: string;
}

interface FieldProps {
  name: string;
  id: string;
  customClassNames?: string;
  options: OptionProps[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const CustomSelect: React.FC<FieldProps> = ({
  name,
  id,
  customClassNames = "",
  options,
  defaultValue,
  onValueChange,
}) => {
  return (
    <Select.Root
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
    >
      <Select.Trigger
        id={id}
        className={`inline-flex gap-4 items-center justify-between px-4 py-2 w-fit rounded-md shadow border text-left text-sm ${customClassNames}`}
      >
        <Select.Value placeholder="Select an option" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-white rounded-lg shadow-lg z-50"
          position="popper"
        >
          <Select.Viewport className="p-1 w-full">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="flex font-poppins items-center gap-4 select-none rounded-md px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
              >
                <Select.ItemText>{option.text}</Select.ItemText>
                <Select.ItemIndicator className="">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CustomSelect;
