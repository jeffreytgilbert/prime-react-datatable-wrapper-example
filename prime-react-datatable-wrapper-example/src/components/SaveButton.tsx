import { Button, Flex, MantineSize } from "@mantine/core";
import { Icon, IconCircleArrowDown } from "@tabler/icons-react";

interface SaveButtonProps {
  label?: string;
  Icon?: Icon;
  size?: MantineSize;
  radius?: MantineSize;
  type?: "submit" | "button";
  onClick?: () => void;
}
function SaveButton({
  label = 'Save',
  Icon,
  size = "lg",
  radius = "md",
  type = "submit",
  onClick
}: SaveButtonProps) {
  return (
    <Flex justify="center" m="lg">
      <Button
        type={type}
        size={size}
        radius={radius}
        onClick={onClick}
        leftSection={
          Icon ?
            <Icon size={30} stroke={1.5} style={{ opacity: .5 }} /> :
            <IconCircleArrowDown size={30} stroke={1.5} style={{ opacity: .5 }} />
        }>{label}</Button>
    </Flex>
  );
}

export default SaveButton;