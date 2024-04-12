import { ACTIONS, Action } from "./App";
import { Dispatch } from "react";

interface OperationButtonProps {
    operation: string;
    dispatch: Dispatch<Action>;
  }

export default function OperationButton({ operation, dispatch }: OperationButtonProps) {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>{operation}</button>
  )
}