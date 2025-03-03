import { Combobox } from "@mantine/core";
import { SelectOption } from "../schemas/models/SelectOption";

export const ComboBoxOptions:React.FC<{optionsList:SelectOption[], selectedValue:string }> = ({optionsList, selectedValue})=> {
  return  optionsList.map((option: SelectOption) => (
    <Combobox.Option
      key={option.value}
      value={option.value}
      active={option.value === selectedValue}>
      {option.label}
    </Combobox.Option>
  ))
};