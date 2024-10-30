// import ImageSwiper from "./components/ImageSwiper"
import ImageSwiper from "@/app/components/ImageSwiper";
import Product from "@/app/components/Product";


export default function page() {
  const images = [
    { src: "/images/home_banner1.png", alt: "Slide 1" },
    { src: "/images/home_banner2.png", alt: "Slide 2" },
    { src: "/images/home_banner3.png", alt: "Slide 3" },
    { src: "/images/home_banner4.png", alt: "Slide 4" },
  ];

  const products = [
    {
      id: 1,
      name: "상품 이름 1",
      price: "50,000원",
      date: "2024-10-01",
      imageUrl: ["/images/bed2.png","/images/bed3.png"],
      seller: true
    },
    {
      id: 2,
      name: "상품 이름 2",
      price: "30,000원",
      date: "2024-10-02",
      imageUrl: ["/images/bed2.png","/images/bed3.png"],
      seller: true
    },
    {
      id: 3,
      name: "상품 이름 1",
      price: "50,000원",
      date: "2024-10-01",
      imageUrl: ["/images/bed2.png","/images/bed3.png"],
      seller: true
    },
    {
      id: 4,
      name: "상품 이름 2",
      price: "30,000원",
      date: "2024-10-02",
      imageUrl: ["/images/bed2.png","/images/bed3.png"],
      seller: true
    },
  ];

  return (
    <div className="py-0">
      <div className="h-[10rem]">
        {/* <ImageSwiper images={images} /> */}
        <ImageSwiper 
          images={images} 
          imageWidth={1920}
          imageHeight={400}
        />
      </div>

      <div className="mt-[1rem]">
        <h2 className="font-bold font-tmoney mb-[0.5rem]">추천 상품</h2>
          <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
      </div>

      <div className="mt-[1rem]">
        <h2 className="font-bold font-tmoney mb-[0.5rem]">인기 상품</h2>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
      </div>
    </div>
  )
}
