package lk.ijse.spring.controller;

import lk.ijse.spring.dto.CustomerDTO;
import lk.ijse.spring.service.CustomerService;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("pos/v1/customer")
@CrossOrigin
public class CustomerController {

    @Autowired
    CustomerService customerService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil saveCustomer(@ModelAttribute CustomerDTO customer){
        customerService.saveCustomer(customer);
        return new ResponseUtil(200,"Saved",null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateCustomer(@RequestBody CustomerDTO customer){
        System.out.println(customer);
        customerService.updateCustomer(customer);
        return new ResponseUtil(200,"Updated",null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @DeleteMapping(params = {"id"},produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil deleteCustomer(@RequestParam String id){
        customerService.deleteCustomer(id);
        return new ResponseUtil(200,"Deleted ",null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path="/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil searchCustomer(@PathVariable String id){
        return new ResponseUtil(200,"OK",customerService.searchCustomer(id));
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getAllCustomers(){
        return new ResponseUtil(200,"OK",customerService.getAllCustomers());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path="/cusID",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getAllCustomerID(){
        return new ResponseUtil(200,"OK",customerService.getAllCustomerID());
    }
}
