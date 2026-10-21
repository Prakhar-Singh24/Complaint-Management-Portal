// Authentication
function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

const currentPage =
    window.location.pathname.split("/").pop();

function protectPage() {

    const protectedPages = [
        "complaint.html",
        "userdashboard.html",
        "usercomplaintdetails.html",
        "editcomplaint.html"
    ];


    if (
        protectedPages.includes(currentPage)
        &&
        !isLoggedIn()
    ) {

        window.location.href = "login.html";

    }

}

protectPage();


let complaints = [];
let users = [];


// Admin Pages Protected by Login
const adminProtectedPages = [
    "admindashboard.html",
    "complaintdetails.html",
    "userdetails.html",
    "reports.html"
];

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (
    adminProtectedPages.includes(currentPage)
) {

    if (
        !currentUser ||
        currentUser.role !== "admin"
    ) {

        window.location.href =
            "login.html";

    }

}

const adminLoginBtn =
    document.getElementById(
        "adminLoginBtn"
    );

if (adminLoginBtn) {

    adminLoginBtn.addEventListener("click", async function (e) {

        e.preventDefault();

        let email =
            document.getElementById(
                "adminEmail"
            ).value.trim();

        let password =
            document.getElementById(
                "adminPassword"
            ).value;

        adminLoginEmail.innerText = "";
        adminLoginPassword.innerText = "";

        if (email === "" && password === "") {

            adminLoginEmail.innerText =
                "Email is required *";

            adminLoginPassword.innerText =
                "Password required *";

            return;
        }

        if (email === "") {

            adminLoginEmail.innerText =
                "Email is required *";

            return;
        }

        let loginEmailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!loginEmailPattern.test(email)) {

            adminLoginEmail.innerText =
                "Enter a valid email address *";

            return;
        }


        if (password === "") {

            adminLoginPassword.innerText =
                "Password required *";

            return;
        }

        try {

            const response = await fetch(
                "https://complaint-management-portal-m8jc.onrender.com/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })

                }
            );

            const data = await response.json();

            if (data.success) {

                if (data.user.role !== "admin") {

                    adminLoginEmail.innerText =
                        "Access Denied! You are not an admin.";

                    return;

                }

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(data.user)
                );

                adminLoginBtn.disabled = true;

                adminLoginBtn.innerText =
                    "Logging in...";

                setTimeout(() => {

                    window.location.href =
                        "admindashboard.html";

                }, 1000);

            }

            else {

                if (data.field === "email") {

                    adminLoginEmail.innerText =
                        data.message;

                }

                else {

                    adminLoginPassword.innerText =
                        data.message;

                }

            }

        }

        catch (error) {

            console.log(error);

            alert("Server Error");

        }
    }

    );

}


// Logout function
function logout(redirectPage = "index.html") {

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    window.location.href = redirectPage;

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


// Dashboard Button Control for User Pages (User)
const pages = [
    "complaint.html",
    "userdashboard.html",
    "usercomplaintdetails.html",
    "editcomplaint.html"
]

if (pages.includes(currentPage)) {

    document.getElementById("dashboard").onclick = function () {

        window.location.href = "userdashboard.html";

    }
}


// Dashboard Button Control for Admin Pages (Admin)
const adminpages = [
    "admindashboard.html",
    "complaintdetails.html",
    "userdetails.html",
    "reports.html"
]

if (adminpages.includes(currentPage)) {

    document.getElementById("dashboard").onclick = function () {

        window.location.href = "admindashboard.html";

    }
}


// User Dashboard
document.getElementById("logout")?.addEventListener("click", () => {

    logout();

});

function handleAuthError(message) {

    if (
        message === "User no longer exists" ||
        message === "Invalid Token" ||
        message === "Token Missing"
    ) {

        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");

        alert("Your session has expired. Please register and login again.");

        window.location.href = "login.html";

        return true;

    }

    return false;

}


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

// Delete Button
document.addEventListener("click", async function (e) {

    if (!e.target.classList.contains("delete-btn")) {
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const token =
            localStorage.getItem("token");

        const complaintId =
            e.target.dataset.id;

        const response = await fetch(

            `https://complaint-management-portal-m8jc.onrender.com/api/complaints/${complaintId}`,

            {

                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }

            }

        );

        const data =
            await response.json();

        if (data.success) {

            alert(
                "Complaint Deleted Successfully"
            );

            loadDashboard();

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

});

// Edit Button
document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("edit-btn")) {
        return;
    }

    const complaintId =
        e.target.dataset.id;

    window.location.href =
        `editcomplaint.html?id=${complaintId}`;

});


