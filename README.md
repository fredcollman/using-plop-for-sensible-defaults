# Using Plop for sensible defaults

## What is Plop?
Plop is a Node CLI tool for generating files.

It's super helpful for automating the kind of repetitive boilerplate that you might write several times a day.
This saves you time - and [yes, there's an xkcd for that](https://xkcd.com/1205/).

## First example
Let's build out a "Hello World" generator.

### Before you start
You will need
- git
- a recent version of Node (check .tool-versions for the version I used)
- pnpm (check .tool-versions for the version I used), although npm or yarn should work fine

If you get stuck, or you're short of time, you can see the finished code on the `main` branch.
(`plopfile.mjs` and the `_templates` directory are the important bits. The rest is a "real" Next.JS app.)

### Prepare the repo
To begin with, clone this repo. It's overkill for the first example, but will help later.
I'm using `pnpm`, but it should work OK with `npm` or `yarn` instead.

```sh
git clone TODO
git switch TODO
pnpm install  # or `npm install`, or `yarn`
```


### Add the first generator
In your code editor, open up `plopfile.mjs`.

Add your first generator:

```js
// plopfile.mjs
const generate = (plop) => {
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
}

export default generate;
```

You'll also need to add a handlebars template at `_templates/hello.hbs`:

```hbs
Hello, {{ name }}!
```

Now you're ready to run

```sh
pnpm plop  # or `npx plop`, or `yarn plop`
```

Enter `World` when asked for your name (or enter your real name) and hit return.

Take a look in the `src/` directory - you should see a new file `src/World.js`.

Looking in `src/World.js`, you'll see it says `Hello, World!`.

Clearly this isn't valid JavaScript, but we're up and running.

Now try running `pnpm plop Gary` and see that `src/Gary.js` is generated with `Hello, Gary!`.

## What just happened?
Plop is built on top of two other tools - Handlebars and Inquirer.

Handlebars is a templating language. In particular anything inside `{{ double_braces }}` will be replaced with the value of `double_braces` variable.

Inquirer is a tool for requesting user input.

Plop uses Inquirer to collect variables ("answers") to use - this is the `prompts` array in our plopfile.

Then Plop passes those answers through Handlebars templates to generate files in a way we configure in the `actions` array. Note that the `path` of our action (`"src/{{name}}.js"`) is a template too!

## A more practical generator
Let's add a more useful example.

Add this Handlebars template to `_templates/basicComponent.hbs`:

```tsx
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const {{ name }} = ({ children }: Props) => {
  return <div>TODO: implement {{ name }}. {children}</div>;
};

export default {{ name }};
```

Note that Handlebars will replace content within double braces, like `{{ name }}`. Content in single braces, like `{ children }`, will be left untouched.

Can you figure out how to add a generator to our plopfile so this will create a component?

e.g. if the user types `pnpm plop basicComponent Spinner`, we will generate a new file at `src/components/Spinner.ts`.

<details>
    <summary>Expand to reveal</summary>

    ```js
    const generate = (plop) => {
      plop.setGenerator("hello", {
        // unchanged
      };

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
    };

    export default generate;
    ```
</details>

Try generating a few components.

## Different action types
Let's say we want to encourage best practices. Devs should add tests and stories alongside their components.

With plop, we can add multiple files.

`actions` accepts an array of actions, so we could have a bunch of `"add"` actions with different paths and templateFiles.

Thankfully, there's an easier way - plop supports a built-in `"addMany"` action type.

This time, here's the generator code:

```js
const generate = (plop) => {
  // ...

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
};

// ...
```

Have a go at implementing templates inside the `_templates` folder so that `pnpm plop component Hero` will generate a Hero component and, along with tests and stories.

<details>
    <summary>Here's a clue</summary>

    The templates should go in these files:
    - _templates/component/index.ts.hbs
    - _templates/component/{{ name }}.stories.tsx.hbs
    - _templates/component/{{ name }}.test.tsx.hbs
    - _templates/component/{{ name }}.tsx.hbs
</details>

Take a look at the other action types here: https://plopjs.com/documentation/#built-in-actions

## Helpers
Plop ships with a bunch of helpers for Handlebars templates. These are little manipulation functions.

The `pascalCase` helper could be particularly useful for our component.

Try using `{{ pascalCase name }}` instead of `{{ name }}`, and check that `pnpm plop component button` does what you expect it to.

## Custom action types
We can define our own actions.

It is often helpful to run some kind of shell script after creating files. For example, if your generator creates a whole package, you might want to run `pnpm install` in that library, as part of the generation step.

Let's run `prettier` on our newly generated code, to make sure it conforms to our linting config.

```js
import { spawn } from "child_process";

// a general helper function - nothing plop-specific here
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

// (answers, config, plop) is the standard interface for a plop action
const runPrettierAction = (answers, config, plop) => {
  const resolvedPath = plop.renderString(config.path, answers);
  return runPrettier(resolvedPath);
};


const generate = (plop) => {
  // we also have to register our action!
  plop.setActionType("runPrettier", runPrettierAction);

  // ...

  plop.setGenerator("component", {
    // ...
    actions: [
      {
        type: "addMany",
        base: "_templates/component",
        destination: "src/components/{{name}}",
        templateFiles: "_templates/component",
      },
      {
        type: "runPrettier",
        path: "src/components/{{name}}",
      },
    ],
  });

  // ...
};

// ...
```

## What we've seen
Plop lets you codify your coding guidelines.

Rather than an aspirational document sitting somewhere in your knowledge base, you have an executable command that encourages you (and the whole team) to write code in a consistent way.

Plop doesn't just save you time, it helps you improve the readability of your codebase.

## Alternatives
There are other tools that achieve a similar goal. [Hygen] is another JS-based tool.
It stores some config, like the output `path`, directly in the template as YAML-like metadata.
This can ease the pain of a centralised config (all in the plopfile) in very large/busy repos.

If you're working in a language other than JS/TS, it may make sense to use a tool from that ecosystem.
This will make it easier for developers on your team to chip in with changes.
[Cookiecutter] is a Python-based tool with similar goals.

Codemods and AST manipulation are another way of approaching this problem.
These are typically more complex to implement - you need to understand how ASTs work, for starters!
The benefit is that they can be more powerful, if the code generation logic is more nuanced.

## Try it yourself
If you want to explore Plop further you could

1. add Plop to an existing project
2. customise the output of the component generator to match your house style guidelines
3. add a new generator, e.g. for a Redux duck, to wrap react-query's useQuery, or to scaffold an entire library
4. visit the docs https://plopjs.com/documentation
