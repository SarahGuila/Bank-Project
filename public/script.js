const mainElement = document.querySelector('main')

const navItems = document.querySelectorAll('.nav-item')

checkLoggedIn()

for (const item of navItems) {
    item.addEventListener('click', (e) => {
        navigationHandler(e.target.textContent)
    })
}

function navigationHandler(page) {
    switch (page) {
        case 'Login':
            generateLoginPage()
            break
        case 'Register':
            generateRegisterPage()
            break
        case 'Account':
            generateAccountPage()
            break
        case 'Actions':
            generateActionsPage()
            break
        case 'Logs':
            alert("Page in progress")
            break
        case 'Logout':
            logout()
            break
        default:
            alert("404 NOT FOUND")
            break
    }
}

function generateLoginPage() {
    mainElement.innerHTML = ''

    const form = document.createElement('form')
    const unInp = document.createElement('input')
    const pwInp = document.createElement('input')
    const sbmInp = document.createElement('input')
    const redirectP = document.createElement('p')
    const linkSpan = document.createElement('span')

    unInp.placeholder = "user name"
    unInp.className = "username"

    pwInp.type = "password"
    pwInp.placeholder = "password"
    pwInp.className = "password"

    sbmInp.type = "submit"
    sbmInp.value = "Login"

    redirectP.innerHTML = `<p>Don't have an account yet?</p>`
    linkSpan.addEventListener("click", generateRegisterPage)

    linkSpan.textContent = 'Register'

    form.addEventListener('submit', e => {
        e.preventDefault()
        login(unInp.value, pwInp.value)
    })

    redirectP.appendChild(linkSpan)

    form.appendChild(unInp)
    form.appendChild(pwInp)
    form.appendChild(sbmInp)
    form.appendChild(redirectP)

    mainElement.appendChild(form)
}

function generateRegisterPage() {
    mainElement.innerHTML = ''

    const form = document.createElement('form')
    const unInp = document.createElement('input')
    const pwInp = document.createElement('input')
    const sbmInp = document.createElement('input')
    const emInp = document.createElement('input')
    const redirectP = document.createElement('p')
    const linkSpan = document.createElement('span')

    unInp.placeholder = "user name"
    unInp.className = "username"

    pwInp.type = "password"
    pwInp.placeholder = "password"
    pwInp.className = "password"

    emInp.type = "email"
    emInp.placeholder = "email"
    emInp.className = "email"

    sbmInp.type = "submit"
    sbmInp.value = "Register"

    redirectP.innerHTML = `<p>Already have an account?</p>`

    linkSpan.textContent = 'Login'
    linkSpan.addEventListener("click", generateLoginPage)

    form.addEventListener('submit', e => {
        e.preventDefault()
        register(unInp.value, pwInp.value, emInp.value)
    })

    redirectP.appendChild(linkSpan)

    form.appendChild(unInp)
    form.appendChild(pwInp)
    form.appendChild(emInp)
    form.appendChild(sbmInp)
    form.appendChild(redirectP)

    mainElement.appendChild(form)
}

async function generateAccountPage() {

    try {
        const details = await getAccountDetails()
        console.log(details)
        mainElement.innerHTML = `   
            <h1>Account</h1>

            <h2>Your current balance: $${details.balance}</h2>

            <p>here will be the history rewritten</p>
        `
        for (const action of details.history) {

            let str = `<p class="${action.type == 'deposit' || action.from ? 'income' : 'expense'}">${action.type} $${action.amount} | ${new Date(action.date).toDateString('he/IL')}`

            if (action.type == 'transfer') {
                const username = action.from?.username || action.to?.username
                str += `| ${action.from ? "from:" : "To:"} ${username}`
            }

            mainElement.innerHTML += str + `</p>`
        }

    } catch (err) {

    }
}

async function checkLoggedIn() {
    try {
        const accounts = await getAllAccountNames()
        if (accounts.err) {
            // generate login page
            generateLoginPage()


        } else {
            // generate account page
            generateAccountPage()
        }
    } catch (err) {

    }
}

async function getAllAccountNames() {
    try {
        const accountNames = await fetch(`/api/data/accounts`)
        return await accountNames.json()
    } catch (err) {
        console.log(err)
    }
}

async function getAccountDetails() {
    try {
        const accountNames = await fetch(`/api/data/history`)
        return await accountNames.json()
    } catch (err) {
        console.log(err)
    }
}

async function login(username, password) {
    try {
        const res = await fetch(`/api/accounts/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        })
        const data = await res.json()

        if (data.err) {
            displayErrorMessege(data.err)
        } else {
            generateAccountPage()
            checkLoggedIn()
        }

    } catch (err) {
        console.log(err)
    }
}

async function logout() {
    try {
        const res = await fetch(`/api/accounts/logout`, {
            method: 'DELETE',
            credentials: 'include'
        })
        checkLoggedIn()

    } catch (err) {
        console.log(err)
    }
}

async function register(username, password, email) {
    try {
        const res = await fetch(`/api/accounts/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email}),
            credentials: 'include'
        })
        const data = await res.json()

        if (data.err) {
            displayErrorMessege(data.err)
        } else {
            generateLoginPage()
        }

    } catch (err) {
        console.log(err)
    }
}

function displayErrorMessege(msg) {
    const errMsg = document.querySelector('.errmsg')
    errMsg.style.display = "block"
    errMsg.textContent = msg
    setTimeout(() => {
        errMsg.textContent = ""
        errMsg.style.display = "none"
    }, 2000)
}

async function generateActionsPage() {
    mainElement.innerHTML = ''

    const select = document.createElement('select')
    const depositOpt = document.createElement('option')
    const withrawalOpt = document.createElement('option')
    const transferOpt = document.createElement('option')
    const btn = document.createElement('button')

    btn.textContent = "Save"

    depositOpt.textContent = "Deposit"
    depositOpt.value = "deposit"
    withrawalOpt.textContent = "Withrawal"
    withrawalOpt.value = "withrawal"
    transferOpt.textContent = "Transfer money"
    transferOpt.value = "transfer"

    select.appendChild(depositOpt)
    select.appendChild(withrawalOpt)
    select.appendChild(transferOpt)

    const amountInp = document.createElement('input')
    amountInp.type = 'number'
    amountInp.placeholder = 'amount'



    select.addEventListener('change', async (e) => {
        if (e.target.value == 'transfer') {
            const accList = await generateAccountsList()
            mainElement.appendChild(accList)
        } else {
            const elm = mainElement.querySelector('.accounts')
            if (elm) {
                mainElement.removeChild(elm)
            }
        }
    })

    btn.addEventListener("click", async () => {
        try {
            const res = await fetch(`/api/actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountInp.value, type: select.value, to: +mainElement.querySelector('.accounts')?.value }),
                credentials: 'include'
            })
            const data = await res.json()

            if (data.err) {
                displayErrorMessege(data.err)
            } else {
                generateAccountPage()
            }
        } catch (err) {

        }
    })

    mainElement.appendChild(select)
    mainElement.appendChild(amountInp)
    mainElement.appendChild(btn)
}


async function generateAccountsList() {
    try {
        const accounts = await getAllAccountNames()
        const toAccount = document.createElement('select')
        toAccount.className = 'accounts'
        for (const account of accounts) {
            const option = document.createElement('option')
            option.textContent = account.username
            option.value = account._id
            toAccount.appendChild(option)
        }
        return toAccount

    } catch (err) {

    }
}