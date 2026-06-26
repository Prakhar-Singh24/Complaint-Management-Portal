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

const adminProtectedPages = [

    "admindashboard.html",

    "complaintdetails.html",

    "userdetails.html"

];

if (
    adminProtectedPages.includes(
        currentPage
    )
) {

    let adminLoggedIn =
        localStorage.getItem(
            "adminLoggedIn"
        );

    if (
        adminLoggedIn !== "true"
    ) {

        window.location.href =
            "adminlogin.html";

    }

}

const adminCredentials = {

    email:
        "admin@gmail.com",

    password:
        "admin789"

};

const adminLoginBtn =
    document.getElementById(
        "adminLoginBtn"
    );

if (adminLoginBtn) {

    adminLoginBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            let email =
                document.getElementById(
                    "adminEmail"
                ).value;

            let password =
                document.getElementById(
                    "adminPassword"
                ).value;

            if (

                email === adminCredentials.email &&

                password === adminCredentials.password

            ) {

                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );

                window.location.href =
                    "admindashboard.html";

            }

            else {

                alert(
                    "Invalid Admin Credentials"
                );
            }
        }
    );

}


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


// Registration Page (Register User) 
const registerBtn =
    document.getElementById("registerBtn");

if (registerBtn) {

    registerBtn.addEventListener("click", function (e) {

        e.preventDefault();

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        let email =
            document.getElementById("email").value;

        let password =
            document.getElementById("password").value;

        let confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Password does not match");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

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
                password

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

            userPhone:
                currentUser.phone,

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

        setTimeout(() => {
            window.location.href = "userdashboard.html"
        }, 100);

    });

}

