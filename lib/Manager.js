const Employee = require("./Employee");
// TODO: Write code to define and export the Engineer class.  HINT: This class should inherit from Employee.
class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        super(name, id, email);
        this.officeNumber = officeNumber;
        this.role = "Manager"
    }

    getOfficeNumber() {
        return this.officeNumber;
    }

}

module.exports = Manager;