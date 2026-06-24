//Check Login
function checkLogin() {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        window.location.href = "login.html";
    }
}


const protectedPages = [
    "complaint.html",
    "track.html",
    "userdashboard.html"
];

const currentPage =
    window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {

    checkLogin();
}

// Navigation
document.getElementById("loginUserBtn")?.addEventListener("click", () => {
    window.location.href = "login.html";
});

document.getElementById("registerUserBtn")?.addEventListener("click", () => {
    window.location.href = "register.html";
});

document.getElementById("registerComplaintBtn")?.addEventListener("click", () => {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {

        window.location.href = "complaint.html";

    } else {

        window.location.href = "login.html";
    }

});

document.getElementById("trackComplaintBtn")?.addEventListener("click", () => {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {

        window.location.href = "track.html";

    } else {

        window.location.href = "login.html";
    }

});

document.getElementById("aboutContact")?.addEventListener("click", () => {
    window.location.href = "contact.html";
});

document.getElementById("homeBtn")?.addEventListener("click", () => {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {

        window.location.href = "userdashboard.html";

    } else {

        window.location.href = "index.html";
    }

});

// User Dashboard
document.getElementById("logout")?.addEventListener("click", () => {

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";

});


let loggedInUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (loggedInUser) {

    document.getElementById("loginLink")
        ?.classList.add("hidden");

    document.getElementById("registerLink")
        ?.classList.add("hidden");

    document.getElementById("logoutLink")
        ?.classList.remove("hidden");
}


// Complaint Page 
const registerBtn =
    document.getElementById("registerBtn");

if (registerBtn) {

    registerBtn.addEventListener("click", function (e) {

        e.preventDefault();

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        let email =
            document.getElementById("email").value;

        let existingUser =
            users.find(user => user.email === email);

        if (existingUser) {

            alert("Email already registered");
            return;
        }

        let user = {

            name:
                document.getElementById("fullName").value,

            email:
                email,

            phone:
                document.getElementById("phone").value,

            password:
                document.getElementById("password").value

        };

        users.push(user);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Registration Successful");

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1000);

    });

}

//Login Page
const loginBtn =
    document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", function (e) {

        e.preventDefault();

        let email =
            document.getElementById("loginEmail").value;

        let password =
            document.getElementById("loginPassword").value;

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        let validUser =
            users.find(user =>
                user.email === email &&
                user.password === password
            );

        if (validUser) {

            localStorage.setItem(
                "currentUser",
                JSON.stringify(validUser)
            );

            window.location.href =
                "userdashboard.html";

        }

        else {

            alert("Invalid Credentials");

        }

    });

}

// Submit Complaint
const submitComplaintBtn =
    document.getElementById("submitComplaintBtn");

if (submitComplaintBtn) {

    submitComplaintBtn.addEventListener("click", function (e) {

        e.preventDefault();

        let complaints =
            JSON.parse(localStorage.getItem("complaints")) || [];

        let currentUser =
            JSON.parse(localStorage.getItem("currentUser"));

        let complaint = {

            complaintId:
                "CMP" + Date.now(),

            userName:
                currentUser.name,

            userEmail:
                currentUser.email,

            category:
                document.getElementById("category").value,

            subject:
                document.getElementById("subject").value,

            description:
                document.getElementById("description").value,

            date:
                new Date().toLocaleDateString(),

            status:
                "Pending"

        };

        complaints.push(complaint);

        localStorage.setItem(
            "complaints",
            JSON.stringify(complaints)
        );

        alert(
            "Complaint Submitted Successfully!\n\nComplaint ID: "
            + complaint.complaintId
        );

    });

}

// Track Complaint
const trackBtn =
    document.getElementById("trackBtn");

