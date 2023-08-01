const generate = (plop) => {
  // controller generator
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
        path: "src/hooks/use{{ pascalCase name}}.tsx",
        templateFile: "_templates/context.hbs",
      },
    ],
  });
};

export default generate;
