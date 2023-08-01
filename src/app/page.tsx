import Button from "../components/Button";
import FancyButton from "../components/FancyButton";
import { HelloProvider } from "../hooks/useExample";

const BASIC_GREETING = { greeting: "hi" };

export default function Home() {
  return (
    <HelloProvider hello={BASIC_GREETING}>
      <main>
        <div>
          <Button>
            here is some <span className="text-xl">exciting</span> button
            content
          </Button>
        </div>
        <div>
          <FancyButton>
            here is some <span className="text-xl">fancy</span> button content
          </FancyButton>
        </div>
      </main>
    </HelloProvider>
  );
}