// Edit Complain Page
if (currentPage === "editcomplaint.html") {

    loadComplaintForEdit();

}

async function loadComplaintForEdit() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const complaintId =
            params.get("id");

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(

                `https://complaint-management-portal-m8jc.onrender.com/api/complaints/${complaintId}`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        if (!data.success) {

            if (handleAuthError(data.message)) {
                return;
            }

            alert(data.message);

            return;

        }

        const complaint =
            data.complaint;

        document.getElementById("subject").value =
            complaint.title;

        document.getElementById("category").value =
            complaint.category;

        document.getElementById("description").value =
            complaint.description;

        const currentUser =
            JSON.parse(
                localStorage.getItem("currentUser")
            );

        document.getElementById("complaintName").value =
            currentUser.name;

        document.getElementById("complaintEmail").value =
            currentUser.email;

        document.getElementById("complaintPhone").value =
            currentUser.phone;

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

const updateComplaintBtn =
    document.getElementById("updateComplaintBtn");

if (updateComplaintBtn) {

    updateComplaintBtn.addEventListener(
        "click",
        async function (e) {

            e.preventDefault();

            try {

                const params =
                    new URLSearchParams(
                        window.location.search
                    );

                const complaintId =
                    params.get("id");

                const token =
                    localStorage.getItem("token");

                const title =
                    document.getElementById("subject")
                        .value.trim();

                const category =
                    document.getElementById("category")
                        .value;

                const description =
                    document.getElementById("description")
                        .value.trim();

                const response =
                    await fetch(

                        `https://complaint-management-portal-m8jc.onrender.com/api/complaints/${complaintId}`,

                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body: JSON.stringify({

                                title,

                                category,

                                description

                            })

                        }

                    );

                const data =
                    await response.json();

                if (data.success) {

                    updateComplaintBtn.disabled = true;

                    updateComplaintBtn.innerText =
                        "Updating Complaint...";

                    setTimeout(() => {

                        updateComplaintBtn.innerText =
                            "Complaint Updated";

                        alert(
                            "Complaint Updated Sucessfully"
                        )

                    }, 2000);

                    setTimeout(() => {

                        window.location.href =
                            "userdashboard.html";

                    }, 2500);

                }

                else {

                    if (handleAuthError(data.message)) {
                        return;
                    }

                    alert(data.message);

                }

            }

            catch (error) {

                console.log(error);

                alert("Server Error");

            }

        }

    );

}


// Registration Page (Register User) 
const registerBtn =
    document.getElementById("registerBtn");

if (registerBtn) {

    registerBtn.addEventListener("click", async function (e) {

        e.preventDefault();

        let fullName =
            document.getElementById("fullName")
                .value.trim();

        if (fullName === "") {

            document.getElementById("registerFullName").innerText =
                "Require full name *"

            return;

        } else {

            document.getElementById("registerFullName").innerText =
                ""

        }

        let email =
            document.getElementById("email")
                .value.trim();

        if (email === "") {

            document.getElementById("registerEmail").innerText =
                "Email is required *"

            return;

        }

        let emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            document.getElementById("registerEmail").innerText =
                "Enter a valid email address *"

            return;

        }

        if (email !== "" && emailPattern.test(email)) {

            document.getElementById("registerEmail").innerText =
                ""
        }

        let phone =
            document.getElementById("phone")
                .value.trim();

        let phonePattern =
            /^[0-9]{10}$/;

        if (!phonePattern.test(phone)) {

            document.getElementById("registerPhone").innerText =
                "Phone number must contain exactly 10 digits *"

            return;

        } else {

            document.getElementById("registerPhone").innerText =
                ""

        }


        let password =
            document.getElementById("password").value;

        if (password.length < 8) {

            document.getElementById("registerPassword").innerText =
                "Password must be at least 8 characters long *"

            return;

        } else {

            document.getElementById("registerPassword").innerText =
                ""

        }

        let confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            document.getElementById("registerConfirmPassword").innerText =
                "Password not matched *"

            return;

        } else {

            document.getElementById("registerConfirmPassword").innerText =
                ""

        }

        try {

            const response = await fetch(
                "https://complaint-management-portal-m8jc.onrender.com/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: fullName,

                        email: email,

                        phone: phone,

                        password: password

                    })

                }
            );

            const data = await response.json();

            if (data.success) {

                registerBtn.disabled = true;

                document.getElementById("registerBtn").innerText =
                    "Creating Account......";

                setTimeout(() => {
                    document.getElementById("registerBtn").innerText =
                        "Registration Successful";
                }, 1000);

                setTimeout(() => {
                    document.getElementById("registerBtn").innerText =
                        "Redirecting to Login";
                }, 2000);

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 4000);

            }

            else {

                registerBtn.disabled = false;

                alert(data.message);

            }

        }

        catch (error) {

            console.log(error);

            registerBtn.disabled = false;

            alert("Server Error");

        }

    });

}


