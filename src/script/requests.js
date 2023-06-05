import { toast } from "./render.js";

const token = JSON.parse(sessionStorage.getItem("@empresas:token"));


const baseUrl = "http://localhost:3333/"
const requestHeaders = {
    "Content-Type": "application/json"
}
const auth = {
    Authorization: `Bearer ${token}`
}

export const green = "#36B37E";
export const red = "#FF5630";

export const requestAllCompanies = async () => {
    const getSectorsAll = await fetch(`${baseUrl}companies/readAll`, {
        method: "GET"
    })
        .then(async (resp) => {
            if (resp.ok) {
                const response = await resp.json();
                localStorage.setItem("@empresas:companiesAll", JSON.stringify(response));
                return response;
            } else {
                throw new Error("url Inválido")
            }
        })
        .catch((error) => {
            console.log(error);
        })

    return getSectorsAll;
}



export const requestAllCategories = async () => {
    const getCategories = await fetch(`${baseUrl}categories/readAll`, {
        method: "GET"
    })
        .then(async (resp) => {
            if (resp.ok) {
                const response = await resp.json();
                localStorage.setItem("@empresas:categories", JSON.stringify(response));
                return response;
            } else {
                throw new Error("URL Inválido");
            }
        })
        .catch((error) => {
            console.log(error);
        })


    return getCategories;
}




export const requestByCompanies = async (select) => {
    const getCompanies = await fetch(`${baseUrl}companies/readByCategory/${select}`, {
        method: "GET"
    })
        .then(async (resp) => {
            if (resp.ok) {
                const response = await resp.json();
                localStorage.setItem("@empresas:companies", JSON.stringify(response));
                return response;
            } else {
                throw new Error("URL Inválido");
            }
        })
        .catch((error) => {
            console.log(error);
        })

    return getCompanies;
}

export const registerUser = async (registerBody) => {
    const register = await fetch(`${baseUrl}employees/create`, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(registerBody)
    })
        .then(async (resp) => {
            if (resp.ok) {
                await toast("Usuario cadastrado com sucesso!", green);

                const inputName = document.querySelector(".register__input-name");
                inputName.value = "";

                const inputEmail = document.querySelector(".register__input-email");
                inputEmail.value = "";

                const inputPassword = document.querySelector(".register__input-password");
                inputPassword.value = "";

                setTimeout(() => location.replace("./Login.html"), 3000);
            } else {
                const response = await resp.json();
                throw (response.message);
            }
        })
        .catch(error => toast(error, red));
}


export const loginRequest = async (loginBody) => {
    const token = await fetch(`${baseUrl}auth/login`, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(loginBody)
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                const { authToken, isAdm } = responsejson;
                sessionStorage.setItem("@empresas:token", JSON.stringify(authToken));
                localStorage.setItem("@empresas:adm", JSON.stringify(isAdm));

                if (responsejson.isAdm) {
                    await toast("Login realizado com sucesso!", green);
                    setTimeout(() => location.replace("./adm.html"), 3000);
                } else {
                    await toast("Login realizado com sucesso!", green);
                    setTimeout(() => location.replace("./user.html"), 3000);
                }
            } else {
                const response = await resp.json();
                throw (response.message);
            }
        })
        .catch((error) => toast(error, red));
}

export const departmentsReadAll = async () => {
    const getDepartments = await fetch(`${baseUrl}departments/readAll`, {
        method: "GET",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                return responsejson;
            }
        })
    return getDepartments;
}

export const departmentById = async (id) => {
    const getDepartmentsById = await fetch(`${baseUrl}departments/readByCompany/${id}`, {
        method: "GET",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                localStorage.setItem("@empresas:departamentByid", JSON.stringify(responsejson));
                return responsejson
            } else {
                const responsejson = await resp.json();
                throw (responsejson.message);
            }
        })
        .catch((error) => console.log(error));

    return getDepartmentsById;
}

export const createDepartment = async (createBody) => {
    const postDepartment = await fetch(`${baseUrl}departments/create`, {
        method: "POST",
        headers: {
            ...requestHeaders,
            ...auth
        },
        body: JSON.stringify(createBody)
    })
        .then(async (resp) => {
            if (resp.ok) {
                await toast("Departamento criado com sucesso", green);
            } else {
                const responsejson = await resp.json();
                throw (responsejson.message);
            }
        })
        .catch((error) => toast(error, red));
}

