import { spawn } from "child_process";

const runPrettier = (fileName) => {
  return new Promise((resolve, reject) => {
    const proc = spawn("prettier", ["--write", fileName]);
    proc.on("close", (code) => {
      if (code === 0) {
        resolve("formatted with prettier");
      } else {
        reject("ERROR: prettier failed");
      }
    });
  });
};

const runPrettierAction = (answers, config, plop) => {
  const resolvedPath = plop.renderString(config.path, answers);
  return runPrettier(resolvedPath);
};

const generate = (plop) => {
  plop.setActionType("runPrettier", runPrettierAction);

  plop.setGenerator("hello", {
    description: "hello world generator",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "what is your name?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{name}}.js",
        templateFile: "_templates/hello.hbs",
      },
    ],
  });

  plop.setGenerator("basicComponent", {
    description: "basic React component generator",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "what should this component be called?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{name}}.tsx",
        templateFile: "_templates/basicComponent.hbs",
      },
    ],
  });

  plop.setGenerator("component", {
    description: "React component generator",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "what should this component be called?",
      },
    ],
    actions: [
      {
        type: "addMany",
        base: "_templates/component",
        destination: "src/components/{{name}}",
        templateFiles: "_templates/component",
      },
    ],
  });

  plop.setGenerator("context", {
    description: "React context generator",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "what should this context be called?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/hooks/use{{ pascalCase name }}.tsx",
        templateFile: "_templates/context.hbs",
      },
      {
        type: "runPrettier",
        path: "src/hooks/use{{ pascalCase name }}.tsx",
      },
    ],
  });
};

export default generate;
