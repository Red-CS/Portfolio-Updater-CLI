#!/usr/bin/env node
var inquirer = require("inquirer");
const { program } = require("commander");
const axios = require("axios");

program.option("-y, --yes", "Skip confirmation check");
program.parse(process.argv);

// From https://fsymbols.com/generators/carty/
console.log();
console.log("  ███████╗██████╗░██╗███╗░░██╗░██████╗░███████╗");
console.log("  ██╔════╝██╔══██╗██║████╗░██║██╔════╝░██╔════╝");
console.log("  █████╗░░██████╔╝██║██╔██╗██║██║░░██╗░█████╗░░");
console.log("  ██╔══╝░░██╔══██╗██║██║╚████║██║░░╚██╗██╔══╝░░");
console.log("  ██║░░░░░██║░░██║██║██║░╚███║╚██████╔╝███████╗");
console.log("  ╚═╝░░░░░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░╚══════╝");
console.log();

/* -------------------------------------------------------------------------- */
/*                                 Main Script                                */
/* -------------------------------------------------------------------------- */

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
        handlePUT();
        return;

      case 2:
        handlePATCH();
        return;

      case 3:
        // TODO - Write handleDELETE()
        return;

      case 4:
        console.log("Exiting");
        return;

      default:
        return;
    }
  })
  .catch((error) => {
    console.log(error);
  });

/* -------------------------- Request Body Handlers ------------------------- */

async function handlePUT() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the project name:",
        name: "project_name",
      },
      {
        type: "input",
        message: "Enter the project desription:",
        name: "project_description",
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
    .then(async (answers) => {
      // If requesting confirmation
      if (!program.opts().yes) {
        // Print form
        console.log("\n", answers, "\n");

        // Confirm
        if (!(await confirm())) return;
      }

      // Submit request
      putDB(answers);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log("The prompt cannot be rendered in the current environment");
      } else {
        // Something else went wrong
        console.log("Something went wrong");
        console.log(error);
      }
    });
}

async function handlePATCH() {
  inquirer
    .prompt([
      /* Pass your questions in here */
      {
        type: "input",
        message: "Enter the project name:",
        name: "project_name",
      },
      {
        type: "input",
        message: "Enter the project desription:",
        name: "project_description",
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
    .then((answers) => console.log(answers));
}

/* --------------------------- API Request Methods -------------------------- */

/**
 * Gets the content of the databse
 * @returns API GET Response from website
 */
async function getDB() {
  var ui = new inquirer.ui.BottomBar();
  displayLoadingBar(ui, true, "Fetching Content . . .");
  // During processing, update the bottom bar content to display a loader
  await axios
    .get("https://animechan.vercel.app/api/random")
    .then(function (response) {
      ui.updateBottomBar("");
      console.log(response.data);
      displayLoadingBar(ui, false);
    })
    .catch((error) => {
      ui.updateBottomBar("");
      console.log("There was something wrong with your request:\n");
      console.log(" ", error.message);
      console.log();
      console.log({
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
      });
      displayLoadingBar(ui, false);
    });
  return;
}

/**
 * Puts a project in the database
 * @returns API PUT Response from website
 */
async function putDB(data) {
  var ui = new inquirer.ui.BottomBar();
  // During processing, update the bottom bar content to display a loader
  displayLoadingBar(ui, true, "Updating database . . .");
  await axios
    .put("https://redwilliams.dev/api/projects", data)
    .then(function (response) {
      ui.updateBottomBar("");
      console.log(response.data);
      displayLoadingBar(ui, false);
    })
    .catch((error) => {
      ui.updateBottomBar("");
      console.log("There was something wrong with your request:\n");
      console.log(" ", error.message);
      console.log();
      console.log({
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
      });
      displayLoadingBar(ui, false);
    });
  return;
}

/**
 * Puts a project in the database
 * @returns API PUT Response from website
 */
async function patchDB(data) {
  var ui = new inquirer.ui.BottomBar();
  // During processing, update the bottom bar content to display a loader
  displayLoadingBar(ui, true, "Updating project . . .");
  await axios
    .patch("https://redwilliams.dev/api/projects", data)
    .then(function (response) {
      ui.updateBottomBar("");
      console.log(response.data);
      displayLoadingBar(ui, false);
    })
    .catch((error) => {
      ui.updateBottomBar("");
      console.log("There was something wrong with your request:\n");
      console.log(" ", error.message);
      console.log();
      console.log({
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
      });
      displayLoadingBar(ui, false);
    });
  return;
}

/* ---------------------------- Helper Functions ---------------------------- */

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

async function confirm() {
  // Confirm
  const result = await inquirer.prompt([
    {
      type: "confirm",
      message: "Is the information you enetered correct?",
      name: "confirm",
    },
  ]);
  return result.confirm;
}
