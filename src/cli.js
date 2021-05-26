#!/usr/bin/env node
var inquirer = require("inquirer");

inquirer
  .prompt([
    /* Pass your questions in here */
    {
      type: "input",
      message: "Enter the project name:",
      name: "name",
    },
    {
      type: "input",
      message: "Enter the project desription:",
      name: "description",
    },
    {
      type: "input",
      message: "Enter the tech list:",
      name: "tech_list",
      suffix: " (comma-separated values)",
      filter: (input) => {
        return filter(input);
      },
    },
    {
      type: "input",
      message: "Enter the Github link:",
      name: "github_link",
    },
    {
      type: "input",
      message: "Enter the project link:",
      name: "project_link",
    },
    {
      type: "confirm",
      message: "Is this a featured project?",
      name: "featured",
    },
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    inquirer.prompt([
      {
        type: "confirm",
        message: "Is this information you enetered correct?",
        name: "confirm",
      },
    ]);
    // console.log(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
      console.log("Here");
    }
  });

function filter(input) {
  input = input.split(",");
  for (var i = 0; i < input.length; i++) {
    input[i] = input[i].trim();
  }
  return input;
}
