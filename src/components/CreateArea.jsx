import React, {useState} from "react";

let possibleOperators = ["+","-","*","/"]
let operator = ""; 
let previousNumber = "";
let justUsedEqual = false;
let firstRun = false; //this variable was made to try and make the first run seamless. coz resetTempChars is activated at the first operator run, but it fucks up the first run. good for other runs. fml.

function CreateArea() {

  const [tempChars, setTempChars] = useState([]);
  const [historyChars, setHistoryChars] = useState([]);
  const [memoryValue, setMemoryValue] = useState("")

  ///Error Checking MEchanism start ///

  function inputValidator (currentID) { //currently checks for an operator being entered twice in a row
    if ( (isNaN(+currentID)) ) { //if the ID is NOT a number:
      let lastHistChar = historyChars[historyChars.length-1];
      console.log("lastHistChar = ",lastHistChar)
      ///the check below eliminates double operators
      if ( historyChars[historyChars.length-1] === currentID) { //in case ID is same as previous ID (operator on operator)
        console.log("from input validator: ",historyChars[historyChars.length-1],currentID)
        return false;
      }
      else if ( (lastHistChar === "+" || lastHistChar === "-" || lastHistChar === "/" || lastHistChar === "*")) {
        if (currentID === "+" || currentID === "-" || currentID === "/" || currentID === "*") {
          console.log("operator after operator")
          return false;
        }
      }
      ///the check below makes sure that if the "." is called, it's not for a number that's already a fracture
      ///the equal sign ("=") empties the temp.char, and so, we use previousNumber if that's the case.
      else if (currentID === "." && (!isNaN(+historyChars[historyChars.length-1])) ) { // id = "." and prev chara isn't operator
        if (justUsedEqual) {
          if ( !Number.isSafeInteger(parseFloat(previousNumber)) ) {//returns false to floats (can't put another period on a fraction already)
            console.log("just used equal = true, previousNumber = ", previousNumber)
            return false;
          }
        }
        else if ( !Number.isSafeInteger(parseFloat(tempChars.join(""))) ) {//returns false to floats (can't put another period on a fraction already)
          console.log("just used equal = false, tempChars = ", tempChars.join(""))
          return false;
        }
      }

    }
  }

  ///Error checking mechanism end
 
  function addToDisplayHistoryString (char) {
    setHistoryChars(previous => { return [...previous, char] })
  }

  function addToTemporaryCharacterString (char) {
    setTempChars(previous=>{ return [...previous , char] });
  }

  function replaceTemporaryCharacterString (char) {
    setTempChars([char]);
  }

  function resetTemporaryCharacterString () {
    setTempChars([]);
  }

  function removeFromHistoryCharactersString (number) {
    let interimErrorCheck = [];
    for (let index2 = 0; index2 < number; index2++) {
      setHistoryChars((prev) => {
        interimErrorCheck = [...prev];
        interimErrorCheck.pop();
        return interimErrorCheck;
        });
    }
  }

  function insertRandomNumber () {
    let rnd = Math.random()
    console.log("SodomizerRandomizer")
    replaceTemporaryCharacterString(rnd);
    addToDisplayHistoryString(rnd);
  }

  function calculateFromOperator (char) {
    let currentNumber = tempChars.join("");
    let result = ""; 
    
    if (operator === "*") {
      result = parseFloat(previousNumber) * parseFloat(currentNumber);
    }
    else if (operator === "+") {
      result = parseFloat(previousNumber) + parseFloat(currentNumber);
    }
    else if (operator === "/") {
      result = parseFloat(previousNumber) / parseFloat(currentNumber);
    }
    else if (operator === "-") {
      result = parseFloat(previousNumber) - parseFloat(currentNumber);
    }

    addToDisplayHistoryString("=")
    addToDisplayHistoryString(result)
    addToDisplayHistoryString(char)
    resetTemporaryCharacterString()
    //setTempChars([])
    //replaceTemporaryCharacterString("")
    operator = char;
    previousNumber = result;
  }

  function calculateFromEqual () {
    let currentNumber = tempChars.join("");
    let result = ""; 
    
    if (operator === "*") {
      result = parseFloat(previousNumber) * parseFloat(currentNumber);
    }
    else if (operator === "+") {
      result = parseFloat(previousNumber) + parseFloat(currentNumber);
    }
    else if (operator === "/") {
      result = parseFloat(previousNumber) / parseFloat(currentNumber);
    }
    else if (operator === "-") {
      result = parseFloat(previousNumber) - parseFloat(currentNumber);
    }

    addToDisplayHistoryString("=")
    addToDisplayHistoryString(result)
    resetTemporaryCharacterString()
    //setTempChars([])
    //replaceTemporaryCharacterString("")
    operator = ""
    previousNumber = result;
    justUsedEqual = true;
  }

  function calculateMemory (memoryOperator) {
    if (memoryOperator === "mplus") {
      setMemoryValue((previousMemoryValue) => { return parseFloat(previousMemoryValue) + parseFloat(tempChars.join(""))});
    }
    else {
      setMemoryValue((previousMemoryValue) => { return parseFloat(previousMemoryValue) - parseFloat(tempChars.join(""))});
    }
  }

    /////////////////////////////////////////////
   //////////// handleChange ahead: ////////////
  /////////////////////////////////////////////

  function handleChange(event) {
    let id = event.target.id;

    if(inputValidator(id) !== false) {
      console.log("*************Start Of Operations*******************")
      console.log("tempChars.join()",tempChars.join(""))
      if (previousNumber === "") { //in case there isn't yet a previousNumber
        if ( (!isNaN(+id)) ) { // if 'id' = number, do this:
          firstRun = true;
          addToTemporaryCharacterString(id);
          addToDisplayHistoryString(id);
          previousNumber = id; //id becomes previous number, so, once even 1 number is in, prevnum is set to it
          console.log("level1, end of previousnumber=nothing, temporaryChars= ",tempChars)
        }
        else if (id === "rnd") {
          firstRun = true;
          insertRandomNumber()
          previousNumber = id;
        }
      }
      // the lines below happen once at least one keystroke was entered, which is a number
      else if ( (!isNaN(+id)) && (justUsedEqual === false) ) { // if 'id' = number, do this:
        console.log("level 2, beginning, temporaryChars= ",tempChars)
        addToTemporaryCharacterString(id);
        addToDisplayHistoryString(id);
      }

      else if ( id === "." ) {
        addToTemporaryCharacterString(id);
        addToDisplayHistoryString(id);
      }

      else if ( (id === "/" || id === "*" || id === "+" || id === "-") ) {
        justUsedEqual = false;

        if (operator === ""){
          console.log("inside operator === nothing, value of tempchars:", tempChars.join(""), "previousNumber:", previousNumber)

          if (firstRun) { //these 3 linbes fix the first run error (111+1=2)
            previousNumber = tempChars.join("");
            firstRun = false;
          }
          operator = id;
          addToDisplayHistoryString(id);
          resetTemporaryCharacterString()
          //setTempChars([]);
          //replaceTemporaryCharacterString("")
        }
        else {
          calculateFromOperator(id);
        }
      }

      else if (id === "=" && operator !== "" && (!isNaN(+historyChars[historyChars.length-1])) ) {
        calculateFromEqual()
      }

      else if ( (id === "mc" || id === "ms" || id === "mr" || id === "mplus" || id === "mminus") ) {
        if (id === "ms") {
          if ( (!isNaN(+historyChars[historyChars.length-1])) && justUsedEqual === false) {
            setMemoryValue(tempChars.join(""));
          }
          else setMemoryValue(previousNumber);
        }
        else if (id === "mr" && memoryValue !== "" && justUsedEqual !== true) {
          removeFromHistoryCharactersString(tempChars.length)
          replaceTemporaryCharacterString(memoryValue);
          addToDisplayHistoryString(memoryValue);
        }
        else if ( (id === "mminus" || id === "mplus") && memoryValue !== "" && (!isNaN(+historyChars[historyChars.length-1]))) {
          calculateMemory(id)
        }
      }

      else if (id ===".") {
        console.log("a legitimate place to use the period... If only there was the functionality programmed for it. Coffee plz.")
      }

      else if (id === "exp" && (!isNaN(+historyChars[historyChars.length-1])) && justUsedEqual !== true) {
        removeFromHistoryCharactersString(tempChars.length)
        replaceTemporaryCharacterString((Math.exp(tempChars.join(""))));
        addToDisplayHistoryString(Math.exp(tempChars.join("")));

        console.log("exponential")
      }
      
      else if (id === "rnd") {
        if (historyChars[historyChars.length-1] === "+" || historyChars[historyChars.length-1] === "-" || historyChars[historyChars.length-1] === "*" || historyChars[historyChars.length-1] === "/" )  {
          insertRandomNumber()
        }
      }

      else if (id === "round" && (!isNaN(+historyChars[historyChars.length-1])) ) {
        removeFromHistoryCharactersString(tempChars.length)
        addToDisplayHistoryString(Math.round(tempChars.join("")*1));
        replaceTemporaryCharacterString(Math.round(tempChars.join("")*1));

        console.log("rounddd")
      }

      console.log("content of tempChars:", tempChars, "content of historyChars: ", historyChars)
    }

    else console.log("didn't pass error czech")
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
      <div id="typed" class="typed">{historyChars}</div>
      <div id="msv" class="msv">{memoryValue}</div>
      <div id="===" class="result">Results here</div>
      <div id="exp" class="exp" onClick={handleChange}>EXP</div>
      <div id="rnd" class="rnd" onClick={handleChange}>RND</div>
      <div id="ac" class="ac" onClick={handleChange}>AC</div>
      <div id="mc" class="mc" onClick={handleChange}>MC</div>
      <div id="ms" class="ms" onClick={handleChange}>MS</div>
      <div id="mplus" class="mplus" onClick={handleChange}>M+</div>
      <div id="mminus" class="mminus" onClick={handleChange}>M-</div>
      <div id="mr" class="mr" onClick={handleChange} >MR</div>




    </div>


  );
}

export default CreateArea;
