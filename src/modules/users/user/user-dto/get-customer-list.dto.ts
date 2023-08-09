export class GetCustomerListDto {
    avatar_url: string;
    customer_id: string; // == user-id
    customer_name: string;
    birthday: string;
    gender: string;
    count_order: string; // đã tạo bao nhiêu order
    total_price: string;
    canceled: string;
    address: string;
}