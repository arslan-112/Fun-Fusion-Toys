import { Exclusive } from "../Components/Exclusive/Exclusive"
import { Middle } from "../Components/Middle/middle"
import { Newarrivals } from "../Components/NewArrivals/Newarrivals"

export const Shop = () => {
  return (
    <div>
        <Middle/>
        <Newarrivals/>
        <Exclusive/>
    </div>
  )
}
