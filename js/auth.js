function encodePassword(password) {
    return btoa(password);
}

function decodePassword(encodedPassword) {
    return atob(encodedPassword);
}

function checkCredentials() {
    var storedUsername = sessionStorage.getItem("username");
    var storedPassword = sessionStorage.getItem("password");

    if (!storedUsername || !storedPassword) {
        var username = prompt("Enter your username:");
        var encodedPassword = prompt("Enter your password:");
        var password = encodePassword(encodedPassword);
        console.log(password);
        if (username === "admin" && password === "YWRtaW4=") {
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", encodePassword(password));
        } else {
            alert("Invalid username or password.");
            window.location.href = "/";
        }
    } else {
        var decodedPassword = decodePassword(storedPassword);
        if (storedUsername === "admin" && decodedPassword === "YWRtaW4=") {
            // Credentials are correct, load the page
            window.onload = function () {
                document.body.style.display = "block";
            };
        } else {
            // Stored credentials are incorrect, clear sessionStorage and prompt for new credentials
            sessionStorage.clear();
            checkCredentials();
        }
    }
}

checkCredentials();