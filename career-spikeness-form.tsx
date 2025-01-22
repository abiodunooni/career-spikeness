import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br to-[#F86D15] from-[#202022]">
      <Card className="w-full max-w-md aspect-square p-8 shadow-lg bg-white bg-opacity-10 backdrop-blur-lg flex flex-col items-center justify-center">
        <Image
          src="/white-logo.svg"
          alt="Nebula Logo"
          width={120}
          height={120}
          className="mb-8"
        />
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          Welcome to Server 2
        </h1>
      </Card>
    </div>
  );
}
