import { ACTIONS } from "../App"

//creates an addition action for when a digit button is clicked or "invoked"
function DigitButton({ dispatch, digit }) {
    return (
    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
    {digit}
    </button>
    )
}

export default DigitButton; 