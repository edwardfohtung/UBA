
const routes ={
  '/login':{ templateId: 'login'},
  '/dashboard': {templateId: 'dashboard',init: updateDashboard},
};

let state = Object.freeze ({
  account: null
});

function onLinkClick(event){
  event.preventDefault();
  navigate(event.target.href);
}

function updateRoute (){
  let path = window.location.pathname 
  let route = routes[path]
  
  if (!route) {
    return navigate('/login');
  }


  const template = document.getElementById(route.templateId);
  const view = template.content.cloneNode(true);
  const app = document.getElementById('app');
  app.innerHTML ='';
  app.appendChild(view);
}
function navigate(path) {
   window.history.pushState({}, path, path);
   updateRoute();

 }

async function register() {
  const registerForm = document.getElementById("registerForm")
  const formData = new FormData(registerForm)
  const data = Object.fromEntries(formData)
  const jsonData = JSON.stringify(data)

  const result = await createAccount(jsonData);

  if (result.error) {
    return console.log('An error occurred:', result.error);
  }

  console.log('Account created!', result);

  updateState('account', result);
  navigate('/dashboard');

}

//POST /api/accounts/

async function createAccount(account) {
  try {
    const response = await fetch("//localhost:5000/api/accounts", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: account
    })

    return await response.json();
  } catch(error) {
    return { error: error.message || 'Unknown error' };
  }
}

async function login() {
  const loginForm = document.getElementById('loginForm')
  const user = loginForm.user.value;
  const data = await getAccount(user);

  if (data.error) {
    return console.log('loginError', data.error);
  }

  console.log(data, "user")
  updateState ('account', data);
  navigate('/dashboard');
  updateDashboard();
}

async function getAccount(user) {
  try {
    const response = await fetch('//localhost:5000/api/accounts/' + encodeURIComponent(user));
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}
function updateElement(id, textorNode) {
  const element = document.getElementById(id);
  element.textContent = '';
  element.append(textorNode);
  data = state.account;

  if (data.error) {
    return updateElement('loginError', data.error);
  }
  
}


function updateDashboard() {
  // const dashboard = document.getElementById("dashboard")
  const transactionsRows = document.createDocumentFragment();
  const account = state.account;
  for (const transaction of account.transactions) {
    const transactionRow = createTransactionRow(transaction);
    transactionsRows.appendChild(transactionRow);
  }
  updateElement('transactions', transactionsRows);
  
  const balance = document.getElementById("currency")
  const description = document.getElementById("description")

  balance.textContent = account.currency + account.balance 
  description.textContent = account.description
}

function createTransactionRow(transaction) {
  const template = document.getElementById('transaction');
  const transactionRow = template.content.cloneNode(true);
  const tr = transactionRow.querySelector('tr');
  tr.children[0].textContent = transaction.date;
  tr.children[1].textContent = transaction.object;
  tr.children[2].textContent = transaction.amount.toFixed(2);
  return transactionRow;
};

function updateState(property, newData) {
  state = Object.freeze({
    ...state,
    [property]: newData
  });
}
function logout() {
  updateState('account', null);
  navigate('/login');
}





 window.onpopstate = () => updateRoute();
 updateRoute();
 


