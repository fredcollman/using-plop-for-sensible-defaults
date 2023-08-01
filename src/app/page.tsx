import Button from "../components/Button";
import FancyButton from "../components/FancyButton";

export default function Home() {
  return (
    <main>
      <div>
        <Button>
          here is some <span className="text-xl">exciting</span> button content
        </Button>
      </div>
      <div>
        <FancyButton>
          here is some <span className="text-xl">fancy</span> button content
        </FancyButton>
      </div>
    </main>
  );
}
