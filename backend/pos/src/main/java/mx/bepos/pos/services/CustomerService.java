package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.Customer;
import mx.bepos.pos.domain.repositories.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> findCustomersByName(String name) {
        return customerRepository.findByFullNameContainingIgnoreCase(name);
    }
}
