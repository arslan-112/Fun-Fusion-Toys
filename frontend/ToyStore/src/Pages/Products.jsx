import { useEffect, useState } from "react";
import axios from "axios";
import { Item } from "../Components/Item/Item";
import "./Css/Products.css"

export const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.data); 
      } catch (error) {
        console.error("Error fetching products:", error); 
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="Products-Container">
      <h2>All Products</h2>
      <div className="product-list">
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <Item key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};
