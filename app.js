const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs").promises;

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const mkdirOptions = { recusive: true };

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

const responses = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const roleChoices = [
    {
        name: "Engineer",
        value: "engineer",
        short: "engineer",
    },
    {
        name: "Manager",
        value: "manager",
        short: "manager",
    },
    {
        name: "Intern",
        value: "intern",
        short: "intern",
    },

]

const questions = [
    {
        type: "input",
        name: "employeeName",
        message: "Employee name:",
    },
    {
        type: "input",
        name: "employeeId",
        message: "Employee id:",
    },
    {
        type: "input",
        name: "employeeEmail",
        message: "Employee e-mail:",
        validate: function (value) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase()) || "Please enter a properly formatted e-mail";
        }
    },
    {
        type: "list",
        name: "employeeRole",
        message: "Employee role:",
        choices: roleChoices,

    },
    {
        type: "input",
        name: "engineerGithub",
        message: "GitHub Username:",
        when: (answers) => answers.employeeRole === "engineer",
    },
    {
        type: "input",
        name: "managerOffice",
        message: "Office Number:",
        when: (answers) => answers.employeeRole === "manager",
    },
    {
        type: "input",
        name: "internSchool",
        message: "School:",
        when: (answers) => answers.employeeRole === "intern",
    },

]

const createOutputDir = async () => {
    try {
        await fs.access(OUTPUT_DIR)
    }
    catch (e) {
        await fs.mkdir(OUTPUT_DIR, mkdirOptions).catch(console.error);
    }
}

const writeOutputFile = async (data) => {
    try {
        await fs.writeFile(outputPath, data, "utf8")
    }
    catch (e) {
        throw e;
    }

}

const pushEmployee = async (employee) => {
    try {
        switch (employee.employeeRole) {
            case "intern":
                const intern = new Intern(employee.employeeName, employee.employeeId, employee.employeeEmail, employee.internSchool)
                responses.push(intern);
                break;
            case "engineer":
                const engineer = new Engineer(employee.employeeName, employee.employeeId, employee.employeeEmail, employee.engineerGithub)
                responses.push(engineer);
                break;
            case "manager":
                const manager = new Manager(employee.employeeName, employee.employeeId, employee.employeeEmail, employee.managerOffice)
                responses.push(manager);
                break;
        }
    }
    catch (e) {
        throw e;
    }
}

const getEmployee = async () => {
    try {
        const employee = await inquirer.prompt(questions);
        await pushEmployee(employee)

        const again = await inquirer.prompt([
            {
                type: "confirm",
                name: "addAnother",
                message: "Add another employee",
                default: true,
            },
        ]);
        if (again.addAnother) {
            await getEmployee();
        }
    } catch (error) {

    }
}

async function main() {
    try {
        await getEmployee();
        const htmlOut = await render(responses);
        console.log(htmlOut);
        await createOutputDir();
        await writeOutputFile(htmlOut);

    }
    catch (e) {
        throw e;

    }
}

main();