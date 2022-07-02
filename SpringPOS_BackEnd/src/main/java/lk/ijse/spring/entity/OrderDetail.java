package lk.ijse.spring.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Entity
public class OrderDetail {
    @Id
    private String itemCode;
    @Id
    private String orderId;
    private String name;
    private int qty;
    private double unitPrice;

    @ManyToOne
    @JoinColumn(name="orderID",referencedColumnName = "orderId",insertable = false,updatable = false)
    private Orders orders;

    @ManyToOne
    @JoinColumn(name = "code",referencedColumnName = "itemCode",insertable = false,updatable = false)
    private Item items;

}
