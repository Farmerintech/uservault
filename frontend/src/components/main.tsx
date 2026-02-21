import FileManager from "./createFile";
import { DashboardHome } from "./homepage";

export const Main = () => {
  return (
    <main className="flex flex-col gap-5 lg:w-[50%] md:w-[40%] p-5 md:pt-5 relative lg:left-[22%] md:left-[32%]">
      <DashboardHome/>
    </main>
  );
};