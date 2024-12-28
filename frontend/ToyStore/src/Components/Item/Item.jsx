import "./Item.css"
import { Link } from "react-router-dom";

export const Item = ({ product }) => {
  return ( 
    <div className="Item">
      <Link to ={`/Shop/${product._id}`}><img src={`http://localhost:5000/uploads/${product.image}`} onClick={window.scrollTo(0,0)} alt={product.name} className="item-image" /></Link>
      <h3 className="item-name">{product.name}</h3>
      <div className="item-info">
        <div className="item-price">Rs.{product.price}</div>
      </div>
    </div>
  );
};