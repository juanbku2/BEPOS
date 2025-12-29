package mx.bepos.pos.web.controllers;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.Customer;
import mx.bepos.pos.services.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/search")
    public List<Customer> findCustomersByName(@RequestParam("name") String name) {
        return customerService.findCustomersByName(name);
    }
}
