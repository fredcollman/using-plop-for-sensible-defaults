import { render } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renders a button", () => {
    const { asFragment } = render(<Button>here is my content</Button>);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <button>
          TODO: implement Button. here is my content
        </button>
      </DocumentFragment>
    `);
  });
});
