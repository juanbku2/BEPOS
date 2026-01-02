package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.Customer;
import mx.bepos.pos.domain.repositories.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        log.info("Fetching all customers");
        return customerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Customer> findCustomersByName(String name) {
        log.info("Finding customers by name: {}", name);
        return customerRepository.findByFullNameContainingIgnoreCase(name);
    }

    @Transactional(readOnly = true)
    public Optional<Customer> getCustomerById(Integer id) {
        log.info("Fetching customer by id: {}", id);
        return customerRepository.findById(id);
    }

    @Transactional
    public Customer saveCustomer(Customer customer) {
        log.info("Saving customer: {}", customer);
        return customerRepository.save(customer);
    }

    @Transactional
    public void deleteCustomer(Integer id) {
        log.info("Deleting customer by id: {}", id);
        customerRepository.deleteById(id);
    }
}