// Login Page
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    const loginPageEmail =
        document.getElementById("loginPageEmail");

    const loginPagePassword =
        document.getElementById("loginPagePassword");

    loginBtn.addEventListener("click", async function (e) {

        e.preventDefault();

        let email =
            document.getElementById("loginEmail")
                .value.trim();

        let password =
            document.getElementById("loginPassword")
                .value;

        loginPageEmail.innerText = "";
        loginPagePassword.innerText = "";

        if (email === "" && password === "") {

            loginPageEmail.innerText =
                "Email is required *";

            loginPagePassword.innerText =
                "Password required *";

            return;
        }

        if (email === "") {

            loginPageEmail.innerText =
                "Email is required *";

            return;
        }

        let loginEmailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!loginEmailPattern.test(email)) {

            loginPageEmail.innerText =
                "Enter a valid email address *";

            return;
        }


        if (password === "") {

            loginPagePassword.innerText =
                "Password required *";

            return;
        }

        try {

            const response = await fetch(
                "https://complaint-management-portal-m8jc.onrender.com/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })

                }
            );

            const data = await response.json();

            if (data.success) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(data.user)
                );

                loginBtn.innerText =
                    "Logging in...";

                loginBtn.disabled = true;

                if (data.user.role === "admin") {

                    setTimeout(() => {
                        window.location.href =
                            "admindashboard.html";
                    }, 1000);

                }

                else {

                    setTimeout(() => {
                        window.location.href =
                            "userdashboard.html";
                    }, 1000);

                }
            }

            else {

                if (data.field === "email") {
                    loginPageEmail.innerText = data.message;
                }

                if (data.field === "password") {
                    loginPagePassword.innerText = data.message;
                }

            }

        }

        catch (error) {

            console.log(error);

            loginBtn.disabled = false;

            alert("Server Error");

        }

    });

}


// Forgot Password
const resetPasswordBtn =
    document.getElementById(
        "resetPasswordBtn"
    );

if (resetPasswordBtn) {

    resetPasswordBtn.addEventListener("click", async function (e) {

        e.preventDefault();

        let email =
            document.getElementById(
                "forgotEmail"
            ).value.trim();

        let newPassword =
            document.getElementById(
                "newPassword"
            ).value;

        let confirmPassword =
            document.getElementById(
                "confirmNewPassword"
            ).value;

        if (email === "") {

            document.getElementById("emailForgot").innerText =
                "Email is required *"

            return;

        }

        let emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            document.getElementById("emailForgot").innerText =
                "Enter a valid email address *"

            return;

        }

        document.getElementById("emailForgot").innerText =
            ""


        if (newPassword.length < 8) {

            document.getElementById("newPasswordForgot").innerText =
                "Password must be at least 8 characters long *"

            return;

        }

        document.getElementById("newPasswordForgot").innerText =
            ""

        if (newPassword !== confirmPassword) {

            document.getElementById("confirmNewPasswordForgot").innerText =
                "Passwords do not match *"

            return;

        }

        document.getElementById("confirmNewPasswordForgot").innerText =
            ""

        try {

            const response = await fetch(

                "https://complaint-management-portal-m8jc.onrender.com/api/auth/forgot-password",

                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email,

                        password: newPassword

                    })

                }

            );

            const data =
                await response.json();

            if (data.success) {

                resetPasswordBtn.innerText =
                    "Resetting Password...";

                resetPasswordBtn.disabled = true;

                setTimeout(() => {

                    resetPasswordBtn.innerText =
                        "Password Updated";

                }, 2000);

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 3000);

            }

            else {

                document.getElementById("emailForgot").innerText =
                    data.message;

            }

        }

        catch (error) {

            console.log(error);

            alert("Server Error");

        }
    }
    );

}


// Categories of Complaints 
const categoryNames = {

    electricity: "Electricity",

    water: "Water Supply",

    road: "Road & Transport",

    sanitation: "Sanitation & Waste Management",

    internet: "Internet & Network",

    streetlight: "Street Light",

    "public-property": "Public Property Damage",

    security: "Security & Safety",

    administration: "Administration",

    other: "Other"

};


