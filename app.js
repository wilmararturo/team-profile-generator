const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

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
    {
        type: "confirm",
        name: "addAnother",
        message: "Add another employee",
        default: true,
    }

]


function getEmployees() {
    inquirer.prompt(questions)
        .then((answers) => {
            switch (answers.employeeRole) {
                case "intern":
                    const intern = new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.internSchool)
                    responses.push(intern);
                    console.log(responses);

                    break;

                case "engineer":
                    const engineer = new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.engineerGithub)
                    responses.push(engineer);
                    console.log(responses);


                    break;
                case "manager":
                    const manager = new Manager(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.managerOffice)
                    responses.push(manager);
                    console.log(responses);

                    break;

                // default:
                //     const employee = new Employee(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.managerOffice)
                //     responses.push(employee);
                //     console.log(responses);
                //     break;
            }
            if (answers.addAnother) {
                getEmployees();
            } else {
                const htmlOut = render(responses);
                console.log(htmlOut);
            }
        });

}
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

getEmployees();