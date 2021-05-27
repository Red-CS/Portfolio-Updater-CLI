#!/usr/bin/env node
var inquirer = require("inquirer");
const { program } = require("commander");
const axios = require("axios");

program.option("-y, --yes", "Skip confirmation check");
program.parse(process.argv);

const options = program.opts();

// From https://fsymbols.com/generators/carty/
console.log();
console.log("  ███████╗██████╗░██╗███╗░░██╗░██████╗░███████╗");
console.log("  ██╔════╝██╔══██╗██║████╗░██║██╔════╝░██╔════╝");
console.log("  █████╗░░██████╔╝██║██╔██╗██║██║░░██╗░█████╗░░");
console.log("  ██╔══╝░░██╔══██╗██║██║╚████║██║░░╚██╗██╔══╝░░");
console.log("  ██║░░░░░██║░░██║██║██║░╚███║╚██████╔╝███████╗");
console.log("  ╚═╝░░░░░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░╚══════╝");
console.log();

/**
 * Main Script
 */
inquirer
  .prompt([
    {
      type: "list",
      name: "option",
      message: "What do you want to do?",
      choices: [
        {
          name: "View the database",
          value: 0,
        },
        {
          name: "Add a project",
          value: 1,
        },
        {
          name: "Update a project",
          value: 2,
        },
        {
          name: "Delete a project",
          value: 3,
          disabled: "Unavailable at this time",
        },
        {
          name: "Exit",
          value: 4,
        },
      ],
    },
  ])
  .then((result) => {
    console.log();
    switch (result.option) {
      // View the database
      case 0:
        getDB();
        return;

      // Add a project
      case 1:
        getInput();
        break;

      case 2:
        patch();
        break;

      case 3:
        // TODO: delete()
        break;

      case 4:
        console.log("Exiting");
        return;
    }
  });

async function getInput() {
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
          input = input.split(",");
          for (var i = 0; i < input.length; i++) {
            input[i] = input[i].trim();
          }
          return input;
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
      // If auto-confirm is off
      if (!program.opts().yes) {
        console.log("\n", answers, "\n");

        //TODO: Change to verify funciton
        // Confirm
        inquirer
          .prompt([
            {
              type: "confirm",
              message: "Is the information you enetered correct?",
              name: "confirm",
            },
          ])
          .then((answer) => {
            // Exit if confirm was false
            if (!answer.confirm) {
              console.log("Returning");
              return;
            }
            // console.log("Done");
            putDB(answers);
            return;
          });
      } else {
        putDB(answers);
        // console.log("Sending");
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
        console.log("Here");
      }
    });
}

/**
 * Gets the content of the databse
 * @returns API GET Response from website
 */
async function getDB() {
  var ui = new inquirer.ui.BottomBar();
  // var display = true;
  displayLoadingBar(ui, true, "Fetching Content . . .");
  // During processing, update the bottom bar content to display a loader
  await axios
    .get("https://animechan.vercel.app/api/random")
    .then(function (response) {
      ui.updateBottomBar("");
      console.log(response.data);
      displayLoadingBar(ui, false);
    });
  return;
}

/**
 * Puts a project in the database
 * @returns API PUT Response from website
 */
async function putDB() {
  var ui = new inquirer.ui.BottomBar();
  // var display = true;
  displayLoadingBar(ui, true, "Updating database . . .");
  // During processing, update the bottom bar content to display a loader
  await axios
    .get("https://animechan.vercel.app/api/random")
    .then(function (response) {
      ui.updateBottomBar("");
      console.log(response.data);
      displayLoadingBar(ui, false);
    });
  return;
}

/**
 * Displays a Loading Bar at the bottom of the shell while fetching data
 * @param {inquirer.ui.BottomBar} ui UI Object
 * @param {boolean} display True when displaying the content, false when removing it
 * @param {string} outputStr The String being displayed while fetching
 * @returns When the loading bar is destroyed
 */
async function displayLoadingBar(ui, display, outputStr) {
  // or output a progress bar, etc
  let wheel;
  while (display) {
    for (var i = 1; i <= 4; i++) {
      switch (i) {
        case 1:
          wheel = "-";
          break;

        case 2:
          wheel = "\\";
          break;

        case 3:
          wheel = "|";
          break;

        case 4:
          wheel = "/";
          break;
      }
      ui.updateBottomBar(`  ${wheel} ${outputStr}\n\n`);
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  ui.onForceClose();
  return;
}
