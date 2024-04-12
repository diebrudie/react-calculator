import { useReducer } from 'react';
import './App.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = { 
  ADD_DIGITS: 'add-digits',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

// Action type definitions
export type Action =
  | { type: 'add-digits'; payload: { digit: string } }
  | { type: 'choose-operation'; payload: { operation: string } }
  | { type: 'clear' } 
  | { type: 'delete-digit' }
  | { type: 'evaluate' };

// Handles all the actions
function reducer(state, { type, payload }){
  switch(type){
    case ACTIONS.ADD_DIGITS:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (state.currentOperand === "0" && payload.digit !== ".") {
        return {
          ...state,
          currentOperand: payload.digit
        };
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) return state
      return { 
        ...state, 
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state

      if (state.currentOperand === null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      
      if (state.previousOperand === null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      };
    case ACTIONS.CLEAR:       
      return {
        ...initialState,
        currentOperand: "0"
      };
    case ACTIONS.DELETE_DIGIT: 
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
      }
      if (state.currentOperand == null) return state 
      if (state.currentOperand.length === 1) return {
        ...state,
        currentOperand: null
      };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      };
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) return state
      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
      };
  }
}

// Evaluate the expression when an operation is chosen
function evaluate( {currentOperand, previousOperand, operation} ){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""  
  let computation = ""

  switch(operation){
    case "+":
      computation = (prev + current).toString();
      break
    case "-":
      computation = (prev - current).toString();
      break
    case "*":
      computation = (prev * current).toString();
      break    
    case "÷":
      computation = (prev / current).toString();
      break
    default:
      return ""    
  }
  return computation
}

// Define an initial state for your reducer
const initialState = {
  currentOperand: "0",
  previousOperand: null,
  operation: null,
};
// formats the numbers to have a europe/german format
const INTEGER_FORMATTER = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 0,
});
// formats the number to have a comma as a decimal separator
function formatOperand(operand) {
  if (operand == null || operand === "") return "0";
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(parseFloat(integer));
  return `${INTEGER_FORMATTER.format(parseFloat(integer))},${decimal}`;
}

function App() { 
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, initialState)  

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." display="," dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />      
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  )
}

export default App
