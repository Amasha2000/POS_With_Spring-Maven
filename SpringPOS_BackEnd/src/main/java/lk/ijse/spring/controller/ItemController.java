package lk.ijse.spring.controller;

import lk.ijse.spring.dto.ItemDTO;
import lk.ijse.spring.service.ItemService;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("pos/v1/item")
@CrossOrigin
public class ItemController {

    @Autowired
    ItemService itemService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil saveItem(@ModelAttribute ItemDTO item){
        itemService.saveItem(item);
        return new ResponseUtil(200,"Saved",null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateItem(@RequestBody ItemDTO item){
        itemService.updateItem(item);
        return new ResponseUtil(200,"Updated",null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @DeleteMapping(params = {"code"},produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil deleteItem(@RequestParam String code){
        itemService.deleteItem(code);
        return new ResponseUtil(200,"Deleted",null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path = "/{code}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil searchItem(@PathVariable String code){
        return new ResponseUtil(200,"OK",itemService.searchItem(code));
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getAll(){
        return new ResponseUtil(200,"OK",itemService.getAllItems());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path = "/itemCode",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getAllItemCodes(){
        return new ResponseUtil(200,"OK",itemService.getAllItemCodes());
    }
}
