const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

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
            choices: ["View all Employees", "Add Employee", "Update Employee Role", "View all Roles", "Add Role", "View all Departments", "Add Department"]

        }
    ]).then(res=>{
        switch (res.action){
            case "View All Employees":
                viewemployees()
                break;
            case "Add Employee":
                addemployee()
                break;
            case "Update Employee Role":
                updateemployee()
                break;
            case "View All Roles":
                viewallroles()
                break;
            case "Add Role":
                addrole()
                break;
            case "View all Departments":
                viewalldepartments()
                break;
            case "Add Department":
                adddepartment()
                break;
        }
    })
}