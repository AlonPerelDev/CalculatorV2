import React, {useState} from "react";

var operator1 = "";
var operator2 = ""; 
let number1 = ""; 
let number2 = ""; 
let firstRun = true;
let useResult = false;
let tempResult = 0;
let noInputErrors = false;
let rnd = 0;
let periodAlreadyUsed = false;
let resetCounter = 0;
let interimErrorCheck = [];
let usedEqual = false;

function CreateArea() {
  
  const [tempChars, setTempChars] = useState([]);
  const [result, setResult] = useState(0);
  const [errorCheck, setErrorCheck] = useState([]);
  const [memoryFunctionsAvailable, setMemoryFunctionsAvailable] = useState(false);
  const [ms, setMS] = useState(0)


  function handleChange(event) {
    let id = event.target.id;
    resetCounter = 0;

//here starts an error checking loop
    if ( !(usedEqual === true && (!isNaN(+id))) ) { // do the following as long as 1.id != number && 2.= wasn't just used.
      if ( (errorCheck.length === 0) && (!isNaN(+id)) ) { //First entered character & is a number (wont hold true if "=" was used)
        setErrorCheck(previous=>{ return [...previous , id] });
        noInputErrors = true;
      }
      else if ( (errorCheck.length === 0) && ((id ==="rnd") || (id ==="mr")) ) {
        noInputErrors = true;
      }

      if ( (errorCheck.length > 0) && (!isNaN(+id)) ) { //not first entered character & is a number
        setErrorCheck(previous=>{ return [...previous , id] });
        noInputErrors = true;
      }
      else if ( (errorCheck.length > 0) && (isNaN(+id)) ) { //ID != first, ID !== number
        if (isNaN(+errorCheck[errorCheck.length -1])) { // PreviousChara !== number
          if (id === "mplus" || id === "mminus" || id === "ms" || id === "mr" || id === "mc" || id === "rnd" || id === "exp") {
            noInputErrors = true;
          }
          else {
            noInputErrors = false;
          }
        }
        else { //PreviousChara === number
          if (id === "mplus" || id === "mminus" || id === "ms" || id === "mr" || id === "mc" || id === "rnd"  || id === "exp") { //id not first, not a number, previous thing is a number though and id is from the memory group
            noInputErrors = true;
          }
          else if (id === "." && periodAlreadyUsed === true) {
            noInputErrors = false;
          }
          else if (id === "=" && firstRun){
            noInputErrors = false;
          }
          else {
            setErrorCheck(previous=>{ return [...previous , id] });
            noInputErrors = true;
          }
        }
     }
    }
    else {
      noInputErrors = false;
    }

//here ends the error checking loop

    console.log("ErrorCheckArray:", errorCheck)
    console.log("at the gate of 'if no input errors:'", noInputErrors)

    if (noInputErrors) {
      console.log("L3 state of noInputErrors:", noInputErrors)

      if (firstRun === true) {
        console.log("first run")
        usedEqual = false;
        if ((!isNaN(+id))) { //if 'id' = number, do this:
          setTempChars(previous=>{ return [...previous , id] });
        }
        else if (id === "/" || id === "*" || id === "+" || id === "-") {
          number1 = tempChars.join("");
          operator1 = id;
          setTempChars([id]);
          firstRun = false;
          periodAlreadyUsed = false;
        }
        else if (id === "." && periodAlreadyUsed === false) {
          setTempChars(previous=>{ return [...previous , id] });
          periodAlreadyUsed = true;
        }
        else if (id === "exp") {
          console.log("exponential")
          if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
            useResult = false;
            setTempChars([Math.exp(number1)])
            setErrorCheck(previous=>{ return [...previous , Math.exp(number1)] });
          }
          else {
            useResult = false;
            for (let index2 = 0; index2 < tempChars.length; index2++) {
              setErrorCheck((prev) => {
                interimErrorCheck = [...prev];
                interimErrorCheck.pop();
                return interimErrorCheck;
                });
            }
            setTempChars([Math.exp(tempChars.join(""))])
            setErrorCheck(previous=>{ return [...previous , Math.exp(tempChars.join(""))] });
          }
          periodAlreadyUsed = true;
        }

        else if (id === "rnd") {
          console.log("random number generator")
          rnd = Math.random();
          if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
            useResult = false;
            setTempChars([rnd])
            setErrorCheck(previous=>{ return [...previous , rnd] });
          }
          else {
            useResult = false;
            for (let index2 = 0; index2 < tempChars.length; index2++) {
              setErrorCheck((prev) => {
                interimErrorCheck = [...prev];
                interimErrorCheck.pop();
                return interimErrorCheck;
                });
            }
            setTempChars([rnd])
            setErrorCheck(previous=>{ return [...previous , rnd] });
          }
          periodAlreadyUsed = true;
        }

        //EXPERIMENTAL
        // this section handles what happens when a memory function is invoked
        else if (id === "ms" || id === "mplus" || id === "mminus" || id === "mr" || id === "mc") {
          console.log("special memory function:", id)

          if (id === "ms") {
            if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
              setMS(number1*1)
            }
            else {
              setMS(tempChars.join("")*1);
            }
            setMemoryFunctionsAvailable(true);
            console.log("ms stored succesfully the value of: ",ms)
          }
          else if (id === "mminus") {
            if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
              setMS(ms - number1);
            }
            else {
              setMS(ms - tempChars.join(""));
            }
            console.log("after -ms, the new value of MS is:", ms)
          }
          else if (id === "mplus") {
            if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
              setMS(parseFloat(ms) + parseFloat(number1));
            }
            else {
              setMS(parseFloat(ms) + parseFloat(tempChars.join("")));
            }
            console.log("after +ms, the new value of MS is:", ms)
          }
          else if (id === "mc") {
            setMS(0);
            setMemoryFunctionsAvailable(false);
          }
          else if (id === "mr") {
            if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
              useResult = false;
              setTempChars([ms])
              setErrorCheck(previous=>{ return [...previous , ms] });
            }
            else {
              for (let index2 = 0; index2 < tempChars.length; index2++) {
                setErrorCheck((prev) => {
                  interimErrorCheck = [...prev];
                  interimErrorCheck.pop();
                  return interimErrorCheck;
                  });
              }
              setTempChars([ms])
              setErrorCheck(previous=>{ return [...previous , ms] });
            }
            if (!Number.isSafeInteger(ms)) { //since MS is being restored, check it's not a float, if it is... period protection on
              console.log("stored number was a float, activating periodAlreadyUsed");
              periodAlreadyUsed = true;
            }
          }
        }

        //  here ends the section that handles memory functions

        else if (id === "round") {
          if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
            useResult = false;
            setTempChars([Math.round(number1*1)])
            setErrorCheck(previous=>{ return [...previous , Math.round(number1*1)] });

          }
          else {
            for (let index2 = 0; index2 < tempChars.length+1; index2++) {
              setErrorCheck((prev) => {
                interimErrorCheck = [...prev];
                interimErrorCheck.pop();
                return interimErrorCheck;
                });
            }
            setTempChars([Math.round(tempChars.join("")*1)])
            setErrorCheck(previous=>{ return [...previous , Math.round(tempChars.join("")*1)] });
          }
        }




        
      }

      else if (firstRun === false) {
        console.log("BEYOND first run")

        if ((!isNaN(+id))) { //if 'id' = number, do this:
          useResult = false;
          if (tempChars[0] === "/" || tempChars[0] === "*" || tempChars[0] === "+" || tempChars[0] === "-") {
              setTempChars([id]);
            }        
          else {
            setTempChars(previous=>{ return [...previous , id] });
          }
        }
        else if (id === "/" || id === "*" || id === "+" || id === "-") {
          useResult = true;
          number2 = tempChars.join("");
          operator2 = id;
          setTempChars([id]);
          if (operator1 === "*") {
            tempResult = parseFloat(number1) * parseFloat(number2);
            setResult(tempResult);
            number1 = tempResult;
          }
          else if (operator1 === "+") {
            tempResult = parseFloat(number1) + parseFloat(number2);
            setResult(tempResult);
            number1 = tempResult;
          }
          if (operator1 === "/") {
            tempResult = parseFloat(number1) / parseFloat(number2);
            setResult(tempResult);
            number1 = tempResult;
          }
          if (operator1 === "-") {
            tempResult = parseFloat(number1) - parseFloat(number2);
            setResult(tempResult);
            number1 = tempResult;
          }
          operator1 = operator2
          periodAlreadyUsed = false;


          console.log("result(stateful): ", result, "tempResult(stateless): ", tempResult)
        }
        // this section handles what happens when a memory function is invoked
        else if (id === "ms" || id === "mplus" || id === "mminus" || id === "mr" || id === "mc") {
          console.log("special memory function:", id)

          if (id === "ms") {
            if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
              setMS(number1*1)
            }
            else {
              setMS(tempChars.join("")*1);
            }
            setMemoryFunctionsAvailable(true);
            console.log("ms stored succesfully the value of: ",ms)
          }
          else if (id === "mminus") {
            if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
              setMS(ms - number1);
            }
            else {
              setMS(ms - tempChars.join(""));
            }
            console.log("after -ms, the new value of MS is:", ms)
          }
          else if (id === "mplus") {
            if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
              setMS(parseFloat(ms) + parseFloat(number1));
            }
            else {
              setMS(parseFloat(ms) + parseFloat(tempChars.join("")));
            }
            console.log("after +ms, the new value of MS is:", ms)
          }
          else if (id === "mc") {
            setMS(0);
            setMemoryFunctionsAvailable(false);
          }
          else if (id === "mr") {
            if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
              useResult = false;
              setTempChars([ms])
              setErrorCheck(previous=>{ return [...previous , ms] });
            }
            else {
              for (let index2 = 0; index2 < tempChars.length; index2++) {
                setErrorCheck((prev) => {
                  interimErrorCheck = [...prev];
                  interimErrorCheck.pop();
                  return interimErrorCheck;
                  });
              }
              setTempChars([ms])
              setErrorCheck(previous=>{ return [...previous , ms] });
            }
            if (!Number.isSafeInteger(ms)) { //since MS is being restored, check it's not a float, if it is... period protection on
              console.log("stored number was a float, activating periodAlreadyUsed");
              periodAlreadyUsed = true;
            }
          }
        }
        //  here ends the section that handles memory functions

        else if (id === "exp") {
          console.log("exponential")
          if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
            useResult = false;
            setTempChars([Math.exp(number1)])
            setErrorCheck(previous=>{ return [...previous , Math.exp(number1)] });
          }
          else {
            for (let index2 = 0; index2 < tempChars.length; index2++) {
              setErrorCheck((prev) => {
                interimErrorCheck = [...prev];
                interimErrorCheck.pop();
                return interimErrorCheck;
                });
            }
            setTempChars([Math.exp(tempChars.join(""))])
            setErrorCheck(previous=>{ return [...previous , Math.exp(tempChars.join(""))] });
          }
          periodAlreadyUsed = true;
        }

        else if (id === "rnd") {
          console.log("random number generator")
          rnd = Math.random();
          if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
            useResult = false;
            setTempChars([rnd])
            setErrorCheck(previous=>{ return [...previous , rnd] });
          }
          else {
            for (let index2 = 0; index2 < tempChars.length; index2++) {
              setErrorCheck((prev) => {
                interimErrorCheck = [...prev];
                interimErrorCheck.pop();
                return interimErrorCheck;
                });
            }
            setTempChars([rnd])
            setErrorCheck(previous=>{ return [...previous , rnd] });
          }
          periodAlreadyUsed = true;
        }

        else if (id === "." && periodAlreadyUsed === false) {
          setTempChars(previous=>{ return [...previous , id] });
          periodAlreadyUsed = true;
        }

        else if (id === "=") { //possibly add inside the if:  && !firstRun
          console.log("what is the status of FirstRun", firstRun)
          useResult = true;
          number2 = tempChars.join("");
          if (operator1 === "*") {
            tempResult = parseFloat(number1) * parseFloat(number2);
            setResult(tempResult);
            number1 = tempResult;
          }
          else if (operator1 === "+") {
            tempResult = parseFloat(number1) + parseFloat(number2);
            setResult(tempResult);
            number1 = tempResult;
          }
          if (operator1 === "/") {
            tempResult = parseFloat(number1) / parseFloat(number2);
            setResult(tempResult);
            number1 = tempResult;
          }
          if (operator1 === "-") {
            tempResult = parseFloat(number1) - parseFloat(number2);
            setResult(tempResult);
            number1 = tempResult;
          }
          //periodAlreadyUsed = false;
          console.log("operator1 = ", operator1)
          firstRun = true;
          usedEqual = true;
          setErrorCheck(previous=>{ return [...previous , tempResult] });
          setTempChars([tempResult]);
        }

        else if (id === "round") {
          if (tempChars.join("") === "/" || tempChars.join("") === "*" || tempChars.join("") === "+" || tempChars.join("") === "-") {
            useResult = false;
            setTempChars([Math.round(number1*1)])
            setErrorCheck(previous=>{ return [...previous , Math.round(number1*1)] });

          }
          else {
            for (let index2 = 0; index2 < tempChars.length+1; index2++) {
              setErrorCheck((prev) => {
                interimErrorCheck = [...prev];
                interimErrorCheck.pop();
                return interimErrorCheck;
                });
            }
            setTempChars([Math.round(tempChars.join("")*1)])
            setErrorCheck(previous=>{ return [...previous , Math.round(tempChars.join("")*1)] });
          }
        }

      }
    }
    else {console.log("input errors")}

    console.log(tempChars)
  }

  function reset () {
    resetCounter = resetCounter +1
    setTempChars([]);    
    operator1 = "";
    operator2 = "";    
    number1 = "";    
    number2 = "";    
    firstRun = true;
    setResult(0);
    tempResult = 0;
    useResult = false;
    setErrorCheck([]);
    noInputErrors = false;
    rnd = 0;
    periodAlreadyUsed = false;
    usedEqual = false;
    if (resetCounter > 1){
      resetCounter = 0;
      setMS(0)
      setMemoryFunctionsAvailable(false);
    }
  }

  return (
    <div class="grid-container">
      <div id="1" class="item1" onClick={handleChange}>1</div>
      <div id="2" class="item2" onClick={handleChange}>2</div>
      <div id="3" class="item3" onClick={handleChange}>3</div>  
      <div id="4" class="item4" onClick={handleChange}>4</div>
      <div id="5" class="item5" onClick={handleChange}>5</div>
      <div id="6" class="item6" onClick={handleChange}>6</div>
      <div id="7" class="item7" onClick={handleChange}>7</div>  
      <div id="8" class="item8" onClick={handleChange}>8</div>
      <div id="9" class="item9" onClick={handleChange}>9</div>
      <div id="0" class="item0" onClick={handleChange}>0</div>
      <div id="*" class="multiply" onClick={handleChange}>X</div>
      <div id="-" class="minus" onClick={handleChange}>-</div>
      <div id="+" class="plus" onClick={handleChange}>+</div>
      <div id="/" class="divide" onClick={handleChange}>/</div>
      <div id="=" class="equal" onClick={handleChange}>=</div>
      <div id="." class="dot" onClick={handleChange}>.</div>
      <div id="round" class="round" onClick={handleChange}>ROUND</div>
      <div id="typed" class="typed">{errorCheck}</div>
      <div id="msv" class="msv">{memoryFunctionsAvailable ? ms : ""}</div>
      <div id="===" class="result">{useResult ? result : tempChars}</div>
      <div id="exp" class="exp" onClick={handleChange}>EXP</div>
      <div id="rnd" class="rnd" onClick={handleChange}>RND</div>
      <div id="ac" class="ac" onClick={reset}>AC</div>
      <div id="mc" class="mc" onClick={handleChange} style={{color: memoryFunctionsAvailable ? 'black' : 'white'}}>MC</div>
      <div id="ms" class="ms" onClick={handleChange}>MS</div>
      <div id="mplus" class="mplus" onClick={handleChange} style={{color: memoryFunctionsAvailable ? 'black' : 'white'}}>M+</div>
      <div id="mminus" class="mminus" onClick={handleChange} style={{color: memoryFunctionsAvailable ? 'black' : 'white'}}>M-</div>
      <div id="mr" class="mr" onClick={handleChange} style={{color: memoryFunctionsAvailable ? 'black' : 'white'}}>MR</div>




    </div>


  );
}

export default CreateArea;
