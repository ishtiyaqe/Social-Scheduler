import Image from 'next/image';

export default function ProductPreview({ text }) {
  return (
    <div className="w-72 h-80 border rounded p-4 flex items-center justify-center bg-white">
      <div className="relative w-full h-full">
        <Image
          src="/tshirt-mockup.jpg"
          alt="tshirt"
          layout="fill"
          objectFit="contain"
          className="w-full h-full"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-black/80 max-w-1/2 max-h-14 text-center ">
          {text}</span>
        </div>
      </div>
    </div>
  );
}