// Complaint Page
const submitComplaintBtn =
    document.getElementById("submitComplaintBtn");

if (submitComplaintBtn) {

    submitComplaintBtn.addEventListener("click", async function (e) {

        e.preventDefault();

        let currentUser =
            JSON.parse(localStorage.getItem("currentUser"));

        let name =
            document.getElementById("complaintName")
                .value.trim();

        if (name === "") {

            document.getElementById("complaintFullName").innerText =
                "Enter Name *"

            return;

        }

        document.getElementById("complaintFullName").innerText =
            ""

        let category =
            document.getElementById("category")
                .value;

        if (category === "") {

            document.getElementById("complaintCategory").innerText =
                "Please select a category"

            return;

        }

        document.getElementById("complaintCategory").innerText =
            ""

        let subject =
            document.getElementById("subject")
                .value.trim();

        if (subject === "") {

            document.getElementById("complaintSubject").innerText =
                "Subject is required"

            return;

        }

        if (subject.length < 5) {
            document.getElementById("complaintSubject").innerText =
                "Subject must be at least 5 characters long"

            return;

        }

        document.getElementById("complaintSubject").innerText =
            ""

        let description =
            document.getElementById("description")
                .value.trim();

        if (description === "") {

            document.getElementById("complaintDescription").innerText =
                "Description is required"

            return;

        }

        if (description.length < 15) {

            document.getElementById("complaintDescription").innerText =
                "Description must be at least 15 characters long"

            return;

        }

        document.getElementById("complaintDescription").innerText =
            ""

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://complaint-management-portal-m8jc.onrender.com/api/complaints",
                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                        "Authorization": "Bearer " + token

                    },

                    body: JSON.stringify({

                        title: subject,

                        category: category,

                        description: description

                    })

                }

            );

            const data = await response.json();

            if (data.success) {

                submitComplaintBtn.disabled = true;

                submitComplaintBtn.innerText =
                    "Submitting Complaint...";

                setTimeout(() => {

                    alert("Complaint Submitted Successfully!");

                    document.querySelector("form").reset();

                }, 2000);

                setTimeout(() => {

                    window.location.href =
                        "userdashboard.html";

                }, 2500);

            }

            else {

                if (handleAuthError(data.message)) {
                    return;
                }

                alert(data.message);

            }
        }

        catch (error) {

            console.log(error);

            alert("Server Error");

        }

    });

}


// Track Complaints
const trackBtn = document.getElementById("trackBtn");

if (trackBtn) {

    trackBtn.addEventListener("click", async function (e) {

        e.preventDefault();

        const complaintId =
            document.getElementById("trackComplaintId").value.trim().toUpperCase();

        const error =
            document.getElementById("trackComplaint");

        error.innerText = "";

        if (complaintId === "") {

            error.innerText = "Enter Complaint ID *";
            return;

        }

        try {

            const response = await fetch(

                `https://complaint-management-portal-m8jc.onrender.com/api/complaints/track/${complaintId}`

            );

            const data = await response.json();

            if (!response.ok) {

                if (handleAuthError(data.message)) {
                    return;
                }

                alert(data.message);
                return;

            }

            const complaint = data.complaint;

            document.getElementById("trackId").innerText =
                complaint.complaintId;

            document.getElementById("trackStatus").innerText =
                complaint.status;

            const status =
                document.getElementById("trackStatus");

            if (complaint.status === "Pending") {

                status.style.color = "red";

            }

            else if (complaint.status === "In Progress") {

                status.style.color = "orange";

            }

            else if (complaint.status === "Resolved") {

                status.style.color = "green";

            }

            document.getElementById("trackCategory").innerText =
                categoryNames[complaint.category];

            document.getElementById("trackDate").innerText =
                new Date(complaint.createdAt).toLocaleDateString();

            document.getElementById("trackDepartment").innerText =
                "Support Department";

        }

        catch (error) {

            console.log(error);

            alert("Server Error");

        }

    });

}


// About Page and Contact Page and Track Page 
const unProtectedPages = [
    "track.html",
    "about.html",
    "contact.html"
];

if (unProtectedPages.includes(currentPage)) {

    if (isLoggedIn()) {

        document.getElementById("loginUserBtn").innerText = "Dashboard";
        document.getElementById("registerUserBtn").innerText = "Logout";

        document.getElementById("loginUserBtn").onclick = function () {
            window.location.href = "userdashboard.html";
        };

        document.getElementById("registerUserBtn").onclick = function () {

            logout();

        };

    }
}


