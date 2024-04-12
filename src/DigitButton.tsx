import { ACTIONS, Action } from "./App";
import { Dispatch } from "react";

interface DigitButtonProps {
  digit: string;
  dispatch: Dispatch<Action>;
}

export default function DigitButton({ digit, display, dispatch }: DigitButtonProps) {
    return (
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGITS, payload: { digit } })}>
        {display || digit}
      </button>
    );
  }
