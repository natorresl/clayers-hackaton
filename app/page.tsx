import ModelGallery from "./components/ModelGallery";
export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-start p-10 gap-8">
      <div className="flex flex-row w-full justify-between">
        <h1 className="max-w-xs text-3xl font-semibold text-black dark:text-zinc-50 w-fit justify-center">
          Clayers
        </h1>
        {/* <ClayEffect /> */}
      </div>
      <p>
        Welcome to clayers, here you will find your beautiful 3D model, just
        click on download and you are ready to 3D print it!
      </p>
      {/* <Search /> */}
      <div className="w-full flex flex-col items-center justify-center gap-8">
        {/* <ModelDisplay />
        <DownloadButton /> */}
        {/* <LogoDisplay /> */}
      </div>
      {/* <FileList /> */}
      <ModelGallery />
    </main>
  );
}