// User Dashboard
if (currentPage === "userdashboard.html") {

    loadDashboard();

}

async function loadDashboard() {

    try {

        const token =
            localStorage.getItem("token");

        const currentUser =
            JSON.parse(
                localStorage.getItem("currentUser")
            );

        document.getElementById("welcomeUser").innerText =
            `Welcome, ${currentUser.name}`;

        const response = await fetch(

            "https://complaint-management-portal-m8jc.onrender.com/api/complaints/my",

            {

                headers: {

                    Authorization:
                        "Bearer " + token

                }

            }

        );

        const data =
            await response.json();

        if (!data.success) {

            if (handleAuthError(data.message)) {
                return;
            }

            alert(data.message);

            return;

        }

        const complaints =
            data.complaints;

        const pending =
            complaints.filter(
                c => c.status === "Pending"
            );

        const progress =
            complaints.filter(
                c => c.status === "In Progress"
            );

        const resolved =
            complaints.filter(
                c => c.status === "Resolved"
            );

        document.getElementById("totalComplaints").innerText =
            complaints.length;

        document.getElementById("pendingComplaints").innerText =
            pending.length;

        document.getElementById("progressComplaints").innerText =
            progress.length;

        document.getElementById("resolvedComplaints").innerText =
            resolved.length;

        const tableBody =
            document.getElementById(
                "complaintsTableBody"
            );

        tableBody.innerHTML = "";

        if (complaints.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">
                        No Complaints Found
                    </td>
                </tr>
            `;

            return;

        }

        complaints.forEach(complaint => {

            tableBody.innerHTML += `

            <tr>

                <td>${complaint.complaintId}</td>

                <td>${categoryNames[complaint.category]}</td>

                <td>${complaint.status}</td>

                <td>${new Date(
                complaint.createdAt
            ).toLocaleDateString()}</td>

                <td>

                    <div class="action-buttons">

                        <button
                        class="view-my-complaint-btn"
                        data-id="${complaint._id}">
                        View
                        </button>
                        
                        <button
                        class="edit-btn"
                        data-id="${complaint._id}"
                        ${complaint.status === "Resolved" ? "disabled" : ""}
                        ${complaint.status === "In Progress" ? "disabled" : ""}>
                        Edit
                        </button>
                        
                        <button
                        class="delete-btn"
                        data-id="${complaint._id}">
                        Delete
                        </button>
                    
                    </div>
                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

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

    loadComplaints();

    loadUsers();

    let complaintTable =
        document.getElementById("adminComplaintTable");

    if (complaintTable) {

        complaintTable.innerHTML = "";

        // Search Complaint by ID (Admin Page)
        let searchInput =
            document.getElementById(
                "searchComplaint"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "keyup",
                function () {

                    let searchValue =
                        this.value.toLowerCase();

                    let rows =
                        document.querySelectorAll(
                            "#adminComplaintTable tr"
                        );

                    rows.forEach(row => {

                        let rowText =
                            row.innerText.toLowerCase();

                        row.style.display =
                            rowText.includes(searchValue)
                                ? ""
                                : "none";

                    });

                }
            );
        }

    }

    // Status wise Filter (Admin Page Filter)
    let statusFilter =
        document.getElementById(
            "statusFilter"
        );

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function () {

                let value =
                    this.value;

                let rows =
                    document.querySelectorAll(
                        "#adminComplaintTable tr"
                    );

                rows.forEach(row => {

                    let dropdown =
                        row.querySelector(
                            ".statusDropdown"
                        );

                    if (!dropdown) return;

                    if (
                        value === "All Status"
                    ) {

                        row.style.display =
                            "";

                    }

                    else {

                        row.style.display =
                            dropdown.value === value
                                ? ""
                                : "none";

                    }
                });
            }
        );
    }


    // Category wise Filter (Admin Page Filter)
    let categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            function () {

                let value =
                    this.value.toLowerCase();

                let rows =
                    document.querySelectorAll(
                        "#adminComplaintTable tr"
                    );

                rows.forEach(row => {

                    let category =
                        row.children[2]
                            ?.innerText
                            .toLowerCase();

                    if (
                        value ===
                        "all categories"
                    ) {

                        row.style.display =
                            "";

                    }

                    else {

                        row.style.display =
                            category === value
                                ? ""
                                : "none";

                    }

                });

            }
        );

    }
}


async function loadComplaints() {

    try {

        const response = await fetch(
            "https://complaint-management-portal-m8jc.onrender.com/api/admin/complaints",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            if (handleAuthError(data.message)) {
                return;
            }

            throw new Error(data.message);
        }

        complaints = data.complaints;

        updateComplaintStats();

        renderComplaintTable();

    }

    catch (error) {

        console.error(error);
        alert(error.message);

    }

}


