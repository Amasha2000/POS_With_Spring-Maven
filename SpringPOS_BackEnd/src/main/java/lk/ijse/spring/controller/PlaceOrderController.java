package lk.ijse.spring.controller;

import lk.ijse.spring.dto.OrderDTO;
import lk.ijse.spring.service.PlaceOrderService;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("pos/v1/placeOrder")
@CrossOrigin
public class PlaceOrderController {

    @Autowired
    PlaceOrderService placeOrderService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil placeOrder(@RequestBody OrderDTO orders){
        placeOrderService.placeOrder(orders);
        return new ResponseUtil(200,"Order Placed Successfully",placeOrderService.getAutoOrderId());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getOrderId(){
        return new ResponseUtil(200,"OK",placeOrderService.getAutoOrderId());
    }
}