// Track Complaints
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

            document.getElementById("trackDate").innerText =
                complaint.date;

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

    let progress =
        userComplaints.filter(c =>
            c.status === "In Progress"
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

    let progressComplaints =
        document.getElementById("progressComplaints");

    if (progressComplaints) {
        progressComplaints.innerText = progress.length;
    }

    let resolvedComplaints =
        document.getElementById("resolvedComplaints");

    if (resolvedComplaints) {
        resolvedComplaints.innerText = resolved.length;
    }


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
                    <td>${categoryNames[complaint.category]}</td>
                    <td>${complaint.status}</td>
                    <td>${complaint.date}</td>
                     <td>
                         <button
                            class="view-my-complaint-btn"
                            data-id="${complaint.complaintId}">
                             View
                        </button>
                     
                        <button
                            class="delete-my-complaint-btn"
                            data-id="${complaint.complaintId}">
                             Delete
                        </button>
                     </td>
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

    let userComplaints =
        JSON.parse(localStorage.getItem("userComplaints")) || [];

    let pending =
        complaints.filter(c =>
            c.status === "Pending"
        );

    let progress =
        complaints.filter(c =>
            c.status === "In Progress"
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

    let progressComplaints =
        document.getElementById("progressComplaints");

    if (progressComplaints) {
        progressComplaints.innerText =
            progress.length;
    }

    let resolvedComplaints =
        document.getElementById("resolvedComplaints");

    if (resolvedComplaints) {
        resolvedComplaints.innerText =
            resolved.length;
    }


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


    let complaintTable =
        document.getElementById("adminComplaintTable");

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
        }

        else {

            complaints.forEach((complaint, index) => {

                complaintTable.innerHTML += `
                    <tr>

                        <td>${complaint.complaintId}</td>

                        <td>${complaint.userName}</td>

                        <td>${categoryNames[complaint.category]}</td>

                        <td>

                            <select
                                class="statusDropdown"
                                data-index="${index}">

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

                        <td>${complaint.date}</td>

                        <td>

                            <button 
                                class="view-btn"
                                data-id="${complaint.complaintId}">
                                View
                            </button>

                            <button
                                class="resolve-btn"
                                data-index="${index}">
                                Update
                            </button>

                            <button
                                class="delete-complaint-btn"
                                data-index="${index}">
                                Delete
                                </button>

                        </td>

                    </tr>
                `;
            });
        }

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


    let usersTable =
        document.getElementById("usersTable");

    if (usersTable) {

        usersTable.innerHTML = "";

        if (users.length === 0) {

            usersTable.innerHTML = `
            <tr>
                <td colspan="6">
                    No Users Found
                </td>
            </tr>
        `;
        }

        else {

            users.forEach((user, index) => {

                usersTable.innerHTML += `
                <tr>

                    <td>
                        USR${String(index + 1)
                        .padStart(3, "0")}
                    </td>

                    <td>${user.name}</td>

                    <td>${user.email}</td>

                    <td>User</td>

                    <td>
                        <span class="active-status">
                            Active
                        </span>
                    </td>

                    <td>

                        <button
                            class="view-user-btn"
                            data-index="${index}">
                            View
                        </button>

                        <button
                            class="delete-user-btn"
                            data-index="${index}">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

            });
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


//Update Status (Admin Page)
document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains(
            "resolve-btn"
        )
    ) {

        let complaints =
            JSON.parse(
                localStorage.getItem(
                    "complaints"
                )
            ) || [];

        let index =
            e.target.dataset.index;

        let dropdown =
            document.querySelector(
                `[data-index="${index}"].statusDropdown`
            );

        complaints[index].status =
            dropdown.value;

        localStorage.setItem(
            "complaints",
            JSON.stringify(complaints)
        );

        alert("Status Updated");

        location.reload();

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


// View Complaint Details (User View)
document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains(
            "view-my-complaint-btn"
        )
    ) {

        let complaintId =
            e.target.dataset.id;

        window.location.href =
            `usercomplaintdetails.html?id=${complaintId}`;

    }

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

    let params =
        new URLSearchParams(
            window.location.search
        );

    let complaintId =
        params.get("id");

    let complaints =
        JSON.parse(
            localStorage.getItem(
                "complaints"
            )
        ) || [];

    let complaint =
        complaints.find(c =>
            c.complaintId === complaintId
        );

    if (complaint) {

        document.getElementById(
            "detailComplaintId"
        ).innerText =
            complaint.complaintId;

        document.getElementById(
            "detailCategory"
        ).innerText =
            complaint.category;

        document.getElementById(
            "detailSubject"
        ).innerText =
            complaint.subject;

        document.getElementById(
            "detailDescription"
        ).innerText =
            complaint.description;

        document.getElementById(
            "detailStatus"
        ).innerText =
            complaint.status;

        document.getElementById(
            "detailDate"
        ).innerText =
            complaint.date;
    }
}


//Complaint Deatils (Admin View)
if (currentPage === "complaintdetails.html") {

    let params =
        new URLSearchParams(
            window.location.search
        );

    let complaintId =
        params.get("id");

    let complaints =
        JSON.parse(
            localStorage.getItem(
                "complaints"
            )
        ) || [];

    let complaint =
        complaints.find(c =>
            c.complaintId === complaintId
        );

    if (complaint) {

        document.getElementById(
            "detailComplaintId"
        ).innerText =
            complaint.complaintId;

        document.getElementById(
            "detailUserName"
        ).innerText =
            complaint.userName;

        document.getElementById(
            "detailUserEmail"
        ).innerText =
            complaint.userEmail;

        document.getElementById(
            "detailUserPhone"
        ).innerText =
            complaint.userPhone;

        document.getElementById(
            "detailCategory"
        ).innerText =
            complaint.category;

        document.getElementById(
            "detailSubject"
        ).innerText =
            complaint.subject;

        document.getElementById(
            "detailDescription"
        ).innerText =
            complaint.description;

        document.getElementById(
            "detailStatus"
        ).innerText =
            complaint.status;

        document.getElementById(
            "detailDate"
        ).innerText =
            complaint.date;
    }
}


document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains(
            "delete-user-btn"
        )
    ) {

        let users =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];

        let index =
            e.target.dataset.index;

        let confirmDelete =
            confirm(
                "Are you sure you want to delete this user?"
            );

        if (confirmDelete) {

            users.splice(index, 1);

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

            alert("User Deleted");

            location.reload();
        }
    }
});


//Delete Complaint (Admin control)
document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains(
            "delete-complaint-btn"
        )
    ) {

        let complaints =
            JSON.parse(
                localStorage.getItem("complaints")
            ) || [];

        let index =
            e.target.dataset.index;

        let confirmDelete =
            confirm(
                "Delete this complaint?"
            );

        if (confirmDelete) {

            complaints.splice(index, 1);

            localStorage.setItem(
                "complaints",
                JSON.stringify(complaints)
            );

            location.reload();
        }
    }
});


// User View Button (Admin Page)
document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains(
            "view-user-btn"
        )
    ) {

        let index =
            e.target.dataset.index;

        window.location.href =
            `userdetails.html?index=${index}`;
    }
});


// Generate Report
document.querySelectorAll(".admin-action-btn")[0]
    ?.addEventListener("click", () => {

        let complaints =
            JSON.parse(localStorage.getItem("complaints")) || [];

        let pending =
            complaints.filter(c =>
                c.status === "Pending"
            ).length;

        let progress =
            complaints.filter(c =>
                c.status === "In Progress"
            ).length;

        let resolved =
            complaints.filter(c =>
                c.status === "Resolved"
            ).length;

        alert(
            `Complaint Report

    Total Complaints: ${complaints.length}

    Pending: ${pending}

    In Progress: ${progress}

    Resolved: ${resolved}`
        );

    });


// User Details Page
if (currentPage === "userdetails.html") {

    let params =
        new URLSearchParams(
            window.location.search
        );

    let index =
        params.get("index");

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    let user =
        users[index];

    if (user) {

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

        let complaints =
            JSON.parse(
                localStorage.getItem(
                    "complaints"
                )
            ) || [];

        let userComplaints =
            complaints.filter(c =>
                c.userEmail === user.email
            );

        document.getElementById(
            "userComplaintCount"
        ).innerText =
            userComplaints.length;

    }

}