import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Description } from "../Components/Description/Description";

export const ProductDescription = () => {
    const { productId } = useParams(); 
    const [product, setProduct] = useState();
  
    useEffect(() => {
        console.log('useEffect triggered for productId:', productId);
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
          setProduct(response.data.data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      fetchProduct();
    }, [productId]);


    if (!product) {
        return <div>Loading...</div>; 
      }
    
      return (
        <div>
          <Description product={product} />
        </div>
      );
};
