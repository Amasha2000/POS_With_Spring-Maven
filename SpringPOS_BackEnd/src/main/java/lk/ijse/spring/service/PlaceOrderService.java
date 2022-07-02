package lk.ijse.spring.service;

import lk.ijse.spring.dto.OrderDTO;

public interface PlaceOrderService {
    void placeOrder(OrderDTO orderDTO);
    String getAutoOrderId();
}
