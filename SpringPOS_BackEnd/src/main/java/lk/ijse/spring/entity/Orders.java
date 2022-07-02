package lk.ijse.spring.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Entity
public class Orders {
    @Id
    private String orderId;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate orderDate;
    private double cost;
    private double discount;
    @ManyToOne(cascade={CascadeType.REFRESH,CascadeType.DETACH})
    @JoinColumn(name="cusId",referencedColumnName = "customerID")
    private Customer customer;

    @OneToMany(mappedBy = "orders",cascade = CascadeType.ALL)
    private List<OrderDetail> detailList;
}