export const modifyDepartments = async (Department_id, modifyBody) => {
    const pacthModifyDepartments = await fetch(`${baseUrl}departments/update/${Department_id}`, {
        method: "PATCH",
        headers: {
            ...requestHeaders,
            ...auth
        },
        body: JSON.stringify(modifyBody)
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                await toast(responsejson.message, green);
            } else {
                const responsejson = await resp.json();
                throw (responsejson.message);
            }
        })
        .catch((error) => {
            toast(error, red);
        })

    return pacthModifyDepartments;
}

export let companyId = null
export let departmentId = null

const requestEmployeeProfile = async () => {
    const getEmployeeProfile = await fetch(`${baseUrl}employees/profile`, {
        method: "GET",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                companyId = responsejson.company_id;
                departmentId = responsejson.department_id;
                return responsejson;
            } else {
                throw new Error("Algo deu errado na requisição EmployeeProfile");
            }
        })
        .catch(error => {
            console.log(error);
        });

    return getEmployeeProfile;
}




const requestCompanyById = async (company_id) => {
    const getCompanyById = await fetch(`${baseUrl}companies/readById/${company_id}`, {
        method: "GET",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                return responsejson
            }
        })

    return getCompanyById;
}



export const requestDepartmentById = async (department__id) => {
    const getDepartmentById = await fetch(`${baseUrl}departments/readById/${department__id}`, {
        method: "GET",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                return responsejson
            }
        })

    return getDepartmentById;
}

export const requestDeleteDepartment = async (department__id) => {
    const deleteDepartment = await fetch(`${baseUrl}departments/delete/${department__id}`, {
        method: "DELETE",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                await toast(responsejson.message, green);
            } else {
                const responsejson = await resp.json();
                throw new Error(responsejson.message);
            }
        })
        .catch(error => {
            console.log(error);
        })

    return deleteDepartment;
}

export const requestEmployeesReadAll = async () => {
    const getAllEmployees = await fetch(`${baseUrl}employees/readAll`, {
        method: "GET",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                return responsejson
            }
        })

    return getAllEmployees;
}

export const requestEmployeesEdit = async (employee_id, body__request) => {
    const employeesEdit = await fetch(`${baseUrl}employees/updateEmployee/${employee_id}`, {
        method: "PATCH",
        headers: {
            ...auth,
            ...requestHeaders
        },
        body: JSON.stringify(body__request)
    })
        .then(async (resp) => {
            if (resp.ok) {
                toast("Alteração feita com sucesso", green);
            } else {
                const responsejson = await resp.json();
                throw responsejson.message;
            }
        })
        .catch(error => {
            toast(error, red);
        })

    return employeesEdit;
}

export const requestEmployeeDelete = async (employeeId) => {
    const DeleteEmployee = await fetch(`${baseUrl}employees/deleteEmployee/${employeeId}`, {
        method: "DELETE",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                await toast(responsejson.message, green);
                return responsejson;
            }
        })

    return DeleteEmployee;
}

export const requesEmployeesOutOfWork = async () => {
    const getEmployeesOutOfWork = await fetch(`${baseUrl}employees/outOfWork`, {
        method: "GET",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                return responsejson
            }
        })

    return getEmployeesOutOfWork;
}

export const requestHireemployee = async (employee_id, hire_body) => {
    const getHireEmployee = await fetch(`${baseUrl}employees/hireEmployee/${employee_id}`, {
        method: "PATCH",
        headers: {
            ...auth,
            ...requestHeaders
        },
        body: JSON.stringify(hire_body)
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                await toast(responsejson.message, green);
            } else {
                const responsejson = await resp.json();
                throw new Error(responsejson.message)
            }
        })
        .catch(error => {
            console.log(error);
        })

    return getHireEmployee;
}

export const requestDismissEmployee = async (employee_id) => {
    const dismissEmploy = await fetch(`${baseUrl}employees/dismissEmployee/${employee_id}`, {
        method: "PATCH",
        headers: auth
    })
        .then(async (resp) => {
            if (resp.ok) {
                const responsejson = await resp.json();
                await toast(responsejson.message, green)
            } else {
                const responsejson = await resp.json();
                throw new Error(responsejson.message)
            }
        })
        .catch(error => {
            console.log(error);
        })
    
    return dismissEmploy;
}

export const allCompanies = await requestAllCompanies();
export const allCategories = await requestAllCategories();
export const departmentAll = await departmentsReadAll();
export const employeeProfile = await requestEmployeeProfile();
export const company = await requestCompanyById(companyId);
export const department = await requestDepartmentById(departmentId);
export const employeesAll = await requestEmployeesReadAll();
export const outOfWork = await requesEmployeesOutOfWork();