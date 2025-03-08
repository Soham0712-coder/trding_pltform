/*===== LOGIN SHOW and HIDDEN =====*/
const signUp = document.getElementById('sign-up'),
    signIn = document.getElementById('sign-in'),
    loginIn = document.getElementById('login-in'),
    loginUp = document.getElementById('login-up')


signUp.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('block')
    loginUp.classList.remove('none')

    // Add classes
    loginIn.classList.toggle('none')
    loginUp.classList.toggle('block')
})

signIn.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('none')
    loginUp.classList.remove('block')

    // Add classes
    loginIn.classList.toggle('block')
    loginUp.classList.toggle('none')
})

// Login functionality
const loginForm = document.getElementById("login-in");
const loginButton = document.getElementById("login-form-submit");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username && password) {
        // Send login data to server for validation
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("You have successfully logged in.");
                // Store user info in session
                sessionStorage.setItem('currentUser', JSON.stringify({
                    username: username,
                    email: data.email
                }));
                window.location.href = "PT.html";
            } else {
                alert("Invalid username or password. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred during login. Please try again.");
        });
    } else {
       alert("Please enter your username and password.");
    }
})

// Signup functionality
const signupForm = document.getElementById("login-up");
const signupButton = document.getElementById("signup-form-submit");

signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = signupForm.username.value;
    const password = signupForm.password.value;
    const email = signupForm.email.value;
    const dematAccount = signupForm.demataccno.value;
    const transPassword = signupForm.trans_password.value;

    if (username && password && email && dematAccount && transPassword) {
        // Send signup data to server
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                dematAccount: dematAccount,
                transPassword: transPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("You have successfully signed up. Please login now.");
                // Switch to login form
                signIn.click();
            } else {
                alert(data.message || "Failed to sign up. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred during sign up. Please try again.");
        });
    } else {
       alert("Please fill in all required fields.");
    }
})





