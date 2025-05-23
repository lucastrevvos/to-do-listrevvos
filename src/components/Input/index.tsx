import { useState } from "react";
import { TextInputProps } from "react-native";
import { Container } from "./styles";

type Props = TextInputProps;

export function Input({ ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      isFocused={isFocused}
      {...rest}
    ></Container>
  );
}
