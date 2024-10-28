import Link from "next/link";
import Image from 'next/image';

export default function CategoryModal({ onClose }) {
  const categories = [
    { name: "가전", img:'/icons/electronics.svg', path: "/category/electronics" },
    { name: "침대", img:'/icons/bed.svg', path: "/category/bed" },
    { name: "책상·식탁", img:'/icons/desk.svg', path: "/category/desk" },
    { name: "의자·소파", img:'/icons/sofa.svg', path: "/category/sofa" },
    { name: "조명·전등", img:'/icons/light.svg', path: "/category/light" },
    { name: "수납·서랍", img:'/icons/drawer.svg', path: "/category/drawer" },
  ];

  return (
    <div
      className="absolute top-full left-[22%] transform -translate-x-[22%] w-[85rem]  h-[10rem] mt-2 bg-white shadow-lg rounded-[1rem] flex pr-[2rem] pl-[2rem] justify-around items-center transition-transform duration-300 ease-out  z-50"
      onMouseLeave={onClose}
    >
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.path}
          className="text-gray-400 hover:text-normalText font-medium flex flex-col items-center"
        >
          <Image
            src={category.img}
            alt={category.name}
            width={80} // 원하는 이미지 너비
            height={80} // 원하는 이미지 높이
            className="mb-2"
          />
          <span>{category.name}</span>
        </Link>
      ))}
    </div>
  );
}
