/*Selecionando elementos do DOM*/
const ownerInput = document.querySelector("#owner-name")
const numberInput = document.querySelector("#card-number")
const monthInput = document.querySelector("#exp-month")
const yearInput = document.querySelector("#exp-year")
const cvcInput = document.querySelector("#cvc-code")
const mainForm = document.querySelector(".before-send")
const formSent = document.querySelector(".form-sent")

/*Criando manipuladores de eventos*/
const cardsEvents = cardEventsHandler()
const formEventHandler = formHandler()

/*Atribuindo event listeners aos elementos*/
ownerInput.addEventListener("input", cardsEvents.changeOwnerName)
numberInput.addEventListener("input", cardsEvents.changeCardNumber)
monthInput.addEventListener("input", cardsEvents.changeExpMonth)
yearInput.addEventListener("input", cardsEvents.changeExpMonth)
cvcInput.addEventListener("input", cardsEvents.changeCvcCode)
mainForm.addEventListener("submit", (event) => {
    formEventHandler.main(event)
})
formSent.addEventListener("submit", (event) => {
    event.preventDefault()
    formEventHandler.isFlagTrue() ? mainForm.submit() : null
})

/*Função: manipulando eventos do formulário*/
function formHandler() {
    let flag = false
    //Removendo todos os erros do formulário (reset do formulário)
    function clearErrors() {
        for (let error of document.querySelectorAll(".input-error")) {
            error.remove()
        }
        for (let input of document.querySelectorAll("input")) {
            input.classList.remove("invalid-input")
        }
    }
    //Criando span de error em caso de entradas invalidas no formulário
    function createError(message) {
        const error = document.createElement("span")
        error.setAttribute("class", "input-error")
        error.innerHTML = message
        return error
    }
    //Validando entradas vazias em todos os campos do formulário
    function validateEmptyInputs() {
        const expDate = document.querySelector(".exp-date-form")
        const fields = document.querySelectorAll(".field")
        for (let field of fields) {
            const input = field.querySelector("input")
            if (input.value === "") {
                field.appendChild(createError("can't be blank."))
                input.classList.add("invalid-input")
                flag = false
            }
        }
        if (yearInput.value === "" || monthInput.value === "") {
            expDate.appendChild(createError("can't be blank."))
            yearInput.value === "" ? yearInput.classList.add("invalid-input") : null
            monthInput.value === "" ? monthInput.classList.add("invalid-input") : null
            flag = false
        }
    }
    //Validando o campo de ownername em caso de entrada invalida
    function validateOwnerName() {
        if (ownerInput.value.length < 6) {
            ownerInput.parentElement.appendChild(createError("must have at least 6 characters."))
            flag = false
            ownerInput.classList.add("invalid-input")
        }
    }
    //Validando o campo de vencimento do cartão em caso de entrada inválida
    function validateCardNumber() {
        if (numberInput.value.length < 19) {
            numberInput.parentElement.appendChild(createError("must have 16 characters."))
            flag = false
            numberInput.classList.add("invalid-input")
        }
    }
    return {
        main(event) {
            flag = true
            event.preventDefault()
            clearErrors()
            validateOwnerName()
            validateCardNumber()
            validateEmptyInputs()
            if (flag === true) {
                mainForm.classList.add("hide")
                formSent.classList.add("show")
            }
        },
        isFlagTrue() {
            return flag
        }
    }
}
/*Função: adicionando dados aos cartões interativos*/
function cardEventsHandler() {
    const cardNumber = document.querySelector(".card-number")
    const ownerName = document.querySelector(".owner-name")
    const expiringDate = document.querySelector(".exp-date-card")
    const cvcCode = document.querySelector(".card-code")
    return {
        changeOwnerName() {
            try {
                ownerInput.value = ownerInput.value
                    .toUpperCase()
                    .match(/[a-zA-Z\s]/g)
                    .join("")
            } catch (error) {
                ownerInput.value = ""
            }
            ownerName.innerHTML = ownerInput.value.toUpperCase()
        },
        changeCardNumber() {
            numberInput.value = numberInput.value.replace(/\D+/g, "")
            numberInput.value = numberInput.value.replace(/([0-9]{4})/g, "$1 ").trimEnd()
            cardNumber.innerHTML = numberInput.value
        },
        changeExpMonth() {
            monthInput.value = monthInput.value.replace(/\D+/g, "").slice(0, 2)
            if (Number(monthInput.value) > 12) monthInput.value = 12
            yearInput.value = yearInput.value.replace(/\D+/g, "").slice(0, 2)
            const month = `0${monthInput.value}`.slice(-2)
            const year = `0${yearInput.value}`.slice(-2)
            expiringDate.innerHTML = `${month}/${year}`
        },
        changeCvcCode() {
            cvcInput.value = cvcInput.value.slice(0, 3).replace(/\D+/g, "")
            cvcCode.innerHTML = `000${cvcInput.value}`.slice(-3)
        }
    }
}
