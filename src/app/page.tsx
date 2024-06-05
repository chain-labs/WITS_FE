import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[url('/background.png')] bg-cover items-center justify-center">
      <div className="h-full w-full bg-black bg-opacity-50 absolute z-10" />

      <button className="relative group h-10 w-40 cursor-pointer z-20 p-10 flex items-center justify-center">
        <div className="group-hover:text-black group-active:text-black text-yellow-300 z-40">
          <p className="text-[25px] font-bold z-40">Claim</p>
        </div>
        <Image
          src="/default.png"
          className="w-full group-hover:hidden group-active:hidden"
          alt=""
          fill
        />
        <Image
          src="/hover.png"
          className="w-full hidden group-hover:block group-active:hidden"
          alt=""
          fill
        />
        <Image
          src="/active.png"
          className="w-full hidden group-active:block"
          alt=""
          fill
        />
      </button>
    </main>
  );
}
