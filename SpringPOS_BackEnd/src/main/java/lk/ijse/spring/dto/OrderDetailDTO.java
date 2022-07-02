package lk.ijse.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class OrderDetailDTO {
    private String itemCode;
    private String orderId;
    private int qty;
    private double unitPrice;
    private double cost;
}
