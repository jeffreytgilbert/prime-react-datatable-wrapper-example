import { Button, Fieldset, SimpleGrid, TextInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { ChangeEvent } from "react";

interface InputValues {
  [key: string]: string;
}

interface DynamicInputFieldsProps {
  inputFields: InputValues[];
  setInputFields: React.Dispatch<React.SetStateAction<InputValues[]>>;
  formFieldKey: string;
  placeholder?: string;
}

export const FormDynamicInputs = ({
  inputFields,
  setInputFields,
  formFieldKey,
  placeholder = "..."
}: DynamicInputFieldsProps) => {
  const handleValueChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...inputFields];
    values[index][`${formFieldKey}${index === 0 ? "".trim() : index + 1}`] =
      event.target.value;
    setInputFields(values);
  };

  const handleAddFields = () => {
    setInputFields([...inputFields, { v: "" }]);
  };

  const handleRemoveFields = (index: number) => {
    const newInputFields = [...inputFields];
    newInputFields.splice(index, 1);
    setInputFields(newInputFields);
  };
  return (
    <>
      {inputFields.map((inputField, index) => (
        <Fieldset legend={`Additional info ${index + 1}`} mt="xs" key={index}>
          <SimpleGrid display="flex" style={{ alignItems: "center" }} mt="xs">
            <TextInput
              placeholder={placeholder}
              w={"100%"}
              value={inputField.value}
              onChange={(e) => handleValueChange(index, e)}
            />
            <Button onClick={() => handleRemoveFields(index)}><IconTrash /></Button>
          </SimpleGrid>
        </Fieldset>
      ))}
      <Button
        onClick={handleAddFields}
        mt="xs"
        disabled={inputFields.length === 5}
      >
        + Additional Info
      </Button>
    </>
  );
};
