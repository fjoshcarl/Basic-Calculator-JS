const clear = document.getElementById("clear");
const percentage = document.getElementById("percentage");
const deleteButtons = document.querySelectorAll(".delete");
const dot = document.getElementById("dot");
const equal = document.getElementById("equal");
const numbers = document.querySelectorAll(".num");
const symbols = document.querySelectorAll(".symbol");
const equation = document.getElementById("equation");
const answer = document.getElementById("answer");
const history = document.getElementById("history");
const historyContainer = document.getElementById("history-container");
const historyButton = document.getElementById("history-button");
const clearHistoryButton = document.getElementById("history-clear");
const delSide = document.getElementById("delete-side");
const operatorArr = ['+', 'x', '÷', '-'];
let pointCount = 0;
let equationValue;
let historyAnswerList;
let historyEquations = JSON.parse(localStorage.getItem("historyEquations"));
let historyAnswers = JSON.parse(localStorage.getItem("historyAnswers"));

const displayInput = (input) => {
    if(equation.innerText == "0" || equation.innerText == "00") {
        equation.innerText = input; // removes 0 as the first digit when another number is inserted as input
    } else {
        equation.innerText += input;
        if(!operatorArr.includes(equation.innerText.slice(-1))) {
            solveEquation();
        }
    }
}

const solveEquation = () => {
    try {
        if (equation.innerText.includes("%") || equation.innerText.includes("x") || equation.innerText.includes("÷")) {
            if (isFinite(eval(solveSymbols()))) {
                answer.innerText = eval(solveSymbols());
            } else {
                answer.innerText = "Syntax error"; // when dividing by zero
            }
        }
        else {
            answer.innerText = eval(equation.innerText);
        }
    } catch (error) {
        answer.innerText = "Syntax error";
    }
}

const solveSymbols = () => {
    equationValue = equation.innerText;
    equationValue = equationValue.replaceAll("%", "/100");
    equationValue = equationValue.replaceAll("÷", "/");
    equationValue = equationValue.replaceAll("x", "*");
    return equationValue;
}

const historyAnswerEvent = (historyAnswer) => {

    historyAnswer.addEventListener('click', () =>{
        if (operatorArr.includes(equation.innerText.slice(-1))) {
            displayInput(historyAnswer.innerText);
        } else if (!isNaN(equation.innerText.slice(-1))) {
            equation.innerText = historyAnswer.innerText;
            answer.innerText = historyAnswer.innerText;
        }
    })

}

if (historyEquations && historyAnswers) {   //  check localstorage
    for (let i = (historyEquations.length)-1; i >= 0; i--) {
        historyContainer.innerHTML += `
            <div class="grid grid-cols-1 h-12 overflow-hidden whitespace-nowrap">
                <p class="flex justify-end">${historyEquations[i]}</p>
                <button class="history-answer flex justify-end text-slate-500 hover:text-lg transition transition-font-size duration-300 ease-in-out">${historyAnswers[i]}</button>
            </div>
        `;
    }
    historyAnswerList = Array.from(document.querySelectorAll(".history-answer")); // converted from nodelist to array
} else {
    historyEquations = [];
    historyAnswers = [];
    historyAnswerList = [];
}

clear.addEventListener("click", () => {
    equation.innerText = "0";
    answer.innerText = "0";
    pointCount = 0;
})

deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", () => {
        // prevents blank equation when it is zero
        if (equation.innerText != "0") {
            if (equation.innerText.slice(-1) == ".") {
                pointCount = 0;
            }
            equation.innerText = equation.innerText.slice(0, -1);
            if (!operatorArr.includes(equation.innerText.slice(-1))) {
                solveEquation();
            }
            if (equation.innerText.length == 0) {
                displayInput("0");
            }
        }
    })
})

dot.addEventListener("click", () => {
    if (pointCount == 0) {
        displayInput(".");
        pointCount = 1;
    }
})

