import CategoryProducts from "../components/CategoryProducts";

export default function drawer() {
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

  return <CategoryProducts categoryName="수납·서랍" products={products} />;

}