if (trackBtn) {

    trackBtn.addEventListener("click", function (e) {

        e.preventDefault();

        let complaintId =
            document.getElementById("trackComplaintId").value;

        let complaints =
            JSON.parse(localStorage.getItem("complaints")) || [];

        let complaint =
            complaints.find(c =>
                c.complaintId === complaintId
            );

        if (complaint) {

            document.getElementById("trackId").innerText =
                complaint.complaintId;

            document.getElementById("trackStatus").innerText =
                complaint.status;

            document.getElementById("trackCategory").innerText =
                complaint.category;

            document.getElementById("trackSubject").innerText =
                complaint.subject;

            document.getElementById("trackDepartment").innerText =
                "Support Department";

        }

        else {

            alert("Complaint Not Found");

        }

    });

}

// User Dashboard
if (currentPage === "userdashboard.html") {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    let complaints =
        JSON.parse(localStorage.getItem("complaints")) || [];

    let userComplaints =
        complaints.filter(c =>
            c.userEmail === currentUser.email
        );

    let pending =
        userComplaints.filter(c =>
            c.status === "Pending"
        );

    let resolved =
        userComplaints.filter(c =>
            c.status === "Resolved"
        );

    let userName =
        document.getElementById("userName");

    if (userName) {
        userName.innerText = currentUser.name;
    }

    let userEmail =
        document.getElementById("userEmail");

    if (userEmail) {
        userEmail.innerText = currentUser.email;
    }

    let totalComplaints =
        document.getElementById("totalComplaints");

    if (totalComplaints) {
        totalComplaints.innerText = userComplaints.length;
    }

    let pendingComplaints =
        document.getElementById("pendingComplaints");

    if (pendingComplaints) {
        pendingComplaints.innerText = pending.length;
    }

    let resolvedComplaints =
        document.getElementById("resolvedComplaints");

    if (resolvedComplaints) {
        resolvedComplaints.innerText = resolved.length;
    }


    let tableBody =
        document.getElementById("complaintsTableBody");

    if (tableBody) {

        tableBody.innerHTML = "";

        if (userComplaints.length === 0) {

            tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="no-data">
                    No Complaints Found
                </td>
            </tr>
        `;
        }

        else {

            userComplaints.forEach(complaint => {

                tableBody.innerHTML += `
                <tr>
                    <td>${complaint.complaintId}</td>
                    <td>${complaint.category}</td>
                    <td>${complaint.status}</td>
                    <td>${complaint.date}</td>
                </tr>
            `;
            });

        }

    }
}


// Complaint Page
if (currentPage === "complaint.html") {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    document.getElementById("complaintName").value =
        currentUser.name;

    document.getElementById("complaintEmail").value =
        currentUser.email;

    document.getElementById("complaintPhone").value =
        currentUser.phone;
}


// Admin Dashboard
if (currentPage === "admindashboard.html") {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    let complaints =
        JSON.parse(localStorage.getItem("complaints")) || [];

    let pending =
        complaints.filter(c =>
            c.status === "Pending"
        );

    let resolved =
        complaints.filter(c =>
            c.status === "Resolved"
        );

    let totalUsers =
        document.getElementById("totalUsers");

    if (totalUsers) {
        totalUsers.innerText = users.length;
    }

    let totalComplaints =
        document.getElementById("totalComplaints");

    if (totalComplaints) {
        totalComplaints.innerText =
            complaints.length;
    }

    let pendingComplaints =
        document.getElementById("pendingComplaints");

    if (pendingComplaints) {
        pendingComplaints.innerText =
            pending.length;
    }

    let resolvedComplaints =
        document.getElementById("resolvedComplaints");

    if (resolvedComplaints) {
        resolvedComplaints.innerText =
            resolved.length;
    }
}

// Home Button (for all pages)
document.querySelectorAll(".homeBtn")
    .forEach(btn => {

        btn.addEventListener("click", (e) => {

            e.preventDefault();

            let currentUser =
                JSON.parse(localStorage.getItem("currentUser"));

            if (currentUser) {

                window.location.href =
                    "userdashboard.html";

            }

            else {

                window.location.href =
                    "index.html";

            }

        });

    });