equal.addEventListener("click", () => {
    if (answer.innerText != "Syntax error") {
        historyEquations.push(equation.innerText);
        historyAnswers.push(answer.innerText);

        equation.innerText = answer.innerText;

        localStorage.setItem("historyEquations", JSON.stringify(historyEquations));
        localStorage.setItem("historyAnswers", JSON.stringify(historyAnswers));

        // add new equation and answer into DOM
        const historyAnswerDiv = document.createElement("div");
        historyAnswerDiv.classList.add("grid", "grid-cols-1", "h-12", "overflow-hidden", "whitespace-nowrap");
        historyAnswerDiv.innerHTML = `
            <p class="flex justify-end">${historyEquations[(historyEquations.length)-1]}</p>
        `;
        const historyAnswerButton = document.createElement("button");
        historyAnswerButton.classList.add("history-answer", "flex", "justify-end", "text-slate-500", "hover:text-lg", "transition", "transition-font-size", "duration-300", "ease-in-out");
        historyAnswerButton.innerText = historyAnswers[(historyEquations.length)-1];
        historyAnswerDiv.append(historyAnswerButton);
        historyContainer.prepend(historyAnswerDiv);
        historyAnswerList.push(historyAnswerButton);
        historyAnswerEvent(historyAnswerButton);
    }
})

historyButton.addEventListener("click", () => {
    if (history.classList.contains("w-0")) {
        historyButton.classList.remove("text-slate-500");
        historyButton.classList.add("text-slate-700");
        history.classList.remove("w-0");
        history.classList.add("w-full");
        delSide.classList.remove("w-0");
        delSide.classList.add("w-auto");
        delSide.classList.remove("h-0");
        delSide.classList.add("h-auto");
    } else {
        historyButton.classList.remove("text-slate-700");
        historyButton.classList.add("text-slate-500");
        history.classList.remove("w-full");
        history.classList.add("w-0");
        delSide.classList.remove("w-auto");
        delSide.classList.add("w-0");
        delSide.classList.remove("h-auto");
        delSide.classList.add("h-0");
    }
})

clearHistoryButton.addEventListener("click", () => {
    localStorage.clear();
    historyAnswerList = [];
    historyContainer.innerHTML = "";
})

historyAnswerList.forEach(historyAnswer => {
    historyAnswerEvent(historyAnswer);
})

symbols.forEach(symbol => {
    symbol.addEventListener('click', () => {
        const lastdigit = equation.innerText.slice(-1);
        // if 1st character is minus operator
        if ((equation.innerText.length == 1 && equation.innerText == "0") && (symbol.innerText != "+" && symbol.innerText != "x" && symbol.innerText != "÷" && symbol.innerText != "%")) {
            console.log("test2");
            displayInput(symbol.innerText);     // only allows minus operator as 1st character
        } else if (equation.innerText.length >= 1 && equation.innerText != "0" && lastdigit != "-") {
            console.log("test3");
            if (lastdigit == ".") {
                // automatically inputs 0 when last digit is a point
                displayInput(`0${symbol.innerText}`);
            } else if (operatorArr.includes(lastdigit)) {    // consecutive operators case
                if ((lastdigit == 'x' || lastdigit == '÷') && symbol.innerText == '-') {
                    displayInput(symbol.innerText);
                } else if (equation.innerText.slice(-2, -1) == 'x' || (equation.innerText.slice(-2, -1) == '÷') && lastdigit == '-') {
                    equation.innerText = equation.innerText.slice(0, -2);
                    displayInput(symbol.innerText);
                } else {
                    equation.innerText = equation.innerText.slice(0, -1);
                    displayInput(symbol.innerText);
                }
            } else if (lastdigit == '%' && symbol.innerText == '%') {
                console.log("consecutive percentage symbols not allowed");
            } else {
                displayInput(symbol.innerText);
            }
        } else {
            if (lastdigit == "-") { // bug fix
                console.log("test1");
                equation.innerText = equation.innerText.slice(0, -1);
                displayInput(symbol.innerText);
            }
        }
        pointCount = 0;
        // TODO:   FIX MINUS OPERATOR DUPE BUG
        // equation.innerText.charAt(equation.innerText.length-2)
    });
})

numbers.forEach(number => {
    number.addEventListener('click', () => {
        // prevent input of num if last character is %
        if (equation.innerText.slice(-1) != "%") {
            displayInput(number.innerText);
        }
    });
})

