const clear = document.getElementById("clear");
const percentage = document.getElementById("percentage");
const del = document.getElementById("delete");
const dot = document.getElementById("dot");
const equal = document.getElementById("equal");


const numbers = document.querySelectorAll(".num");
const symbols = document.querySelectorAll(".symbol");

const equation = document.getElementById("equation");
const answer = document.getElementById("answer");
const operatorarr = ['+', 'x', '÷', '-'];
let pointcount = 0;
let equationValue;




const displayInput = (input) => {
    if(equation.innerText == "0" || equation.innerText == "00") {
        equation.innerText = input; // removes 0 as the first digit when another number is inserted as input
    } else {
        equation.innerText += input;
    }
}

const solveEquation = () => {
    try {
        if (equation.innerText.includes("%") || equation.innerText.includes("x") || equation.innerText.includes("÷")) {
            answer.innerText = eval(solveSymbols());
        }
        else {
            answer.innerText = eval(equation.innerText);
        }
    } catch (error) {
        answer.innerText = "Syntax error";
    }
}

const solveSymbols = () => {
    if (equation.innerText.includes("%")) {
        equationValue = equation.innerText.replaceAll("%", "/100");
    }
    if (equation.innerText.includes("x")) {
        equationValue = equation.innerText.replaceAll("x", "*");
    }
    if (equation.innerText.includes("÷")) {
        equationValue = equation.innerText.replaceAll("÷", "/");
    }
    return equationValue;
}

clear.addEventListener("click", () => {
    equation.innerText = "0";
    answer.innerText = "0";
    pointcount = 0;
})

del.addEventListener("click", () => {
    if(equation.innerText != "0"){ // prevents blank equation when it is zero
        if(equation.innerText.slice(-1) == "."){
            pointcount = 0;
        }
        equation.innerText = equation.innerText.slice(0, -1);
        solveEquation();

        if(equation.innerText.length == 0){
            displayInput("0");
        }
    }
})

dot.addEventListener("click", () => {
    if(pointcount == 0) {
        displayInput(".");
        pointcount = 1;
    }
})

equal.addEventListener("click", () => {
    equation.innerText = answer.innerText;
})

symbols.forEach(symbol => {
    symbol.addEventListener('click', () => {
        const lastdigit = equation.innerText.slice(-1);
        if (lastdigit == ".") {    // automatically inputs 0 when last digit is a point
            displayInput(`0${symbol.innerText}`);
        } else if (operatorarr.includes(lastdigit)) {    // consecutive operators case
            if ((lastdigit == 'x' || lastdigit == '÷') && symbol.innerText == '-') {
                displayInput(symbol.innerText);
            } else if (equation.innerText.slice(-2, -1) == 'x' || (equation.innerText.slice(-2, -1) == '÷') && lastdigit == '-') {
                equation.innerText = equation.innerText.slice(0, -2);
                displayInput(symbol.innerText);
            } else {
                equation.innerText = equation.innerText.slice(0, -1);
                displayInput(symbol.innerText);
            }
        } else { // normal
            displayInput(symbol.innerText);
        }
        pointcount = 0;
    });
})

numbers.forEach(number => {
    number.addEventListener('click', () => {
        displayInput(number.innerText);
        solveEquation();
    });
})
