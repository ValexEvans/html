document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById('root');
    let isRegistering = false;

    const handleLogin = () => {
        // Placeholder for login logic
        console.log("Logging in...");
    };

    const handleRegister = () => {
        // Placeholder for registration logic
        console.log("Registering...");
    };

    const toggleRegister = () => {
        isRegistering = !isRegistering;
        renderPage();
    };

    const renderPage = () => {
        const containerContent = isRegistering ? getRegisterContainer() : getLoginContainer();
        root.innerHTML = containerContent;

        // Add event listeners after rendering the page
        if (isRegistering) {
            document.getElementById('registerButton').addEventListener('click', handleRegister);
            document.getElementById('loginLink').addEventListener('click', toggleRegister);
        } else {
            document.getElementById('loginButton').addEventListener('click', handleLogin);
            document.getElementById('registerLink').addEventListener('click', toggleRegister);
        }
    };

    const getLoginContainer = () => {
        return `
        <div class="container">
          <div class="login-container">
            <h1 class="title">Turntable</h1>
            <div class="form-group">
              <input class="input" type="text" placeholder="Email">
              <input class="input" type="password" placeholder="Password">
              <button id="loginButton" class="button">Login</button>
              <p class="toggleText">Don't have an account yet? <a id="registerLink" href="#">Register</a></p>
            </div>
          </div>
        </div>
      `;
    };

    const getRegisterContainer = () => {
        return `
        <div class="container">
          <div class="login-container">
            <h1 class="title">Turntable</h1>
            <div class="form-group">
              <input class="input" type="text" placeholder="First Name">
              <input class="input" type="text" placeholder="Last Name">
              <input class="input" type="text" placeholder="Username">
              <input class="input" type="text" placeholder="Email">
              <input class="input" type="password" placeholder="Password">
              <button id="registerButton" class="button">Register</button>
              <p class="toggleText">Already have an account? <a id="loginLink" href="#">Login</a></p>
            </div>
          </div>
        </div>
      `;
    };

    renderPage();
});
