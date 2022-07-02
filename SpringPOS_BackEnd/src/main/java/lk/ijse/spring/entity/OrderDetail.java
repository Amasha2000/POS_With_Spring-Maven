package lk.ijse.spring.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Entity
@IdClass(OrderDetailPK.class)
public class OrderDetail {
    @Id
    private String itemCode;
    @Id
    private String orderId;
    private int qty;
    private double unitPrice;
    private double cost;

    @ManyToOne
    @JoinColumn(name="orderID",referencedColumnName = "orderId",insertable = false,updatable = false)
    private Orders orders;

    @ManyToOne
    @JoinColumn(name = "code",referencedColumnName = "itemCode",insertable = false,updatable = false)
    private Item items;

}