async function loadUsers() {

    try {

        const response = await fetch(
            "https://complaint-management-portal-m8jc.onrender.com/api/admin/users",
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            if (handleAuthError(data.message)) {
                return;
            }

            throw new Error(data.message);

        }

        users = data.users;

        renderUsersTable()
    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}


function renderUsersTable() {

    let usersTable =
        document.getElementById("usersTable");

    usersTable.innerHTML = "";

    if (usersTable) {

        usersTable.innerHTML = "";

        if (users.length === 1) {

            usersTable.innerHTML = `
            <tr>
                <td colspan="6">
                    No Users Found
                </td>
            </tr>
        `;

            return;
        }

        users.forEach((user, index) => {
            if (user.role !== "user") {
                return;
            }

            usersTable.innerHTML += `
                <tr>

                    <td>
                        USR${String(index + 1)
                    .padStart(3, "0")}
                    </td>

                    <td>${user.name}</td>

                    <td>${user.email}</td>

                    <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>

                    <td>
                        <span class="active-status">
                            Active
                        </span>
                    </td>

                    <td>

                        <div class="action-buttons">

                            <button
                                class="view-user-btn"
                                data-id="${user._id}">
                                View
                            </button>

                            <button
                                class="delete-user-btn"
                                data-id="${user._id}">
                                Delete
                            </button>

                        </div>
                    </td>

                </tr>
            `;

        });
    }
}


function renderComplaintTable() {

    let complaintTable =
        document.getElementById("adminComplaintTable");

    if (!complaintTable) return;

    complaintTable.innerHTML = "";

    if (complaintTable) {

        complaintTable.innerHTML = "";

        if (complaints.length === 0) {

            complaintTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        No Complaints Found
                    </td>
                </tr>
            `;

            return
        }

        complaints.forEach((complaint, index) => {

            complaintTable.innerHTML += `
                    <tr>

                        <td>${complaint.complaintId}</td>

                        <td>${complaint.user ? complaint.user.name : "Deleted User"}</td>

                        <td>${categoryNames[complaint.category]}</td>

                        <td>

                            <select
                                class="statusDropdown"
                                data-id="${complaint._id}">

                                <option value="Pending"
                                ${complaint.status === "Pending"
                    ? "selected" : ""}>
                                    Pending
                                </option>

                                <option value="In Progress"
                                ${complaint.status === "In Progress"
                    ? "selected" : ""}>
                                    In Progress
                                </option>

                                <option value="Resolved"
                                ${complaint.status === "Resolved"
                    ? "selected" : ""}>
                                    Resolved
                                </option>

                            </select>

                        </td>

                        <td>${new Date(complaint.createdAt).toLocaleDateString()}</td>

                        <td>

                        <div class="action-buttons">

                            <button 
                                class="view-btn"
                                data-id="${complaint._id}">
                                View
                            </button>

                            <button
                                class="resolve-btn"
                                data-id="${complaint._id}">
                                Update
                            </button>

                            <button
                                class="delete-complaint-btn"
                                data-id="${complaint._id}">
                                Delete
                            </button>

                            </div>
                        </td>

                    </tr>
                `;
        });
    }
}


function updateComplaintStats() {

    const total =
        complaints.length;

    const pending =
        complaints.filter(
            complaint =>
                complaint.status === "Pending"
        ).length;

    const progress =
        complaints.filter(
            complaint =>
                complaint.status === "In Progress"
        ).length;

    const resolved =
        complaints.filter(
            complaint =>
                complaint.status === "Resolved"
        ).length;

    document.getElementById("totalComplaints").innerText = total;

    document.getElementById("pendingComplaints").innerText = pending;

    document.getElementById("progressComplaints").innerText = progress;

    document.getElementById("resolvedComplaints").innerText = resolved;

}


// Reports Page
if (currentPage === "reports.html") {

    loadReports();

}

async function loadReports() {

    try {

        const response = await fetch(
            "https://complaint-management-portal-m8jc.onrender.com/api/admin/complaints",
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            if (handleAuthError(data.message)) {
                return;
            }

            throw new Error(data.message);

        }

        complaints = data.complaints;

        updateReportStats();

        updateCategoryBreakdown();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}


function updateReportStats() {

    document.getElementById("reportTotal").innerText =
        complaints.length;

    document.getElementById("reportPending").innerText =
        complaints.filter(
            c => c.status === "Pending"
        ).length;

    document.getElementById("reportProgress").innerText =
        complaints.filter(
            c => c.status === "In Progress"
        ).length;

    document.getElementById("reportResolved").innerText =
        complaints.filter(
            c => c.status === "Resolved"
        ).length;

}


function updateCategoryBreakdown() {

    const categoryCounts = {

        electricity: 0,
        water: 0,
        road: 0,
        sanitation: 0,
        internet: 0,
        streetlight: 0,
        "public-property": 0,
        security: 0,
        administration: 0,
        other: 0

    };

    complaints.forEach(complaint => {

        if (categoryCounts.hasOwnProperty(complaint.category)) {

            categoryCounts[complaint.category]++;

        }

    });

    document.getElementById("electricityCount").innerText =
        categoryCounts.electricity;

    document.getElementById("waterCount").innerText =
        categoryCounts.water;

    document.getElementById("roadCount").innerText =
        categoryCounts.road;

    document.getElementById("sanitationCount").innerText =
        categoryCounts.sanitation;

    document.getElementById("internetCount").innerText =
        categoryCounts.internet;

    document.getElementById("streetlightCount").innerText =
        categoryCounts.streetlight;

    document.getElementById("publicPropertyCount").innerText =
        categoryCounts["public-property"];

    document.getElementById("securityCount").innerText =
        categoryCounts.security;

    document.getElementById("administrationCount").innerText =
        categoryCounts.administration;

    document.getElementById("otherCount").innerText =
        categoryCounts.other;

}


// User Details (Admin)
if (currentPage === "userdetails.html") {

    loadUserDetails();

}


async function loadUserDetails() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const userId =
            params.get("id");

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(

                `https://complaint-management-portal-m8jc.onrender.com/api/admin/users/${userId}`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        if (!response.ok) {

            if (handleAuthError(data.message)) {
                return;
            }

            throw new Error(data.message);

        }

        const user =
            data.user;

        document.getElementById(
            "userDetailName"
        ).innerText =
            user.name;

        document.getElementById(
            "userDetailEmail"
        ).innerText =
            user.email;

        document.getElementById(
            "userDetailPhone"
        ).innerText =
            user.phone;

        document.getElementById(
            "userComplaintCount"
        ).innerText =
            data.complaintCount;

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}


// Update Status (Admin Page)
document.addEventListener("click", async function (e) {

    if (!e.target.classList.contains("resolve-btn")) return;

    try {

        const complaintId =
            e.target.dataset.id;

        const dropdown =
            document.querySelector(
                `.statusDropdown[data-id="${complaintId}"]`
            );

        const status =
            dropdown.value;

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                `https://complaint-management-portal-m8jc.onrender.com/api/admin/complaints/${complaintId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            if (handleAuthError(data.message)) {
                return;
            }

            throw new Error(data.message);

        }

        alert(data.message);

        loadComplaints();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

});


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


// Admin Dashboard table 
document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains(
            "view-btn"
        )
    ) {

        let complaintId =
            e.target.dataset.id;

        window.location.href =
            `complaintdetails.html?id=${complaintId}`;

    }
});


// Report Generate Button (Admin)
document.getElementById("generateReportBtn")
    ?.addEventListener("click", () => {

        window.location.href = "reports.html";

    });


// View Complaint Details (User View)
document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("view-my-complaint-btn")) {
        return;
    }

    const complaintId =
        e.target.dataset.id;

    window.location.href =
        `usercomplaintdetails.html?id=${complaintId}`;

});


// Delete Complaint Button (User Dashboard)
document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains(
            "delete-my-complaint-btn"
        )
    ) {

        let confirmDelete =
            confirm(
                "Are you sure you want to delete this complaint?"
            );

        if (!confirmDelete) return;

        let complaintId =
            e.target.dataset.id;

        let complaints =
            JSON.parse(
                localStorage.getItem("complaints")
            ) || [];

        complaints =
            complaints.filter(c =>
                c.complaintId !== complaintId
            );

        localStorage.setItem(
            "complaints",
            JSON.stringify(complaints)
        );

        alert("Complaint Deleted Successfully");

        location.reload();

    }

});


// User Complaint Details (User View)
if (currentPage === "usercomplaintdetails.html") {

    loadUserComplaintDetails();

}

async function loadUserComplaintDetails() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const complaintId =
            params.get("id");

        if (!complaintId) {

            alert("Complaint ID Missing");

            window.location.href =
                "userdashboard.html";

            return;

        }

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(

                `https://complaint-management-portal-m8jc.onrender.com/api/complaints/${complaintId}`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        if (!data.success) {

            if (handleAuthError(data.message)) {
                return;
            }

            alert(data.message);

            window.location.href =
                "userdashboard.html";

            return;

        }

        const complaint =
            data.complaint;

        document.getElementById("detailComplaintId").innerText =
            complaint.complaintId;

        document.getElementById("detailCategory").innerText =
            categoryNames[complaint.category];

        document.getElementById("detailSubject").innerText =
            complaint.title;

        document.getElementById("detailDescription").innerText =
            complaint.description;

        const statusElement = document.getElementById("detailStatus");

        statusElement.innerText = complaint.status;

        statusElement.className = "status";

        if (complaint.status === "Pending") {

            statusElement.classList.add("pending");

        }

        else if (complaint.status === "In Progress") {

            statusElement.classList.add("progress");

        }

        else if (complaint.status === "Resolved") {

            statusElement.classList.add("resolved");

        }

        document.getElementById("detailDate").innerText =
            new Date(
                complaint.createdAt
            ).toLocaleString();

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}


// Complaint Details (Admin View)
if (currentPage === "complaintdetails.html") {

    loadAdminComplaintDetails();

}

async function loadAdminComplaintDetails() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const complaintId =
            params.get("id");

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(

                `https://complaint-management-portal-m8jc.onrender.com/api/complaints/${complaintId}`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        if (!data.success) {

            if (handleAuthError(data.message)) {
                return;
            }

            alert(data.message);

            return;

        }

        const complaint =
            data.complaint;

        document.getElementById("detailComplaintId").innerText =
            complaint.complaintId;

        document.getElementById("detailUserName").innerText =
            complaint.user.name;

        document.getElementById("detailUserEmail").innerText =
            complaint.user.email;

        document.getElementById("detailUserPhone").innerText =
            complaint.user.phone;

        document.getElementById("detailCategory").innerText =
            categoryNames[complaint.category];

        document.getElementById("detailSubject").innerText =
            complaint.title;

        document.getElementById("detailDescription").innerText =
            complaint.description;

        const statusElement = document.getElementById("detailStatus");

        statusElement.innerText = complaint.status;

        statusElement.className = "status";

        if (complaint.status === "Pending") {
            
            statusElement.classList.add("pending");

        }

        else if (complaint.status === "In Progress") {

            statusElement.classList.add("progress");

        }

        else if (complaint.status === "Resolved") {

            statusElement.classList.add("resolved");

        }

        document.getElementById("detailDate").innerText =
            new Date(
                complaint.createdAt
            ).toLocaleString();

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}


// View User (Admin)
document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains(
            "view-user-btn"
        )
    ) {

        const userId =
            e.target.dataset.id;

        window.location.href =
            `userdetails.html?id=${userId}`;

    }

});


