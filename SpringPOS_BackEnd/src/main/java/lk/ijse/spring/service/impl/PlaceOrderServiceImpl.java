package lk.ijse.spring.service.impl;

import lk.ijse.spring.dto.OrderDTO;
import lk.ijse.spring.entity.Item;
import lk.ijse.spring.entity.OrderDetail;
import lk.ijse.spring.entity.Orders;
import lk.ijse.spring.repo.ItemRepo;
import lk.ijse.spring.repo.OrderDetailRepo;
import lk.ijse.spring.repo.OrdersRepo;
import lk.ijse.spring.service.PlaceOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;

@Service
@Transactional
public class PlaceOrderServiceImpl implements PlaceOrderService {

    @Autowired
    OrdersRepo ordersRepo;

    @Autowired
    OrderDetailRepo orderDetailRepo;
    
    @Autowired
    ItemRepo itemRepo;
    
    @Autowired
    ModelMapper mapper;

    @Override
    public void placeOrder(OrderDTO orderDTO) {
        if(!ordersRepo.existsById(orderDTO.getOrderId())){
            ordersRepo.save(mapper.map(orderDTO, Orders.class));
            if(orderDTO.getDetailList().size()<1){
                throw new RuntimeException("Please select items to place the order");
            }
            for(OrderDetail orderDetails:mapper.map(orderDTO,Orders.class).getDetailList()){
                Item item = itemRepo.findById(orderDetails.getItemCode()).get();
                item.setQuantity(item.getQuantity()-orderDetails.getQty());
                itemRepo.save(item);

                getAutoOrderId();
            }
        }else{
            throw new RuntimeException("Order Already Exists");
        }
    }

    @Override
    public String getAutoOrderId(){
        System.out.println(ordersRepo.getOrderId());
        if(ordersRepo.getOrderId()!=null){
            int temp=Integer.parseInt(ordersRepo.getOrderId().split("-")[1]);
            temp=temp+1;
            if(temp<=9){
                return "000-00"+temp;
            }else if(temp<=99){
                return "000-0"+temp;
            }else{
                return "000-"+temp;
            }
        }else {
            return "000-001";
        }
    }

}
