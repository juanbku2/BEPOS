package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> findByFullNameContainingIgnoreCase(String fullName);
}
