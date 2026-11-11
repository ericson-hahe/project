
// CampusConnect - Frontend Student Portal

// Account information is stored in JavaScript memory
// for the current page session only.

const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

let registeredStudent = null;
let activeStudent = null;

// Shortcut for selecting HTML elements
const $ = (id) => document.getElementById(id);


// DISPLAY VALIDATION MESSAGES

function showMessage(element, message = "", type = "") {
  element.textContent = message;
  element.className = `form-message ${type}`;
}


// CLEAR INVALID INPUT STYLES

function clearInvalid(form) {
  form.querySelectorAll("input").forEach(input => {
    input.classList.remove("invalid");
  });
}


// HIGHLIGHT INVALID INPUT

function markInvalid(input) {
  input.classList.add("invalid");
  input.focus();
}


// SWITCH TO LOGIN PAGE

function showLogin() {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");

  $("formEyebrow").textContent = "WELCOME BACK";
  $("formTitle").textContent = "Sign in to your account";
  $("formSubtitle").textContent =
    "Enter your student details to continue.";

  showMessage($("loginMessage"));
  clearInvalid(loginForm);
}


// SWITCH TO REGISTRATION PAGE

function showRegister() {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");

  $("formEyebrow").textContent = "JOIN THE PORTAL";
  $("formTitle").textContent = "Create your account";
  $("formSubtitle").textContent =
    "Register your student information below.";

  showMessage($("registerMessage"));
  clearInvalid(registerForm);
}


// LOGIN AND REGISTER NAVIGATION

$("showRegister").addEventListener("click", showRegister);
$("showLogin").addEventListener("click", showLogin);


// SHOW AND HIDE PASSWORD

document.querySelectorAll("[data-toggle]").forEach(button => {

  button.addEventListener("click", () => {

    const field = $(button.dataset.toggle);

    const showing = field.type === "text";

    field.type = showing ? "password" : "text";

    button.textContent = showing ? "Show" : "Hide";

    button.setAttribute(
      "aria-label",
      showing ? "Show password" : "Hide password"
    );

  });

});


// EMAIL VALIDATION

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// PASSWORD VALIDATION

function validPassword(password) {

  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

}


// REGISTRATION FORM

registerForm.addEventListener("submit", (event) => {

  event.preventDefault();

  clearInvalid(registerForm);

  const name = $("fullName").value.trim();

  const studentNumber =
    $("studentNumber").value.trim();

  const email =
    $("registerEmail").value.trim().toLowerCase();

  const password =
    $("registerPassword").value;

  const confirmPassword =
    $("confirmPassword").value;

  const message = $("registerMessage");


  // VALIDATE FULL NAME

  if (!name) {

    markInvalid($("fullName"));

    showMessage(
      message,
      "Please enter your full name.",
      "error"
    );

    return;
  }


  // VALIDATE STUDENT NUMBER

  if (!/^\d{4}-\d{4}$/.test(studentNumber)) {

    markInvalid($("studentNumber"));

    showMessage(
      message,
      "Use the student number format YYYY-0000, such as 2026-0001.",
      "error"
    );

    return;
  }


  // VALIDATE EMAIL

  if (!validEmail(email)) {

    markInvalid($("registerEmail"));

    showMessage(
      message,
      "Please enter a valid email address.",
      "error"
    );

    return;
  }


  // VALIDATE PASSWORD

  if (!validPassword(password)) {

    markInvalid($("registerPassword"));

    showMessage(
      message,
      "Password must be 8+ characters and include uppercase, lowercase, a number, and a special character.",
      "error"
    );

    return;
  }


  // CONFIRM PASSWORD

  if (password !== confirmPassword) {

    markInvalid($("confirmPassword"));

    showMessage(
      message,
      "The passwords do not match. Please try again.",
      "error"
    );

    return;
  }


  // SAVE STUDENT INFORMATION IN MEMORY

  registeredStudent = {
    name,
    studentNumber,
    email,
    password
  };


  // RESET REGISTRATION FORM

  registerForm.reset();


  // RETURN TO LOGIN PAGE

  showLogin();

  $("loginEmail").value = email;

  showMessage(
    $("loginMessage"),
    "Registration successful. You can now sign in.",
    "success"
  );

});


// LOGIN FORM

loginForm.addEventListener("submit", (event) => {

  event.preventDefault();

  clearInvalid(loginForm);

  const email =
    $("loginEmail").value.trim().toLowerCase();

  const password =
    $("loginPassword").value;

  const message = $("loginMessage");


  // CHECK EMAIL

  if (!validEmail(email)) {

    markInvalid($("loginEmail"));

    showMessage(
      message,
      "Enter a valid email address.",
      "error"
    );

    return;
  }


  // CHECK PASSWORD

  if (!password) {

    markInvalid($("loginPassword"));

    showMessage(
      message,
      "Please enter your password.",
      "error"
    );

    return;
  }


  // CHECK IF ACCOUNT EXISTS

  if (!registeredStudent) {

    showMessage(
      message,
      "No account is registered in this session. Please create an account first.",
      "error"
    );

    return;
  }


  // VERIFY LOGIN INFORMATION

  if (
    email !== registeredStudent.email ||
    password !== registeredStudent.password
  ) {

    showMessage(
      message,
      "The email or password is incorrect. Please check your details.",
      "error"
    );

    return;
  }


  // LOGIN SUCCESSFUL

  activeStudent = registeredStudent;

  loginForm.reset();

  renderDashboard();

});


// GET STUDENT INITIALS

function initials(name) {

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join("");

}


// DISPLAY STUDENT DASHBOARD

function renderDashboard() {

  $("headerName").textContent =
    activeStudent.name;

  $("avatarInitials").textContent =
    initials(activeStudent.name);

  $("welcomeName").textContent =
    `Welcome, ${activeStudent.name.split(" ")[0]}!`;

  $("studentName").textContent =
    activeStudent.name;

  $("studentId").textContent =
    activeStudent.studentNumber;

  $("studentEmail").textContent =
    activeStudent.email;

  $("loginTime").textContent =
    new Date().toLocaleString();

  $("year").textContent =
    new Date().getFullYear();


  // HIDE AUTHENTICATION PAGE

  authView.classList.add("hidden");


  // SHOW DASHBOARD

  dashboardView.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// LOGOUT FUNCTION

function logout() {

  activeStudent = null;

  dashboardView.classList.add("hidden");

  authView.classList.remove("hidden");

  showLogin();

  showMessage(
    $("loginMessage"),
    "You have been logged out successfully.",
    "success"
  );

}


// LOGOUT BUTTON EVENT

$("logoutButton").addEventListener(
  "click",
  logout
);


// MY PROFILE NAVIGATION

$("profileNav").addEventListener("click", () => {

  $("profileDetails").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

});


// AUTOMATIC COPYRIGHT YEAR

$("year").textContent =
  new Date().getFullYear();
