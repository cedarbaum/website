"use client";

import Chat from "@/components/chat";


export default function Page() {
  return (
    <div className="dark w-full h-full">
      <main className="w-full h-full">
        <div className="bg-primary dark:bg-black relative h-full w-full flex flex-col md:mx-auto">
          <div className="md:p-8 relative h-full w-full md:mx-auto flex flex-col justify-center items-center">
            <div className="w-full h-full md:h-[80%] md:max-h-[800px] md:max-w-md overflow-visible">
              <Chat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
