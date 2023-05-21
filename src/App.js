import { useReducer } from "react"
import "./styles/styles.css"
import DigitButton from "./buttons/DigitButton"
import OperationButton from "./buttons/OperationButton"


// create actions for calculator
export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}

//use the reducer operation to specify what happens when each operation is invoked
function reducer(state, {type, payload}) {
    switch (type) {
        
        //when adding mutiple numbers are invoked
        case ACTIONS.ADD_DIGIT:
            if(state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false
                }
            }
            if(payload.digit === "0" && state.currentOperand === "0") {
                return state
            }
            if(payload.digit === "." && state.currentOperand.includes(".")) {
                return state
            }
        return {
            ...state,
            currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        }
        
        //when selecting numbers and operations are invoked
        case ACTIONS.CHOOSE_OPERATION:
            if(state.currentOperand == null && state.previousOperand == null) {
                return state
            }
            if(state.previousOperand == null ) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }
            if(state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }

        return {
            ...state,
            previousOperand: evaluate(state),
            currentOperand: null,
            operation: payload.operation
        }
        //when the clear action is invoked
        case ACTIONS.CLEAR:
            return {}

        //when the delete action is invoked
        case ACTIONS.DELETE_DIGIT:
            if(state.overwrite) {
                return {
                    ...state,
                    currentOperand: null,
                    overwrite: false
                }
            }
            if(state.currentOperand == null) return state
            if(state.currentOperand.length === 1) {
                return {
                    ...state,
                    currentOperand: null
                }
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }

        //when the evaluate action is invoked
        case ACTIONS.EVALUATE:
            if(state.operation == null ||
               state.currentOperand == null ||
               state.previousOperand == null) {
                return state
            }

        return {
            ...state,
            overwrite: true,
            previousOperand: null,
            operation: null,
            currentOperand: evaluate(state)
        }
    }
}

//creates the functionallity for the operations being used
function evaluate({ currentOperand, previousOperand, operation}) {
    const previous = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if(isNaN(previous) || isNaN(current)) return ""
    let compute = ""
    switch (operation) {
        case "+":
            compute = previous + current
        break
        case "-":
            compute = previous - current
        break
        case "*":
            compute = previous * current
        break
        case "÷":
            compute = previous / current
        break
    }
    return compute.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0
})

//Allows numbers to be formatted properly using numerical symbols
function formatOperand(operand) {
    if(operand == null) return
    const [integer, decimal] = operand.split('.')
    if(decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App () {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
    // html code with our buttons with actions
    return (
    <div className="calculator-grid">
        <div className="output">
            <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
            <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation='÷' dispatch={dispatch}/>
        <DigitButton digit='1' dispatch={dispatch}/>        
        <DigitButton digit='2' dispatch={dispatch}/>
        <DigitButton digit='3' dispatch={dispatch}/>
        <OperationButton operation='*' dispatch={dispatch}/>
        <DigitButton digit='4' dispatch={dispatch}/>
        <DigitButton digit='5' dispatch={dispatch}/>
        <DigitButton digit='6' dispatch={dispatch}/>
        <OperationButton operation='+' dispatch={dispatch}/>
        <DigitButton digit='7' dispatch={dispatch}/>
        <DigitButton digit='8' dispatch={dispatch}/>
        <DigitButton digit='9' dispatch={dispatch}/>
        <OperationButton operation='-' dispatch={dispatch}/>
        <DigitButton digit='.' dispatch={dispatch}/>
        <DigitButton digit='0' dispatch={dispatch}/>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
)
}

export default App;