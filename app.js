
const routes ={
  '/login':{ templateId: 'login'},
  '/dashboard': {templateId: 'dashboard'},
};

function onLinkClick(event){
  event.preventDefault();
  navigate(event.target.href);
}

function updateRoute (){
  let path = window.location.pathname 
  let route = routes[path]

  if(!route) {
    return navigate("/login")
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


 window.onpopstate = () => updateRoute();
 updateRoute();
 


