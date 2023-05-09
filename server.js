const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
  );

// prompt questions

const beginPrompts = ()=>{
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: [
             "View all Employees",
             "Add Employee", 
             "Update Employee Role", 
             "View all Roles", 
             "Add Role", 
             "View all Departments", 
             "Add Department",
             "Quit"
            ]

        }
    ]).then(res=>{
        switch (res.action){
            case "View all Employees":
                viewEmployees()
                break;
            case "Add Employee":
                addEmployee()
                break;
            case "Update Employee Role":
                updateEmployee()
                break;
            case "View all Roles":
                viewRoles()
                break;
            case "Add Role":
                addRole()
                break;
            case "View all Departments":
                viewDepartments()
                break;
            case "Add Department":
                addDepartment()
                break;
            default: process.exit(1)
        }
    })
}
async function viewEmployees(){
    const [employees] = await db.promise().query("Select * FROM employee")
    console.table(employees)
    beginPrompts()
}

async function addEmployee(){
    const [employees] = await db.promise().query("Select * FROM employee")
    const [roles] = await db.promise().query("Select * FROM role_position")
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employees first name?",
            name: "first_name",
        },
        {
            type: "input",
            message: "What is the employees last name?",
            name: "last_name",
        },
        {
            type: "list",
            message: "Please choose a role from the list below",
            name: "role_id",
            choices: roles.map(({id, title})=>({
                name:title,
                value:id
            }))
        },
        {
            type: "list",
            message: "Please choose a manager from the list below",
            name: "manager_id",
            choices: employees.map(({id, first_name, last_name})=>({
                name:first_name + " " + last_name,
                value:id
            }))
        }
    ]).then(async answers => {
        await db.promise().query(`insert into employee (first_name, last_name, role_id, manager_id) values('${answers.first_name}', '${answers.last_name}', ${answers.role_id}, ${answers.manager_id})`) 
        viewEmployees()
    })
}

async function updateEmployee(){
    const [employees] = await db.promise().query("Select * FROM employee")
    const [roles] = await db.promise().query("Select * FROM role_position")
    const employee_id = await inquirer.prompt ([
        {
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "employee_id",
            choices: employees.map(({id, first_name, last_name})=>({
                name:first_name + " " + last_name,
                value:id
            }))
        }
    ]).employee_id
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employees first name?",
            name: "first_name",
        },
        {
            type: "input",
            message: "What is the employees last name?",
            name: "last_name",
        },
        {
            type: "list",
            message: "Please choose a role from the list below",
            name: "role_id",
            choices: roles.map(({id, title})=>({
                name:title,
                value:id
            }))
        },
        {
            type: "list",
            message: "Please choose a manager from the list below",
            name: "manager_id",
            choices: employees.map(({id, first_name, last_name})=>({
                name:first_name + " " + last_name,
                value:id
            }))
        }
    ]).then(async answers => {
        await db.promise().query(`update employees set first_name = '${answers.first_name}', last_name = '${answers.last_name}', role_id = ${answers.role_id}, manager_id = ${answers.manager_id} where id=${employee_id}`) 
        viewEmployees()
    })
}


async function viewRoles(){
    const [roles] = await db.promise().query("Select * FROM role_position")
    console.table(roles)
    beginPrompts()
}

async function addRole(){
    const [departments] = await db.promise().query("Select * FROM department")
    inquirer.prompt([
        {
            type: "input",
            message: "What is the title of the role?",
            name: "role_title",
        },
        {
            type: "input",
            message: "What is the salary for the role?",
            name: "salary",
        },
        {
            type: "list",
            message: "Please choose a department from the list below",
            name: "department_id",
            choices: departments.map(({id, department_name})=>({
                name:department_name,
                value:id
            }))
        }
    ]).then(async answers => {
        await db.promise().query(`insert into role_position (title, salary, department_id) values('${answers.role_title}', ${answers.salary}, ${answers.department_id})`) 
        viewRoles()
    })
}

async function viewDepartments(){
    const [department] = await db.promise().query("Select * FROM department")
    console.table(department)
    beginPrompts()
}

async function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department",
        }
    ]).then(async answers => {
        await db.promise().query(`insert into department (department_name) values('${answers.department}')`) 
        viewDepartments()
    })
}

beginPrompts()
