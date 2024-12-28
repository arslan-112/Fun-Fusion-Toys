import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import "./Newarrivals.css";
import { Item } from "../Item/Item";

export const Newarrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.data); 
        console.error("Unexpected response format:", response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error); 
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="NewArrivals">
      <h2>New Arrivals</h2>
      <div className="product-list">
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.slice(0, 3).map((product) => (
            <Item key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};
