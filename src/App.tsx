
import "./App.css";
import "./index.css";
import GithubProfileViewer from "./components/customComponents/GithubProfileViewer";
function App() {
  return (
    <div className=" pt-14 px-4">
      <div className="flex flex-col  items-center h-screen w-full">
        <h1 className=" text-2xl md:text-4xl  font-bold mb-8 ">
          GitHub Profile Viewer
        </h1>
        <GithubProfileViewer />
      </div>
    </div>
  );
}

export default App;
