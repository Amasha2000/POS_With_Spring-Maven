package lk.ijse.spring.service.impl;

import lk.ijse.spring.dto.ItemDTO;
import lk.ijse.spring.entity.Item;
import lk.ijse.spring.repo.ItemRepo;
import lk.ijse.spring.service.ItemService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ItemServiceImpl implements ItemService {

    @Autowired
    ItemRepo repo;

    @Autowired
    ModelMapper mapper;

    @Override
    public void saveItem(ItemDTO itemDTO) {
        if(!repo.existsById(itemDTO.getItemCode())){
            repo.save(mapper.map(itemDTO, Item.class));
        }else{
            throw new RuntimeException("Customer Already Exists");
        }
    }

    @Override
    public void updateItem(ItemDTO itemDTO) {
        if(repo.existsById(itemDTO.getItemCode())){
            repo.save(mapper.map(itemDTO,Item.class));
        }else{
            throw new RuntimeException("No such a customer to Update");
        }
    }

    @Override
    public void deleteItem(String id) {
        if(repo.existsById(id)){
            repo.deleteById(id);
        }else {
            throw new RuntimeException("Check the Item Code and Try Again");
        }
    }

    @Override
    public ItemDTO searchItem(String id) {
        if(repo.existsById(id)){
            return mapper.map(repo.findById(id).get(),ItemDTO.class);
        }else{
            throw new RuntimeException("No such a customer for "+id+" !");
        }
    }

    @Override
    public List<ItemDTO> getAllItems() {
        return mapper.map(repo.findAll(),new TypeToken<List<ItemDTO>>(){}.getType());
    }

    @Override
    public List<String> getAllItemCodes() {
        return repo.getAllItemCodes();
    }
}
