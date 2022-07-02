package lk.ijse.spring.repo;

import lk.ijse.spring.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrdersRepo extends JpaRepository<Orders,String> {
    @Query(value="select orderId from orders order by orderId desc limit 1",nativeQuery = true)
    String getOrderId();
}
