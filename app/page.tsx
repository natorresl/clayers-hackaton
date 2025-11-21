import ModelDisplay from "./components/ModelDisplay";
import {app} from "../firebaseConfig/"
export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-start p-24 gap-8">
      <h1 className="max-w-xs text-3xl font-semibold text-black dark:text-zinc-50">
        Testing three.js
      </h1>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <label>Search your name:</label>
        <input className="border border-gray rounded-sm " />
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-8">
        <ModelDisplay />
      </div>
    </main>
  );
}
