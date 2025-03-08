/*===== LOGIN SHOW and HIDDEN =====*/
const signUp = document.getElementById("sign-up"),
  signIn = document.getElementById("sign-in"),
  loginIn = document.getElementById("login-in"),
  loginUp = document.getElementById("login-up");

signUp.addEventListener("click", () => {
  loginIn.classList.remove("block");
  loginUp.classList.remove("none");

  loginIn.classList.toggle("none");
  loginUp.classList.toggle("block");
});

signIn.addEventListener("click", () => {
  loginIn.classList.remove("none");
  loginUp.classList.remove("block");

  loginIn.classList.toggle("block");
  loginUp.classList.toggle("none");
});

// Login functionality
const loginForm = document.getElementById("login-in");
const loginButton = document.getElementById("login-form-submit");

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  
  const username = document.querySelector("#login-in #username").value;
  const password = document.querySelector("#login-in #password").value;

  if (username && password) {
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful!");
          sessionStorage.setItem("currentUser", JSON.stringify({ username: data.username, email: data.email }));
          window.location.href = "PT.html";
        } else {
          alert(data.message || "Invalid username or password.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during login. Please try again.");
      });
  } else {
    alert("Please enter your username and password.");
  }
});

// Signup functionality
const signupForm = document.getElementById("login-up");
const signupButton = document.getElementById("signup-form-submit");

signupButton.addEventListener("click", (e) => {
  e.preventDefault();

  const username = document.querySelector("#login-up #username").value;
  const email = document.querySelector("#login-up #email").value;
  const password = document.querySelector("#login-up #password").value;
  const dematAccount = document.querySelector("#login-up #demataccno").value;
  const transPassword = document.querySelector("#login-up #trans_password").value;

  if (username && email && password && dematAccount && transPassword) {
    fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, dematAccount, transPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Signup successful! Please login.");
          signIn.click();
        } else {
          alert(data.message || "Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during signup. Please try again.");
      });
  } else {
    alert("Please fill in all required fields.");
  }
});




