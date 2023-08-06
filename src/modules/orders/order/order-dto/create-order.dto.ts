import { EmployeeDto } from "src/modules/users/employee/employee-dto/employee.dto";
import { PaymentDto } from "../../payment/payment.dto";
import { ShippingDto } from "../../shipping/shipping.dto";
import { UserDto } from "src/modules/users/user/user-dto/user.dto";
import { DiscountDto } from "src/modules/products/discount/discount-dto/discount.dto";
import { GetProductForOrderDto } from "../../../products/product/product-dto/get-product-order.dto";

export class CreateOrderDto {

    // display price (product) or price in Product
    /**
     * 1. display price (product)
     * 2. (price (product) * percent (discount)) * quantity) + other product (get from Cart)
     * 3. ((product-final-price)* percent (discount)) + shipping cost = total_price
     */

    // order_id: number;
    // total_price: number;
    // status: string;

    products: GetProductForOrderDto[]; //  [{},{},{}]

    //  5 FK: Shippings- Payment - Employee - User - Employee
    shipping_id: number;
    payment_id: number;
    employee_id: string;
    user_id: number;
    discount_id: number;
}