// Delete User (Admin)
document.addEventListener("click", async function (e) {

    if (!e.target.classList.contains("delete-user-btn")) return;

    const confirmDelete =
        confirm("Delete this user and all their complaints?");

    if (!confirmDelete) return;

    try {

        const userId =
            e.target.dataset.id;

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(

                `https://complaint-management-portal-m8jc.onrender.com/api/admin/users/${userId}`,

                {

                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        if (!response.ok) {

            if (handleAuthError(data.message)) {
                return;
            }

            throw new Error(data.message);

        }

        alert(data.message);

        loadUsers();

        loadComplaints();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

});


// Delete Complaint (Admin Control)
document.addEventListener("click", async function (e) {

    if (!e.target.classList.contains("delete-complaint-btn")) return;

    const confirmDelete =
        confirm("Delete this complaint?");

    if (!confirmDelete) return;

    try {

        const complaintId =
            e.target.dataset.id;

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(

                `https://complaint-management-portal-m8jc.onrender.com/api/admin/complaints/${complaintId}`,

                {

                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        if (!response.ok) {

            if (handleAuthError(data.message)) {
                return;
            }

            throw new Error(data.message);

        }

        alert(data.message);

        loadComplaints();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

});


// Show and Hide Passowrd
document.querySelectorAll(".toggle-password")
    .forEach(button => {

        button.addEventListener("click", function () {

            let input =
                document.getElementById(
                    this.dataset.target
                );

            let icon =
                this.querySelector("img");

            if (input.type === "password") {

                input.type = "text";

                icon.src =
                    "./images/eye-slash.svg";

            }

            else {

                input.type = "password";

                icon.src =
                    "./images/eye-open.svg";

            }

        });

    });